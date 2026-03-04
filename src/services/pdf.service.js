import fs from 'fs'
import puppeteer from 'puppeteer'
import path from 'path'
import { formatDate } from '../utils/dateFormatter.js'

export const generateViaticPDF = async (data) => {

  const templatePath = path.resolve('src/templates/viatic-resumen.html')


  let html = fs.readFileSync(templatePath, 'utf8')

  let provinciaSection = ''

  if (data.type === 'PROVINCIA') {
    provinciaSection = `
    <div class="info-line">
      <span class="label">FECHA LLEGADA A PROVINCIA:</span> ${formatDate(data.arrive_date)}
    </div>
    <div class="info-line">
      <span class="label">FECHA SALIDA DE PROVINCIA:</span> ${formatDate(data.exit_date)}
    </div>
  `
  } else {
    provinciaSection = ''
  }

  let ddjstatus = ''

  if (data.type === 'PROVINCIA') {
    ddjstatus = `
   <div class="info-line">
      <span class="label">REALIZACIÓN DE LA DDJJ:</span>
     ${formatDate(data.presentation_date)}
    </div>
  `
  } else {
    ddjstatus = ''
  }

  console.log(provinciaSection);


  // Reemplazos simples
  html = html
    .replace('{{PRESENTACION}}', formatDate(data.presentation_date))
    .replace('{{ESTADO}}', data.estado)
    .replace('{{NEW_CODE}}', data.new_code)
    .replace('{{CODIGO_TRABAJADOR}}', data.codigo_trabajador)
    .replace('{{NOMBRE_COMPLETO}}', data.nombre_completo.toUpperCase())
    .replace('{{PROYECT_NAME}}', data.proyect_name.toUpperCase())
    .replace('{{CENTRO_COSTO}}', data.centro_costo)
    .replace('{{CLIENT_NAME}}', data.client_name.toUpperCase())
    .replace('{{PLANTA_NAME}}', data.planta_name.toUpperCase())
    .replace('{{START_MOV}}', formatDate(data.start_mov))
    .replace('{{END_MOV}}', formatDate(data.end_mov))
    .replace('{{PROVINCIA_SECTION}}', provinciaSection)
    .replace('{{DDJJ_SECTION}}', ddjstatus)

  console.log(data.new_code);


  // Generar filas dinámicas
  const rows = data.depositos.map(d => `
    <tr>
      <td>${d.voucher}</td>
      <td>${d.fecha}</td>
      <td>S/ ${d.monto}</td>
    </tr>
  `).join('')



  html = html.replace('{{TABLE_ROWS}}', rows)

  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()

  return pdf
}

export const generateViaticliquidationPDF = async (data) => {

  const templatePath = path.resolve('src/templates/liquidation-gastos.html')


  let html = fs.readFileSync(templatePath, 'utf8')

  const today = new Date()

  const TODAY_DAY = String(today.getDate()).padStart(2, '0')
  const TODAY_MONTH = String(today.getMonth() + 1).padStart(2, '0')
  const TODAY_YEAR = today.getFullYear()

  // Reemplazos simples
  html = html
    .replace('{{NEW_CODE}}', data.nro_viaje)
    .replace('{{NEW_CODE_DESC}}', data.nro_viaje)
    .replace('{{CENTRO_COSTO}}', data.centro_costo)
    .replace('{{NOMBRE_COMPLETO}}', data.nombre_completo.toUpperCase())
    .replace('{{CODIGO_TRABAJADOR}}', data.codigo_trabajador)
    .replace('{{AREA_EMPLOY}}', data.area_employ.toUpperCase())
    .replace('{{PROYECT_NAME}}', data.proyect_name.toUpperCase())
    .replace('{{CLIENT_NAME}}', data.client_name.toUpperCase())
    .replace('{{PLANTA_NAME}}', data.planta_name.toUpperCase())
    .replace('{{PRESENTATION}}', formatDate(data.presentation_date))
    .replace('{{ESTADO}}', data.estado)
    .replace('{{APROV_DATE}}', formatDate(data.aproved_date))
    .replace('{{START_MOV}}', formatDate(data.start_mov))
    .replace('{{END_MOV}}', formatDate(data.end_mov))
    .replace('{{TODAY_DAY}}', TODAY_DAY)
    .replace('{{TODAY_MONTH}}', TODAY_MONTH)
    .replace('{{TODAY_YEAR}}', TODAY_YEAR)



  const Declarationrows = data.declarations.map(d => {
    console.log(d);

    let hospAlim = ''
    let movilidad = ''
    let otros = ''

    switch (d.category) {
      case 'ALOJAMIENTO':
      case 'ALIMENTACION':
        hospAlim = `S/ ${Number(d.amount).toFixed(2)}`
        break

      case 'MOVILIDAD':
        movilidad = `S/ ${Number(d.amount).toFixed(2)}`
        break

      default:
        otros = `S/ ${Number(d.amount).toFixed(2)}`
    }

    return `
    <tr>
      <td>${d.document}</td>
      <td>${formatDate(d.fecha)}</td>
      <td>${d.description}</td>
      <td>${hospAlim}</td>
      <td>${movilidad}</td>
      <td>${otros}</td>
      <td>S/ ${Number(d.amount).toFixed(2)}</td>
    </tr>
  `
  }).join('')

  let movilityDeclarationRows = ''

  if (Number(data.movility_amount) > 0) {
    movilityDeclarationRows = `
       <tr>
      <td></td>
      <td></td>
      <td>OTROS- PLANILLA DE MOVILIDAD LIMA : </td>
      <td></td>
      <td>${data.movility_amount}</td>
      <td></td>
      <td>S/ ${Number(data.movility_amount).toFixed(2)}</td>
    </tr>
  `
  } else {
    movilityDeclarationRows = ''
  }


  // Generar filas dinámicas

  let totalHospAlim = 0
  let totalMovilidad = 0
  let totalOtros = 0

  data.declarations.forEach(d => {
    switch (d.category) {
      case 'ALOJAMIENTO':
      case 'ALIMENTACION':
        totalHospAlim += Number(d.amount)
        break

      case 'MOVILIDAD':
        totalMovilidad += Number(d.amount)
        break

      default:
        totalOtros += Number(d.amount)
    }
  })

  // sumado de adicionales
  totalMovilidad += Number(data.movility_amount || 0)


  const depositCodes = data.deposits
    .map(d => d.code)
    .join(', ')

  const depositCodesFormatted = `(${depositCodes})`

  const totalDeposits = data.deposits
    .reduce((acc, d) => acc + Number(d.amount), 0)


  html = html.replace('{{DECLARATION_ROWS}}', Declarationrows)
  html = html.replace('{{MOVILITY_DECLARATION_ROWS}}', movilityDeclarationRows)
  html = html.replace('{{DEPOSIT_CODES}}', depositCodesFormatted)
  html = html.replace('{{TOTAL_DEPOSITS}}', `S/ ${totalDeposits.toFixed(2)}`)
  html = html.replace('{{TOTAL_HOSPALIM}}', `S/ ${totalHospAlim.toFixed(2)}`)
  html = html.replace('{{TOTAL_MOVILIDAD}}', `S/ ${totalMovilidad.toFixed(2)}`)
  html = html.replace('{{TOTAL_LIQUIDAR}}', `S/ ${totalDeposits.toFixed(2)}`)
  html = html.replace('{{TOTAL_OTROS}}', `S/ ${totalOtros.toFixed(2)}`)
  html = html.replace('{{TOTAL_GENERAL}}', `S/ ${(totalHospAlim + totalMovilidad + totalOtros).toFixed(2)}`)
  html = html.replace('{{TOTAL_GENERAL_CONTROL}}', `S/ ${(totalHospAlim + totalMovilidad + totalOtros).toFixed(2)}`)
  html = html.replace('{{SALDO_FINAL}}', `S/ ${(totalHospAlim + totalMovilidad + totalOtros - totalDeposits).toFixed(2)}`)

  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()

  return pdf
}

export const generateViaticMovilityPDF = async (data) => {

  const templatePath = path.resolve('src/templates/movility-gastos.html')


  let html = fs.readFileSync(templatePath, 'utf8')


  const formatMonthYear = (date) => {
    const d = new Date(date)

    const month = new Intl.DateTimeFormat('es-ES', {
      month: 'long'
    }).format(d)

    const year = d.getFullYear()

    return `${month.toUpperCase()} ${year}`
  }

  // Reemplazos simples
  html = html
    .replace('{{NRO_VIAJE}}', data.nro_viaje)
    .replace('{{NOMBRE_COMPLETO}}', data.nombre_completo.toUpperCase())
    .replace('{{CODIGO_TRABAJADOR}}', data.codigo_trabajador)
    .replace('{{PERIODO_MOV}}', formatMonthYear(data.end_mov))
    .replace('{{PRESENTATION}}', formatDate(data.presentation_date))
    .replace('{{ESTADO}}', data.estado)
    .replace('{{START_MOV}}', formatDate(data.start_mov))
    .replace('{{END_MOV}}', formatDate(data.end_mov))



  const Declarationrows = data.declarations.map(d => {

    return `
    <tr>
      <td>${formatDate(d.fecha)}</td>
      <td>${d.description}</td>
      <td>${d.origin}</td>
      <td>${d.destiny}</td>
      <td>S/ ${Number(d.amount).toFixed(2)}</td>
    </tr>
  `
  }).join('')

  // Generar filas dinámicas

  let totalMovilidad = 0
  let totalOtros = 0

  data.declarations.forEach(d => {
    switch (d.category) {
      case 'MOVILIDAD':
        totalMovilidad += Number(d.amount)
        break

      default:
        totalOtros += Number(d.amount)
    }
  })




  html = html.replace('{{DECLARATION_ROWS}}', Declarationrows)
  html = html.replace('{{TOTAL_MOVILIDAD}}', `S/ ${totalMovilidad.toFixed(2)}`)
  html = html.replace('{{TOTAL_OTROS}}', `S/ ${totalOtros.toFixed(2)}`)
  html = html.replace('{{TOTAL_GENERAL}}', `S/ ${(totalMovilidad + totalOtros).toFixed(2)}`)

  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()

  return pdf
}