const mainEl = document.getElementById("main-container")
const backgroundEl = document.getElementById("background")
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

let pdf_db = ""
async function getFolder(folderId) {
  // Buscar archivos que estén dentro de esa carpeta
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,webViewLink,webContentLink)`
  const respuesta = await fetch(url)
  const respuesta_promise = await respuesta.json()
  pdf_db = await respuesta_promise.files
}

getFolder(folderId_main)

async function getFolder01(e) {
  const current_dicipline_spaced = e.target.dataset.especialidad.replaceAll("_", " ")
  // lo juntamos, ya que esta separado por "_"
  const current_dicipline = e.target.dataset.especialidad.replaceAll("_", "")
  // filtrar de todas las dicipline, cual es la elegida y obtener un obj
  const drive_current_dicipline_obj = pdf_db.filter(pdf_unit => deleteSpaces(pdf_unit.name) === current_dicipline)[0]

  // buscamos en el drive, segun el id de la capeta de la diciplina
  const url01 = `https://www.googleapis.com/drive/v3/files?q='${drive_current_dicipline_obj.id}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,webViewLink,webContentLink)`
  
  // esperamos hasta que haga los request
  const response01 = await fetch(url01)
  const response01_json = await response01.json()


  const pdf_html = response01_json.files.map(pdf => `
    <div class="download-div">
      <div>
        <p class="download-title">${pdf.name}</p>
        <p class="download-actualizacion">Ultima actualización: 99/99/9999</p>
      </div>
        <button class="download-btn" onclick="window.open('${pdf.webViewLink}')"><i class="fa-regular fa-file-pdf"></i>Descargar</button>
    </div>`).join('')


  mainEl.innerHTML = `
  <div class="subheader-background" id="background">
    <div class="subheader-txt">
      <h1>${capitalize(current_dicipline_spaced)}</h1>
    </div>
  </div>
  <h2 class="description">Se desarrollaron formularios específicos para los procedimientos más frecuentes realizadas en el servicio de ${current_dicipline_spaced.toLowerCase()} de la Clínica Pasteur. <br>Recuerde que deben ser impresos, completados con los datos correspondientes, firmados por el paciente y validados con firma y sello del profesional médico interviniente.</h2>
  <div class="download-container">
    ${pdf_html}
  </div>`;

  document.getElementById("background").style.backgroundImage = `url('images/${current_dicipline}.jpg')`
}


const buttons_html = especialidades.map(especialidad => `
    <button data-especialidad=${(especialidad.nombre).replaceAll(" ", "_")} class="dicipline-btn">
      <img class="vector" src="iconos/${deleteSpaces(especialidad.nombre)}.svg" alt="${especialidad.alt}">
      ${especialidad.nombre}
    </button>`).join("")
mainEl.innerHTML += `
    <div class="main-title">
      <h1>Consentimientos informados</h1>
      <h2>Garantizamos los derechos de nuestros pacientes</h2>
      <h3>Accede a nuesta biblioteca de formularios</h3>
    </div>
    <div class="grid-container">
      ${buttons_html}
    </div>`

document.addEventListener("click", function(e){
  // si se clickea alguna especialidad
  if (e.target.dataset.especialidad) {
    getFolder01(e)
  }
})

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1)
}

function deleteSpaces(word) {
  return word.replaceAll(" ", "")
}
