const fs = require('fs')

const { JWT } = require('google-auth-library')
const { GoogleSpreadsheet } = require('google-spreadsheet')

const creds = require('./src/i18n/airnext-translationsheet-readentials.json')

const exportFolder = './src'

const serviceAccountAuth = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const doc = new GoogleSpreadsheet(
  '10jh4hpK29du3WFtOb5PmAelkspMCWIP01NEyvbvQDIM',
  serviceAccountAuth,
)

const write = async result => {
  let jobId = 60
  const data = Object.values(result).reduce((grouped, item) => {
    const jobCount = Math.ceil(item.length / 10)
    for (let i = 0; i < jobCount; i++) {
      grouped[jobId] = item.slice(10 * i, 10 * (i + 1))
      jobId++
    }
    return grouped
  }, {})

  fs.writeFileSync(
    `${exportFolder}/dummyRecoveyJob.json`,
    JSON.stringify(data, null, 2),
    err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('err :>> ', err)
      }
    },
  )
}

const getInfo = async () => {
  await doc.loadInfo()
  const sheet = doc.sheetsById[0]
  await sheet.loadHeaderRow()

  const rows = await sheet.getRows({ limit: sheet.rowCount })
  const dataArr = rows.map(row => row.toObject())
  const result = dataArr.reduce((grouped, item) => {
    const key = item.job_DateOfReceiptOfVehicle
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(item)
    return grouped
  }, {})

  await write(result)
}

getInfo()
