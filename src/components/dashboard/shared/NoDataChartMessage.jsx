import React from 'react'

import useTranslations from '../../../hooks/useTranslations'

const NoDataChartMessage = ({ height = '100%' }) => {
  const { t } = useTranslations()

  return (
    <div
      style={{
        alignItems: 'center',
        color: '#64748b',
        display: 'flex',
        fontSize: 14,
        fontWeight: 600,
        height,
        justifyContent: 'center',
        left: 0,
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        width: '100%',
      }}
    >
      {t('msg_NoData')}
    </div>
  )
}

export default NoDataChartMessage
