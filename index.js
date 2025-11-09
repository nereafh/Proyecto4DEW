

//Elemento raíz del árbol
const listaRaiz = document.querySelector('#root');

//Formulario para agregar archivos/carpetas
const formularioAgregar = document.querySelector('#add-ex');

//Barra de búsqueda
const barraBusqueda = document.querySelector('#search-ex input');

//Checkbox para ocultar todo el árbol
const checkboxOcultar = document.querySelector('#hide');





//Creo un elemento del árbol (carpeta o archivo), createElement(): crea elementos HTML desde JS
function crearElemento(nombre, tipo) {

  const li = document.createElement('li'); // El <li> principal
  const nombreSpan = document.createElement('span'); // El texto del nombre

  /*
  Si es archivo y no tiene extensión → añade ".txt", textContent es una propiedad propia de JS
  se puede: obtener texto y cambiarlo 
  Diferencias con innerText y innerHTML
  textoContent: muestra todo el texto incluyendo CSS y no inserta HTML

  Al igual que la anterior classList también es una propiedad de JS: añade una clase 
  .remove("clase"): borra una clase
  .toggle("clase"): añade si no existe/quita si existe
  .replace("c1", "c2"): remplaza una por otra 
  .contains("clase"): comprueba si tiene clase 
  */
  nombreSpan.textContent = (tipo === 'file' && !nombre.includes('.')) ? nombre + '.txt' : nombre;
  nombreSpan.classList.add('name');

  /*
  Creo el botón, pero ni aparece en pantalla ni funciona
  lo agrego dentro de appendChild para que se visualice en pantalla,
  por último le agrego la lógica con addEventListener
  */
  const botonEliminar = document.createElement('span');
  botonEliminar.textContent = 'X';
  botonEliminar.classList.add('delete');

  
  if (tipo === 'folder') {
    // Es una carpeta
    li.classList.add('folder');

    const toggle = document.createElement('input'); // Checkbox para mostrar/ocultar
    toggle.type = 'checkbox';
    toggle.checked = true;
    toggle.classList.add('toggle');

    const botonAgregar = document.createElement('span'); // Botón de "+"
    botonAgregar.textContent = '+';
    botonAgregar.classList.add('add');

    const subLista = document.createElement('ul'); // Contenedor de hijos

    // Agrego al DOM, appendChild para visualizarse
    li.appendChild(botonEliminar);
    li.appendChild(toggle);
    li.appendChild(nombreSpan);
    li.appendChild(botonAgregar);
    li.appendChild(subLista);

  } else {
    // Es un archivo
    li.classList.add('file');
    li.appendChild(botonEliminar);
    li.appendChild(nombreSpan);
  }

  return li;
}



/* 
Comprueba si ya existe un archivo/carpeta con ese nombre dentro de una lista
lista.querySelector('.name): selecciona todos los eventos con clase='name' 

Como lo que devuelve no es un array como tal lo convierto a array
*/
function existeNombre(nombre, lista) {
  const items = Array.from(lista.querySelectorAll('.name'));
  let encontrado = false; // Variable para marcar si encontramos el nombre

  items.forEach(function(item) {
    const texto = item.textContent.toLowerCase();
    if (texto === nombre.toLowerCase() || texto === (nombre + '.txt').toLowerCase()) {
      encontrado = true; // Marcamos que encontramos el nombre
    }
  });

  return encontrado;
}






//---------------EVENTOS---------------
//Borrar

listaRaiz.addEventListener('click', function(evento) {
  const objetivo = evento.target;

  // Eliminar archivo o carpeta vacía
  if (objetivo.classList.contains('delete') && !objetivo.classList.contains('disabled')) {
    
    const li = objetivo.parentElement; //coge el elemento li del botón padre ya sea archivo o carpeta que se quiere borrar
    const subLista = li.querySelector('ul'); 

    // Si hay hijos en la carpeta no se borra
    if (subLista && subLista.children.length > 0) 
      return;
    
    li.remove();
  }

  // Seleccionar carpeta donde agregar elementos
  if (objetivo.classList.contains('add')) {
    listaRaiz.querySelectorAll('.folder.selected')
      .forEach(function(c) { 
        c.classList.remove('selected'); //Recorro las carpetas y les quito el elemento selected, es decir, que solo una carpete puede estar seleccionada al mismo tiempo
      });

    const carpetaSeleccionada = objetivo.parentElement; //parentElement: acceso al elemento padre
    /*
    Ejemplo:
  <ul>
    <li>
      <span class="delete">X</span>
      Archivo1.txt
    </li>
  </ul>
  const boton = document.querySelector('.delete')
  boton.parentElement será el <li> que lo contiene.
    */
    carpetaSeleccionada.classList.add('selected');

    formularioAgregar.querySelector('#itemName').focus();
  }
});



//--------------MOSTRAR Y OCULTAR------------
listaRaiz.addEventListener('change', function(evento) {
  if (evento.target.classList.contains('toggle')) {
    const subLista = evento.target.parentElement.querySelector('ul');
    subLista.style.display = evento.target.checked ? 'block' : 'none';
  }
});



//------------AGREGAR--------
formularioAgregar.querySelector('button').addEventListener('click', function(e) {
  e.preventDefault();//Evita que la página se recargue al agregar un archivo o carpeta 

  const input = formularioAgregar.querySelector('#itemName');
  const nombre = input.value.trim(); //Obtiene el nombre quitando espacios al principio y final
  const tipo = formularioAgregar.querySelector('#itemType').value;

  if (nombre === '') //si no hay nada se termina
    return;

  // Carpeta seleccionada o raíz
  const carpeta = listaRaiz.querySelector('.folder.selected') || listaRaiz.querySelector('li');

  const listaDestino = carpeta.querySelector('ul');

  if (existeNombre(nombre, listaDestino)) 
    return;

  const nuevo = crearElemento(nombre, tipo);
  listaDestino.appendChild(nuevo);

  input.value = '';
  carpeta.classList.remove('selected');
});




//-----------OCULTAR------------
checkboxOcultar.addEventListener('change', function() {
  listaRaiz.style.display = checkboxOcultar.checked ? 'none' : 'block';
});




//----------BARRA DE BÚSQUEDA-------------
barraBusqueda.addEventListener('keyup', function(e) {
  const texto = e.target.value.toLowerCase(); //todo a minúsculas

  function filtrar(li) {
    const nombre = li.querySelector('.name') ? li.querySelector('.name').textContent.toLowerCase() : '';
    const hijos = li.querySelectorAll(':scope > ul > li');
    let coincideHijo = false;

    // Revisa hijos recursivamente
    hijos.forEach(function(h) {
      if (filtrar(h)) 
        coincideHijo = true;
    });

    const coincidePropio = nombre.includes(texto);

    li.style.display = (coincidePropio || coincideHijo) ? 'list-item' : 'none';

    return coincidePropio || coincideHijo;
  }

  listaRaiz.querySelectorAll(':scope > li').forEach(li => filtrar(li));
});




//----------AUTOCOMPLETAR (TAB)-------------
barraBusqueda.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    const texto = barraBusqueda.value.toLowerCase();

    //Convierte la lista especial devuelta a array para poder usar métodos de array
    const coincidencias = Array.from(listaRaiz.querySelectorAll('.name'))
      .map(function(n) { return n.textContent; })
      .filter(function(n) { return n.toLowerCase().startsWith(texto); });

    if (coincidencias.length === 1) { //solo una coincidencia, evitando que se autocomplete si hay varias
      e.preventDefault(); //Completa automáticamente el texto, bloqueando la acción por defecto que sería moverse al siguiente campo
      barraBusqueda.value = coincidencias[0];
    }
  }
});
