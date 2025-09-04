export const dateFormat = convertedDate => {
  const createdDate = convertedDate && new Date(convertedDate)

  let date = createdDate && createdDate?.getDate()
  let month = createdDate && createdDate?.getMonth() + 1
  let year = createdDate && createdDate?.getFullYear()
  let newDate =
    year +
    '/' +
    (month > 9 ? month : '0' + month) +
    '/' +
    (date > 9 ? date : '0' + date)
  newDate = newDate === 'Invalid date' ? '-' : newDate
  let dmyDate =
    (date > 9 ? date : '0' + date) +
    '/' +
    (month > 9 ? month : '0' + month) +
    '/' +
    year
  dmyDate = dmyDate === 'Invalid date' ? '-' : dmyDate
  return { newDate, dmyDate }
}
