const fs = require('fs')

const { JWT } = require('google-auth-library')
const { GoogleSpreadsheet } = require('google-spreadsheet')

const creds = require('./airnext-translationsheet-readentials.json')

const exportFolder = '../../public/locales'

const serviceAccountAuth = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const doc = new GoogleSpreadsheet(creds.sheet_id, serviceAccountAuth)

const write = async (data, columnKey) => {
  Object.keys(data).forEach(async key => {
    let enumString = ``
    for (const valueKey in data[key]) {
      const ele = data[key][valueKey]
      enumString += `${enumString ? '\n' : ''}  ${valueKey} = '${ele}',`
    }

    if (key === columnKey) {
      let enumString = ``
      for (const valueKey in data[key]) {
        const ele = data[key][valueKey]
        enumString += `${enumString ? '\n' : ''}  '${valueKey}' : '${ele}',`
      }
      await fs.writeFile(
        `${exportFolder}/${key}/TranslationKeys.js`,
        `const TranslationKeys = {\n${enumString}\n}\n export default TranslationKeys`,
        err => {
          if (err) {
          }
        },
      )
    } else {
      await fs.writeFile(
        `${exportFolder}/${key}/translation.json`,
        JSON.stringify(data[key], null, 2),
        err => {
          if (err) {
          }
        },
      )
    }
  })
}

const getInfo = async () => {
  await doc.loadInfo()
  const sheet = doc.sheetsById[creds.sheet_index]
  await sheet.loadHeaderRow()
  let result = {}
  const colTitles = sheet.headerValues
  const keyColumnName = colTitles[0]
  colTitles.forEach(col => {
    if (!!col) {
      result = { ...result, [col]: {} }
    }
  })

  const rows = await sheet.getRows({ limit: sheet.rowCount })
  rows.forEach(row => {
    const obj = row.toObject()
    for (const key in obj) {
      const value = obj[key]
      const valueKey = obj[keyColumnName]
      if (!!value && !!valueKey) {
        result[key][obj[keyColumnName]] = obj[key]
      }
    }
  })

  await write(result, keyColumnName)
}

getInfo()
