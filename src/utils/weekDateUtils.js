import { dayJs, DISPLAY_DATE_FORMAT, formatDate } from './dayjs'

const SAVE_DATE_FORMAT = 'DD/MM/YYYY'
const TOTAL_WEEKS_IN_YEAR = 52

export const getCurrentWeekDateRange = (format = SAVE_DATE_FORMAT) => {
  const today = dayJs()

  return {
    from: today.startOf('isoWeek').format(format),
    to: today.endOf('isoWeek').format(format),
  }
}

export const getISOWeekNumber = (date, inputFormat = SAVE_DATE_FORMAT) => {
  const parsedDate =
    typeof date === 'string' ? formatDate(date, inputFormat) : dayJs(date)

  return parsedDate?.isValid?.() ? parsedDate.isoWeek() : null
}

export const getWeekCounterLabel = ({
  from,
  date,
  inputFormat = SAVE_DATE_FORMAT,
} = {}) => {
  const weekNumber = getISOWeekNumber(from || date || dayJs(), inputFormat)

  return weekNumber ? `Week - ${weekNumber}/${TOTAL_WEEKS_IN_YEAR}` : ''
}

export const isSameDateRange = (firstRange, secondRange) =>
  firstRange?.from === secondRange?.from && firstRange?.to === secondRange?.to

export const getCurrentWeekPickerValue = () => {
  const { from, to } = getCurrentWeekDateRange()

  return [formatDate(from, SAVE_DATE_FORMAT), formatDate(to, SAVE_DATE_FORMAT)]
}

export { SAVE_DATE_FORMAT, TOTAL_WEEKS_IN_YEAR, DISPLAY_DATE_FORMAT }
