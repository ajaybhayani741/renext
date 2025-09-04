import { Collapse } from 'antd'
import React, { memo } from 'react'

import useTranslations from '../../../hooks/useTranslations'

const Emails = ({ values = [], basicEmail }) => {
  const { t } = useTranslations()
  return (
    <>
      <Collapse
        items={[
          {
            key: '1',
            label: basicEmail || '-',
            children: (
              <table>
                {values?.map((val, index) => (
                  <tr key={index}>
                    <td>{`${t(`user_Email`)} ${index + 1}`}</td>
                    <td>{`: ${val || '-'} `}</td>
                  </tr>
                ))}
              </table>
            ),
          },
        ]}
        className="email-list"
      />
    </>
  )
}

export default memo(Emails)
