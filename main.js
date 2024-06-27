const API_URL = "http://localhost/Labo3/personasEmpleadosClientes.php";

function $(id){return document.getElementById(id)}

function mostrarDatos()
{
    const XHTTP = new XMLHttpRequest();

    XHTTP.open("GET", API_URL);

    XHTTP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            let clientes = JSON.parse(XHTTP.response);

            let tabla = document.querySelector("#tablaPersonas tbody");

            clientes.forEach(function(cliente) {
                let fila = document.createElement("tr");
                
                let columnaId = document.createElement("td");
                columnaId.textContent = cliente.id;
                fila.appendChild(columnaId);
                
                let columnaNombre = document.createElement("td");
                columnaNombre.textContent = cliente.nombre;
                fila.appendChild(columnaNombre);
                
                let columnaApellido = document.createElement("td");
                columnaApellido.textContent = cliente.apellido;
                fila.appendChild(columnaApellido);

                let columnaEdad = document.createElement("td");
                columnaEdad.textContent = cliente.edad;
                fila.appendChild(columnaEdad);

                let columnaVentas = document.createElement("td");
                columnaVentas.textContent = cliente.ventas;
                fila.appendChild(columnaVentas);

                let columnaSueldo = document.createElement("td");
                columnaSueldo.textContent = cliente.sueldo;
                fila.appendChild(columnaSueldo);

                let columnaCompras = document.createElement("td");
                columnaCompras.textContent = cliente.compras;
                fila.appendChild(columnaCompras);

                let columnaTelefono = document.createElement("td");
                columnaTelefono.textContent = cliente.telefono;
                fila.appendChild(columnaTelefono);
                
                let columnaBotones = document.createElement("td");
                let botonModificar = document.createElement("button");
                botonModificar.textContent = "Modificar";
                columnaBotones.appendChild(botonModificar);
                
                let botonEliminar = document.createElement("button");
                botonEliminar.textContent = "Eliminar";
                columnaBotones.appendChild(botonEliminar);
                
                fila.appendChild(columnaBotones);
                tabla.appendChild(fila);
            });
        }
        else
        {
            console.log(XHTTP.statusText);
        }
    };

    XHTTP.send();
}

//BOTON AGREGAR
$("btnAgregar").addEventListener("click", function() {
    mostrarAbm();

    $("selectTipo").addEventListener("change", function (){
        let tipo = this.value;
        actualizarVisibilidadCampos(tipo);

        console.log(tipo);
    });
})

//BOTON CANCELAR!
$("btnCancelar").addEventListener("click", function() {
    ocultarAbm();

    document.querySelectorAll("tbody td").forEach(cell => {
        cell.remove();

        console.log("BORRE!");
    });
})

function mostrarAbm()
{
    $("formularioAbm").style.display = "block";
    $("formularioLista").style.display = "none";

    let tipo = $("selectTipo").value;
    actualizarVisibilidadCampos(tipo);

    $("abmNombre").value = "";
    $("abmApellido").value = "";
    $("abmEdad").value = "";
    $("abmVentas").value = "";
    $("abmSueldo").value = "";
    $("abmCompras").value = "";
    $("abmTelefono").value = "";
}

function ocultarAbm()
{
    $("formularioAbm").style.display = "none";
    $("formularioLista").style.display = "block";

    mostrarDatos();
}

function actualizarVisibilidadCampos(tipo)
{
    let divEmpleado = $("empleado");
    let divCliente = $("cliente");

    if (tipo === "Empleado")
    {
        divEmpleado.style.display = "block";
        divCliente.style.display = "none";
    }
    else
    {
        divEmpleado.style.display = "none";
        divCliente.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", function (){
    mostrarDatos();
});

