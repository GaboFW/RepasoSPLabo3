const API_URL = "http://localhost/Labo3/personasEmpleadosClientes.php";

document.addEventListener('DOMContentLoaded', () => {
    const spinner = document.getElementById('spinner');
    const formularioLista = document.getElementById('formularioLista');
    const formularioAbm = document.getElementById('formularioAbm');
    const tablaPersonas = document.getElementById('tablaPersonas').querySelector('tbody');
    const btnAgregar = document.getElementById('btnAgregar');
    const btnAceptar = document.getElementById('btnAceptar');
    const btnCancelar = document.getElementById('btnCancelar');
    const selectTipo = document.getElementById('selectTipo');
    const empleadoFields = document.getElementById('empleado');
    const clienteFields = document.getElementById('cliente');

    let listaPersonas = [];

    function mostrarSpinner() {
        spinner.style.display = 'block';
    }

    function ocultarSpinner() {
        spinner.style.display = 'none';
    }

    function mostrarFormularioAbm(tipo, data = {}) {
        formularioLista.style.display = 'none';
        formularioAbm.style.display = 'block';
        document.getElementById('abmId').value = data.id || '';
        document.getElementById('abmNombre').value = data.nombre || '';
        document.getElementById('abmApellido').value = data.apellido || '';
        document.getElementById('abmEdad').value = data.edad || '';
        selectTipo.value = tipo || 'Empleado';

        if (tipo === 'Empleado') {
            empleadoFields.style.display = 'block';
            clienteFields.style.display = 'none';
            document.getElementById('abmVentas').value = data.ventas || '';
            document.getElementById('abmSueldo').value = data.sueldo || '';
        } else if (tipo === 'Cliente') {
            empleadoFields.style.display = 'none';
            clienteFields.style.display = 'block';
            document.getElementById('abmCompras').value = data.compras || '';
            document.getElementById('abmTelefono').value = data.telefono || '';
        }
    }

    function ocultarFormularioAbm() {
        formularioAbm.style.display = 'none';
        formularioLista.style.display = 'block';
    }

    function obtenerListaPersonas() {
        mostrarSpinner();
        const xhr = new XMLHttpRequest();
        xhr.open('GET', API_URL, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                listaPersonas = JSON.parse(xhr.responseText);
                renderizarTabla();
                ocultarSpinner();
            } else {
                alert('Error al obtener datos');
                ocultarSpinner();
            }
        };
        xhr.send();
    }

    function renderizarTabla() {
        tablaPersonas.innerHTML = '';
        listaPersonas.forEach(persona => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${persona.id}</td>
                <td>${persona.nombre}</td>
                <td>${persona.apellido}</td>
                <td>${persona.edad}</td>
                <td>${persona.ventas || 'N/A'}</td>
                <td>${persona.sueldo || 'N/A'}</td>
                <td>${persona.compras || 'N/A'}</td>
                <td>${persona.telefono || 'N/A'}</td>
                <td>
                    <button onclick="modificarElemento(${persona.id})">Modificar</button>
                    <button onclick="eliminarElemento(${persona.id})">Eliminar</button>
                </td>
            `;
            tablaPersonas.appendChild(tr);
        });
    }

    function agregarElemento() {
        mostrarFormularioAbm(selectTipo.value);
    }

    function modificarElemento(id) {
        const persona = listaPersonas.find(p => p.id === id);
        if (persona) {
            mostrarFormularioAbm(persona.tipo, persona);
        }
    }

    function eliminarElemento(id) {
        if (confirm('¿Estás seguro de eliminar este elemento?')) {
            mostrarSpinner();
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', API_URL, true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    listaPersonas = listaPersonas.filter(p => p.id !== id);
                    renderizarTabla();
                    ocultarSpinner();
                } else {
                    alert('Error al eliminar');
                    ocultarSpinner();
                }
            };
            xhr.send(JSON.stringify({ id }));
        }
    }

    btnAgregar.addEventListener('click', () => agregarElemento());

    // btnAceptar.addEventListener('click', () => {
    //     const tipo = selectTipo.value;
    //     const nuevaPersona = {
    //         id: document.getElementById('abmId').value,
    //         nombre: document.getElementById('abmNombre').value,
    //         apellido: document.getElementById('abmApellido').value,
    //         edad: document.getElementById('abmEdad').value,
    //         tipo: tipo
    //     };

    //     if (tipo === 'Empleado') {
    //         nuevaPersona.ventas = document.getElementById('abmVentas').value;
    //         nuevaPersona.sueldo = document.getElementById('abmSueldo').value;
    //     } else if (tipo === 'Cliente') {
    //         nuevaPersona.compras = document.getElementById('abmCompras').value;
    //         nuevaPersona.telefono = document.getElementById('abmTelefono').value;
    //     }
    //     mostrarSpinner();
    //     const xhr = new XMLHttpRequest();
    //     const metodo = nuevaPersona.id ? 'POST' : 'PUT';
    //     xhr.open(metodo, API_URL, true);
    //     xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    //     xhr.onload = function () {
    //         if (xhr.status === 200) {
    //             const respuesta = JSON.parse(xhr.responseText);
    //             if (metodo === 'PUT') {
    //                 nuevaPersona.id = respuesta.id;
    //                 listaPersonas.push(nuevaPersona);
    //             } else {
    //                 const index = listaPersonas.findIndex(p => p.id === nuevaPersona.id);
    //                 listaPersonas[index] = nuevaPersona;
    //             }
    //             renderizarTabla();
    //             ocultarFormularioAbm();
    //             ocultarSpinner();
    //         } else {
    //             alert('Error al guardar');
    //             ocultarSpinner();
    //             ocultarFormularioAbm();
    //         }
    //     };
    //     xhr.send(JSON.stringify(nuevaPersona));
    // });

    btnAceptar.addEventListener('click', () => {
        const tipo = selectTipo.value;
        const nuevaPersona = {
            id: document.getElementById('abmId').value,
            nombre: document.getElementById('abmNombre').value,
            apellido: document.getElementById('abmApellido').value,
            edad: document.getElementById('abmEdad').value,
            tipo: tipo
        };
    
        if (tipo === 'Empleado') {
            nuevaPersona.ventas = document.getElementById('abmVentas').value;
            nuevaPersona.sueldo = document.getElementById('abmSueldo').value;
        } else if (tipo === 'Cliente') {
            nuevaPersona.compras = document.getElementById('abmCompras').value;
            nuevaPersona.telefono = document.getElementById('abmTelefono').value;
        }
    
        mostrarSpinner();
        const metodo = nuevaPersona.id ? 'POST' : 'PUT';
        const url = API_URL; // Asegúrate de que API_URL esté definida en tu entorno
    
        fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(nuevaPersona)
        })
        .then(response => {
            ocultarSpinner();
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al guardar');
            }
        })
        .then(respuesta => {
            if (metodo === 'PUT') {
                nuevaPersona.id = respuesta.id;
                listaPersonas.push(nuevaPersona);
            } else {
                const index = listaPersonas.findIndex(p => p.id === nuevaPersona.id);
                listaPersonas[index] = nuevaPersona;
            }
            renderizarTabla();
            ocultarFormularioAbm();
        })
        .catch(error => {
            alert(error.message);
            ocultarFormularioAbm();
        });
    });

    btnCancelar.addEventListener('click', () => ocultarFormularioAbm());

    obtenerListaPersonas();
});
