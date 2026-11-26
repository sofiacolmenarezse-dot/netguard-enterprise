const STORAGE_KEY = "netguard_nodos_v1";

const NODOS_INICIALES = [
  {
    id: "ND-001",
    nombre: "Router Principal - Sala",
    ip: "192.168.1.1",
    latencia: 14,
    anchoBanda: 120
  },
  {
    id: "ND-002",
    nombre: "Repetidor Cuarto Trasero",
    ip: "192.168.1.24",
    latencia: 95,
    anchoBanda: 18
  },
  {
    id: "ND-003",
    nombre: "Enlace Estudio / Trabajo",
    ip: "192.168.1.45",
    latencia: 28,
    anchoBanda: 85
  }
];

let nodos = [];
let fotoCargadaNombre = "";

const form = document.getElementById("nodo-form");
const inputNombre = document.getElementById("nombre-nodo");
const inputIp = document.getElementById("direccion-ip");
const inputLatencia = document.getElementById("latencia");
const inputAnchoBanda = document.getElementById("ancho-banda");
const btnReset = document.getElementById("btn-reset-datos");
const feedbackEl = document.getElementById("form-feedback");

const tablaBody = document.getElementById("tabla-nodos");
const badgeEficiencia = document.getElementById("badge-eficiencia");
const diagnosticoPanel = document.getElementById("diagnostico-panel");

const inputFoto = document.getElementById("foto-router");
const previewContainer = document.getElementById("preview-container");
const previewImg = document.getElementById("preview-img");
const previewNombre = document.getElementById("preview-nombre");
const selectSintoma = document.getElementById("sintoma-router");
const inputPregunta = document.getElementById("pregunta-ia");
const btnConsultarIa = document.getElementById("btn-consultar-ia");
const respuestaIa = document.getElementById("respuesta-ia");
const chipsPregunta = document.querySelectorAll(".chip-btn");

function cargarNodos() {
  const guardados = localStorage.getItem(STORAGE_KEY);
  if (guardados) {
    try {
      const parsed = JSON.parse(guardados);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.warn("Error al leer localStorage, se cargan datos iniciales:", error);
    }
  }
  return [...NODOS_INICIALES];
}

function guardarNodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nodos));
}

function esIpValida(ip) {
  const partes = ip.trim().split(".");
  if (partes.length !== 4) return false;
  return partes.every((octeto) => {
    if (!/^\d{1,3}$/.test(octeto)) return false;
    const num = Number(octeto);
    return num >= 0 && num <= 255;
  });
}

function evaluarEficiencia(latencia, anchoBanda) {
  if (latencia <= 35 && anchoBanda >= 50) {
    return {
      nivel: "Eficiente",
      claseBadge: "badge-ok",
      resumen: "La conexión Wi-Fi presenta un rendimiento eficiente y estable para uso diario, videollamadas y navegación fluida.",
      consecuencias: [
        "Videollamadas estables y baja probabilidad de cortes o congelamientos.",
        "Carga rápida de páginas web, clases en línea y streaming en buena calidad."
      ],
      tips: [
        "Mantén el router ventilado y en su posición actual si no hay fallas.",
        "Usa la banda de 5 GHz para equipos cercanos que requieran mayor velocidad y la de 2.4 GHz para mayor alcance."
      ]
    };
  }

  if (latencia <= 100 && anchoBanda >= 20) {
    return {
      nivel: "Eficiencia Media",
      claseBadge: "badge-warn",
      resumen: "El enlace funciona, pero muestra señales moderadas de congestión o pérdida de rendimiento.",
      consecuencias: [
        "Pequeños retrasos al abrir páginas pesadas o subir archivos.",
        "Posible baja de resolución en video o leve retardo en llamadas si hay varios equipos conectados."
      ],
      tips: [
        "Acerca el dispositivo al router o reduce paredes/obstáculos entre ambos.",
        "Pausa descargas grandes o actualizaciones en segundo plano en otros celulares o computadoras.",
        "Si estás lejos del router, evalúa acercarte o cambiar de banda Wi-Fi."
      ]
    };
  }

  return {
    nivel: "No Eficiente",
    claseBadge: "badge-bad",
    resumen: "La conexión NO es eficiente: hay alta latencia o bajo ancho de banda que afectan la experiencia de red.",
    consecuencias: [
      "Cortes frecuentes en videollamadas, retrasos notables en respuesta y carga muy lenta.",
      "Buffering constante en videos y dificultad para enviar archivos o mantener sesiones estables."
    ],
    tips: [
      "Revisa si el router está saturado, mal ubicado o cerca de fuentes de interferencia (microondas, paredes gruesas, exceso de redes cercanas).",
      "Reinicia el router (apagar 30 segundos y encender) para limpiar sesiones colgadas.",
      "Haz una prueba cerca del router: si cerca va bien y lejos va mal, el problema es de cobertura/señal; si cerca también va mal, revisa el enlace o reporta con tus datos al técnico."
    ]
  };
}

function mostrarDiagnostico(nodo) {
  const diag = evaluarEficiencia(Number(nodo.latencia), Number(nodo.anchoBanda));
  badgeEficiencia.textContent = diag.nivel;
  badgeEficiencia.className = `badge ${diag.claseBadge}`;

  diagnosticoPanel.innerHTML = `
    <p><strong>Nodo evaluado:</strong> ${escaparHtml(nodo.nombre)} (${escaparHtml(nodo.ip)}) — <strong>${nodo.latencia} ms</strong> / <strong>${nodo.anchoBanda} Mbps</strong></p>
    <p style="margin-top:6px;">${escaparHtml(diag.resumen)}</p>
    <p style="margin-top:10px;"><strong>¿Qué ocurre si no es eficiente / qué implica?</strong></p>
    <ul>
      ${diag.consecuencias.map((item) => `<li>${escaparHtml(item)}</li>`).join("")}
    </ul>
    <p style="margin-top:10px;"><strong>Tips para mejorar o diagnosticar:</strong></p>
    <ul>
      ${diag.tips.map((tip) => `<li>${escaparHtml(tip)}</li>`).join("")}
    </ul>
  `;
}

function escaparHtml(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderizarTabla() {
  tablaBody.innerHTML = "";

  nodos.forEach((nodo) => {
    const diag = evaluarEficiencia(Number(nodo.latencia), Number(nodo.anchoBanda));
    const tr = document.createElement("tr");
    tr.title = "Haz clic para ver el diagnóstico detallado de este nodo";

    tr.innerHTML = `
      <td>${escaparHtml(nodo.id)}</td>
      <td>${escaparHtml(nodo.nombre)}</td>
      <td>${escaparHtml(nodo.ip)}</td>
      <td>${escaparHtml(nodo.latencia)} ms</td>
      <td>${escaparHtml(nodo.anchoBanda)} Mbps</td>
      <td><span class="badge ${diag.claseBadge}">${escaparHtml(diag.nivel)}</span></td>
    `;

    tr.addEventListener("click", () => {
      mostrarDiagnostico(nodo);
    });

    tablaBody.appendChild(tr);
  });
}

function mostrarFeedback(mensaje, tipo) {
  feedbackEl.textContent = mensaje;
  feedbackEl.className = `feedback-msg ${tipo === "error" ? "feedback-error" : "feedback-ok"}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const ip = inputIp.value.trim();
  const latencia = Number(inputLatencia.value);
  const anchoBanda = Number(inputAnchoBanda.value);

  if (!nombre) {
    mostrarFeedback("Por favor ingresa un nombre para el nodo o conexión.", "error");
    return;
  }

  if (!esIpValida(ip)) {
    mostrarFeedback("Ingresa una dirección IPv4 válida (ejemplo: 192.168.1.1).", "error");
    return;
  }

  if (!Number.isFinite(latencia) || latencia <= 0 || latencia > 5000) {
    mostrarFeedback("La latencia debe ser un número mayor a 0 y hasta 5000 ms.", "error");
    return;
  }

  if (!Number.isFinite(anchoBanda) || anchoBanda <= 0 || anchoBanda > 10000) {
    mostrarFeedback("El ancho de banda debe ser un número mayor a 0 Mbps.", "error");
    return;
  }

  const nuevoId = `ND-${String(nodos.length + 1).padStart(3, "0")}`;
  const nuevoNodo = {
    id: nuevoId,
    nombre,
    ip,
    latencia,
    anchoBanda
  };

  nodos.unshift(nuevoNodo);
  guardarNodos();
  renderizarTabla();
  mostrarDiagnostico(nuevoNodo);
  mostrarFeedback("Nodo registrado y evaluado correctamente.", "ok");
  form.reset();
});

btnReset.addEventListener("click", () => {
  nodos = [...NODOS_INICIALES];
  guardarNodos();
  renderizarTabla();
  mostrarDiagnostico(nodos[0]);
  mostrarFeedback("Se restauraron los nodos de ejemplo.", "ok");
});

inputFoto.addEventListener("change", () => {
  const archivo = inputFoto.files && inputFoto.files[0];
  if (!archivo) {
    fotoCargadaNombre = "";
    previewContainer.classList.add("hidden");
    return;
  }

  fotoCargadaNombre = archivo.name;
  const lector = new FileReader();
  lector.onload = (evento) => {
    previewImg.src = evento.target.result;
    previewNombre.textContent = `Imagen cargada: ${archivo.name}`;
    previewContainer.classList.remove("hidden");
  };
  lector.readAsDataURL(archivo);
});

chipsPregunta.forEach((chip) => {
  chip.addEventListener("click", () => {
    inputPregunta.value = chip.dataset.pregunta || "";
    generarRespuestaAsistente();
  });
});

function generarRespuestaAsistente() {
  const consulta = inputPregunta.value.trim();
  const sintoma = selectSintoma.value;
  const textoLower = consulta.toLowerCase();

  let explicacion = "";

  if (textoLower.includes("cómo funciona") || textoLower.includes("como funciona")) {
    explicacion =
      "El Wi-Fi funciona transmitiendo paquetes de datos mediante ondas de radio entre el router/punto de acceso y tus dispositivos. " +
      "La velocidad máxima depende del enlace y la banda (2.4 GHz llega más lejos pero tiene más interferencia; 5 GHz es más rápida pero atraviesa peor muros), " +
      "mientras que la latencia mide qué tan rápido viajan y regresan los datos.";
  } else if (textoLower.includes("tip") || textoLower.includes("lento") || textoLower.includes("mal")) {
    explicacion =
      "Cuando el Wi-Fi va lento:\n" +
      "1) Prueba cerca del router para descartar falta de alcance o paredes.\n" +
      "2) Revisa si hay muchos dispositivos descargando o transmitiendo a la vez.\n" +
      "3) Reinicia el router (30 segundos desconectado) y verifica si mejora.";
  } else {
    explicacion =
      "Un Wi-Fi poco eficiente suele deberse a distancia excesiva, obstáculos/interferencias, saturación de canal o problemas en la línea de entrada. " +
      "Cuando falla, sube la latencia o cae el ancho de banda, provocando cortes en llamadas, carga lenta o demoras.";
  }

  const resumenTecnico = {
    "luz-roja-parpadeo": "Indicador de alerta/desconexión en el router (posible pérdida de sincronía óptica/WAN o caída de enlace externo).",
    "senal-debil-lejos": "Degradación por distancia y atenuación de señal entre el router y la zona afectada.",
    "cortes-frecuentes": "Inestabilidad intermitente o saturación/interferencia en momentos de mayor uso.",
    "velocidad-baja": "Menor rendimiento efectivo respecto al plan contratado (revisar banda usada, interferencia o prueba por cable)."
  };

  let bloqueExtra = `\n\nNota para comentar a un técnico:\n• Síntoma seleccionado: ${resumenTecnico[sintoma] || resumenTecnico["velocidad-baja"]}`;

  if (fotoCargadaNombre) {
    bloqueExtra += `\n• Foto adjunta para revisión visual: ${fotoCargadaNombre} (muestra el estado físico/luces del equipo para acompañar el reporte).`;
  }

  if (consulta) {
    bloqueExtra += `\n• Detalle reportado por el usuario: "${consulta}"`;
  }

  respuestaIa.innerHTML = `<strong>Asistente NetGuard:</strong>\n${escaparHtml(explicacion)}${escaparHtml(bloqueExtra)}`;
}

btnConsultarIa.addEventListener("click", generarRespuestaAsistente);

// Inicialización
nodos = cargarNodos();
renderizarTabla();
mostrarDiagnostico(nodos[0]);