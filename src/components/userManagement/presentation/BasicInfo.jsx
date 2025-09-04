import React from 'react'

import Emails from './Emails'
import useTranslations from '../../../hooks/useTranslations'
import { noImage } from '../../../utils/icons'
import { include, isEqual, length, values } from '../../../utils/javascript'

function BasicInfo({ basicInfoData, otherDetail, userDetails, getEmailList }) {
  const { t } = useTranslations()
  return (
    <div className="info-wrapper">
      <table width="100%" className="basic-info-table">
        <tbody>
          <tr className="basic-table-user-info">
            <td colSpan={2}>
              <table width="100%" className="basic-user-table">
                <tbody>
                  {basicInfoData.map((value, index) =>
                    !value?.hidden ? (
                      <tr key={index} className={value?.classNames}>
                        <td>{t(value.label)}</td>
                        {isEqual(value.type, 'email') ? (
                          <td>
                            {length(values(getEmailList())) ? (
                              <Emails
                                values={values(getEmailList())}
                                basicEmail={`: ${value?.value || '-'}`}
                              />
                            ) : (
                              <>
                                <span className="vertical-middle"> : </span>
                                {value?.value || '-'}
                              </>
                            )}
                          </td>
                        ) : (
                          <td>
                            <>
                              <span className="vertical-middle"> : </span>
                              {value?.value || '-'}
                            </>
                          </td>
                        )}
                        {value?.icon ? <td>{value?.icon}</td> : null}
                      </tr>
                    ) : null,
                  )}
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <img
                        src={userDetails?.profile?.fileUrl || noImage}
                        alt="user-profile"
                        className="user-profile"
                        height={300}
                        width={300}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {otherDetail?.map(
            (value, index) =>
              include(value?.permission, userDetails?.roleId) &&
              (value?.title ? (
                <h3>{t(value?.title)}</h3>
              ) : (
                <tr key={index} className={value.className}>
                  <td>{t(value.label)}</td>
                  <td colSpan={2}>
                    <div className="d-flex align-center">
                      <span className="mr-5 d-inline-block"> : </span>
                      <div>
                        {value?.value || '-'}
                        <span className="ml-5">{value?.optionValue}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )),
          )}
        </tbody>
      </table>
    </div>
  )
}

export default BasicInfo
