import React from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import ANTDTag from '../../../../shared/antd/ANTDTag'
import { dayJs, DISPLAY_DATE_FORMAT } from '../../../../utils/dayjs'
import { editImage, pdfImage, ShareAltOutlined } from '../../../../utils/icons'
import { certTagProp } from '../../jobs.description'

const JobReportUI = ({
  val,
  onPdfClick,
  reportLink,
  onShareClick,
  isUpdatedDate,
  hideShareUpdate,
  onUpdateClick,
  tags,
}) => {
  const { t } = useTranslations()
  return (
    <>
      <div className="d-flex">
        <h3 className="primary-title nowrap">{t(val?.title)}</h3>
        {tags?.map((tag, i) => (
          <ANTDTag
            key={i}
            color={certTagProp?.[tag]?.color}
            className="cert-tag-style mb-10 ml-10"
          >
            {t(certTagProp?.[tag]?.text)}
          </ANTDTag>
        ))}
      </div>
      <div
        // className={`icons-wrapper ${!reportLink ? 'disable-View' : ''} d-flex`}
        className={`icons-wrapper d-flex`}
      >
        <span
          className="inner-wrapper"
          onClick={() => onPdfClick({ reportLink })}
        >
          <span className="icon">
            <img src={pdfImage} alt="report" />
          </span>
          <p className="mb-0 mt-5 text-center">{t('cert_Display')}</p>
        </span>
        {!hideShareUpdate && (
          <>
            <span
              className="inner-wrapper"
              onClick={() => onShareClick({ reportLink })}
            >
              <span className="icon">
                <ShareAltOutlined />
              </span>
              <p className="mb-0 mt-10 text-center">{t('cert_Share')}</p>
            </span>

            <span className="inner-wrapper" onClick={() => onUpdateClick()}>
              <span className="icon">
                <img src={editImage} alt="report" />
              </span>
              <p className="mt-5 mb-0 text-center">{t('btn_Update')}</p>
            </span>
          </>
        )}
      </div>
      {isUpdatedDate && (
        <div className="d-flex space-between mt-10 mb-10">
          <h3 className="ml-15">
            <b>{t('job_UpdatedOn')}</b> : {dayJs().format(DISPLAY_DATE_FORMAT)}
          </h3>
        </div>
      )}
    </>
  )
}

export default JobReportUI
