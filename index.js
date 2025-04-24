const mainEl = document.getElementById("main-container")
const backgroundEl = document.getElementById("background")

const especialidades = [
    {
      nombre: "Anestesiología",
      alt: "Icono de anestesiólogo con mascarilla",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"],
      
    },
    {
      nombre: "Cabeza y cuello",
      alt: "Icono de cuello con zona tiroidea destacada",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"],
    },
    {
      nombre: "Cirugía bariátrica",
      alt: "Icono de estómago reducido quirúrgicamente",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Cirugía cardiovascular",
      alt: "Icono de corazón con instrumentos quirúrgicos",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Cirugía general",
      alt: "Icono de médico con estetoscopio",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Cirugía maxilofacial",
      alt: "Icono de perfil facial con mandíbula resaltada",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Cirugía neonatal",
      alt: "Icono de bebé envuelto en mantita",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Coloproctología",
      alt: "Icono de mano con guante sosteniendo intestino",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Endoscopía",
      alt: "Icono de tubo flexible entrando en sistema digestivo",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Ginecología y Obstetricia",
      alt: "Icono de útero en estilo anatómico",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Hemodinamia",
      alt: "Icono de sistema circulatorio con flujos",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Nefrología",
      alt: "Icono de riñones con detalles anatómicos",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Oftalmología",
      alt: "Icono de ojo con detalles de visión",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf", "pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf", "pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf", "pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf", "pdf/Carta de Agradecimiento Mamá japonesa.pdf"]
    },
    {
      nombre: "Oncología",
      alt: "Icono de célula con diagnóstico médico",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "ORL",
      alt: "Icono de oído, nariz y garganta en esquema",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Traumatología",
      alt: "Icono de pierna en movimiento con rayos de dolor",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Trasplante hepático y cirugía hepatobiliar",
      alt: "Icono de hígado con vena porta",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    },
    {
      nombre: "Urología",
      alt: "Icono de vejiga con sistema urinario resaltado",
      pdf: ["pdf/Carta de Agradecimiento Mamá japonesa.pdf", "pdf/Carta de Agradecimiento Tanaka.pdf"]
    }
  ];

const buttons = especialidades.map(especialidad => `
    <button data-especialidad=${deleteSpaces(especialidad.nombre)} class="dicipline-btn">
      <img class="vector" src="iconos/${deleteSpaces(especialidad.nombre)}.svg" alt=${especialidad.alt}>
      ${especialidad.nombre}
    </button>`).join("")
mainEl.innerHTML += `
    <div class="main-title">
      <h1>Consentimientos informados</h1>
      <h2>Garantizamos los derechos de nuestros pacientes</h2>
      <h3>Accede a nuesta biblioteca de formularios</h3>
    </div>
    <div class="grid-container">
        ${buttons}
    </div>`

document.addEventListener("click", function(e){
    if (e.target.dataset.especialidad) {
        const current_especialidad = e.target.dataset.especialidad
        console.log(current_especialidad)
        const current_especialidad_obj = (especialidades.filter(especialidad => deleteSpaces(especialidad.nombre) === capitalize(current_especialidad))[0])
        console.log(current_especialidad_obj)

        // faltan los pdf reales
        const pdf_html = current_especialidad_obj.pdf.map(pdf => `
          <div class="download-div">
            <div>
              <p class="download-title">Hepatograma nivel 4</p>
              <p class="download-actualizacion">Ultima actualización: 99/99/9999</p>
            </div>
              <button class="download-btn" onclick="window.open('pdf/Carta de Agradecimiento Mamá japonesa.pdf')"><i class="fa-regular fa-file-pdf"></i>Descargar</button>
          </div>`).join('')

        mainEl.innerHTML = `
        <div class="subheader-background" id="background">
          <div class="subheader-txt">
            <h1>${capitalize(current_especialidad_obj.nombre)}</h1>
          </div>
        </div>
        <h2 class="description">Se desarrollaron formularios específicos para los procedimientos más frecuentes realizadas en el servicio de ${current_especialidad} de la Clínica Pasteur. <br>Recuerde que deben ser impresos, completados con los datos correspondientes, firmados por el paciente y validados con firma y sello del profesional médico interviniente.</h2>
        <div class="download-container">
          ${pdf_html}
        </div>`;

        document.getElementById("background").style.backgroundImage = `url('images/${e.target.dataset.especialidad}.jpg')`
    }
})

// Funcion para poner mayuscula a la primera letra
function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1)
}

function deleteSpaces (word) {
  return word.replaceAll(" ", "")
}
