import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/publications.json'), 'utf8'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate HTML ids');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Exactly one h1 is required');
assert.equal((html.match(/class="publication-item"/g) || []).length, data.publications.length);
assert.equal(new Set(data.publications.map((record) => record.id)).size, data.publications.length, 'Duplicate publication identifiers');
const dois = data.publications.map((record) => record.doi?.toLowerCase()).filter(Boolean);
const pmids = data.publications.map((record) => record.pmid).filter(Boolean);
assert.equal(new Set(dois).size, dois.length, 'Duplicate DOI');
assert.equal(new Set(pmids).size, pmids.length, 'Duplicate PubMed identifier');
for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (target.startsWith('#')) assert(ids.includes(target.slice(1)), `Missing section: ${target}`);
  else if (!/^(https?:|mailto:|data:)/.test(target)) assert(fs.existsSync(path.join(root, target.split(/[?#]/)[0])), `Missing local asset: ${target}`);
}
for (const record of data.publications) {
  assert(record.sources.length > 0 && record.authors.length > 0 && record.title && record.year, `Incomplete source data: ${record.id}`);
  assert(record.doi || record.pmid || record.pmcid, `Missing primary bibliographic identifier: ${record.id}`);
  assert(record.authors.some((name) => {
    const normalised = name.toLowerCase().replace(/[^a-z]/g, '');
    return normalised.includes('majeedsaidan') || ['mamajeed', 'mamajid', 'mohammedamajeed', 'muhammedamajeed'].includes(normalised);
  }), `Researcher absent from author list: ${record.id}`);
  assert(!record.authors.some((name) => /maryam|ahmad.*majeed/i.test(name)), `Potential author-name mix-up: ${record.id}`);
}
const bib = fs.readFileSync(path.join(root, 'data/publications.bib'), 'utf8');
assert.equal((bib.match(/@article\{/g) || []).length, data.publications.length, 'BibTeX count mismatch');
JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
console.log(`Verified ${data.publications.length} unique publication records, their citations, local assets, internal anchors and structured metadata.`);
