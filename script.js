fetch('toc.json')
  .then(response => response.json())
  .then(data => buildSidebar(data));

function buildSidebar(sections) {
  const tree = document.querySelector('.tree');
  if (!tree) return;

  tree.innerHTML = '';

  const home = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = 'index.html';
  homeLink.textContent = '🏠 Home';
  home.appendChild(homeLink);
  tree.appendChild(home);

  sections.forEach(section => {
    const li = document.createElement('li');
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
      childLi.appendChild(link);
      ul.appendChild(childLi);
    });

    li.appendChild(span);
    li.appendChild(ul);
    tree.appendChild(li);
  });
}

function toggle(el) {
  el.classList.toggle("active");
  const nested = el.nextElementSibling;
  if (nested) {
    nested.style.display = nested.style.display === "block" ? "none" : "block";
  }
}
