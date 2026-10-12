function initFutureReading() {
  const filterInput = document.getElementById('filterInput');
  const tableBody = document.getElementById('tableBody');
  const count = document.getElementById('filterCount');
  if (!filterInput || !tableBody) return;
  const headers = Array.from(document.querySelectorAll('th[data-sort]'));
  // Keep all source rows. Filtering never removes a row from this dataset.
  const rows = Array.from(tableBody.querySelectorAll('tr'));
  const sort = { column: 'title', ascending: true };

  function update() {
    const query = filterInput.value.trim().toLowerCase();
    rows.sort((a, b) => {
      const comparison = (a.dataset[sort.column] || '').localeCompare(b.dataset[sort.column] || '', undefined, { sensitivity: 'base' });
      return sort.ascending ? comparison : -comparison;
    });
    let visible = 0;
    rows.forEach(row => {
      row.hidden = !(row.dataset.search || '').includes(query);
      if (!row.hidden) visible += 1;
      tableBody.appendChild(row);
    });
    headers.forEach(header => {
      const active = header.dataset.sort === sort.column;
      header.classList.toggle('is-sorted', active);
      header.setAttribute('aria-sort', active ? (sort.ascending ? 'ascending' : 'descending') : 'none');
    });
    if (count) count.textContent = `${visible} of ${rows.length} books`;
  }

  filterInput.addEventListener('input', update);
  headers.forEach(header => header.querySelector('[data-sort-button]')?.addEventListener('click', () => {
    const column = header.dataset.sort;
    if (!column) return;
    sort.ascending = sort.column === column ? !sort.ascending : true;
    sort.column = column;
    update();
  }));
  update();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFutureReading);
else initFutureReading();
