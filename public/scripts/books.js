function initBooks() {
  const searchInput = document.getElementById('searchInput');
  const classFilter = document.getElementById('classFilter');
  const viewButtons = document.querySelectorAll('[data-view-button]');
  const viewPanels = document.querySelectorAll('[data-view-panel]');
  const bookItems = document.querySelectorAll('[data-book-item]');
  const tableBody = document.querySelector('#booksTable tbody');
  const sortableHeaders = document.querySelectorAll('#booksTable th[data-sort]');
  const params = new URLSearchParams(window.location.search);
  const initialClass = params.get('class') || '';

  if (classFilter && initialClass) {
    classFilter.value = initialClass;
  }

  const tableSortState = { column: 'title', ascending: true };

  function applyTableSort() {
    if (!tableBody) return;
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const visible = rows.filter(row => row.style.display !== 'none');
    const hidden = rows.filter(row => row.style.display === 'none');
    const { column, ascending } = tableSortState;

    visible.sort((a, b) => {
      const aVal = a.getAttribute(`data-${column}`) || '';
      const bVal = b.getAttribute(`data-${column}`) || '';
      const cmp = aVal.localeCompare(bVal);
      return ascending ? cmp : -cmp;
    });

    tableBody.innerHTML = '';
    [...visible, ...hidden].forEach(row => tableBody.appendChild(row));
  }

  function setSortedHeader(header) {
    sortableHeaders.forEach(h => h.classList.remove('is-sorted'));
    header.classList.add('is-sorted');
  }

  function applyFilters() {
    const searchTerm = (searchInput?.value || '').toLowerCase();
    const selectedClassValue = classFilter?.value || '';
    const selectedClass = selectedClassValue.toLowerCase();
    bookItems.forEach(item => {
      const itemClass = item.getAttribute('data-class') || '';
      const itemSearch = item.getAttribute('data-search') || '';
      const matchesSearch = itemSearch.includes(searchTerm);
      const matchesClass = !selectedClass || itemClass === selectedClass;
      item.style.display = matchesSearch && matchesClass ? '' : 'none';
    });
    if (tableBody) applyTableSort();
    const url = new URL(window.location.href);
    if (selectedClassValue) url.searchParams.set('class', selectedClassValue);
    else url.searchParams.delete('class');
    window.history.replaceState({}, '', url);
  }

  const setView = (view) => {
    viewButtons.forEach(btn => {
      const isActive = btn.getAttribute('data-view') === view;
      btn.classList.toggle('active', isActive);
    });
    viewPanels.forEach(panel => {
      const isActive = panel.getAttribute('data-view-panel') === view;
      panel.classList.toggle('active', isActive);
    });
    try {
      if (view) localStorage.setItem('booksView', view);
    } catch {
      // ignore storage errors
    }
  };

  const preferredView = (() => {
    try {
      return localStorage.getItem('booksView');
    } catch {
      return null;
    }
  })();

  if (preferredView) {
    setView(preferredView);
  } else {
    setView('tiles');
  }

  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => setView(btn.getAttribute('data-view')));
  });

  sortableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const column = header.getAttribute('data-sort') || 'title';
      if (tableSortState.column === column) {
        tableSortState.ascending = !tableSortState.ascending;
      } else {
        tableSortState.column = column;
        tableSortState.ascending = true;
      }
      setSortedHeader(header);
      applyTableSort();
    });
  });

  if (sortableHeaders.length) {
    setSortedHeader(sortableHeaders[0]);
    applyTableSort();
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (classFilter) classFilter.addEventListener('change', applyFilters);
  applyFilters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBooks);
} else {
  initBooks();
}
