import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDModal from '../../../shared/antd/ANTDModal'

const PDFViewer = ({ viewPdf, closeModal }) => {
  const { t } = useTranslations()
  return (
    <div>
      <ANTDModal
        open={viewPdf?.flag}
        width={750}
        onCancel={closeModal}
        closable={false}
        footer={[]}
      >
        <div>
          {viewPdf?.fileUrl ? (
            <iframe
              title="s1"
              src={viewPdf?.fileUrl}
              height="750px"
              width="100%"
            />
          ) : (
            <div hidden={viewPdf?.fileUrl}>
              <h1>{t('noReportAvailable')}!!</h1>
            </div>
          )}
        </div>
      </ANTDModal>
    </div>
  )
}

export default PDFViewer
