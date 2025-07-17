// Load TOC and build sidebar
fetch('toc.json')
  .then(res => res.json())
  .then(data => {
    const tree = document.querySelector('.nav-tree');
    if (tree) {
      tree.innerHTML = '';
      tree.appendChild(buildTree(data));
      setupDynamicLinks();
    }
  })
  .catch(error => console.error('Error loading toc.json:', error));

// Recursive function to build nested list
function buildTree(items) {
  const ul = document.createElement('ul');
  ul.className = 'nav-tree-list';

  items.forEach(item => {
    const li = document.createElement('li');

    if (item.children) {
      li.classList.add('folder-toggle');

      const header = document.createElement('div');
      header.className = 'folder-header';

      if (item.link) {
        const a = document.createElement('a');
        a.textContent = '📁 ' + item.title;
        a.href = '#';
        a.setAttribute('data-load', item.link);
        header.appendChild(a);
      } else {
        header.textContent = '📁 ' + item.title;
      }

      // Remove click event since all are expanded by default
      li.appendChild(header);
      const nestedUl = buildTree(item.children);
      li.appendChild(nestedUl);
      li.classList.add('open'); // Expand all folders by default
    } else {
      const a = document.createElement('a');
      a.textContent = item.title;
      a.href = '#';
      a.setAttribute('data-load', item.link);
      li.appendChild(a);
    }

    ul.appendChild(li);
  });

  return ul;
}

// Load page content into main area
function loadContent(link, push = true) {
  if (!link) return;
  const path = link.getAttribute('data-load');
  if (!path) return;

  fetch(path)
    .then(res => res.text())
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const content = doc.body.innerHTML;
      document.querySelector('.main-content').innerHTML = content;

      if (push) {
        history.pushState({ path }, '', `#${path}`);
      }

      document.querySelectorAll('a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    })
    .catch(() => {
      document.querySelector('.main-content').innerHTML = '<p>Error loading content.</p>';
    });
}

// Setup click listeners for sidebar links
function setupDynamicLinks() {
  document.querySelectorAll('a[data-load]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      loadContent(this);
    });
  });
}

// Load default page on startup
window.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.slice(1);
  const defaultPath = hash || 'pages/introduction.html';
  const targetLink = document.querySelector(`a[data-load="${defaultPath}"]`);
  if (targetLink) {
    loadContent(targetLink, false);
  }
});

// Handle browser navigation
window.addEventListener('popstate', () => {
  const hash = location.hash.slice(1);
  const link = document.querySelector(`a[data-load="${hash}"]`);
  if (link) loadContent(link, false);
});