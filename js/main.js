/*
Alumno: Sandes Julian Naim
Fecha: 3/6/2025
Parcial: 1
Materia: Programacion III

Nota: Como aca se trabaja mucho con clases, tuve que usar la funcion "getElementsByClassName" que
en realidad devuelve un array de todas las etiquetas que tienen esa clase (porque justamente
las clases se pueden asignar a multiples etiqueta) para trabajar con el HTML!
*/

/*-------------------------------------------*/
//Definicion de Eventos
/*-------------------------------------------*/
let barraBusqueda = document.getElementsByClassName("barra-busqueda")[0]; //Este es el "Input" del encabezado!
barraBusqueda.addEventListener("keyup", FiltrarProductos);

/*-------------------------------------------*/
//Definicion de Variables
/*-------------------------------------------*/
//Objeto Alumno (lo defini como CONST porque esto es algo que jamas se modificara).
const objAlumno = {dni: 46687343, nombre:"Julian", apellido:"Sandes"};

//Array de Frutas
let arrFrutas = [
    {id:1, nombre:"Arandano", precio:5000, img:"img/arandano.jpg"},
    {id:2, nombre:"Banana", precio:1000, img:"img/banana.jpg"},
    {id:3, nombre:"Frambuesa", precio:4000, img:"img/frambuesa.png"},
    {id:4, nombre:"Frutilla", precio:3000, img:"img/frutilla.jpg"},
    {id:5, nombre:"Kiwi", precio:2000, img:"img/kiwi.jpg"},
    {id:6, nombre:"Mandarina", precio:800, img:"img/mandarina.jpg"},
    {id:7, nombre:"Manzana", precio:1500, img:"img/manzana.jpg"},
    {id:8, nombre:"Naranja", precio:9000, img:"img/naranja.jpg"},
    {id:9, nombre:"Pera", precio:2500, img:"img/pera.jpg"},
    {id:10, nombre:"Anana", precio:5000, img:"img/anana.jpg"},
    {id:11, nombre:"Pomelo Amarillo", precio:3000, img:"img/pomelo-amarillo.jpg"},
    {id:12, nombre:"Pomelo Rojo", precio:2000, img:"img/pomelo-rojo.jpg"},
    {id:13, nombre:"Sandia", precio:2000, img:"img/sandia.jpg"}
]

//Array del Carrito (de inicio vacio!)
let arrCarrito = [];

/*-------------------------------------------*/
//Funciones
/*-------------------------------------------*/
//  *Funcion para imprimir los datos del escritor! :P
function imprimirDatosAlumno(){
    console.log(`Codigo JavaScript creado y escrito por\n${objAlumno.nombre} ${objAlumno.apellido} - DNI ${objAlumno.dni}`);

    //alumDato sera el div con la clase "nombreAlumno".
    alumDato = document.getElementsByClassName("nombreAlumno")[0];
    alumDato.innerHTML = objAlumno.nombre + " " + objAlumno.apellido; //nombre apellido
}

//  *Funcion para modificar el contenedor de productos!
//  Esta funcion puede aceptar distintos arrays que contenga los productos. 
//  Esto es para que se pueda reutilizar en otras funciones (ej. 'FiltrarProductos').
function mostrarProductos(array){
    let htmlNuevoContenido = ""; //Esta variable tendra las nuevas instrucciones para el HTML.

    //Todas las tarjetas de productos en el HTML seguiran este formato!
    //Para este caso use un forEach porque resume mas todo el proceso en pocas sintaxis.
    array.forEach(producto => {htmlNuevoContenido += `
        <div class="card-producto">
            <img src="${producto.img}" alt="">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button onClick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        </div>
    `
    });

    //Toda la instruccion es luego puesta en el div de "contenedor-productos"!
    document.getElementsByClassName("contenedor-productos")[0].innerHTML = htmlNuevoContenido;
}

//  *Funcion para filtrar el contenido del contenedor de productos en base a lo que buscamos.
function FiltrarProductos(){
    let busq = barraBusqueda.value; //Extraemos el texto del InputBox.

    /*Desde mi perspectiva, pense que seria buena idea incluir productos que los nombres
    coincidan exactamente (incluyendo mayusculas) y por otro lado incluir aquellos que no
    necesariamente tengan que coincidir perfectamente en las mayusculas!*/

    //"Filtrado Perfecto" buscara aquellos productos que coincidan perfectamente con lo escrito.
    let arrFiltradoPerfecto = arrFrutas.filter(prod => prod.nombre.includes(busq));
    //"Filtrado Basico" buscara aquellos productos que no necesariamente coincidan perfecto.
    let arrFiltradoBasico = arrFrutas.filter(prod => prod.nombre.toLowerCase().includes(busq.toLowerCase()));

    //Y luego, con la funcion "fusionSinDupicados" se manda como argumento para la funcion mostrar productos!
    mostrarProductos(fusionSinDupicados(arrFiltradoPerfecto, arrFiltradoBasico));
}

//  *Funcion para eliminar elementos duplicados y fusionar 2 arrays.
//  Esta funcion existe para cumplir mi capricho del Filtrado! :P
//  Devuelve un array sin elementos duplicados!
function fusionSinDupicados(array1, array2){

    //Cada iteracion del primer Array se iterara todo el segundo Array
    //para ver si coinciden en la ID (dato unico de cada producto).
    //Si resulta que si coinciden, se elimina el duplicado que se encuentre en el segundo array!
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
            if(array1[i].id == array2[j].id){
                array2.splice(j, 1);
            }
        }
    }
    return (array1.concat(array2));
}

//  *Funcion para encontrar un producto mediante su ID.
//  Si encuentra el indice del producto coincidente, retornara este mismo.
//  Caso contrario, retornara un -1.
function productoPorID(id, array){
    for (let p = 0; p < array.length; p++) {
        if(array[p].id == id){ //Si este indice es el que coincide, significa que es el que buscamos!
            return p;
        }
    }
    return -1;
}

//  *Funcion para añadir un producto al carrito!
//  Como es un dato unico, aca se trabaja con IDs...
function agregarAlCarrito(id){
    let prod = arrFrutas[productoPorID(id, arrFrutas)];

    //Solo trabajaremos si encontramos el producto de forma valida!
    if(prod != -1){
        arrCarrito.push(prod); //Lo agregamos al array del carrito!
        console.log(arrCarrito);
        mostrarCarrito();
    }else{
        //Caso contrario (y muy raro?) imprimiremos en la consola un mensaje de error.
        console.error(`Error: Producto no encontrado (ID ${id})`)
    }

    guardarProductos(); //Cada cambio en el carrito se guardara.
}

//  *Funcion para mostrar el contenido del carrito!
//  Mucho del proceso es parecido a la funcion "mostrarProductos".
function mostrarCarrito(){
    let htmlNuevoContenido = "";
    let precioTotal = 0; //Esto es para luego contar el precio de todos los productos.

    //Todas las tarjetas de productos en el HTML seguiran este formato!
    //Para este caso use un forEach porque resume mas todo el proceso en pocas sintaxis.
    arrCarrito.forEach(producto => {htmlNuevoContenido += `
        <li class="bloque-item">
            <p class="nombre-item">${producto.nombre} - $${producto.precio}</p>
            <button class="boton-eliminar" onClick="eliminarProducto(${producto.id})">Eliminar</button>
        </li>
    `

    precioTotal += producto.precio;
    });

    //Esto es mandado al la etiqueta con id "items-carrito".
    document.getElementById("items-carrito").innerHTML = htmlNuevoContenido;

    //De paso se actualiza el contador y el precio total de los productos.
    document.getElementById("contador-carrito").innerHTML = arrCarrito.length;
    document.getElementById("precio-total").innerHTML = `$${precioTotal};`
}

//  *Funcion para eliminar el producto del carrito.
//  Trabaja con IDs.
function eliminarProducto(id){
    //Si se encontro un producto valido, este sera el que removeremos!
    if(productoPorID(id, arrCarrito) >= 0){
        arrCarrito.splice(productoPorID(id, arrCarrito), 1);
        mostrarCarrito(); //Para demostrar los cambios, se ejecuta la funcion de mostrarCarrito.
    }else{
        //Caso contrario, imprimiremos en la consola un mensaje de error.
        console.error(`Error: Producto a eliminar no encontrado (ID ${id})`)
    }

    guardarProductos(); //Cada cambio en el carrito se guardara.
}

//  *Funcion para guardar los productos del carrito.
//  Trabaja con LocalStorage!
function guardarProductos(){
    if(arrCarrito.length > 0){
        let arrGuardado = []; //Este array tendra todos los productos en el formato de JSON!
        arrCarrito.forEach(prod => {arrGuardado.push(prod);}); //Aca si use forEach para simplificar.
        console.log(arrCarrito);

        //Y de paso, se usa JSON.Stringify para que lo guarde en el formato correcto.
        localStorage.setItem("productos", JSON.stringify(arrGuardado));
    }
    else{ //En caso de estar vacio el array, borraremos de la existencia el item!
        localStorage.removeItem("productos");
    }
    
}

//  *Funcion para cargar los productos del carrito.
//  El amigo de la funcion anterior.
function cargarProductos(){
    let arrCargado = localStorage.getItem("productos"); //Aca ira todo lo obtenido del LocalHost.

    //Si no es Null, significa que hay productos!
    if(arrCargado != null){
        arrCargado = JSON.parse(arrCargado); //Convertimos el string al array obtenido. (ya que lo convetimos antes!)

        //Si no esta vacio, se carga.
        if(arrCargado.length > 0){
            arrCargado.forEach(prod => {arrCarrito.push(prod)}); //Y ahora solo pasamos todos los elementos al carrio para mostrarlo.
            mostrarCarrito();
            console.log("Productos guardados cargados!")
        }
        
    }
}

//  *Funcion para ordenar los productos.
//  Segun el argumento, se ordenara de distinta forma (descrito mas abajo)
function ordenarProductos(tipo){
    switch(tipo){
        case 0: //Orden por Nombre
            //Mejor oportunidad para usar operadores ternarios no encontre!
            //Basicamente nos fijamos si el producto ira adelante si el nombre comienza con una letra
            //superior o inferior dependiendo de su orden.
            mostrarProductos(arrFrutas.sort((a,b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0)));
        break;

        case 1: //Orden por Precio
            //El orden aca es de menor a mayor.
            mostrarProductos(arrFrutas.sort((a,b) => a.precio - b.precio));
        break;

        default: //Orden por ID
            mostrarProductos(arrFrutas.sort((a,b) => a.id - b.id)); //De menor a mayor
        break;
    }
}

//  *Funcion para vaciar el carrito.
//  Se explica solo.
function vaciarCarrito(){
    arrCarrito = [];
    mostrarCarrito(); //Se actualiza el carrito.
    guardarProductos(); //Y se guarda todo el borrado.
}

//---------------------------------------------------------------------

//  *Funcion inicializadora, solo se ejecutara al arrancar la pagina.
function Init(){
    imprimirDatosAlumno(); //Esto imprimira los datos.
    mostrarProductos(arrFrutas); //Crea las tarjetas de productos disponibles!
    cargarProductos(); //Intentaremos cargar todo los productos que puedan estar en el LocalStorage.
}

Init();
//Fin del archivo.