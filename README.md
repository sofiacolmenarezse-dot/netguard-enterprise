# ⚡ NetGuard Enterprise - Dashboard de Monitoreo SD-WAN

## Descripción General

NetGuard Enterprise es una aplicación web interactiva desarrollada para resolver la problemática de visibilidad centralizada y monitoreo de conectividad en infraestructura de redes distribuidas bajo arquitectura SD-WAN (Software-Defined Wide Area Network).

La aplicación permite evaluar en tiempo real parámetros críticos de telecomunicaciones como la latencia (ms), la asignación de ancho de banda (Mbps) y el estado operativo de los nodos perimetrales. Su propósito es ofrecer una vista clara y ordenada de la salud de la red para operadores y administradores de infraestructura.

---

## 🛠️ Tecnologías Utilizadas

- HTML5: estructuración semántica de la interfaz de usuario.
- CSS3: diseño responsivo con una paleta estilo NOC (Network Operations Center) en tonos oscuros.
- JavaScript (ES6+): lógica asíncrona client-side, manipulación dinámica del DOM, validación de umbrales y carga de datos desde JSON.
- JSON: almacenamiento local estructurado para simular una base de datos de nodos de red.

---

## 📊 Funcionalidades Principales

- Visualización centralizada de nodos de red.
- Monitoreo de latencia, estado y ancho de banda.
- Evaluación automática del estado del nodo: Activo o Advertencia.
- Registro de nuevos dispositivos desde un formulario web.
- Validación de entradas para evitar errores lógicos y de formato.
- Alertas visuales de éxito o error en la interfaz.
- Actualización dinámica de la tabla principal al agregar nodos.

---

## 📂 Estructura del Repositorio

```text
avance-proyecto-sofia/
├── index.html     # Estructura principal de la interfaz web
├── style.css      # Hoja de estilos corporativa (NOC Dark Theme)
├── app.js         # Lógica modularizada de JavaScript
├── data.json      # Base de datos local de nodos de red
├── README.md      # Documentación del proyecto
├── Untitled-1.css # Archivo CSS auxiliar
├── automatizacion_excel.py # Script adicional no relacionado con la UI
├── ejercicio_ciclos.py     # Script de práctica/ejercicios Python
└──
```

---

## ✅ Cómo Ejecutarlo

1. Abre la carpeta del proyecto en tu editor.
2. Desde la raíz del proyecto, ejecuta el siguiente comando:

```bash
python -m http.server 8000
```

3. Abre en tu navegador la siguiente URL:

```text
http://localhost:8000
```

> Nota: la aplicación usa fetch("data.json"), por lo que es recomendable ejecutarla desde un servidor local y no abrir el archivo HTML directamente desde el sistema de archivos.

---

## 🧩 Uso de la Aplicación

- La página carga automáticamente los nodos desde `data.json`.
- La sección de registro permite ingresar:
  - nombre del nodo
  - dirección IP
  - latencia estimada en ms
  - ancho de banda en Mbps
- Los valores ingresados se validan antes de agregarse a la red.
- El sistema comunica el resultado mediante mensajes de alerta en pantalla.

---

## 🎯 Objetivo del Proyecto

El objetivo de NetGuard Enterprise es simular un panel de control operativo para redes distribuidas, donde se pueda monitorear la salud de la infraestructura, detectar anomalías en la latencia y organizar la gestión de dispositivos conectados en un entorno SD-WAN.

---

## 👤 Autor

Proyecto desarrollado como ejemplo de dashboard de monitoreo de red y administración de infraestructura tecnológica.
