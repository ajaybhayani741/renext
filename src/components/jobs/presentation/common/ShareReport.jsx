import React from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import ANTDButton from '../../../../shared/antd/ANTDButton'
import ANTDForm, { ANTDFormItem } from '../../../../shared/antd/ANTDForm'
import ANTDImage from '../../../../shared/antd/ANTDImage'
import ANTDInput from '../../../../shared/antd/ANTDInput'
import ANTDModal from '../../../../shared/antd/ANTDModal'
import { noImage } from '../../../../utils/icons'
import { shareCertificateFields } from '../../jobs.description'

const ShareReport = ({
  shareReport,
  setShareReport,
  onFinish,
  onValuesChange,
  shareCertificateForm,
  loader,
}) => {
  const { isOpen, reportLink } = { ...shareReport }
  const { t } = useTranslations()

  return (
    <div>
      <ANTDModal
        centered
        title={t('cert_Share')}
        open={isOpen}
        onCancel={() => setShareReport({ isOpen: false, report: {} })}
        footer={false}
        width={980}
        closable={false}
      >
        <>
          <div>
            <h3>1. {t('job_ScanQRCode')} :</h3>
            <p className="text-center">
              <ANTDImage
                height={250}
                width={250}
                src={reportLink?.reportQr || noImage}
              />
            </p>
          </div>
          <ANTDForm
            form={shareCertificateForm}
            name="shareCertificateForm"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            autoComplete="off"
            layout="vertical"
          >
            {shareCertificateFields(t).map((field, index) => (
              <>
                <h3>
                  {index + 2}. {t(field.label)} :
                </h3>
                <ANTDFormItem
                  key={field.name}
                  name={field.name}
                  rules={[
                    ...(field.validation && field.validation.rules
                      ? field.validation.rules
                      : []),
                  ]}
                >
                  <ANTDInput />
                </ANTDFormItem>
              </>
            ))}
            <ANTDFormItem className="d-flex justify-center">
              <ANTDButton
                type="primary"
                htmlType="submit"
                loading={loader?.share}
              >
                {t('cert_Share')}
              </ANTDButton>
            </ANTDFormItem>
          </ANTDForm>
        </>
      </ANTDModal>
    </div>
  )
}

export default ShareReport
