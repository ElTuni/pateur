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

async function getFolder(folderId) {
  // Buscar archivos que estén dentro de esa carpeta
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name)`
  const respuesta = await fetch(url)
  const data = await respuesta.json()
  pdf_db = data.files
}

getFolder(folderId_main)

async function getFolderDicipline(e) {
  showLoading()

  try {
    // lo separamos, ya que esta separado por "_"
    const current_dicipline_spaced = e.replaceAll("_", " ")
    // lo juntamos, ya que esta separado por "_"
    const current_dicipline = e.replaceAll("_", "")

    // filtrar de todas las dicipline, cual es la elegida y obtener un obj
    const drive_current_dicipline_obj = pdf_db.filter(
      pdf_unit => deleteSpaces(pdf_unit.name) === current_dicipline)
      [0]

    if (!drive_current_dicipline_obj) {
      throw new Error("Especialidad no encontrada")
    }

    // buscamos en el drive, segun el id de la capeta de la diciplina
    const url = `https://www.googleapis.com/drive/v3/files?q='${drive_current_dicipline_obj.id}'+in+parents&key=${apiKey}&fields=files(name,webViewLink,modifiedTime,mimeType,id)`

    // esperamos hasta que haga los request
    const response = await fetch(url)
    const data = await response.json()

    if (!data.files || data.files.length === 0) {
      throw new Error("No se encontraron documentos")
    }

    // checkeamos si el primer archivo de la carpeta, es un folder
    if (data.files[0]?.mimeType.endsWith("folder")) {
      // creamos la varialbe donde vamos a guardar todos los archivos de las carpetas
      let allInsideFiles = []
      for (const folderFile of data.files) {
        const subResponse = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderFile.id}'+in+parents&key=${apiKey}&fields=files(name,webViewLink,modifiedTime,mimeType)`)
        const subData = await subResponse.json()
        // vamos creando los divs, con los archivos de cada carpeta, con su respectivo nombre
        allInsideFiles.push(renderDownloadDivs(subData.files, folderFile.name))
      }
      renderSubPage(allInsideFiles.join(''), current_dicipline_spaced, current_dicipline)
    }
    // si no contiene ningun folder
    else {
      renderSubPage(renderDownloadDivs(data.files), current_dicipline_spaced, current_dicipline)
    }
  } catch (error) {
    showError("Hubo un problema al cargar los documentos. Por favor, intente nuevamente.")
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
}

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

function renderDownloadDivs(downloadsArray, folderName = "") {
  let folderNameDiv = ""
  // si los archivos provienen de una carpeta, agregamos su nombra
  if (folderName) {
    folderNameDiv = `<p class="subtitulos folder-title">${folderName}</p>`
  }
  return `
  ${folderNameDiv}
  <div class="download-container">
    ${downloadsArray.map(pdf => `
      <div class="download-div">
        <div>
          <p class="download-title">${pdf.name.replace(/\.pdf$/i, "")}</p>
          <p class="download-actualizacion">Ultima actualización: ${new Date(pdf.modifiedTime).toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
        </div>
          <button class="download-btn" aria-label="Descargar ${pdf.name.replace(/\.pdf$/i, "")}" onclick="window.open('${pdf.webViewLink}')"><i class="fa-regular fa-file-pdf"></i>Descargar</button>
      </div>`).join('')}
    </div>`
}

function renderSubPage (pdf_html, current_dicipline_spaced, current_dicipline){
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
    <h2 class="description">Formularios específicos de los procedimientos utilizados con más frecuencia en el Servicio de ${capitalize(current_dicipline_spaced)}.<br><br>Requisito de validez: Los documentos deben presentarse impresos, con los datos del paciente completos, firma del paciente y la firma/sello del médico responsable que indica el procedimiento.</h2>
    <p class="subtitulos underline text-left">Documentos:</p>
    ${pdf_html}`

    document.getElementById("background").style.backgroundImage = `url('images/${current_dicipline}.jpg')`
    
    // scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

renderMain()
history.replaceState({page: "main"}, '', "/main")