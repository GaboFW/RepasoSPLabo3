class Persona
{
    constructor(id, nombre, apellido, edad)
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }

    toString()
    {
        return `ID: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, Edad: ${this.edad}`;
    }

    toJson()
    {
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            edad: this.edad
        });
    }
}

class Empleado extends Persona
{
    constructor(id, nombre, apellido, edad, sueldo, ventas)
    {
        super(id, nombre, apellido, edad);
        this.sueldo = sueldo;
        this.ventas = ventas;
    }

    toString()
    {
        return `${super.toString()}, Sueldo: ${this.sueldo}, Ventas: ${this.ventas}`;
    }

    toJson()
    {
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            edad: this.edad,
            sueldo: this.sueldo,
            ventas: this.ventas
        });
    }
}

class Cliente extends Persona
{
    constructor(id, nombre, apellido, edad, compras, telefono)
    {
        super(id, nombre, apellido, edad);
        this.compras = compras;
        this.telefono = telefono;
    }

    toString()
    {
        return `${super.toString()}, Compras: ${this.compras}, Telefono: ${this.telefono}`;
    }
}

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
        columnaVentas.textContent = cliente.ventas ;
        fila.appendChild(columnaVentas);

        let columnaSueldo = document.createElement("td");
        columnaSueldo.textContent = cliente.sueldo ;
        fila.appendChild(columnaSueldo);

        let columnaCompras = document.createElement("td");
        columnaCompras.textContent = cliente.compras ;
        fila.appendChild(columnaCompras);

        let columnaTelefono = document.createElement("td");
        columnaTelefono.textContent = cliente.telefono ;
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
$("btnAceptar").addEventListener("click", () => {
    console.log("Click aceptar abm");

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

    if (nuevaPersona.nombre == "" || nuevaPersona.apellido == "" || nuevaPersona.edad < 15)
    {
        alert("Complete los campos Nombre, Apellido o Edad correctamente");
        return;
    }

    if (nuevaPersona.tipo === "Empleado") 
    {
        if (nuevaPersona.sueldo == "" || nuevaPersona.sueldo < 0 || nuevaPersona.ventas == "" || nuevaPersona.ventas < 0)
        {
            alert("Complete los datos Sueldo o Ventas correctamente");
            return;
        }
    }

    if (nuevaPersona.tipo === "Cliente")
    {
        if (nuevaPersona.compras == "" || nuevaPersona.compras < 0 || nuevaPersona.telefono == "")
        {
            alert("Complete los datos Compras o Telefono correctamente");
            return;
        }
    }

    if (nuevaPersona.id)
    {
        actualizarPersona(nuevaPersona);

        renderizarTabla();
        ocultarAbm();
        ocultarSpinner()
    }
    else
    {
        insertarPersona(nuevaPersona);

        renderizarTabla();
        ocultarAbm();
        ocultarSpinner();
    }
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

    let tipo = $("selectTipo");

    if (persona)
    {
        $("selectTipo").disabled = true;

        $("abmId").value = persona.id;
        $("abmNombre").value = persona.nombre;
        $("abmApellido").value = persona.apellido;
        $("abmEdad").value = persona.edad;
        if (persona.compras)
        {
            tipo.value = "Cliente";
        }
        else
        {
            tipo.value = "Empleado";
        }
        $("abmVentas").value = persona.ventas;
        $("abmSueldo").value = persona.sueldo;
        $("abmCompras").value = persona.compras;
        $("abmTelefono").value = persona.telefono;
        
        actualizarVisibilidadCampos(tipo.value);
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

        actualizarVisibilidadCampos(tipo.value);
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

async function actualizarPersona(nuevaPersona)
{
    console.log("Async");

    fetch(API_URL, {
        method: "POST", //MODIFICAR
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(nuevaPersona)
    })
    .then(respuesta => {
        let index = LISTAPERSONAS.findIndex(persona => persona.id == nuevaPersona.id);
        if (index !== -1)   
        {
            LISTAPERSONAS[index].nombre = nuevaPersona.nombre;
            LISTAPERSONAS[index].apellido = nuevaPersona.apellido;
            LISTAPERSONAS[index].edad = nuevaPersona.edad;
            if (nuevaPersona.tipo === "Empleado")
            {
                LISTAPERSONAS[index].ventas = nuevaPersona.ventas;
                LISTAPERSONAS[index].sueldo = nuevaPersona.sueldo;
            }
            if (nuevaPersona.tipo === "Cliente")
            {
                LISTAPERSONAS[index].compras = nuevaPersona.compras;
                LISTAPERSONAS[index].telefono = nuevaPersona.telefono;
            }
        }

        ocultarAbm();
    })
    .catch(error => {
        console.error(error.message);
        ocultarAbm();
    });
}

function insertarPersona(nuevaPersona)
{
    let put = {
        method: "PUT", //AGREGAR
        headers: {
         "Content-type": "application/json; charset=UTF-8" 
        },
        body: JSON.stringify(nuevaPersona)
    }
    
    fetch(API_URL, put)
    .then(respuesta => respuesta.json())
    .then(data => {
        nuevaPersona.id = data.id;

        LISTAPERSONAS.push(nuevaPersona);

        ocultarSpinner();
        ocultarAbm();
        renderizarTabla();
    })
    .catch(error => {
        console.error(error.message);

        ocultarAbm();
        ocultarSpinner();
        renderizarTabla();
    });
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