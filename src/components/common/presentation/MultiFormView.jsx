import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'
import { entries, length } from '../../../utils/javascript'

const MultiFormView = ({ formValue, title, formKeys }) => {
  const { t } = useTranslations()
  return (
    <ANTDCard className="mt-10">
      <table className="w-100">
        <tbody>
          {length(formValue)
            ? formValue?.map((value, index) => (
                <div key={index} className="mb-10 grey-card-body">
                  <h3 className="primary-color">{`${t(title)} ${
                    index + 1
                  }`}</h3>
                  {entries(formKeys)?.map(([key, label]) => (
                    <>
                      <tr key={key}>
                        <td>
                          <b>{t(label)}</b>
                        </td>
                        <td>{`: ${
                          t(
                            typeof value?.[key] === 'object'
                              ? value?.[key]
                              : t(value?.[key]),
                          ) || '-'
                        }`}</td>
                      </tr>
                    </>
                  ))}
                </div>
              ))
            : null}
        </tbody>
      </table>
    </ANTDCard>
  )
}

export default MultiFormView
