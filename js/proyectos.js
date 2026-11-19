const contenedor = document.getElementById("lista-proyectos");
const botonesFiltro = document.querySelectorAll(".filtro-btn");
let proyectosCargados = [];

function obtenerEnlacePrincipal(proyecto) {
  if (proyecto.url_local && proyecto.url_local.trim() !== "") {
    return {
      href: proyecto.url_local.trim(),
      texto: "Ver proyecto (Respaldo local)",
      origen: "Subcarpeta GitHub",
      external: false
    };
  }
  return {
    href: (proyecto.url_drive || "#").trim(),
    texto: "Abrir en Drive",
    origen: "Google Drive",
    external: true
  };
}

function renderizarProyectos(filtro = "todos") {
  const filtrados =
    filtro === "todos"
      ? proyectosCargados
      : proyectosCargados.filter((p) => p.categoria === filtro);

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay proyectos en esta categoría por ahora.</p>";
    return;
  }

  contenedor.innerHTML = filtrados
    .map((proyecto) => {
      const principal = obtenerEnlacePrincipal(proyecto);
      const targetAttrs = principal.external
        ? 'target="_blank" rel="noopener noreferrer"'
        : "";

      const enlaceSecundario =
        principal.origen === "Subcarpeta GitHub" && proyecto.url_drive
          ? `<a href="${proyecto.url_drive}" target="_blank" rel="noopener noreferrer">Carpeta Drive</a>`
          : "";

      return `
        <article class="tarjeta-proyecto">
          <div>
            <span class="badge-origen">${proyecto.etiquetaCategoria || proyecto.categoria} · ${principal.origen}</span>
            <h3>${proyecto.titulo}</h3>
            <p class="meta-alumnos">${proyecto.estudiantes || ""}</p>
            <p>${proyecto.descripcion || ""}</p>
          </div>
          <div class="acciones-proyecto">
            <a href="${principal.href}" ${targetAttrs}>${principal.texto} →</a>
            ${enlaceSecundario}
          </div>
        </article>
      `;
    })
    .join("");
}

botonesFiltro.forEach((btn) => {
  btn.addEventListener("click", () => {
    botonesFiltro.forEach((b) => b.classList.remove("activo"));
    btn.classList.add("activo");
    renderizarProyectos(btn.dataset.filtro);
  });
});

async function cargarProyectos() {
  try {
    const respuesta = await fetch("data/proyectos.json", { cache: "no-store" });
    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }
    proyectosCargados = await respuesta.json();
    renderizarProyectos();
  } catch (error) {
    console.error("No se pudo cargar data/proyectos.json:", error);
    contenedor.innerHTML =
      "<p>No se pudieron cargar los proyectos en este momento. Revisa que el archivo <code>data/proyectos.json</code> tenga JSON válido.</p>";
  }
}

cargarProyectos();