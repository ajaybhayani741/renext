import React from 'react'
import Webcam from 'react-webcam'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { flipIcon } from '../../../utils/icons'

const TakePhoto = ({
  takePhoto,
  isDesktop,
  facingMode,
  showFlipBtn,
  videoElement,
  videoConstraints,
  handleError,
  handleCapture,
  handleTakePhoto,
  handleSwitchCam,
}) => {
  const { t } = useTranslations()

  return (
    <ANTDModal
      width="800px"
      footer={
        takePhoto.valid
          ? [
              <ANTDButton
                key="back"
                className="mb-10 mr-15"
                type="primary"
                onClick={handleTakePhoto}
              >
                {t('msg_Cancel')}
              </ANTDButton>,
            ]
          : [
              <div className="d-flex flex-end" key="action">
                {showFlipBtn && (
                  <ANTDButton
                    className="view-flip mr-15 mb-10"
                    type="primary"
                    onClick={() => handleSwitchCam()}
                  >
                    <img src={flipIcon} width="25px" height="20px" alt="flip" />
                  </ANTDButton>
                )}
                <ANTDButton
                  key="cancel"
                  className="mr-15 mb-10"
                  type="primary"
                  onClick={handleTakePhoto}
                >
                  {t('msg_Cancel')}
                </ANTDButton>
                <ANTDButton
                  className="mr-15 mb-10"
                  type="primary"
                  onClick={handleCapture}
                >
                  {t('msg_OK')}
                </ANTDButton>
              </div>,
            ]
      }
      className="take-image-modal"
      closable={false}
      open={takePhoto.flag}
    >
      {takePhoto.valid ? (
        <div className="text-center scanner-not-connect">
          <h2> {takePhoto.valid}</h2>
        </div>
      ) : (
        <Webcam
          screenshotFormat="image/png"
          audio={false}
          videoConstraints={{ ...videoConstraints, facingMode }}
          ref={videoElement}
          style={{ width: '100%', height: '600px' }}
          onUserMediaError={handleError}
        />
      )}
    </ANTDModal>
  )
}

export default TakePhoto
