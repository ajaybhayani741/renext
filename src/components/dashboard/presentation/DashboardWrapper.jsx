import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDRow from '../../../shared/antd/ANTDRow'
import ANTDTable from '../../../shared/antd/ANTDTable'
import { length } from '../../../utils/javascript'
import dashboardWrapper from '../container/dashboardWrapper.container'

const DashboardWrapper = ({
  children,
  selectedColumn,
  handleCloseModal,
  chartClassName,
}) => {
  const { t } = useTranslations()
  const { columns } = dashboardWrapper({ title: selectedColumn?.title })

  return (
    <div className="dashboard-wrapper">
      <ANTDRow
        gutter={[16, 12]}
        className={`${chartClassName ?? ''} text-center chart-view`}
      >
        {children}
      </ANTDRow>
      {selectedColumn?.selected && (
        <ANTDModal
          title={
            selectedColumn?.modalTitle
              ? `${t(selectedColumn?.chartData?.category)} ${selectedColumn?.chartData?.type ? `(${selectedColumn?.chartData?.type})` : ''}`
              : t('txt_Details')
          }
          centered
          open={selectedColumn?.selected}
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
            dataSource={
              length(selectedColumn?.list)
                ? selectedColumn?.list?.map((item, ind) => ({
                    ...item,
                    key: ind,
                  }))
                : []
            }
            pagination={false}
            size="small"
          ></ANTDTable>
        </ANTDModal>
      )}
    </div>
  )
}

export default DashboardWrapper
