
/* ==========================================
   MY PERSONAL LIFE 💗
   Archivo: script.js
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const guardar = (clave, valor) => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      mostrarMensaje("No se pudieron guardar los datos. Revisa el espacio disponible.");
    }
  };

  const leer = (clave, defecto = []) => {
    try {
      const valor = localStorage.getItem(clave);
      return valor ? JSON.parse(valor) : defecto;
    } catch {
      return defecto;
    }
  };

  const datos = {
    animo: leer("mpl_animo"),
    calma: leer("mpl_calma", ""),
    periodos: leer("mpl_periodos"),
    salud: leer("mpl_salud"),
    medicamentos: leer("mpl_medicamentos"),
    comidas: leer("mpl_comidas"),
    actividades: leer("mpl_actividades"),
    atenciones: leer("mpl_atenciones"),
    dinero: leer("mpl_dinero"),
    musica: leer("mpl_musica"),
    foto: leer("mpl_foto", "")
  };

  let categoriaSeleccionada = "Personal";

  function mostrarMensaje(texto) {
    const mensaje = $("mensaje");
    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.classList.add("visible");

    setTimeout(() => mensaje.classList.remove("visible"), 3000);
  }

  function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (caracter) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[caracter]);
  }

  function fechaHoy() {
    return new Date().toLocaleDateString("es-EC", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function fechaCorta(fecha) {
    if (!fecha) return "Sin fecha";
    const partes = fecha.split("-");
    return partes.length === 3
      ? `${partes[2]}/${partes[1]}/${partes[0]}`
      : fecha;
  }

  function hoyISO() {
    const ahora = new Date();
    const zona = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000);
    return zona.toISOString().slice(0, 10);
  }

  function guardarTodo() {
    guardar("mpl_animo", datos.animo);
    guardar("mpl_calma", datos.calma);
    guardar("mpl_periodos", datos.periodos);
    guardar("mpl_salud", datos.salud);
    guardar("mpl_medicamentos", datos.medicamentos);
    guardar("mpl_comidas", datos.comidas);
    guardar("mpl_actividades", datos.actividades);
    guardar("mpl_atenciones", datos.atenciones);
    guardar("mpl_dinero", datos.dinero);
    guardar("mpl_musica", datos.musica);
    guardar("mpl_foto", datos.foto);
  }

  function renderizarLista(id, elementos, plantilla, vacio = "Todavía no hay registros.") {
    const contenedor = $(id);
    if (!contenedor) return;

    if (!elementos.length) {
      contenedor.innerHTML = `<p class="aviso">${escapar(vacio)}</p>`;
      return;
    }

    contenedor.innerHTML = elementos.map(plantilla).join("");
  }

  function crearRegistro(titulo, detalle, fecha, extra = "") {
    return `
      <article class="registro">
        <strong>${escapar(titulo)}</strong>
        <p>${escapar(detalle || "Sin detalles adicionales")}</p>
        <small>${escapar(fechaCorta(fecha))}${extra ? " · " + escapar(extra) : ""}</small>
      </article>
    `;
  }

  // NAVEGACIÓN
  document.querySelectorAll("[data-page]").forEach((boton) => {
    boton.addEventListener("click", () => {
      document.querySelectorAll(".pagina").forEach((pagina) => {
        pagina.classList.remove("activa");
      });

      document.querySelectorAll("[data-page]").forEach((elemento) => {
        elemento.classList.remove("activa");
      });

      const pagina = $(boton.dataset.page);
      if (pagina) pagina.classList.add("activa");

      boton.classList.add("activa");

      const titulo = $("titulo");
      if (titulo) {
        titulo.textContent = boton.textContent.trim();
      }
    });
  });

  // FECHA Y VALORES INICIALES
  if ($("fecha")) $("fecha").textContent = fechaHoy();

  [
    "inicioPeriodo",
    "fechaActividad",
    "fechaAtencion",
    "fechaDinero"
  ].forEach((id) => {
    if ($(id)) $(id).value = hoyISO();
  });

  if ($("anio")) $("anio").value = new Date().getFullYear();
  if ($("mes")) $("mes").value = String(new Date().getMonth());
  if ($("duracion")) $("duracion").value = 5;
  if ($("ciclo")) $("ciclo").value = 28;

  // ESTADO DE ÁNIMO
  document.querySelectorAll("[data-emocion]").forEach((boton) => {
    boton.addEventListener("click", () => {
      if ($("emocion")) $("emocion").value = boton.dataset.emocion;
      document.querySelectorAll("[data-emocion]").forEach((b) => {
        b.classList.remove("activa");
      });
      boton.classList.add("activa");
    });
  });

  function registrarAnimo() {
    const emocion = $("emocion")?.value || "";
    const nota = $("notaAnimo")?.value.trim() || "";

    if (!emocion) {
      mostrarMensaje("Selecciona cómo te sientes hoy.");
      return;
    }

    datos.animo.unshift({
      emocion,
      nota,
      fecha: hoyISO()
    });

    guardarTodo();
    actualizarAnimo();

    if ($("notaAnimo")) $("notaAnimo").value = "";
    mostrarMensaje("Tu estado de ánimo quedó registrado 💗");
  }

  $("guardarAnimo")?.addEventListener("click", registrarAnimo);
  $("registrarAnimo")?.addEventListener("click", registrarAnimo);

  function actualizarAnimo() {
    renderizarLista("historialAnimo", datos.animo, (item) =>
      crearRegistro(item.emocion, item.nota, item.fecha)
    );

    if ($("resumenAnimo")) {
      $("resumenAnimo").textContent = datos.animo[0]
        ? `${datos.animo[0].emocion} · ${fechaCorta(datos.animo[0].fecha)}`
        : "Aún no has registrado tu ánimo";
    }
  }

  $("guardarCalma")?.addEventListener("click", () => {
    datos.calma = $("calma")?.value || "";
    guardarTodo();
    mostrarMensaje("Tus notas de calma se guardaron 🌷");
  });

  if ($("calma")) $("calma").value = datos.calma;

  // CICLO MENSTRUAL
  function registrarPeriodo() {
    const fecha = $("inicioPeriodo")?.value;
    const duracion = Number($("duracion")?.value || 5);
    const ciclo = Number($("ciclo")?.value || 28);

    if (!fecha) {
      mostrarMensaje("Selecciona el primer día de tu período.");
      return;
    }

    if (duracion < 1 || duracion > 15 || ciclo < 15 || ciclo > 60) {
      mostrarMensaje("Revisa la duración y la longitud del ciclo.");
      return;
    }

    datos.periodos.unshift({ fecha, duracion, ciclo });
    datos.periodos.sort((a, b) => b.fecha.localeCompare(a.fecha));

    guardarTodo();
    actualizarPeriodos();
    dibujarCalendario();

    mostrarMensaje("Registro del período guardado.");
  }

  $("guardarPeriodo")?.addEventListener("click", registrarPeriodo);
  $("predecirPeriodo")?.addEventListener("click", () => {
    const ultimo = datos.periodos[0];

    if (!ultimo) {
      mostrarMensaje("Registra primero el inicio de tu período.");
      return;
    }

    const siguiente = new Date(`${ultimo.fecha}T12:00:00`);
    siguiente.setDate(siguiente.getDate() + Number(ultimo.ciclo || 28));

    mostrarMensaje(
      `Próxima fecha estimada: ${siguiente.toLocaleDateString("es-EC")}. Es solo una estimación.`
    );
  });

  function actualizarPeriodos() {
    renderizarLista("historialPeriodos", datos.periodos, (item) =>
      crearRegistro(
        "Inicio del período",
        `Duración registrada: ${item.duracion} días`,
        item.fecha,
        `Ciclo habitual: ${item.ciclo} días`
      )
    );
  }

  function dibujarCalendario() {
    const contenedor = $("calendario");
    if (!contenedor) return;

    const anio = Number($("anio")?.value || new Date().getFullYear());
    const mes = Number($("mes")?.value ?? new Date().getMonth());

    if (mes < 0 || mes > 11 || anio < 2000 || anio > 2100) {
      contenedor.innerHTML = "<p>Elige un mes y un año válidos entre 2000 y 2100.</p>";
      return;
    }

    const primerDia = new Date(anio, mes, 1).getDay();
    const totalDias = new Date(anio, mes + 1, 0).getDate();
    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    if ($("tituloCalendario")) {
      $("tituloCalendario").textContent = `${nombresMeses[mes]} ${anio}`;
    }

    let html = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      .map((dia) => `<div class="dia"><strong>${dia}</strong></div>`)
      .join("");

    for (let i = 0; i < primerDia; i++) {
      html += '<div class="dia dia-vacio"></div>';
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const fecha = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      let esPeriodo = false;

      datos.periodos.forEach((periodo) => {
        const inicio = new Date(`${periodo.fecha}T12:00:00`);
        const actual = new Date(`${fecha}T12:00:00`);
        const diferencia = Math.round((actual - inicio) / 86400000);

        if (diferencia >= 0 && diferencia < Number(periodo.duracion)) {
          esPeriodo = true;
        }
      });

      const clase = [
        "dia",
        esPeriodo ? "periodo" : "",
        fecha === hoyISO() ? "hoy" : ""
      ].filter(Boolean).join(" ");

      html += `<div class="${clase}" title="${esPeriodo ? "Período registrado" : fecha}">${dia}</div>`;
    }

    contenedor.innerHTML = html;
  }

  $("anio")?.addEventListener("change", dibujarCalendario);
  $("mes")?.addEventListener("change", dibujarCalendario);

  // SALUD Y MEDICAMENTOS
  $("guardarSintoma")?.addEventListener("click", () => {
    const sintoma = $("sintoma")?.value.trim();
    const detalle = $("detalleSalud")?.value.trim() || "";
    const temperatura = $("temperatura")?.value || "";

    if (!sintoma) {
      mostrarMensaje("Escribe el síntoma o la observación que deseas registrar.");
      return;
    }

    datos.salud.unshift({
      sintoma,
      detalle,
      temperatura,
      fecha: hoyISO()
    });

    guardarTodo();
    actualizarSalud();

    $("sintoma").value = "";
    $("detalleSalud").value = "";
    if ($("temperatura")) $("temperatura").value = "";

    mostrarMensaje("Observación de salud guardada.");
  });

  $("guardarMedicamento")?.addEventListener("click", () => {
    const medicamento = $("medicamento")?.value.trim();
    const dosis = $("dosis")?.value.trim() || "";
    const hora = $("horaMedicamento")?.value || "";

    if (!medicamento) {
      mostrarMensaje("Escribe el nombre del medicamento.");
      return;
    }

    datos.medicamentos.unshift({
      medicamento,
      dosis,
      hora,
      fecha: hoyISO()
    });

    guardarTodo();
    actualizarSalud();

    $("medicamento").value = "";
    $("dosis").value = "";
    if ($("horaMedicamento")) $("horaMedicamento").value = "";

    mostrarMensaje("Registro del medicamento guardado.");
  });

  function actualizarSalud() {
    const registros = [
      ...datos.salud.map((item) => ({
        titulo: `Síntoma: ${item.sintoma}`,
        detalle: `${item.detalle}${item.temperatura ? " · Temperatura: " + item.temperatura + " °C" : ""}`,
        fecha: item.fecha
      })),
      ...datos.medicamentos.map((item) => ({
        titulo: `Medicamento: ${item.medicamento}`,
        detalle: `${item.dosis}${item.hora ? " · Hora: " + item.hora : ""}`,
        fecha: item.fecha
      }))
    ].sort((a, b) => b.fecha.localeCompare(a.fecha));

    renderizarLista("historialSalud", registros, (item) =>
      crearRegistro(item.titulo, item.detalle, item.fecha)
    );
  }

  // NUTRICIÓN
  const alimentos = [
    { nombre: "Manzana", categoria: "Frutas", beneficio: "Aporta fibra y vitamina C." },
    { nombre: "Uvas", categoria: "Frutas", beneficio: "Contienen agua y antioxidantes." },
    { nombre: "Banano", categoria: "Frutas", beneficio: "Aporta potasio y carbohidratos." },
    { nombre: "Naranja", categoria: "Frutas", beneficio: "Aporta vitamina C." },
    { nombre: "Tomate", categoria: "Verduras", beneficio: "Contiene vitamina C y licopeno." },
    { nombre: "Cebolla", categoria: "Verduras", beneficio: "Aporta fibra y compuestos vegetales." },
    { nombre: "Pimiento", categoria: "Verduras", beneficio: "Aporta vitamina C." },
    { nombre: "Lechuga", categoria: "Verduras", beneficio: "Aporta agua, folato y fibra." },
    { nombre: "Col", categoria: "Verduras", beneficio: "Aporta fibra y vitamina C." },
    { nombre: "Jengibre", categoria: "Raíces y especias", beneficio: "Se usa para dar sabor; puede ayudar con algunas molestias digestivas." },
    { nombre: "Zanahoria", categoria: "Verduras", beneficio: "Aporta betacaroteno, que el cuerpo convierte en vitamina A." },
    { nombre: "Aguacate", categoria: "Frutas", beneficio: "Contiene grasas insaturadas y fibra." },
    { nombre: "Huevo", categoria: "Proteínas", beneficio: "Aporta proteína y vitamina B12." },
    { nombre: "Lentejas", categoria: "Legumbres", beneficio: "Aportan proteína vegetal, hierro y fibra." },
    { nombre: "Avena", categoria: "Cereales", beneficio: "Aporta fibra y energía." }
  ];

  function mostrarAlimentos(filtro = "") {
    const contenedor = $("alimentos");
    if (!contenedor) return;

    const encontrados = alimentos.filter((alimento) =>
      `${alimento.nombre} ${alimento.categoria} ${alimento.beneficio}`
        .toLowerCase()
        .includes(filtro.toLowerCase())
    );

    contenedor.innerHTML = encontrados.length
      ? encontrados.map((alimento) => `
          <article class="alimento">
            <h3>${escapar(alimento.nombre)}</h3>
            <small>${escapar(alimento.categoria)}</small>
            <p>${escapar(alimento.beneficio)}</p>
          </article>
        `).join("")
      : "<p>No se encontraron alimentos con esa búsqueda.</p>";
  }

  $("buscarAlimento")?.addEventListener("input", (evento) => {
    mostrarAlimentos(evento.target.value);
  });

  $("guardarComida")?.addEventListener("click", () => {
    const comida = $("comida")?.value.trim();
    const tipo = $("tipoComida")?.value || "Comida";
    const nota = $("notaComida")?.value.trim() || "";
    const peso = $("peso")?.value || "";

    if (!comida) {
      mostrarMensaje("Escribe qué comiste.");
      return;
    }

    datos.comidas.unshift({
      comida,
      tipo,
      nota,
      peso,
      fecha: hoyISO()
    });

    guardarTodo();
    actualizarComidas();

    $("comida").value = "";
    $("notaComida").value = "";
    if ($("peso")) $("peso").value = "";

    mostrarMensaje("Tu comida quedó registrada.");
  });

  function actualizarComidas() {
    renderizarLista("historialComidas", datos.comidas, (item) =>
      crearRegistro(
        `${item.tipo}: ${item.comida}`,
        `${item.nota}${item.peso ? " · Peso registrado: " + item.peso + " kg" : ""}`,
        item.fecha
      )
    );
  }

  // ACTIVIDADES
  document.querySelectorAll("[data-categoria]").forEach((boton) => {
    boton.addEventListener("click", () => {
      categoriaSeleccionada = boton.dataset.categoria;

      if ($("tipoActividad")) {
        $("tipoActividad").value = categoriaSeleccionada;
      }

      document.querySelectorAll("[data-categoria]").forEach((elemento) => {
        elemento.classList.remove("activa");
      });

      boton.classList.add("activa");
    });
  });

  $("guardarActividad")?.addEventListener("click", () => {
    const nombre = $("nombreActividad")?.value.trim();
    const fecha = $("fechaActividad")?.value;
    const hora = $("horaActividad")?.value || "";
    const detalle = $("detalleActividad")?.value.trim() || "";
    const categoria = $("tipoActividad")?.value || categoriaSeleccionada;

    if (!nombre || !fecha) {
      mostrarMensaje("Completa el nombre y la fecha de la actividad.");
      return;
    }

    datos.actividades.push({ nombre, fecha, hora, detalle, categoria });
    datos.actividades.sort((a, b) =>
      `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`)
    );

    guardarTodo();
    actualizarActividades();

    $("nombreActividad").value = "";
    $("detalleActividad").value = "";

    mostrarMensaje("Actividad agregada a tu agenda.");
  });

  function actualizarActividades() {
    renderizarLista(
      "listaActividades",
      datos.actividades,
      (item) => crearRegistro(
        `${item.categoria}: ${item.nombre}`,
        item.detalle,
        item.fecha,
        item.hora || ""
      )
    );

    const pendientes = datos.actividades.filter((item) => item.fecha >= hoyISO());

    if ($("resumenTareas")) {
      $("resumenTareas").textContent = `${pendientes.length} actividad(es) pendiente(s)`;
    }
  }

  // CITAS, TRÁMITES Y ATENCIONES
  $("guardarAtencion")?.addEventListener("click", () => {
    const tipo = $("tipoAtencion")?.value || "Atención";
    const fecha = $("fechaAtencion")?.value;
    const hora = $("horaAtencion")?.value || "";
    const lugar = $("lugarAtencion")?.value.trim() || "";
    const nota = $("notaAtencion")?.value.trim() || "";

    if (!fecha) {
      mostrarMensaje("Selecciona la fecha de la cita o trámite.");
      return;
    }

    datos.atenciones.push({ tipo, fecha, hora, lugar, nota });
    datos.atenciones.sort((a, b) =>
      `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`)
    );

    guardarTodo();
    actualizarAtenciones();

    $("lugarAtencion").value = "";
    $("notaAtencion").value = "";

    mostrarMensaje("Cita o trámite registrado.");
  });

  function actualizarAtenciones() {
    renderizarLista("listaAtenciones", datos.atenciones, (item) =>
      crearRegistro(
        item.tipo,
        `${item.lugar}${item.nota ? " · " + item.nota : ""}`,
        item.fecha,
        item.hora
      )
    );
  }

  // INGRESOS, GASTOS Y COMPRAS
  $("guardarDinero")?.addEventListener("click", () => {
    const tipo = $("tipoDinero")?.value || "gasto";
    const monto = Number($("monto")?.value);
    const fecha = $("fechaDinero")?.value;
    const concepto = $("concepto")?.value.trim();

    if (!Number.isFinite(monto) || monto <= 0 || !fecha || !concepto) {
      mostrarMensaje("Ingresa un monto positivo, una fecha y un concepto.");
      return;
    }

    datos.dinero.unshift({ tipo, monto, fecha, concepto });

    guardarTodo();
    actualizarDinero();

    $("monto").value = "";
    $("concepto").value = "";
    if ($("comprobante")) $("comprobante").value = "";

    mostrarMensaje("Movimiento financiero guardado.");
  });

  function actualizarDinero() {
    const ingresos = datos.dinero
      .filter((item) => item.tipo === "ingreso")
      .reduce((suma, item) => suma + item.monto, 0);

    const gastos = datos.dinero
      .filter((item) => item.tipo !== "ingreso")
      .reduce((suma, item) => suma + item.monto, 0);

    const moneda = (cantidad) => cantidad.toLocaleString("es-EC", {
      style: "currency",
      currency: "USD"
    });

    if ($("ingresos")) $("ingresos").textContent = moneda(ingresos);
    if ($("gastos")) $("gastos").textContent = moneda(gastos);
    if ($("balance")) $("balance").textContent = moneda(ingresos - gastos);
    if ($("resumenDinero")) $("resumenDinero").textContent = moneda(ingresos - gastos);

    renderizarLista("historialDinero", datos.dinero, (item) =>
      crearRegistro(
        `${item.tipo}: ${moneda(item.monto)}`,
        item.concepto,
        item.fecha
      )
    );
  }

  // SEGURIDAD Y UBICACIÓN
  $("obtenerUbicacion")?.addEventListener("click", () => {
    const estado = $("estadoUbicacion");
    const enlace = $("enlaceMapa");

    if (!navigator.geolocation) {
      if (estado) estado.textContent = "Este navegador no admite ubicación.";
      return;
    }

    if (estado) estado.textContent = "Solicitando permiso de ubicación…";

    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        const lat = posicion.coords.latitude;
        const lon = posicion.coords.longitude;
        const url = `https://www.google.com/maps?q=${lat},${lon}`;

        if (estado) estado.textContent = "Ubicación obtenida. Compártela solo con alguien de confianza.";
        if (enlace) {
          enlace.href = url;
          enlace.textContent = "Abrir mi ubicación en Google Maps";
          enlace.target = "_blank";
          enlace.rel = "noopener noreferrer";
        }

        const mensaje = `Necesito compartir mi ubicación: ${url}`;

        if ($("whatsapp")) {
          $("whatsapp").href = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
          $("whatsapp").target = "_blank";
          $("whatsapp").rel = "noopener noreferrer";
        }

        if ($("correo")) {
          $("correo").href = `mailto:?subject=${encodeURIComponent("Mi ubicación")}&body=${encodeURIComponent(mensaje)}`;
        }
      },
      () => {
        if (estado) {
          estado.textContent = "No se pudo obtener la ubicación. Revisa los permisos del navegador.";
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  // La ubicación requiere permiso y normalmente HTTPS o localhost.
  // No se comparte automáticamente; tú decides cuándo abrir WhatsApp o correo.

  // LUGARES EN ECUADOR
  $("buscarLugar")?.addEventListener("click", () => {
    const provincia = $("provincia")?.value.trim() || "";
    const ciudad = $("ciudad")?.value.trim() || "";
    const tipo = $("tipoLugar")?.value || "lugares turísticos";

    const busqueda = [tipo, ciudad, provincia, "Ecuador"]
      .filter(Boolean)
      .join(" ");

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busqueda)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  // MÚSICA FAVORITA
  $("guardarCancion")?.addEventListener("click", () => {
    const nombre = $("nombreCancion")?.value.trim();
    const artista = $("artista")?.value.trim() || "";
    const enlace = $("enlaceCancion")?.value.trim() || "";

    if (!nombre) {
      mostrarMensaje("Escribe el nombre de la canción.");
      return;
    }

    if (enlace) {
      try {
        const url = new URL(enlace);
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Enlace no válido");
        }
      } catch {
        mostrarMensaje("Introduce un enlace web válido.");
        return;
      }
    }

    datos.musica.unshift({ nombre, artista, enlace });
    guardarTodo();
    actualizarMusica();

    $("nombreCancion").value = "";
    $("artista").value = "";
    $("enlaceCancion").value = "";

    mostrarMensaje("Canción añadida a tus favoritos 🎵");
  });

  function actualizarMusica() {
    const contenedor = $("coleccionMusica");
    if (!contenedor) return;

    if (!datos.musica.length) {
      contenedor.innerHTML = '<p class="aviso">Todavía no tienes canciones guardadas.</p>';
      return;
    }

    contenedor.innerHTML = datos.musica.map((item) => `
      <article class="registro">
        <strong>${escapar(item.nombre)}</strong>
        <p>${escapar(item.artista || "Artista no indicado")}</p>
        ${item.enlace
          ? `<a href="${escapar(item.enlace)}" target="_blank" rel="noopener noreferrer">Abrir canción</a>`
          : "<small>No se añadió un enlace.</small>"}
      </article>
    `).join("");
  }

  // EXPORTAR COPIA DE SEGURIDAD
  $("exportar")?.addEventListener("click", () => {
    guardarTodo();

    const copia = {
      version: 1,
      fechaExportacion: new Date().toISOString(),
      datos
    };

    const archivo = new Blob(
      [JSON.stringify(copia, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `my-personal-life-respaldo-${hoyISO()}.json`;
    enlace.click();

    URL.revokeObjectURL(url);
    mostrarMensaje("Copia de seguridad descargada.");
  });

  // IMPORTAR COPIA DE SEGURIDAD
  $("importar")?.addEventListener("change", async (evento) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    try {
      const contenido = JSON.parse(await archivo.text());

      if (!contenido.datos || typeof contenido.datos !== "object") {
        throw new Error("Archivo incompatible");
      }

      if (!confirm("Importar reemplazará los datos actuales de esta página. ¿Deseas continuar?")) {
        evento.target.value = "";
        return;
      }

      const claves = [
        "animo", "calma", "periodos", "salud", "medicamentos",
        "comidas", "actividades", "atenciones", "dinero", "musica", "foto"
      ];

      claves.forEach((clave) => {
        if (Object.prototype.hasOwnProperty.call(contenido.datos, clave)) {
          datos[clave] = contenido.datos[clave];
        }
      });

      guardarTodo();
      actualizarTodo();
      mostrarMensaje("Copia de seguridad restaurada.");
    } catch {
      mostrarMensaje("No se pudo importar. Selecciona una copia válida.");
    } finally {
      evento.target.value = "";
    }
  });

  // BORRAR DATOS
  $("borrarDatos")?.addEventListener("click", () => {
    const confirmar = confirm(
      "¿Seguro que quieres borrar todos los registros guardados en esta página? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    [
      "mpl_animo", "mpl_calma", "mpl_periodos", "mpl_salud",
      "mpl_medicamentos", "mpl_comidas", "mpl_actividades",
      "mpl_atenciones", "mpl_dinero", "mpl_musica", "mpl_foto"
    ].forEach((clave) => localStorage.removeItem(clave));

    location.reload();
  });

  // FOTO DE PERFIL
  $("foto")?.addEventListener("change", (evento) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      mostrarMensaje("Selecciona un archivo de imagen.");
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      mostrarMensaje("La imagen debe pesar menos de 2 MB.");
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      datos.foto = lector.result;
      guardarTodo();
      mostrarFoto();
      mostrarMensaje("Foto de perfil actualizada.");
    };

    lector.readAsDataURL(archivo);
  });

  function mostrarFoto() {
    const vista = $("vistaFoto");
    if (!vista) return;

    if (datos.foto) {
      vista.innerHTML = `<img src="${datos.foto}" alt="Foto de perfil" style="width:100%;max-width:180px;border-radius:50%;object-fit:cover;">`;
    } else {
      vista.textContent = "Tu foto aparecerá aquí";
    }
  }

  function actualizarTodo() {
    actualizarAnimo();
    actualizarPeriodos();
    dibujarCalendario();
    actualizarSalud();
    actualizarComidas();
    actualizarActividades();
    actualizarAtenciones();
    actualizarDinero();
    actualizarMusica();
    mostrarAlimentos();
    mostrarFoto();
  }

  // INICIAR LA PÁGINA
  actualizarTodo();
});
