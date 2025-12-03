import { dayJs } from './dayjs'
import {
  include,
  isEqual,
  length,
  nullOrUndefined,
  ternary,
} from './javascript'

const b64toFile = (b64Data, type, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []
  const viewType = type ? '.' + type.split('/')?.[1] : '.png'
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }
  // file.url && (file?.url.split(";")?.[0].split("/")?.[1] || "jpg")
  const blob = new Blob(byteArrays, { type: contentType })
  const file = new File([blob], `${Date.now() + viewType}`, {
    type: type ? type : 'image/png',
  })
  return file
}

const fieldContactFormat = contact => {
  let char
  if (contact) {
    let numbers = contact.toString().replace(/\D/g, '')
    if (numbers.length === 10) {
      char = { 0: '', 3: '-', 6: '-' }
    } else if (numbers.length < 11) {
      char = { 0: '', 2: '-', 6: '-' }
    } else if (include([11, 12], length(numbers))) {
      char = { 0: '', 3: '-', 7: '-' }
    } else if (isEqual(length(numbers), 13)) {
      char = { 0: '', 2: '-', 5: '-', 9: '-' }
    }
    contact = ''
    let newChar = 2
    for (let i = 0; i < numbers.length; i++) {
      if (char) {
        contact += (char[i] || '') + numbers[i]
      } else {
        contact += (i === newChar ? '-' : '') + numbers[i]
        if (i === newChar) {
          newChar = newChar + 4
        }
      }
    }
  }
  return contact
}

const validationTag = lang => {
  switch (lang) {
    case 'jp':
      return 'en-validation'
    // return 'jp-validation'

    default:
      return 'en-validation'
  }
}

const modifyFileListKeys = list =>
  ternary(
    length(list),
    list?.map(file => ({
      name: file?.fileName,
      url: file?.fileUrl,
      uid: file?.dmsId,
      dmsId: file?.dmsId,
    })),
    [],
  )

const downloadReport = async (reportUrl, fileName) => {
  try {
    const response = await fetch(reportUrl)
    const blob = await response.blob()
    // Create an object URL for the Blob
    const blobUrl = URL.createObjectURL(blob)
    // Create a temporary link element to initiate download
    const link = document.createElement('a')
    link.href = blobUrl
    // link.setAttribute('download', filename); // Set the filename
    fileName && link.setAttribute('download', fileName || 'file.pdf')
    link.style.display = 'none'
    // Append the link to the document body
    document.body.appendChild(link)
    // Trigger a click event on the link to start the download
    link.click()
    // Clean up: remove the link and revoke the Blob URL after download starts
    document.body.removeChild(link)
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    // console.error('Error downloading the file:', error)
  }
}
const maskNumber = ({ value }) => {
  if (!value) return ''
  const valueStr = value.toString()
  const maskedSection = valueStr.slice(0).replace(/./g, 'X')
  return maskedSection
}

const numberFormat = (value, decimals = true) => {
  const num = Number(value)
  const isDecimals = decimals && num % 1 !== 0

  if (isNaN(num)) return ''

  return num.toLocaleString(
    'en-US',
    isDecimals && {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )
}

const fixedNumber = (num, decimal = 2) => {
  if (nullOrUndefined(num)) return null
  if (typeof num !== 'number') num = Number(num)
  if (isNaN(num)) return 0
  return Number(num.toFixed(decimal))
}

const deepClone = value => {
  // Check for null or undefined
  if (value === null || typeof value !== 'object') {
    return value
  }

  // Handle Dates
  if (value instanceof Date) {
    return new Date(value.getTime())
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item))
  }

  // Handle Objects
  if (value instanceof Object) {
    const copy = {}
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        copy[key] = deepClone(value[key])
      }
    }
    return copy
  }

  // Handle other cases (like Map, Set, etc.)
  if (value instanceof Map) {
    return new Map(
      Array.from(value.entries()).map(([k, v]) => [deepClone(k), deepClone(v)]),
    )
  }

  if (value instanceof Set) {
    return new Set(Array.from(value).map(item => deepClone(item)))
  }

  // If none of the above, return the value as is
  return value
}

const getLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator?.geolocation) {
      const showPosition = async position => {
        const currentLocation = {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
        }
        resolve(currentLocation)
      }
      const positionError = error => {}
      navigator?.geolocation?.getCurrentPosition(showPosition, positionError)
    } else {
      reject()
    }
  })
}

const calendarYearDate = year => {
  const saveFormat = 'DD/MM/YYYY'
  const startDate = dayJs(`${year}-01-01`).format(saveFormat)
  const endDate = dayJs(`${year}-12-31`).format(saveFormat)
  return { startDate, endDate }
}

export {
  b64toFile,
  fieldContactFormat,
  validationTag,
  downloadReport,
  maskNumber,
  numberFormat,
  fixedNumber,
  deepClone,
  getLocation,
  modifyFileListKeys,
  calendarYearDate,
}
