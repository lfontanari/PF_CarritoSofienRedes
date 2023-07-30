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
const modalCarrito = document.querySelector(".carrito-container");
const botonCarrito = document.querySelector("#carrito");
const contenedor = document.querySelector("#product-container");
let contenedorCarrito;
let carritoVisible = false;
let precioTotalCarrito = 0;

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));  /* parseo el objeto carrito con la funcion stringify para guardarlo */
}

//Funcion para mostrar los productos en las tarjetas desde el jason

function getProductos() {
   
  debugger;
  return fetch ('../json/data.json')
    .then(response => response.json())
    .then(data => {
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
          debugger;
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
    })
    
    .catch(err => console.error(err));
  
     
    /*.finally(msaje => console.log(msaje)) ; */
    
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
      precioTotalCarritoElement.textalign = "justify";
      modalCarrito.appendChild(precioTotalCarritoElement);
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
  guardarCarrito(carrito);
  actualizarCarrito();
  modalCarrito.classList.add("modal-oculto");
  carritoVisible = false;
  precioTotalCarrito=0;
}


getProductos();