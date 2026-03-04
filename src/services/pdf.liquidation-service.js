import fs from 'fs'
import puppeteer from 'puppeteer'
import path from 'path'
import { formatDate } from '../utils/dateFormatter.js'

export const generateViaticliquidationPDF = async (data) => {

  const templatePath = path.resolve('src/templates/liquidation-gastos.html')


  let html = fs.readFileSync(templatePath, 'utf8')



  // Reemplazos simples
  html = html
    .replace('{{NRO_VIAJE}}', data.nro_viaje)
    .replace('{{CENTRO_COSTO}}', data.centro_costo)
    .replace('{{NOMBRE_COMPLETO}}', data.nombre_completo)
    .replace('{{CODIGO_TRABAJADOR}}', data.codigo_trabajador)
    .replace('{{AREA_EMPLOY}}', data.area_employ)
    .replace('{{PROYECT_NAME}}', data.proyect_name)
    .replace('{{CLIENT_NAME}}', data.client_name)
    .replace('{{PLANTA_NAME}}', data.planta_name)
    .replace('{{PRESENTACION}}', formatDate(data.presentation_date))
    .replace('{{ESTADO}}', data.estado)
    .replace('{{START_MOV}}', formatDate(data.start_mov))
    .replace('{{END_MOV}}', formatDate(data.end_mov))



  // Generar filas dinámicas
  const Declarationrows = data.declarations.map(d => `
    <tr>
      <td>${d.document}</td>
      <td>${d.fecha}</td>
      <td>${d.description}</td>
      <td>${d.category}</td>
      <td>S/ ${d.amount}</td>
    </tr>
  `).join('')

  const Depositrows = data.deposits.map(c => `
    <tr>
      <td>${c.code}</td>
      <td>S/ ${c.amount}</td>
    </tr>
  `).join('')

  html = html.replace('{{DECLARATION_ROWS}}', Declarationrows)
  html = html.replace('{{DEPOSIT_ROWS}}', Depositrows)

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