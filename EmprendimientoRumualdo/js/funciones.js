//VARIABLES DE ACCESO GLOBAL
const productos = [];
let carrito   = [];

//DECLARACIÓN DE CLASE PRODUCTO
class Producto {
  constructor(id, nombre, precio, img,cantidad ) {
      this.id = parseInt(id);
      this.nombre = nombre;
      this.precio = parseFloat(precio);        
      this.img = img;
      this.cantidad = parseInt(cantidad);
  
  }

  agregarCantidad(valor) {
      this.cantidad += valor;
  }

  subtotal() {
      return this.cantidad * this.precio;
  }
}

//Utilizo el metodo HIDE para ocultar todo lo que esta en el div productosContenedor
$('#productosContenedor').hide();

//Utilizo una llamada asincrona para traer los datos desde un JSON
$.get("../data/productos.json", function (respuesta, estado) {
    console.dir(respuesta);
    console.log(estado);
    //Pregunto si el estado de la operacion fue exitoso
    if (estado == "success") {
        //Recorro el array respuesta y lo transformo a objetos de tipo "producto"
        for (const objeto of respuesta) {
            //Guardo los objetos "traducidos" en el array productos           
            productos.push(new Producto(objeto.id, objeto.nombre, objeto.precio, objeto.imagen, objeto.cantidad));

        }
        //GENERAR INTERFAZ DE PRODUCTOS CON UNA FUNCION
        productosUI(productos, '#productosContenedor');
    } else {
        console.log('Los datos no se cargaron correctamente');
    }

});

$(document).ready(function () {
    //Asocio en evento click a los botones con la clase btn-compra       
    $(".btn-compra").click(comprarProducto);
    });

$(window).on('load', function () {
    $("#espera").remove();
    //AGREGO FADEIN PARA QUE SE MUESTREN LOS PRODUCTOS OCULTOS 
    $('#productosContenedor').fadeIn(2000,
        //Agrego una funcion callback
        function () {
            console.log("Funcionalidad Callback")
        });
});

//FUNCION PARA GENERAR LA INTERFAZ DE PRODUCTOS CON JQUERY
function productosUI(productos, id) {
  $(id).empty();
  for (const producto of productos) {
    $(id).append(`<div class="card" style="width: 18rem;">
                    <img src="${producto.img}" class="card-img-top" alt="Foto de: "${producto.nombre}>
                    <div class="card-body">
                      <h5 class="card-title">${producto.nombre}</h5>
                      <p class="card-text"> <b>$${producto.precio} </b> </p>                      
                      <a href="#" id='${producto.id}' class="btn btn-compra rounded-pill items-btn-card"> Comprar </a>
                    </div>
                  </div>`);
  }
}

//MANEJADOR DE COMPRA DE PRODUCTOS
function comprarProducto(event) {
  //PREVENIR REFRESCO AL PRESIONAR ENLACES
  event.preventDefault();
  //OBTENER ID DEL BOTON PRESIONADO
  const idProducto = event.target.id;
  //OBTENER OBJETO DEL PRODUCTO CORRESPONDIENTE AL ID
  const existe = carrito.find(producto => producto.id == idProducto);

  if (existe == undefined) {
    const seleccionado = productos.find(producto => producto.id == idProducto);
    carrito.push(seleccionado);
  } else {
    existe.agregarCantidad(1);
  }
  //---------Almacenamiento en localstorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  carritoUI(carrito);
}

function carritoUI(productos) {
  //CAMBIAR INTERIOR DEL INDICADOR DE CANTIDAD DE PRODUCTOS;
  $('#carritoCantidad').html(productos.length);
  //VACIAR EL INTERIOR DEL CUERPO DEL CARRITO;
  $('#carritoProductos').empty();
  for (const producto of productos) {
    $('#carritoProductos').append(`<p> ${producto.nombre} <br>
                                    <span class="badge rounded-pill items-btn-card">
                                    $ ${producto.precio}</span>
                                    <span class="badge rounded-pill items-btn-card">
                                    Cantidad: ${producto.cantidad}</span>
                                    <span class="badge rounded-pill items-btn-card">
                                    Subtotal: ${producto.subtotal()}</span>  
                                    </p>`);
  }
  //Agrego un boton confirmar al carrito
  $('#carritoProductos').append(`<button id="btnConfirmar" class="rounded-pill items-btn-card">Confirmar</button>`);
  //Agrego el evento click al boton confirmar
  $("#btnConfirmar").on("click", enviarCompra);
}
//Creo una funcion para manejar el evento click en el boton confirmar
function enviarCompra() {
  //Hago un envio post
  //Envio la info del carrito  transformada a JSON
  $.post("https://jsonplaceholder.typicode.com/posts", JSON.stringify(carrito), function (respuesta, estado) {
    console.log(estado);
    console.log(respuesta);
    ///Pregunto si el estado de la operacion fue exitoso
    if (estado == "success") {
      //Vacio el carrito
      $('#carritoProductos').empty();
      //Vacio el numero de productos
      $('#carritoCantidad').html("0");
    } else {
      console.log('Los datos no se enviaron correctamente');
    }

  })
}

function selectUI(lista, selector) {
  $(selector).empty();
  for (const categoria of lista) {
    $(selector).append(`<option>${categoria}</option>`);
  }
  $(selector).prepend(`<option selected>TODOS</option>`);
}


