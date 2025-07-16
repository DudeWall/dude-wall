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