// Handle collapsible folders in left sidebar
document.querySelectorAll('.folder-toggle .folder-header').forEach(header => {
  header.addEventListener('click', () => {
    const parent = header.parentElement;
    parent.classList.toggle('open');
  });
});

// Highlight and load content dynamically
function loadContent(link, pushState = true) {
  const target = link.getAttribute('data-load');

  fetch(target)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.body.innerHTML;
      document.querySelector('.main-content').innerHTML = newContent;

      if (pushState) {
        history.pushState(null, '', target);
      }

      // 🔹 Remove previous highlights
      document.querySelectorAll('a').forEach(a => a.classList.remove('active'));
      document.querySelectorAll('.folder-header').forEach(h => h.classList.remove('active'));

      // 🔹 Highlight the clicked link
      link.classList.add('active');

      // 🔹 If it's a child inside a folder, also highlight the folder header
      const folder = link.closest('.folder-toggle');
      if (folder) {
        folder.classList.add('open');
        const header = folder.querySelector('.folder-header');
        if (header) header.classList.add('active');
      }
    });
}

// Attach click listeners to all [data-load] links
function setupDynamicLinks() {
  document.querySelectorAll('a[data-load]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      loadContent(this);
    });
  });
}

// Setup on page load
setupDynamicLinks();

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const matchingLink = document.querySelector(`a[data-load="/${path}"], a[data-load="${path}"]`);

  if (matchingLink) {
    loadContent(matchingLink, false);
  } else {
    fetch(path)
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        document.querySelector('.main-content').innerHTML = doc.body.innerHTML;
      });
  }
});
