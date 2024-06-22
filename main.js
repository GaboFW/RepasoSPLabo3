const API = "personasEmpleadosClientes.php";

function $(id){return document.getElementById(id)}

function mostrarDatos()
{
    const XTTHP = new XMLHttpRequest();
    
    XTTHP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            var clientes = JSON.parse(this.response);//
            var tabla = document.querySelector("#tabla-personas tbody");
            
            clientes.forEach(function(cliente) {
                var fila = document.createElement("tr");
                
                var columnaId = document.createElement("td");
                columnaId.textContent = cliente.id;
                fila.appendChild(columnaId);
                
                var columnaNombre = document.createElement("td");
                columnaNombre.textContent = cliente.nombre;
                fila.appendChild(columnaNombre);
                
                var columnaApellido = document.createElement("td");
                columnaApellido.textContent = cliente.apellido;
                fila.appendChild(columnaApellido);

                var columnaEdad = document.createElement("td");
                columnaEdad.textContent = cliente.edad;
                fila.appendChild(columnaEdad);

                var columnaVentas = document.createElement("td");
                columnaVentas.textContent = cliente.ventas;
                fila.appendChild(columnaVentas);

                var columnaSueldo = document.createElement("td");
                columnaSueldo.textContent = cliente.sueldo;
                fila.appendChild(columnaSueldo);

                var columnaCompras = document.createElement("td");
                columnaCompras.textContent = cliente.compras;
                fila.appendChild(columnaCompras);

                var columnaTelefono = document.createElement("td");
                columnaTelefono.textContent = cliente.telefono;
                fila.appendChild(columnaTelefono);
                
                tabla.appendChild(fila);
            });
        }
        else
        {
            console.log(XTTHP.statusText);
        }
    };

    //XTTHP.open("GET", "Prueba.txt");
    //XTTHP.open("GET", API);
    XTTHP.open("GET", "personasEmpleadosClientes.php");
    XTTHP.send();
}

mostrarDatos();
