import React from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import ANTDModal from '../../../../shared/antd/ANTDModal'

const ReportView = ({ reportView, setReportView }) => {
  const { isOpen, reportLink } = { ...reportView }
  const { t } = useTranslations()
  return (
    <div>
      <ANTDModal
        centered
        open={isOpen}
        onCancel={() => setReportView({ isOpen: false, reportLink: '' })}
        footer={false}
        width={980}
        closable={false}
      >
        <>
          {reportLink ? (
            <iframe
              title="report"
              src={reportLink}
              height="750px"
              width="100%"
            />
          ) : (
            <div className="job-view-report-modal" hidden={reportLink}>
              <h1>{t('msg_NoReportAvailable')}</h1>
            </div>
          )}
        </>
      </ANTDModal>
    </div>
  )
}

export default ReportView
