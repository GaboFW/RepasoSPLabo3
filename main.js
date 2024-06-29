const API_URL = "http://localhost/Labo3/personasEmpleadosClientes.php";

let LISTAPERSONAS = [];

function $(id){return document.getElementById(id)}

document.addEventListener("DOMContentLoaded", function (){
    mostrarListaPersonas();
});

function mostrarListaPersonas()
{
    mostrarSpinner();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            LISTAPERSONAS = JSON.parse(xhr.responseText);
            renderizarTabla();
        }
        
        ocultarSpinner();
    };

    xhr.send();
}

function renderizarTabla()
{
    let tabla = document.querySelector("#tablaPersonas tbody");
    borrarTd();

    LISTAPERSONAS.forEach(function(cliente) {
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
        //MODIFICAR
        botonModificar.addEventListener("click", function() {
            console.log("Click modificar " + cliente.id);
            mostrarAbm(cliente);
        });

        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        //ELIMINAR
        botonEliminar.addEventListener("click", function() {
            console.log("Click eliminar " + cliente.id);

            mostrarSpinner();
            const xhr = new XMLHttpRequest();
            xhr.open("DELETE", API_URL);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                if (xhr.status === 200)
                {
                    LISTAPERSONAS = LISTAPERSONAS.filter(persona => persona.id !== cliente.id);

                    renderizarTabla();
                    ocultarSpinner();
                }
                else
                {
                    console.error("Error al eliminar");
                    ocultarSpinner();
                }
            };

            xhr.send(JSON.stringify({ id: cliente.id }));
        });

        columnaBotones.appendChild(botonModificar);
        columnaBotones.appendChild(botonEliminar);
        
        fila.appendChild(columnaBotones);
        tabla.appendChild(fila);
    });
}

//BOTON AGREGAR ELEMENTO
$("btnAgregar").addEventListener("click", function() {
    mostrarAbm();

    $("selectTipo").addEventListener("change", function (){
        let tipo = this.value;
        actualizarVisibilidadCampos(tipo);

        $("abmVentas").value = "";
        $("abmSueldo").value = "";
        $("abmCompras").value = "";
        $("abmTelefono").value = "";

        console.log(tipo);
    });
});

//BOTON ACEPTAR EN ABM
$("btnAceptar").addEventListener("click", async () => {
    console.log("Click aceptar abm");

    mostrarSpinner();

    let nuevaPersona = {
        id: $("abmId").value,
        nombre: $("abmNombre").value,
        apellido: $("abmApellido").value,
        edad: $("abmEdad").value,
        tipo: $("selectTipo").value,
        ventas: $("abmVentas").value,
        sueldo: $("abmSueldo").value,
        compras: $("abmCompras").value,
        telefono: $("abmTelefono").value
    };

    let metodo;
    if (nuevaPersona.id)
    {
        metodo = "POST";
    }
    else
    {
        metodo = "PUT";
    }

    fetch(API_URL, {
        method: metodo,
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(nuevaPersona)
    })
    .then(respuesta => {
        if (metodo === "PUT") //AGREGAR
        {
            console.log(metodo);

            nuevaPersona.id = respuesta.id;
            LISTAPERSONAS.push(nuevaPersona);
        } 
        if (metodo === "POST") //MODIFICAR
        {
            console.log(metodo);

            let index = LISTAPERSONAS.findIndex(persona => persona.id === nuevaPersona.id);
            if (index !== -1)
            {
                LISTAPERSONAS[index] = nuevaPersona;
            }
        }

        renderizarTabla();
        ocultarAbm();
        ocultarSpinner();
    })
    .catch(error => {
        console.error(error.message);
        ocultarAbm();
        ocultarSpinner();
    });
});

//BOTON CANCELAR ABM 
$("btnCancelar").addEventListener("click", function() {
    ocultarAbm();
    borrarTd();
    renderizarTabla();
});

function mostrarAbm(persona = null)
{
    $("formularioAbm").style.display = "block";
    $("formularioLista").style.display = "none";

    let tipo = $("selectTipo").value;
    actualizarVisibilidadCampos(tipo);

    if (persona)
    {
        $("selectTipo").disabled = true;

        $("abmId").value = persona.id;
        $("abmNombre").value = persona.nombre;
        $("abmApellido").value = persona.apellido;
        $("abmEdad").value = persona.edad;
        tipo = persona.tipo;
        $("abmVentas").value = persona.ventas;
        $("abmSueldo").value = persona.sueldo;
        $("abmCompras").value = persona.compras;
        $("abmTelefono").value = persona.telefono;
    }
    else
    {
        $("abmId").value = "";
        $("abmNombre").value = "";
        $("abmApellido").value = "";
        $("abmEdad").value = "";
        $("abmVentas").value = "";
        $("abmSueldo").value = "";
        $("abmCompras").value = "";
        $("abmTelefono").value = "";

        $("selectTipo").disabled = false;
    }
}

function ocultarAbm()
{
    $("formularioAbm").style.display = "none";
    $("formularioLista").style.display = "block";

    renderizarTabla();
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

function borrarTd()
{
    document.querySelectorAll("tbody td").forEach(cell => {
        cell.remove();

        console.log("BORRE!");
    });
}

function mostrarSpinner()
{
    $("spinner").parentNode.style.display = "flex";
}

function ocultarSpinner()
{
    $("spinner").parentNode.style.display = "none";
}