import { Select } from 'antd'

import useTranslations from '../../hooks/useTranslations'

function ANTDSelect({ notFoundContent, ...props }) {
  const { t } = useTranslations()
  return (
    <Select {...props} notFoundContent={notFoundContent || t('txt_NoData')} />
  )
}
export default ANTDSelect
