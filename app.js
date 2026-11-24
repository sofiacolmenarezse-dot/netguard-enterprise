/**
 * NetGuard Enterprise - Motor Principal (Refactorizado)
 * Arquitectura modular siguiendo el principio de responsabilidad única.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Estado global de la aplicación
    let listaNodosRed = [];

    /**
     * 1. Carga asíncrona de datos desde el archivo local JSON
     */
    async function cargarDatosIniciales() {
        try {
            const respuesta = await fetch("data.json");
            if (!respuesta.ok) throw new Error("No se pudo cargar la base de datos.");
            const datos = await respuesta.json();
            listaNodosRed = datos.nodos || [];
            renderizarTablaNodos(listaNodosRed);
        } catch (error) {
            mostrarMensajeAlerta(`Error al inicializar datos: ${error.message}`, "error");
        }
    }

    /**
     * 2. Determina el estado del nodo según los umbrales de latencia de telecomunicaciones
     */
    function evaluarEstadoNodo(latenciaMs) {
        return latenciaMs > 50 ? "Advertencia" : "Activo";
    }

    /**
     * 3. Valida lógicamente las entradas del formulario para evitar Runtime/Logical Errors
     */
    function validarEntradasRed(latencia, anchoBanda) {
        if (isNaN(latencia) || latencia <= 0) {
            return { valido: false, mensaje: "La latencia debe ser un número entero positivo mayor a 0 ms." };
        }
        if (latencia > 100) {
            return { valido: false, mensaje: `Alerta Crítica: Latencia excesiva (${latencia}ms). Supera el umbral máximo de 100ms.` };
        }
        if (isNaN(anchoBanda) || anchoBanda <= 0) {
            return { valido: false, mensaje: "El ancho de banda debe ser superior a 0 Mbps." };
        }
        return { valido: true };
    }

    /**
     * 4. Renderiza la tabla de nodos en el DOM
     */
    function renderizarTablaNodos(nodos) {
        const tbody = document.getElementById("tbody-nodos");
        if (!tbody) return;

        tbody.innerHTML = "";
        nodos.forEach(nodo => {
            const tr = document.createElement("tr");
            const colorEstado = nodo.estado === "Activo" ? "#22c55e" : "#f59e0b";

            tr.innerHTML = `
                <td>${nodo.id}</td>
                <td>${nodo.nombre}</td>
                <td>${nodo.ip}</td>
                <td><span style="color: ${colorEstado}; font-weight: bold;">● ${nodo.estado}</span></td>
                <td>${nodo.latencia}</td>
                <td>${nodo.anchoBanda} Mbps</td>
            `;
            tbody.appendChild(tr);
        });
    }

    /**
     * 5. Muestra notificaciones visuales en la interfaz
     */
    function mostrarMensajeAlerta(mensaje, tipo) {
        const cajaAlerta = document.getElementById("mensaje-alerta");
        if (!cajaAlerta) return;

        cajaAlerta.className = `alert ${tipo}`;
        cajaAlerta.textContent = mensaje;
    }

    /**
     * 6. Manejador del evento de registro de nuevos nodos
     */
    function procesarRegistroNodo(evento) {
        evento.preventDefault();

        const nombreInput = document.getElementById("nombreNodo").value.trim();
        const ipInput = document.getElementById("ipNodo").value.trim();
        const latenciaVal = parseInt(document.getElementById("latenciaNodo").value, 10);
        const bandaVal = parseInt(document.getElementById("bandaNodo").value, 10);

        // Validación lógicamente modularizada
        const resultadoValidacion = validarEntradasRed(latenciaVal, bandaVal);
        if (!resultadoValidacion.valido) {
            mostrarMensajeAlerta(resultadoValidacion.mensaje, "error");
            return;
        }

        // Construcción del nuevo objeto nodo
        const nuevoNodo = {
            id: `ND-00${listaNodosRed.length + 1}`,
            nombre: nombreInput,
            ip: ipInput,
            estado: evaluarEstadoNodo(latenciaVal),
            latencia: `${latenciaVal}ms`,
            anchoBanda: bandaVal
        };

        listaNodosRed.push(nuevoNodo);
        renderizarTablaNodos(listaNodosRed);
        mostrarMensajeAlerta(`¡Nodo "${nombreInput}" integrado correctamente a la red SD-WAN!`, "success");

        document.getElementById("form-nodo").reset();
    }

    // Inicialización del sistema y asignación de eventos
    const formulario = document.getElementById("form-nodo");
    if (formulario) {
        formulario.addEventListener("submit", procesarRegistroNodo);
    }

    cargarDatosIniciales();
});