// Folder toggle functionality
document.querySelectorAll('.folder-toggle .folder-header').forEach(header => {
  header.addEventListener('click', () => {
    const parent = header.parentElement;
    parent.classList.toggle('open');
  });
});

// Highlight current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.endsWith(currentPage)) {
    link.classList.add('active');
    const folder = link.closest('.folder-toggle');
    if (folder) folder.classList.add('open');
  }
});

// Load page content into main-content without full reload

document.querySelectorAll('a[data-load]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.getAttribute('data-load');

    fetch(target)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.body.innerHTML;

        document.querySelector('.main-content').innerHTML = newContent;

        // Update URL without reloading (optional, cleaner nav)
        history.pushState(null, '', target);
        
        // Re-highlight the active link
        document.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      });
  });
});

window.addEventListener('popstate', () => {
  const path = window.location.pathname.split('/').pop();
  const target = path || 'index.html';

  fetch(target)
    .then(res => res.text())
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const newContent = doc.body.innerHTML;
      document.querySelector('.main-content').innerHTML = newContent;
    });
});