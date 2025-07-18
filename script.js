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
      // Apply bold-header if bold is true or undefined (default to bold for folders)
      if (item.bold === true || item.bold === undefined) {
        header.classList.add('bold-header');
      } else if (item.bold === false) {
        // Do nothing or remove bold-header if already present
        header.classList.remove('bold-header');
      }

      if (item.link) {
        const a = document.createElement('a');
        if (item.icon && item.icon.trim()) {
          addIcon(a, item.icon);
        }
        a.appendChild(document.createTextNode(item.title));
        a.href = '#';
        a.setAttribute('data-load', item.link);
        header.appendChild(a);
      } else {
        const span = document.createElement('span');
        if (item.icon && item.icon.trim()) {
          addIcon(span, item.icon);
        }
        span.appendChild(document.createTextNode(item.title));
        header.appendChild(span);
      }

      li.appendChild(header);
      const nestedUl = buildTree(item.children);
      li.appendChild(nestedUl);
      li.classList.add('open');
    } else {
      const a = document.createElement('a');
      if (item.icon && item.icon.trim()) {
        addIcon(a, item.icon);
      }
      // Apply bold-header only if bold is true, default to normal
      if (item.bold === true) {
        a.classList.add('bold-header');
      }
      a.appendChild(document.createTextNode(item.title));
      a.href = '#';
      a.setAttribute('data-load', item.link);
      li.appendChild(a);
    }

    ul.appendChild(li);
  });

  return ul;
}

// Function to add icon based on type
function addIcon(element, icon) {
  if (icon.startsWith('fa-') || icon.includes('fa-')) {
    const iconElement = document.createElement('i');
    iconElement.className = `fas ${icon}`;
    iconElement.style.marginRight = '0.5rem';
    element.insertBefore(iconElement, element.firstChild);
  }
  else if (icon.trim().startsWith('<svg')) {
    const iconElement = document.createElement('span');
    iconElement.innerHTML = icon;
    iconElement.style.marginRight = '0.5rem';
    element.insertBefore(iconElement, element.firstChild);
  }
  else {
    const iconElement = document.createElement('img');
    iconElement.src = icon;
    iconElement.alt = 'Icon';
    iconElement.style.marginRight = '0.5rem';
    element.insertBefore(iconElement, element.firstChild);
  }
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