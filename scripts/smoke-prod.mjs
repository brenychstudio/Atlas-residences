#!/usr/bin/env node

const inputOrigin = process.argv[2];

if (!inputOrigin) {
  console.error('Usage: node scripts/smoke-prod.mjs https://<site-origin>');
  process.exit(1);
}

let origin;
try {
  const parsed = new URL(inputOrigin.trim());
  origin = parsed.origin.replace(/\/$/, '');
} catch {
  console.error('FAIL invalid origin. Example: https://atlas-residences.pages.dev');
  process.exit(1);
}

const results = [];

function record(status, label, message) {
  results.push({ status, label, message });
  const symbol = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${symbol} ${status} ${label} - ${message}`);
}

async function fetchHtml(url, label, required = true) {
  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      const status = required ? 'FAIL' : 'WARN';
      record(status, label, `HTTP ${res.status}`);
      return null;
    }
    const html = await res.text();
    record('PASS', label, 'HTTP 200');
    return html;
  } catch (error) {
    const status = required ? 'FAIL' : 'WARN';
    record(status, label, `Fetch error: ${error.message}`);
    return null;
  }
}

function assertContains(html, needle, label, required = true) {
  if (!html) return;
  if (html.includes(needle)) {
    record('PASS', label, `contains ${needle}`);
  } else {
    record(required ? 'FAIL' : 'WARN', label, `missing ${needle}`);
  }
}

function hasInputName(html, name) {
  const re = new RegExp(`<input[^>]*name=["']${name}["']`, 'i');
  return re.test(html);
}

function assertInput(html, name, label, required = true) {
  if (hasInputName(html, name)) {
    record('PASS', label, `input ${name}`);
  } else {
    record(required ? 'FAIL' : 'WARN', label, `missing input ${name}`);
  }
}

function getFormAction(html) {
  const match = html.match(/<form\b[^>]*\baction=["']([^"']+)["'][^>]*>/i);
  return match ? match[1] : '';
}

function discoverUnitPath(unitsHtml) {
  const linkRe = /href=["'](\/[^"']*\/units\/[^"']+\/)["']/gi;
  let match;
  while ((match = linkRe.exec(unitsHtml)) !== null) {
    if (!match[1].includes('/units/?')) {
      return match[1];
    }
  }
  return null;
}

async function run() {
  const urls = {
    a: `${origin}/en/contact/?source=home&utm_source=google&utm_medium=cpc&utm_campaign=atlas-launch&utm_term=tt&utm_content=cc&gclid=G123&fbclid=F456`,
    b: `${origin}/en/contact/?source=downloads`,
    c: `${origin}/en/contact/?source=masterplan&building=a`,
    d: `${origin}/en/contact/?source=unit&unit=a-01-t1-101`,
    e: `${origin}/en/contact/?sent=1`,
    f: `${origin}/en/contact/?error=1`,
    g: `${origin}/en/masterplan/`,
    h: `${origin}/en/units/`,
  };

  const htmlA = await fetchHtml(urls.a, '(a) contact with attribution');
  const htmlB = await fetchHtml(urls.b, '(b) contact source=downloads');
  const htmlC = await fetchHtml(urls.c, '(c) contact source=masterplan&building=a');
  const htmlD = await fetchHtml(urls.d, '(d) contact source=unit&unit=...', false);
  const htmlE = await fetchHtml(urls.e, '(e) contact sent=1');
  const htmlF = await fetchHtml(urls.f, '(f) contact error=1');
  const htmlG = await fetchHtml(urls.g, '(g) masterplan');
  const htmlH = await fetchHtml(urls.h, '(h) units index');

  for (const [html, label] of [
    [htmlA, '(a) contact form'],
    [htmlB, '(b) contact form'],
    [htmlC, '(c) contact form'],
  ]) {
    if (!html) continue;
    assertContains(html, '<form', `${label} has form`);
    for (const field of ['lead_context', 'intent', 'source', 'lang', 'page']) {
      assertInput(html, field, `${label} hidden field ${field}`);
    }
  }

  if (htmlC) {
    assertInput(htmlC, 'building', '(c) building field for building param');
  }

  if (htmlA) {
    for (const field of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
      assertInput(htmlA, field, `(a) attribution field ${field}`);
    }

    const action = getFormAction(htmlA);
    if (action && action.includes('formspree.io')) {
      record('PASS', '(a) provider-specific checks', 'Form action uses Formspree');
      for (const field of ['_subject', '_next', '_gotcha']) {
        assertInput(htmlA, field, `(a) Formspree field ${field}`);
      }
    } else {
      record('PASS', '(a) provider-specific checks', 'Non-Formspree action; skipped _subject/_next/_gotcha assertions');
    }
  }


  if (htmlD) {
    assertContains(htmlD, '<form', '(d) contact form has form', false);
    assertInput(htmlD, 'unit', '(d) unit field for unit param', false);
  }
  if (htmlE) {
    const ok = htmlE.includes('atlas_contact_form_sent') || htmlE.includes('sent=1') || htmlE.includes('contact-form-sent');
    record(ok ? 'PASS' : 'FAIL', '(e) sent marker', ok ? 'sent marker detected' : 'missing sent marker');
  }

  if (htmlF) {
    const ok = htmlF.includes('atlas_contact_form_error') || htmlF.includes('error=1') || htmlF.includes('contact-form-error');
    record(ok ? 'PASS' : 'FAIL', '(f) error marker', ok ? 'error marker detected' : 'missing error marker');
  }

  if (htmlG) {
    for (const meta of ['property="og:title"', 'property="og:image"', 'name="twitter:card"']) {
      assertContains(htmlG, meta, `(g) masterplan meta ${meta}`);
    }
  }

  if (htmlH) {
    const unitPath = discoverUnitPath(htmlH);
    if (!unitPath) {
      record('FAIL', '(h) discover unit page', 'Could not find unit URL from /en/units/');
    } else {
      record('PASS', '(h) discover unit page', unitPath);
      const unitHtml = await fetchHtml(`${origin}${unitPath}`, '(h) discovered unit page');
      if (unitHtml) {
        for (const meta of ['property="og:title"', 'property="og:image"', 'name="twitter:card"']) {
          assertContains(unitHtml, meta, `(h) unit meta ${meta}`);
        }
      }
    }
  }

  const failed = results.some((r) => r.status === 'FAIL');
  const warned = results.some((r) => r.status === 'WARN');
  console.log(`\nSummary: ${results.filter((r) => r.status === 'PASS').length} pass, ${results.filter((r) => r.status === 'WARN').length} warn, ${results.filter((r) => r.status === 'FAIL').length} fail`);
  if (failed) process.exit(1);
  if (warned) process.exit(0);
}

run();
