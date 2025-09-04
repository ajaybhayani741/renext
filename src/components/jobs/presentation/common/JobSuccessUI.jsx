import useTranslations from '../../../../hooks/useTranslations'
import { clipboardsImage } from '../../../../utils/icons'

const JobSuccessUI = () => {
  const { t } = useTranslations()
  return (
    <div className="text-center align-center">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          className=""
          src={clipboardsImage}
          alt="clipboard"
          height="150px"
          width="150px"
        />
      </div>
      <h2 className="mt-10">{t('msg_JobCompleted')}</h2>
    </div>
  )
}

export default JobSuccessUI
