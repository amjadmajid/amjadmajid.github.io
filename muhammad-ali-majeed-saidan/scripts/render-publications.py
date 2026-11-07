#!/usr/bin/env python3
"""Render curated publication metadata as static HTML and a BibTeX download."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / 'data/publications.json').read_text(encoding='utf-8'))
publications = data['publications']

def esc(value):
    return html.escape(str(value), quote=True)

def order_key(record):
    date = record.get('publication_date') or str(record['year'])
    if len(date) < 7 and (record.get('online_first') or '').startswith(str(record['year'])):
        date = record['online_first']
    return (record['year'], date)

def citation(record):
    authors = record.get('authors_indexed') or ', '.join(record['authors']) + '.'
    volume = record.get('volume') or ''
    issue = f"({record['issue']})" if record.get('issue') else ''
    pages = f":{record['pages']}" if record.get('pages') else ''
    doi = f" https://doi.org/{record['doi']}" if record.get('doi') else f" {record['url']}"
    return f"{authors} {record['title']}. {record['journal']}. {record['year']};{volume}{issue}{pages}.{doi}"

def bib_name(name):
    parts = name.split()
    boundary = len(parts) - 1
    if len(parts) > 2 and parts[-2].lower() == 'al':
        boundary -= 1
    return ' '.join(parts[boundary:]) + ', ' + ' '.join(parts[:boundary])

def bib_value(value):
    return str(value).replace('\\', '\\textbackslash{}').replace('&', '\\&').replace('%', '\\%').replace('_', '\\_')

rendered = []
bib = ['% Curated bibliography for Dr Muhammad Ali Majeed-Saidan', '% Verified 7 November 2026. Not a complete lifetime publication list.', '']
for record in sorted(publications, key=order_key, reverse=True):
    rid = record['id']
    title = record['title'].replace('(1995--2004)', '(1995–2004)')
    topics = ','.join(record.get('topics', []))
    authors = ', '.join(f'<strong>{esc(name)}</strong>' if 'majeed-saidan' in name.lower() else esc(name) for name in record['authors'])
    if record['type'] == 'Correspondence':
        authors = '<span class="indexed-note">Indexed letter and reply authors:</span> ' + authors
    volume = record.get('volume') or ''
    issue = f"({record['issue']})" if record.get('issue') else ''
    pages = record.get('pages') or ''
    journal_meta = f"{record['journal']} · {volume}{issue}" + (f", {pages}" if pages else '')
    primary = 'https://doi.org/' + record['doi'] if record.get('doi') else record['url']
    links = f'<a class="publication-link" href="{esc(primary)}" target="_blank" rel="noopener noreferrer">Journal <span aria-hidden="true">↗</span><span class="sr-only">: {esc(title)}</span></a>'
    if record.get('pmid'):
        links += f'<a class="publication-link" href="https://pubmed.ncbi.nlm.nih.gov/{esc(record["pmid"])}/" target="_blank" rel="noopener noreferrer">PubMed <span aria-hidden="true">↗</span><span class="sr-only">: {esc(title)}</span></a>'
    if record.get('pmcid'):
        links += f'<a class="publication-link" href="https://pmc.ncbi.nlm.nih.gov/articles/{esc(record["pmcid"])}/" target="_blank" rel="noopener noreferrer">Full text <span aria-hidden="true">↗</span><span class="sr-only">: {esc(title)}</span></a>'
    cite = citation(record)
    rendered.append(f'''<article class="publication-item" data-year="{record['year']}" data-topics="{esc(topics)}" id="{esc(rid)}">
  <div class="publication-year">{record['year']}<span class="publication-type">{esc(record['type'])}</span></div>
  <div class="publication-main"><h3 class="publication-title"><a href="{esc(primary)}" target="_blank" rel="noopener noreferrer">{esc(title)}</a></h3>
  <p class="publication-authors">{authors}</p><p class="publication-meta">{esc(journal_meta)}</p>
  <p class="publication-summary">{esc(record['summary'])}</p>
  <div class="publication-actions">{links}<button class="publication-link copy-citation" type="button" data-copy-citation="{esc(cite)}" aria-label="Copy citation: {esc(title)}">Copy citation</button></div>
  <p class="citation-fallback" tabindex="-1" hidden>{esc(cite)}</p></div>
</article>''')
    fields = {'author': ' and '.join(bib_name(name) for name in record['authors']), 'title': '{' + title + '}', 'journal': record['journal'], 'year': record['year']}
    for key in ['volume', 'issue', 'pages', 'doi', 'url']:
        value = record.get(key)
        if value:
            if key == 'pages':
                value = re.sub(r'(?<=\d)-(?=\d)', '--', value)
            fields['number' if key == 'issue' else key] = value
    if record['type'] not in ['Research article', 'Clinical trial']:
        fields['note'] = record['type']
    # DOIs and URLs are literal identifier values, so preserve their punctuation.
    fields_text = ',\n'.join('  ' + key + ' = {' + (str(value) if key in ['doi', 'url'] else bib_value(value)) + '}' for key, value in fields.items())
    bib.append('@article{' + rid.replace('-', '') + ',\n' + fields_text + '\n}\n')

index_path = ROOT / 'index.html'
index = index_path.read_text(encoding='utf-8')
index, count = re.subn(r'<!-- PUBLICATIONS_START -->.*?<!-- PUBLICATIONS_END -->', '<!-- PUBLICATIONS_START -->\n' + '\n'.join(rendered) + '\n<!-- PUBLICATIONS_END -->', index, flags=re.S)
assert count == 1, 'Publication markers not found exactly once'
index_path.write_text(index, encoding='utf-8')
(ROOT / 'data/publications.bib').write_text('\n'.join(bib), encoding='utf-8')
print(f'Rendered {len(publications)} publications and BibTeX entries.')
