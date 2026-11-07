# Dr Muhammad Ali Majeed-Saidan — professional research website

A responsive, accessible, buildless academic website covering paediatrics, neonatal medicine, congenital anomalies and birth-defect surveillance. The public name follows his publications; the alternative spelling provided for the project is included in structured metadata.

## Features

- Editorial design with original SVG artwork, system fonts and no third-party scripts.
- Biography and dated professional contributions tied to public sources.
- Searchable bibliography with topic/year filtering, pagination and copyable citations.
- Journal/DOI and PubMed links, plus a downloadable BibTeX bibliography.
- Semantic HTML, keyboard navigation, reduced-motion support and print styles.
- Responsive layout and relative asset paths suitable for a GitHub project Pages site.
- No tracking, cookies, forms, paid services or runtime dependencies.

## Deployment layout

The website is prepared for the `muhammad-ali-majeed-saidan/` subdirectory of the existing `amjadmajid/amjadmajid.github.io` Pages repository, on its `master` branch. This keeps the website self-contained. All asset paths are relative, so the folder can also be moved to its own repository using the instructions below.

## Publish on GitHub Pages

1. Create a **public** repository, for example `muhammad-ali-majeed-saidan`.
2. Upload or push this folder’s source files to its `main` branch. Include `.nojekyll`, `assets/` and `data/`. Do not upload `dist/` or `.openai/`.
3. Open **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, select **main** and **/ (root)**, then save.
5. Wait for GitHub’s Pages deployment to finish. Use the live address shown in Settings → Pages.

The source files are already the deployable website; a build is not needed for branch-based Pages publishing. If another repository name or account is used, the relative paths continue to work. Do not add a `CNAME` unless the domain is owned and its DNS has been configured.

## Local development

Open `index.html` directly, or use any static web server. The publications are rendered into HTML and do not depend on a `fetch()` call, so the page works from disk and without JavaScript. JavaScript adds filtering and pagination.

With Node 18 or newer, `npm run build` copies the public site to `dist/` for preview or another static host. No package installation is necessary. Run `npm run check` to check the local asset links, publication identifiers and basic metadata.

## Editing

| File | Purpose |
| --- | --- |
| `index.html` | Profile text, links, research sections and pre-rendered publication list |
| `assets/styles.css` | Design and responsive layout |
| `assets/app.js` | Mobile navigation, filters, pagination and citation copying |
| `assets/research-art.svg` | Original decorative artwork; replace with an approved portrait if desired |
| `data/publications.json` | Bibliographic source data |
| `data/publications.bib` | Downloadable BibTeX references |
| `scripts/render-publications.py` | Regenerates the publication HTML and BibTeX from JSON |
| `docs/research-notes.md` | Evidence, identity checks, editorial decisions and facts needing confirmation |

To update the bibliography, edit `data/publications.json`, run `python scripts/render-publications.py`, then run the build/check commands. Each record requires a source URL and should be checked against a publisher or PubMed record. Publication topics are editorial classifications, not publisher keywords.

## Editorial boundaries

This is a professional research profile. It does not advertise active clinical practice. Current appointments, preferred contact details, a full CV and an approved portrait were not supplied or independently confirmed. Old institutional email addresses and citation metrics have not been presented as current. The supplied Google Scholar URL is preserved, but its contents could not be accessed during preparation.

No university appointment, professor title, degree date, award or complete lifetime publication count is inferred. Similarly named authors are excluded. Refer to `docs/research-notes.md` before adding biographical claims.

Prepared 7 November 2026. Website content and bibliography should be reviewed periodically by the profile owner.
