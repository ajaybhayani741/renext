import { DatePicker, ConfigProvider } from 'antd'
import calenderEN from 'antd/es/locale/en_GB'
import calenderJP from 'antd/es/locale/ja_JP'

import useTranslations from '../../hooks/useTranslations'
import { isEqual, ternary } from '../../utils/javascript'

const { RangePicker } = DatePicker

const ANTDDatePicker = ({ ...props }) => {
  const { i18n } = useTranslations()
  return (
    <ConfigProvider
      locale={ternary(isEqual(i18n.language, 'jp'), calenderJP, calenderEN)}
    >
      <DatePicker {...props} />
    </ConfigProvider>
  )
}

const ANTDDateRange = ({ ...props }) => {
  const { i18n } = useTranslations()
  return (
    <ConfigProvider
      locale={ternary(isEqual(i18n.language, 'jp'), calenderJP, calenderEN)}
    >
      <RangePicker {...props} />
    </ConfigProvider>
  )
}

export { ANTDDatePicker, ANTDDateRange }
