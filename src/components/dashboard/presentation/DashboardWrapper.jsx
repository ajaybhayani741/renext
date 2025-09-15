import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDTable from '../../../shared/antd/ANTDTable'
import HightChart from '../../charts/index'
import dashboardWrapper from '../container/dashboardWrapper.container'

const DashboardWrapper = ({
  chartOptions,
  data,
  handleCloseModal,
  chartClassName,
}) => {
  const { t } = useTranslations()
  const { columns } = dashboardWrapper()

  return (
    <div className="dashboard-wrapper">
      <div className={chartClassName ?? 'chart-view'}>
        <HightChart {...chartOptions} />
      </div>
      {data?.selected && (
        <ANTDModal
          title={`${t(data?.chartData?.category)} (${data?.chartData?.type})`}
          centered
          open={data?.selected}
          onCancel={handleCloseModal}
          footer={false}
        >
          <div className="text-end mb-10">
            <ANTDButton type="primary" className="btn">
              {t('dash_ExportToPDFExcel')}
            </ANTDButton>
          </div>
          <ANTDTable
            columns={columns}
            dataSource={data?.list || []}
            pagination={false}
            size="small"
          ></ANTDTable>
        </ANTDModal>
      )}
    </div>
  )
}

export default DashboardWrapper
