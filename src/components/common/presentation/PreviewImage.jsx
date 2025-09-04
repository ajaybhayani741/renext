import useTranslations from '../../../hooks/useTranslations'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { include } from '../../../utils/javascript'

function PreviewImage({ imagePreview, handleCancel }) {
  const { t } = useTranslations()

  const imageType =
    imagePreview?.type || /\.\w+$/.exec(imagePreview?.image)?.[0]

  return (
    <ANTDModal
      open={imagePreview?.visible}
      footer={null}
      onCancel={handleCancel}
      title={t('job_Preview')}
      destroyOnClose
      width={include(imageType, 'pdf') ? 800 : 500}
    >
      {['mp4', 'mov', 'avi', 'wmv', 'avchd', 'webm', 'flv'].some(type =>
        include(imageType, type),
      ) ? (
        <video width="470" controls autoplay>
          <source src={imagePreview?.image} type="video/mp4" />
        </video>
      ) : include(imageType, 'pdf') ? (
        <iframe
          src={imagePreview?.image}
          title={t('job_Preview')}
          height="750px"
          width="100%"
        />
      ) : (
        <img
          alt={t('job_Preview')}
          src={imagePreview?.image}
          className="w-100 border-black-1"
        />
      )}
    </ANTDModal>
  )
}

export default PreviewImage
