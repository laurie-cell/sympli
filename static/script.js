fetch('/api/new_case')
  .then(response => response.json())
  .then(data => {
    document.getElementById('caseDisplay').textContent = JSON.stringify(data, null, 2);
  })
  .catch(error => console.error('Error fetching case:', error));
