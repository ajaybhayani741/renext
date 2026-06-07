import React from 'react'

import ANTDButton from './antd/ANTDButton'
import ANTDModal from './antd/ANTDModal'
import useTranslations from '../hooks/useTranslations'
import { successSvg, warningImage } from '../utils/icons'
import { ternary } from '../utils/javascript'

const PopUpConfirm = ({
  footer = null,
  title,
  msgList = [],
  description,
  isOpen,
  success,
  onCancelModel,
  onAccept,
  onReject,
  acceptLoader = false,
}) => {
  const { t } = useTranslations()
  return (
    <ANTDModal
      title={false}
      centered
      open={isOpen}
      onCancel={onCancelModel}
      footer={footer}
      className={`warning-modal ${success ? 'success-modal' : ''}`}
      destroyOnClose
    >
      <div>
        {title && <h3>{t(title)}</h3>}
        <div className="popup-content">
          <div className="d-flex align-center">
            <img
              src={ternary(success, successSvg, warningImage)}
              alt="warning"
            />
            <span className="d-inline-block popup-heading">
              {t(ternary(success, 'msg_Success', 'msg_Warning'))}
            </span>
          </div>
          <ul className="pl-15 ml-15 mt-20">
            {description && <li>{description}</li>}
            {msgList?.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
        <div className="confirmation-btn">
          {onAccept && (
            <ANTDButton
              className="bg-danger"
              onClick={onAccept}
              loader={acceptLoader}
            >
              {t('btn_Yes')}
            </ANTDButton>
          )}
          {onReject && (
            <ANTDButton className="bg-view" onClick={onReject}>
              {t('btn_No')}
            </ANTDButton>
          )}
        </div>
      </div>
    </ANTDModal>
  )
}

export default PopUpConfirm
