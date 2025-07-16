fetch('toc.json')
  .then(response => response.json())
  .then(data => buildSidebar(data));

function buildSidebar(sections) {
  const tree = document.querySelector('.tree');
  if (!tree) return;

  tree.innerHTML = '';

  const currentPage = window.location.pathname.split('/').pop();

  const home = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = 'index.html';
  homeLink.textContent = '🏠 Home';
  if (currentPage === '' || currentPage === 'index.html') {
    homeLink.classList.add('active');
  }
  home.appendChild(homeLink);
  tree.appendChild(home);

  sections.forEach((section, index) => {
    const li = document.createElement('li');

    // ✅ Case 1: Section has children (folder style)
    if (section.children && section.children.length > 0) {
      const span = document.createElement('span');
      span.className = 'folder';
      span.textContent = '📁 ' + section.title;
      span.onclick = () => toggle(span);

      const ul = document.createElement('ul');
      ul.className = 'nested';

      section.children.forEach(item => {
        const childLi = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.title;

        // 🔥 Add active class if this is the current page
        if (item.link === currentPage) {
          link.classList.add('active');
          span.classList.add('active'); // expand the folder if needed
          ul.style.display = 'block';
        }

        childLi.appendChild(link);
        ul.appendChild(childLi);
      });

      li.appendChild(span);
      li.appendChild(ul);
    }

    // ✅ Case 2: Section has no children but has a link (header-only link)
    else if (section.link) {
      const link = document.createElement('a');
      link.href = section.link;
      link.textContent = '📁 ' + section.title;

      if (section.link === currentPage) {
        link.classList.add('active');
      }

      li.appendChild(link);
    }

    // ✅ Append the item to the tree
    tree.appendChild(li);

    // ✅ Optional: Add separator between sections
    if (index < sections.length - 1) {
      const separator = document.createElement('hr');
      separator.className = 'toc-separator';
      tree.appendChild(separator);
    }
  });
}

function toggle(el) {
  el.classList.toggle("active");
  const nested = el.nextElementSibling;
  if (nested) {
    nested.style.display = nested.style.display === "block" ? "none" : "block";
  }
}

fetch('misc.json')
  .then(res => res.json())
  .then(items => {
    const miscTree = document.querySelector('.misc-tree');
    items.forEach(item => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.link;
      link.textContent = item.title;
      li.appendChild(link);
      miscTree.appendChild(li);
    });
  });