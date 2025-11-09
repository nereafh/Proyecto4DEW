// ============================================================
// Árbol de Directorios - JS Modular y Comentado
// ============================================================

// ==============================
// SELECCIÓN DE ELEMENTOS DEL DOM
// ==============================
const rootList = document.querySelector('#root');      // Carpeta raíz
const addForm = document.querySelector('#add-ex');      // Formulario de agregar
const searchBar = document.querySelector('#search-ex input'); // Input de búsqueda
const hideBox = document.querySelector('#hide');        // Checkbox para ocultar todo el árbol

// ==============================
// FUNCIONES AUXILIARES
// ==============================

// Crear un elemento (archivo o carpeta)
function createElement(name, type){
  const li = document.createElement('li');
  const nameSpan = document.createElement('span');
  nameSpan.textContent = type === 'file' && !name.includes('.') ? name+'.txt' : name;
  nameSpan.classList.add('name');

  const deleteBtn = document.createElement('span');
  deleteBtn.textContent = 'X';
  deleteBtn.classList.add('delete');

  if(type === 'folder'){
    li.classList.add('folder');

    // Checkbox toggle
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = true;
    toggle.classList.add('toggle');

    // Botón agregar
    const addBtn = document.createElement('span');
    addBtn.textContent = '+';
    addBtn.classList.add('add');

    const subList = document.createElement('ul');

    li.appendChild(deleteBtn);
    li.appendChild(toggle);
    li.appendChild(nameSpan);
    li.appendChild(addBtn);
    li.appendChild(subList);

  } else {
    li.classList.add('file');
    li.appendChild(deleteBtn);
    li.appendChild(nameSpan);
  }
  return li;
}

// Comprueba si ya existe un elemento con el mismo nombre dentro de un ul
function existsInList(name, ul){
  return Array.from(ul.querySelectorAll('.name'))
              .some(n => n.textContent.toLowerCase() === name.toLowerCase() || 
                         n.textContent.toLowerCase() === (name+'.txt').toLowerCase());
}

// ==============================
// EVENTOS PRINCIPALES
// ==============================

// BORRAR archivos o carpetas vacías
rootList.addEventListener('click', function(e){
  const target = e.target;

  if(target.classList.contains('delete') && !target.classList.contains('disabled')){
    const li = target.parentElement;
    const subList = li.querySelector('ul');
    if(subList && subList.children.length > 0){
      return;
    }
    li.remove();
  }

  // BOTÓN +: seleccionar carpeta para agregar elementos
  if(target.classList.contains('add')){
    rootList.querySelectorAll('.folder.selected').forEach(f => f.classList.remove('selected'));
    const folderLi = target.parentElement;
    folderLi.classList.add('selected');
    addForm.querySelector('#itemName').focus();
  }
});

// TOGGLE mostrar/ocultar contenido de carpeta
rootList.addEventListener('change', function(e){
  if(e.target.classList.contains('toggle')){
    const subList = e.target.parentElement.querySelector('ul');
    subList.style.display = e.target.checked ? 'block' : 'none';
  }
});

// AGREGAR archivo o carpeta
addForm.querySelector('button').addEventListener('click', function(e){
  e.preventDefault();

  const input = addForm.querySelector('#itemName');
  const name = input.value.trim();
  const typeSelect = addForm.querySelector('#itemType');
  const type = typeSelect.value;

  if(name === ''){
    return;
  }

  const selectedFolder = rootList.querySelector('.folder.selected') || rootList.querySelector('li');
  const targetUl = selectedFolder.querySelector('ul');

  if(existsInList(name, targetUl)){
    return;
  }

  const newEl = createElement(name, type);
  targetUl.appendChild(newEl);

  input.value = '';
  selectedFolder.classList.remove('selected');
});

// OCULTAR TODO EL ÁRBOL
hideBox.addEventListener('change', function(){
  rootList.style.display = hideBox.checked ? 'none' : 'block';
});

// BUSCADOR y FILTRADO
searchBar.addEventListener('keyup', function(e){
  const term = e.target.value.toLowerCase();

  function filterLi(li){
    const name = li.querySelector('.name')?.textContent.toLowerCase() || '';
    const children = li.querySelectorAll(':scope > ul > li');
    let childMatch = false;
    children.forEach(c => { if(filterLi(c)) childMatch = true; });
    const selfMatch = name.includes(term);
    li.style.display = selfMatch || childMatch ? 'list-item' : 'none';
    return selfMatch || childMatch;
  }

  rootList.querySelectorAll(':scope > li').forEach(li => filterLi(li));
});

// AUTOCOMPLETAR CON TAB
searchBar.addEventListener('keydown', function(e){
  if(e.key === 'Tab'){
    const term = searchBar.value.toLowerCase();
    const matches = Array.from(rootList.querySelectorAll('.name'))
                         .map(n => n.textContent)
                         .filter(n => n.toLowerCase().startsWith(term));

    if(matches.length === 1){
      e.preventDefault();
      searchBar.value = matches[0];
    }
  }
});
