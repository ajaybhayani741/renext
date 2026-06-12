import React, { useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import pathName from '../../../routing/pathName.constant'
import ANTDFloatButton from '../../../shared/antd/ANTDFloatButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { userWiseRole } from '../../../utils/constant'
import { manualIcon, technicalIcon } from '../../../utils/icons'
import { include, isEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import EmbedPDFViewer from '../../common/presentation/EmbedPDFViewer'
import HOSTManual from '../../home/HOSTManual.pdf'

const FloatButtonUI = () => {
  const { t } = useTranslations()
  const { location } = useRouter()
  const { selector } = useRedux()
  const [helpModal, setHelpModal] = useState(false)
  const [technicalModal, setTechnicalModal] = useState(false)
  const { inspectionOfficer, districtCollector } = userWiseRole
  const isDesktop = selector(state => state.app.isDesktop)
  const userData = JSON.parse(getItem('userData') || '{}')
  const { roleId } = userData || {}
  const activeItem = location.pathname
  const showOnCurrentScreen = include([pathName.HOME, pathName.JOBS], activeItem)

  const handleFloatModal = () => {
    setHelpModal(prev => !prev)
  }

  const handleTechnicalModal = () => {
    setTechnicalModal(prev => !prev)
  }

  const showFloatButtons =
    showOnCurrentScreen && include([inspectionOfficer, districtCollector], roleId)
  const showManualButton =
    showOnCurrentScreen && isEqual(roleId, inspectionOfficer)

  return (
    <div>
      {showFloatButtons && (
        <div className="jobs-float-button-group">
          <div className="jobs-float-button-list">
            {showManualButton && (
              <ANTDFloatButton
                icon={
                  <img src={manualIcon} alt="manual" className="manual-icon" />
                }
                onClick={handleFloatModal}
              />
            )}
            <ANTDFloatButton
              icon={
                <img
                  src={technicalIcon}
                  alt="technical"
                  className="technical-icon"
                />
              }
              onClick={handleTechnicalModal}
            />
          </div>
        </div>
      )}
      {helpModal && (
        <ANTDModal
          open={helpModal}
          onCancel={handleFloatModal}
          footer={[]}
          width={950}
          closable={false}
        >
          <EmbedPDFViewer src={`${HOSTManual}`} isDesktop={isDesktop} />
        </ANTDModal>
      )}
      {technicalModal && (
        <ANTDModal
          open={technicalModal}
          onCancel={handleTechnicalModal}
          footer={[]}
          title={t('txt_technicalSupport')}
        >
          <div className="technical-modal-content">
            <p>{t('txt_ForTechnicalIssuesPleaseContact')}</p>
            <ul type="circle" className="ml-15">
              <li>
                <b>Shashank</b>: +91 8985878263
              </li>
              {/* <li>
                <b>Vishal</b>: +91 9769474676
              </li> */}
              <li>
                <b>Mahit</b>: +91 9642245339
              </li>
            </ul>
          </div>
        </ANTDModal>
      )}
    </div>
  )
}

export default FloatButtonUI
