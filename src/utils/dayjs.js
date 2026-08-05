import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { ternary } from './javascript'

dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(isoWeek)

const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY'

const dayJs = (...args) => dayjs(...args)

const formatDate = (date, format = 'YYYY/MM/DD') =>
  ternary(date, dayJs(date, format), null)

const estDateFormat = dayJsDate => {
  return dayJsDate?.isValid?.() ? dayJsDate.utcOffset(-5) : null
}

export { dayJs, formatDate, estDateFormat, DISPLAY_DATE_FORMAT }
