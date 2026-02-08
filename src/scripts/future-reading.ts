function initFutureReading() {
  const filterInput = document.getElementById('filterInput') as HTMLInputElement | null;
  const tableBody = document.getElementById('tableBody');
  const sortableHeaders = document.querySelectorAll('[data-sort]');

  const currentSort = {
    column: '',
    ascending: true,
  };

  function getTableData() {
    if (!tableBody) return [];
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    return rows.map(row => ({
      element: row,
      title: row.children[1].textContent || '',
      author: row.children[2].textContent || '',
      class: row.children[3].textContent || '',
      dateCompleted: row.children[4].textContent || '',
    }));
  }

  function sortData(data: ReturnType<typeof getTableData>, column: keyof ReturnType<typeof getTableData>[number]) {
    return data.sort((a, b) => {
      const aVal = a[column].toLowerCase();
      const bVal = b[column].toLowerCase();
      return currentSort.ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }

  function updateTable(data: ReturnType<typeof getTableData>) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    data.forEach(item => {
      tableBody.appendChild(item.element);
    });
  }

  function filterData(data: ReturnType<typeof getTableData>, searchTerm: string) {
    const term = searchTerm.toLowerCase();
    return data.filter(item => {
      const searchString = `${item.title} ${item.author} ${item.class} ${item.dateCompleted}`.toLowerCase();
      return searchString.includes(term);
    });
  }

  function setSortedHeader(header: Element) {
    sortableHeaders.forEach(h => h.classList.remove('is-sorted'));
    header.classList.add('is-sorted');
  }

  if (filterInput && tableBody) {
    filterInput.addEventListener('input', () => {
      const data = getTableData();
      const filtered = filterData(data, filterInput.value);
      updateTable(filtered);
    });
  }

  sortableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const column = (header as HTMLElement).dataset.sort as keyof ReturnType<typeof getTableData>[number];
      if (!column) return;
      if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
      } else {
        currentSort.column = column;
        currentSort.ascending = true;
      }
      setSortedHeader(header);
      const data = getTableData();
      const sorted = sortData(data, column);
      updateTable(sorted);
    });
  });

  if (sortableHeaders.length) {
    setSortedHeader(sortableHeaders[0]);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFutureReading);
} else {
  initFutureReading();
}
