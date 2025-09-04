import { Fragment } from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import ANTDDivider from '../../../../shared/antd/ANTDDivider'
import { entries } from '../../../../utils/javascript'

const DetailListView = ({ infoData, title = 'txt_Details' }) => {
  const { t } = useTranslations()

  return (
    <>
      <h2 className="content-title">{t(title)}</h2>
      <div className="info-wrapper">
        {entries(infoData)?.map(([key, info]) => (
          <Fragment key={key}>
            <h3 className="mb-5">
              <b>{t(key)}</b>
            </h3>
            <table className="basic-info-job-table">
              <tbody>
                <tr className="basic-table-job-info">
                  <td colSpan={2}>
                    <table className="basic-job-table">
                      <tbody>
                        {info?.map((value, index) => (
                          <tr key={index} className={value?.classNames}>
                            <td>{t(value.label)}</td>
                            <td>{`: ${value?.value || '-'}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <ANTDDivider className="mt-10 mb-10" />
          </Fragment>
        ))}
      </div>
    </>
  )
}

export default DetailListView
