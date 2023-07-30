document.addEventListener("DOMContentLoaded", () => {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.forEach((itemCarrito) => carritoHTML(itemCarrito));
  modalCarrito.classList.add("modal-oculto");
  carritoVisible = false;
  actualizarCarrito();
  
});

class Producto {
  constructor(id, categoria, nombre, precio, imagen) {
    this.id = id;
    this.categoria = categoria;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
  }
}

let carrito = [];
let precioTotalCarrito = 0;
const modalCarrito = document.querySelector(".carrito-container");
const botonCarrito = document.querySelector("#carrito");
const contenedor = document.querySelector("#product-container");
let contenedorCarrito;
let carritoVisible = false;


function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));  /* parseo el objeto carrito con la funcion stringify para guardarlo */
}

//Funcion para mostrar los productos en las tarjetas desde el json
// agrego  ASYNC y AWAIT con try catch en la funcion

async function getProductos() {
  try {
    
    const response = await fetch("./json/data.json");
    if (!response.ok) {
      throw new Error('Error en la solicitud. Codigo de estado: ' + response.status);
    }
    const data = await response.json();
    contenedor.innerHTML = "";
    const productos = data.productos;
    productos.forEach(producto => {
      const contenedorProductos = document.createElement("div");
      contenedorProductos.classList.add("tarjeta");
      contenedorProductos.innerHTML = `
                  <img src="${producto.imagen}">
                  <h6>${producto.categoria} : ${producto.nombre}</h6>
                  <p>$${producto.precio}</p>
                  <button class='agregar_carrito' id='${producto.id}'>Agregar al carrito</button>`;

      contenedor.appendChild(contenedorProductos);
      const imagen = contenedorProductos.querySelector("img");
    });
    //AGREGAR AL CARRITO
    const botonAgregar = document.querySelectorAll(".agregar_carrito"); /* lo tomo de la clase agregar_carrito por eso el . */
    botonAgregar.forEach(function (boton) {
      boton.addEventListener("click", function () {
        modalCarrito.classList.add("modal-oculto");
        carritoVisible = false;
        const botonId = parseInt(this.id);
        const productoAgregado = productos.find(
          (producto) => producto.id === botonId
        );
        carrito.push(productoAgregado);
        
        guardarCarrito(carrito);
        precioTotalCarrito += productoAgregado.precio;
        Swal.fire({
          text: "Producto agregado !!!",
          imageUrl: productoAgregado.imagen,
          imageWidth: 250,
          imageHeight: 200,
          imageAlt: "foto de producto",
          confirmButtonText: "OK",
        });
        actualizarCarrito();
      });
    });

    

  } catch (e) {
    throw new Error("Error");
  }
}

//MOSTRAR CARRITO
botonCarrito.addEventListener("click", function () {
 

  if (carritoVisible) {
    modalCarrito.innerHTML = "";
    modalCarrito.classList.add("modal-oculto");
    carritoVisible = false;
      
  } else {
    modalCarrito.innerHTML = "";
   
    carrito.forEach(carritoHTML);

    modalCarrito.classList.remove("modal-oculto");
    carritoVisible = true;
    if (carrito.length !== 0) {
      
      const btnVaciarCarrito = document.createElement("button");
      btnVaciarCarrito.id = "vaciar-carrito";
      btnVaciarCarrito.textContent = "Vaciar Carrito";
      btnVaciarCarrito.addEventListener("click", vaciarCarrito);
      modalCarrito.appendChild(btnVaciarCarrito);

      const precioTotalCarritoElement = document.createElement("p");
      precioTotalCarritoElement.textContent = `SUBTOTAL: $ ${precioTotalCarrito.toFixed(2)}`;
      
      modalCarrito.appendChild(precioTotalCarritoElement);

      const btnComprar = document.createElement("button");
      btnComprar.id = "comprar";
      btnComprar.textContent = "Comprar";
      btnComprar.addEventListener("click", comprar);
      modalCarrito.appendChild(btnComprar);

      
    }
  }

  if (carrito.length === 0) {
    Toastify({
      text: "El carrito esta vacio!",
      className: "info",
      duration: 2000,
      position: "center",
    }).showToast();
  }
});
//GENERAR HTML DEL CARRITO
function carritoHTML(itemCarrito) {
  contenedorCarrito = document.createElement("div");
  contenedorCarrito.classList.add("item-carrito");
  contenedorCarrito.innerHTML = `
            <img src='${itemCarrito.imagen}'>
            <div class="item-texto">
             <h6>${itemCarrito.categoria} : ${itemCarrito.nombre}</h6>
              <p>$${itemCarrito.precio}</p>
            </div>            
            `;
  modalCarrito.appendChild(contenedorCarrito);
  const separador = document.createElement("hr");
  modalCarrito.appendChild(separador);
}




function actualizarCarrito() {
  modalCarrito.innerHTML = "";
  carrito.forEach(function (itemCarrito) {

    carritoHTML(itemCarrito);

  });
  if (carrito.length === 0) {
    modalCarrito.classList.add("modal-oculto");
    carritoVisible = false;
  }
}

function vaciarCarrito() {
  carrito = [];
  precioTotalCarrito=0;
  guardarCarrito(carrito);
  actualizarCarrito();
  modalCarrito.classList.add("modal-oculto");
  carritoVisible = false;
  
}

function comprar(){
  Swal.fire({
    title: 'Gracias por tu compra',
    icon: 'success',
    confirmButtonText: 'Cerrar',
    color: '#f48aba'
  });
  vaciarCarrito();
}

getProductos();