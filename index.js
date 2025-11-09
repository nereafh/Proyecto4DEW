// ============================================================
// Árbol de Directorios - Desarrollo Web Lado Cliente
// Versión comentada y fácil de entender
// ============================================================

// ==============================
// DEFINICIÓN DE FORMULARIOS Y LISTA
// ==============================

// Primer formulario (buscador)
const searchForm = document.forms[0];

// Formulario para agregar elementos
const addForm = document.forms["add-ex"];

// Carpeta raíz del árbol
const list = document.querySelector('#root');

// ==============================
// EVENTO: BORRAR ARCHIVOS O CARPETAS
// ==============================

// Escucha cualquier click dentro del árbol
list.addEventListener('click', function (e) {
  // Verifica si se hizo click en un botón de borrar
  if (e.target.classList.contains('delete') && !e.target.classList.contains('disabled')) {
    const li = e.target.parentElement; // Elemento <li> que contiene el archivo o carpeta
    const subList = li.querySelector('ul'); // Sublista dentro de la carpeta

    // Evita eliminar carpetas que no estén vacías
    if (subList && subList.children.length > 0) {
      alert("No puedes eliminar una carpeta que no está vacía.");
      return;
    }

    // Elimina el elemento del DOM
    li.parentNode.removeChild(li);
  }
});

// ==============================
// EVENTO: AGREGAR ARCHIVOS O CARPETAS
// ==============================

// Botón "Agregar" del formulario inferior
addForm.querySelector("button").addEventListener('click', function (e) {
  e.preventDefault(); // Evita que el formulario recargue la página

  // Obtiene los valores del formulario
  const nameInput = addForm.querySelector('#itemName');
  const typeSelect = addForm.querySelector('#itemType');
  const value = nameInput.value.trim(); // Nombre del archivo o carpeta
  const type = typeSelect.value; // Tipo: folder o file

  if (value === "") {
    alert("Debes escribir un nombre.");
    return;
  }

  // Verifica si ya existe el elemento en el nivel actual
  const existing = list.querySelectorAll('.name');
  for (let el of existing) {
    if (el.textContent === value) {
      alert("Ya existe un elemento con ese nombre.");
      return;
    }
  }

  // ==============================
  // CREACIÓN DE ELEMENTOS DEL DOM
  // ==============================
  const li = document.createElement('li'); // <li> contenedor
  const deleteBtn = document.createElement('span'); // Botón "X" para borrar
  deleteBtn.textContent = 'X';
  deleteBtn.classList.add('delete');

  const nameSpan = document.createElement('span'); // Nombre visible
  nameSpan.textContent = type === "file" && !value.includes('.') ? value + ".txt" : value;
  nameSpan.classList.add('name');

  if (type === "folder") {
    // Si es carpeta, se agregan checkbox y botón "+"
    li.classList.add('folder');

    // Checkbox para mostrar/ocultar subcarpetas
    const toggle = document.createElement('input');
    toggle.type = "checkbox";
    toggle.classList.add('toggle');
    toggle.checked = true;

    // Botón "+" para agregar elementos dentro de esta carpeta
    const addBtn = document.createElement('span');
    addBtn.textContent = '+';
    addBtn.classList.add('add');

    // Sublista vacía para elementos hijos
    const subList = document.createElement('ul');

    // Se agregan todos los elementos a la carpeta
    li.appendChild(deleteBtn);
    li.appendChild(toggle);
    li.appendChild(nameSpan);
    li.appendChild(addBtn);
    li.appendChild(subList);

  } else {
    // Si es archivo
    li.classList.add('file');
    li.appendChild(deleteBtn);
    li.appendChild(nameSpan);
  }

  // ==============================
  // AGREGAR ELEMENTO AL ÁRBOL
  // ==============================
  const selectedFolder = document.querySelector('.folder.selected') || list.querySelector('li'); // carpeta raíz por defecto
  const targetList = selectedFolder.querySelector('ul'); // sublista donde se insertará
  targetList.appendChild(li);

  // Limpiar campo de texto
  nameInput.value = "";
});

// ==============================
// EVENTO: OCULTAR O MOSTRAR TODO EL ÁRBOL
// ==============================
const hideBox = document.querySelector('#hide');
hideBox.addEventListener('change', function () {
  if (hideBox.checked) {
    list.style.display = "none"; // Oculta todo
  } else {
    list.style.display = "block"; // Muestra todo
  }
});

// ==============================
// EVENTO: EXPANDIR O COLAPSAR CARPETAS
// ==============================
list.addEventListener('change', function (e) {
  if (e.target.classList.contains('toggle')) {
    const subList = e.target.parentElement.querySelector('ul'); // sublista de la carpeta
    subList.style.display = e.target.checked ? "block" : "none"; // mostrar u ocultar
  }
});

// ==============================
// EVENTO: FILTRAR ARCHIVOS Y CARPETAS
// ==============================
const searchBar = document.forms['search-ex'].querySelector('input');

searchBar.addEventListener('keyup', (e) => {
  const term = e.target.value.toLowerCase(); // texto de búsqueda
  const allLis = list.querySelectorAll('li');

  // Función recursiva: verifica si un elemento o sus hijos coinciden
  function coincide(li) {
    const name = li.querySelector('.name')?.textContent.toLowerCase() || '';
    const hijos = li.querySelectorAll(':scope > ul > li');
    let matchHijo = false;

    // Revisa todos los hijos
    hijos.forEach(h => {
      if (coincide(h)) matchHijo = true;
    });

    // Si coincide él o algún hijo → mostrar
    const matchPropio = name.includes(term);
    const mostrar = matchPropio || matchHijo;
    li.style.display = mostrar ? 'list-item' : 'none';
    return mostrar;
  }

  // Aplica la función desde la raíz
  list.querySelectorAll(':scope > li').forEach(li => coincide(li));
});

// ==============================
// EVENTO OPCIONAL: AUTOCOMPLETAR NOMBRE CON TAB
// ==============================
searchBar.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const term = searchBar.value.toLowerCase();
    const coincidencias = [...list.querySelectorAll('.name')]
      .map(n => n.textContent)
      .filter(n => n.toLowerCase().startsWith(term));

    // Solo si hay una coincidencia
    if (coincidencias.length === 1) {
      e.preventDefault();
      searchBar.value = coincidencias[0];
    }
  }
});
