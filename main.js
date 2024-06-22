// const API = "personasEmpleadosClientes.php";
const API_URL = "http://localhost/PROBANDO/personasEmpleadosClientes.php";

function $(id){return document.getElementById(id)}

function mostrarDatos()
{
    const XHTTP = new XMLHttpRequest();

    // XHTTP.open("GET", "Prueba.txt");
    XHTTP.open("GET", API_URL);
    // XHTTP.open("GET", "test.php");


    XHTTP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            //console.log(XHTTP.response);
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












mostrarDatos();

