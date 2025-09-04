import { WarningOutlined } from '@ant-design/icons'

import useTranslations from '../hooks/useTranslations'

const PageNotFound = ({ message = 'txt_PageNotFound' }) => {
  const { t } = useTranslations()
  return (
    <div className="not-found">
      <div className="not-found-img">
        <WarningOutlined />
      </div>
      <h4 fontSize="20px">{t(message)}</h4>
    </div>
  )
}

export default PageNotFound
