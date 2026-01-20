const mainEl = document.getElementById("main-container")
const backgroundEl = document.getElementById("background")
const headerEl = document.getElementById("header")
const apiKey = "AIzaSyDVQ6oLA9MnKb5Fb8v2UIOQmArGZjYGRa0"
const folderId_main = "1Le13O6M6tlMAfRUUbQnSMFaojPvup9rS";
const especialidades = [
  {
    nombre: "Anestesiología",
    alt: "Icono de anestesiólogo con mascarilla"
  },
  {
    nombre: "Cabeza y cuello",
    alt: "Icono de cuello con zona tiroidea destacada"
  },
  {
    nombre: "Cirugía bariátrica",
    alt: "Icono de estómago reducido quirúrgicamente"
  },
  {
    nombre: "Cirugía cardiovascular",
    alt: "Icono de corazón con instrumentos quirúrgicos"
  },
  {
    nombre: "Cirugía general",
    alt: "Icono de médico con estetoscopio"
  },
  {
    nombre: "Cirugía maxilofacial",
    alt: "Icono de perfil facial con mandíbula resaltada"
  },
  {
    nombre: "Cirugía neonatal",
    alt: "Icono de bebé envuelto en mantita"
  },
  {
    nombre: "Cirugía plástica",
    alt: "Icono de labios resaltados en aumento estético"
  },
  {
    nombre: "Coloproctología",
    alt: "Icono de mano con guante sosteniendo intestino"
  },
  {
    nombre: "Endoscopía",
    alt: "Icono de tubo flexible entrando en sistema digestivo"
  },
  {
    nombre: "Ginecología y Obstetricia",
    alt: "Icono de útero en estilo anatómico"
  },
  {
    nombre: "Hemodinamia",
    alt: "Icono de sistema circulatorio con flujos"
  },
  {
    nombre: "Nefrología",
    alt: "Icono de riñones con detalles anatómicos"
  },
  {
    nombre: "Neurología",
    alt: "Icono de cerebro humano visto de perfil"
  },
  {
    nombre: "Oftalmología",
    alt: "Icono de ojo con detalles de visión"
  },
  {
    nombre: "Oncología",
    alt: "Icono de célula con diagnóstico médico"
  },
  {
    nombre: "ORL",
    alt: "Icono de oído, nariz y garganta en esquema"
  },
  {
    nombre: "Traumatología",
    alt: "Icono de pierna en movimiento con rayos de dolor"
  },
  {
    nombre: "Trasplante hepático y cirugía hepatobiliar",
    alt: "Icono de hígado con vena porta"
  },
  {
    nombre: "Urología",
    alt: "Icono de vejiga con sistema urinario resaltado"
  }
]

let pdf_db = []
let allDocuments = [] // Todos los documentos de todas las especialidades
let isDataLoaded = false

async function preloadAllDocuments() {
  try {
    // 1. Obtener las carpetas principales (especialidades)
    const mainUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId_main}'+in+parents&key=${apiKey}&fields=files(id,name)`
    const mainResponse = await fetch(mainUrl)
    const mainData = await mainResponse.json()
    pdf_db = mainData.files

    // 2. Para cada especialidad, obtener sus documentos
    const promises = pdf_db.map(async (folder) => {
      const url = `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents&key=${apiKey}&fields=files(name,webViewLink,modifiedTime,mimeType,id)`
      const response = await fetch(url)
      const data = await response.json()

      if (!data.files || data.files.length === 0) return []

      // Si tiene subcarpetas, obtener los documentos de cada una
      if (data.files[0]?.mimeType.endsWith("folder")) {
        const subPromises = data.files.map(async (subFolder) => {
          const subUrl = `https://www.googleapis.com/drive/v3/files?q='${subFolder.id}'+in+parents&key=${apiKey}&fields=files(name,webViewLink,modifiedTime,mimeType)`
          const subResponse = await fetch(subUrl)
          const subData = await subResponse.json()

          return (subData.files || []).map(doc => ({
            ...doc,
            especialidad: folder.name,
            subcarpeta: subFolder.name
          }))
        })
        const subResults = await Promise.all(subPromises)
        return subResults.flat()
      } else {
        // Documentos directamente en la carpeta
        return data.files.map(doc => ({
          ...doc,
          especialidad: folder.name,
          subcarpeta: null
        }))
      }
    })

    const results = await Promise.all(promises)
    allDocuments = results.flat()
    isDataLoaded = true

  } catch (error) {
    console.error("Error precargando documentos:", error)
  }
}

// Iniciar precarga
preloadAllDocuments()

function getFolderDicipline(e) {
  // Si los datos no están cargados, mostrar loading y esperar
  if (!isDataLoaded) {
    showLoading()
    setTimeout(() => getFolderDicipline(e), 500)
    return
  }

  const current_dicipline_spaced = e.replaceAll("_", " ")
  const current_dicipline = e.replaceAll("_", "")

  // Filtrar documentos de esta especialidad desde el cache
  const especialidadDocs = allDocuments.filter(
    doc => deleteSpaces(doc.especialidad) === current_dicipline
  )

  if (especialidadDocs.length === 0) {
    showError("No se encontraron documentos para esta especialidad.")
    return
  }

  // Agrupar por subcarpeta si existen
  const tieneSubcarpetas = especialidadDocs.some(doc => doc.subcarpeta)

  if (tieneSubcarpetas) {
    // Agrupar por subcarpeta
    const grupos = {}
    especialidadDocs.forEach(doc => {
      const key = doc.subcarpeta || "Sin categoría"
      if (!grupos[key]) grupos[key] = []
      grupos[key].push(doc)
    })

    const html = Object.entries(grupos)
      .map(([subcarpeta, docs]) => renderDownloadDivs(docs, subcarpeta))
      .join('')

    renderSubPage(html, current_dicipline_spaced, current_dicipline)
  } else {
    renderSubPage(renderDownloadDivs(especialidadDocs), current_dicipline_spaced, current_dicipline)
  }
}

function renderMain(){
  // creacion de los botones iterando sobre el array de las especialidades
  const buttons_html = especialidades.map(especialidad => `
      <button data-especialidad=${(especialidad.nombre).replaceAll(" ", "_")} class="dicipline-btn">
        <img data-especialidad=${(especialidad.nombre).replaceAll(" ", "_")} class="vector" src="iconos/${deleteSpaces(especialidad.nombre)}.svg" alt="${especialidad.alt}">
        ${especialidad.nombre}
      </button>`).join("")
  
  // actualizamos el dom con la main page
  mainEl.innerHTML = `
      <div class="main-title">
        <h1>Consentimientos informados</h1>
        <h2 class="subtitulos">Aquí encontrará los consentimientos informados de los procedimientos quirúrgicos más frecuentes, elaborados por los diferentes servicios del Centro Quirúrgico, validados por el Departamento de Calidad de la Clínica Pasteur.</h2>
      </div>

      <div class="search-container">
        <div class="search-input-wrapper">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" id="search-input" class="search-input" placeholder="Buscar documentos..." autocomplete="off">
        </div>
        <div id="search-results" class="search-results"></div>
      </div>

      <div class="otros-documentos-container">
        <button data-especialidad="Documentos_generales" class="otros-documentos-btn">
          Documentos generales
        </button>
      </div>

      <h3 class="subtitulos">Accede a nuestra biblioteca de formularios:</h3>
      <div class="especialidades-wrapper">
        <div class="grid-container">
          ${buttons_html}
        </div>
      </div>`

  // Agregar event listener al buscador
  const searchInput = document.getElementById('search-input')
  const searchIcon = document.querySelector('.search-icon')

  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300))

    // Mostrar resultados de nuevo al hacer focus si hay texto
    searchInput.addEventListener('focus', () => {
      const resultsContainer = document.getElementById('search-results')
      if (searchInput.value.trim().length >= 2 && resultsContainer.innerHTML) {
        resultsContainer.classList.add('active')
      }
    })
  }

  if (searchIcon && searchInput) {
    searchIcon.addEventListener('click', () => searchInput.focus())
  }
}

// Cerrar resultados de búsqueda al hacer clic fuera
document.addEventListener('click', function(e) {
  const searchContainer = document.querySelector('.search-container')
  const resultsContainer = document.getElementById('search-results')

  if (searchContainer && resultsContainer && !searchContainer.contains(e.target)) {
    resultsContainer.classList.remove('active')
  }
})

// event listener para los botones de las especialidades
document.addEventListener("click", function(e){
  // si se clickea alguna especialidad
  if (e.target.dataset.especialidad) {
    getFolderDicipline(e.target.dataset.especialidad)
    updateUrl(e.target.dataset.especialidad)
  }
})

// en caso de que se usen las flechas de atras y adelante
window.addEventListener("popstate", function(e){
  // si no es main, es alguna especialidad, por lo que se la pasa a la función
  if (e.state?.page != "main") {
    getFolderDicipline(e.state.page)
  } // de lo contrario, significa que es main, y llama a la funcion para redearla
  else {
    renderMain()
  }
})

function updateUrl (currentPage) {
  const cleanUrl = toUrlSlug(currentPage)
  history.pushState({page: currentPage}, '', `/${cleanUrl}`)
}

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1)
}

function showLoading() {
    mainEl.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Cargando documentos...</p>
        </div>`
}

function showError(message) {
    mainEl.innerHTML = `
        <div class="error-container">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <p>${message}</p>
            <button class="back-btn" aria-label="Volver a la página principal" onclick="renderMain(); updateUrl('main')">
                <i class="fa-solid fa-arrow-left"></i>
                Volver al inicio
            </button>
        </div>`
}

function deleteSpaces(word) {
  return word.replaceAll(" ", "")
}

function toUrlSlug(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "")
}

function debounce(func, wait) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function handleSearch(e) {
  const query = e.target.value.trim()
  const resultsContainer = document.getElementById('search-results')

  if (!query || query.length < 2) {
    resultsContainer.innerHTML = ''
    resultsContainer.classList.remove('active')
    return
  }

  if (!isDataLoaded) {
    resultsContainer.innerHTML = '<p class="search-loading">Cargando datos...</p>'
    resultsContainer.classList.add('active')
    return
  }

  const normalizedQuery = normalizeText(query)

  // Filtrar documentos que coincidan con la búsqueda
  const results = allDocuments.filter(doc => {
    const normalizedName = normalizeText(doc.name)
    return normalizedName.includes(normalizedQuery)
  })

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="search-no-results">No se encontraron documentos</p>'
    resultsContainer.classList.add('active')
    return
  }

  // Agrupar resultados por especialidad
  const grouped = {}
  results.forEach(doc => {
    if (!grouped[doc.especialidad]) grouped[doc.especialidad] = []
    grouped[doc.especialidad].push(doc)
  })

  // Renderizar resultados
  const html = Object.entries(grouped).map(([especialidad, docs]) => `
    <div class="search-group">
      <p class="search-group-title">${especialidad}</p>
      ${docs.slice(0, 5).map(doc => `
        <a href="${doc.webViewLink}" target="_blank" class="search-result-item">
          <i class="fa-regular fa-file-pdf"></i>
          <span>${doc.name.replace(/\.pdf$/i, "")}</span>
          <span class="search-result-date">${new Date(doc.modifiedTime).toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: '2-digit'})}</span>
        </a>
      `).join('')}
      ${docs.length > 5 ? `<p class="search-more">+${docs.length - 5} más...</p>` : ''}
    </div>
  `).join('')

  resultsContainer.innerHTML = html
  resultsContainer.classList.add('active')
}

function renderDownloadDivs(downloadsArray, folderName = "") {
  const titleHtml = folderName ? `<p class="folder-card-title">${folderName}</p>` : ""

  return `
    <div class="folder-card">
      ${titleHtml}
      <div class="download-container">
        ${downloadsArray.map(pdf => `
          <div class="download-div">
            <div class="download-info">
              <p class="download-title">${pdf.name.replace(/\.pdf$/i, "")}</p>
              <p class="download-actualizacion">${new Date(pdf.modifiedTime).toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
            </div>
            <button class="download-btn" aria-label="Descargar ${pdf.name.replace(/\.pdf$/i, "")}" onclick="window.open('${pdf.webViewLink}')">
              <img class="download-icon" src="images/download vector.png" alt="">
              <span class="download-text">Descargar</span>
            </button>
          </div>`).join('')}
      </div>
    </div>`
}

function renderSubPage (pdf_html, current_dicipline_spaced, current_dicipline){
    const isDocumentosGenerales = current_dicipline === "Documentosgenerales"

    const descripcionHtml = isDocumentosGenerales
      ? `Acceda a la documentación necesaria para la adecuada programación y ejecución de las cirugías en el Centro Quirúrgico Pasteur. Descargue, complete y firme los formularios correspondientes para formalizar la pre-admisión e internación de sus pacientes en Clínica Pasteur.`
      : `Formularios de consentimientos informados específicos para los procedimientos quirúrgicos utilizados con más frecuencia en el Servicio de ${capitalize(current_dicipline_spaced)}.<br><br><strong>Requisito de validez:</strong><br>Los documentos deben presentarse impresos, con los datos del paciente completos, firma del paciente y la firma/sello del médico responsable que indica el procedimiento.`

    mainEl.innerHTML = `
    <div class="subheader-background" id="background">
      <div class="subheader-txt">
        <h1>${capitalize(current_dicipline_spaced)}</h1>
      </div>
      <button class="back-btn" aria-label="Volver a la página principal" onclick="renderMain(); updateUrl('main')">
      <i class="fa-solid fa-arrow-left"></i>
      Volver
    </button>
    </div>
    <h2 class="description">${descripcionHtml}</h2>
    ${pdf_html}`

    const bgEl = document.getElementById("background")
    if (current_dicipline === "Documentosgenerales") {
      bgEl.style.background = "linear-gradient(180deg,rgba(167, 92, 138, 0.69) 0%,rgba(181, 74, 140, 0.82) 85%, transparent 80%)"
    } else {
      bgEl.style.backgroundImage = `url('images/${current_dicipline}.jpg')`
    }

    // scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

renderMain()
history.replaceState({page: "main"}, '', "/main")