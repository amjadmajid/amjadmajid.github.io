(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const navToggle = $('.nav-toggle');
  const nav = $('#site-nav');
  const closeMenu = () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (event) => { if (!event.target.closest('.site-header')) closeMenu(); });
  window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);
  document.querySelectorAll('a[href="#source-notes"]').forEach((link) => link.addEventListener('click', () => { $('#source-notes').open = true; }));

  const items = Array.from(document.querySelectorAll('.publication-item'));
  if (!items.length) return;
  const search = $('#publication-search');
  const yearSelect = $('#publication-year');
  const topicButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const pagination = $('#publication-pagination');
  const resultCount = $('#publication-count');
  const empty = $('#publication-empty');
  const pageSize = 7;
  let activeTopic = 'all';
  let currentPage = 1;
  const normalise = (value) => value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const records = items.map((element) => ({
    element,
    year: element.dataset.year,
    topics: (element.dataset.topics || '').split(','),
    text: normalise(element.textContent),
  }));
  const years = [...new Set(records.map((record) => record.year))].sort((a, b) => Number(b) - Number(a));
  years.forEach((year) => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.append(option);
  });
  $('#publication-controls').hidden = false;
  $('#publication-topics').hidden = false;

  function render({ scroll = false } = {}) {
    const terms = normalise(search.value.trim()).split(/\s+/).filter(Boolean);
    const matching = records.filter((record) =>
      (activeTopic === 'all' || record.topics.includes(activeTopic)) &&
      (yearSelect.value === 'all' || record.year === yearSelect.value) &&
      terms.every((term) => record.text.includes(term))
    );
    const pageCount = Math.ceil(matching.length / pageSize);
    currentPage = Math.max(1, Math.min(currentPage, pageCount || 1));
    records.forEach(({ element }) => { element.hidden = true; });
    const start = (currentPage - 1) * pageSize;
    matching.slice(start, start + pageSize).forEach(({ element }) => { element.hidden = false; });
    const isFiltered = terms.length || activeTopic !== 'all' || yearSelect.value !== 'all';
    resultCount.textContent = matching.length
      ? `${isFiltered ? matching.length + ' matching ' : records.length + ' curated '}publication${(isFiltered ? matching.length : records.length) === 1 ? '' : 's'} · Showing ${start + 1}–${Math.min(start + pageSize, matching.length)}`
      : 'No matching publications';
    empty.hidden = Boolean(matching.length);
    pagination.replaceChildren();
    pagination.hidden = pageCount < 2;
    if (pageCount > 1) {
      const addButton = (label, page, disabled, current = false) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'page-button' + (current ? ' is-active' : '');
        button.textContent = label;
        button.disabled = disabled;
        button.setAttribute('aria-label', /^\d+$/.test(label) ? `Go to publication page ${page}` : label);
        if (current) button.setAttribute('aria-current', 'page');
        button.addEventListener('click', () => { currentPage = page; render({ scroll: true }); });
        pagination.append(button);
      };
      addButton('← Previous', currentPage - 1, currentPage === 1);
      for (let page = 1; page <= pageCount; page += 1) addButton(String(page), page, false, currentPage === page);
      addButton('Next →', currentPage + 1, currentPage === pageCount);
    }
    if (scroll) $('#publication-controls').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }
  function setTopic(topic) {
    activeTopic = topic;
    currentPage = 1;
    topicButtons.forEach((button) => {
      const active = button.dataset.filter === topic;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    render();
  }
  topicButtons.forEach((button) => button.addEventListener('click', () => setTopic(button.dataset.filter)));
  search.addEventListener('input', () => { currentPage = 1; render(); });
  yearSelect.addEventListener('change', () => { currentPage = 1; render(); });
  $('#reset-filters').addEventListener('click', () => { search.value = ''; yearSelect.value = 'all'; setTopic('all'); search.focus(); });
  document.querySelectorAll('.research-filter-link').forEach((link) => link.addEventListener('click', () => {
    search.value = '';
    yearSelect.value = 'all';
    setTopic(link.dataset.topic);
  }));

  const toast = $('#copy-status');
  let toastTimer;
  document.querySelectorAll('[data-copy-citation]').forEach((button) => button.addEventListener('click', async () => {
    const citation = button.dataset.copyCitation;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(citation);
      toast.textContent = 'Citation copied';
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
    } catch {
      const detail = button.closest('.publication-item').querySelector('.citation-fallback');
      detail.hidden = false;
      detail.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(detail);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }));
  window.addEventListener('beforeprint', () => records.forEach(({ element }) => { element.hidden = false; }));
  window.addEventListener('afterprint', () => render());
  render();
})();
