import { useEffect, useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDTable from '../../../shared/antd/ANTDTable'
import { downloadReport } from '../../../utils/customFunctions'
import { excelIcon } from '../../../utils/icons'
import { getExcelReportListApi } from '../report.api'

const ViewPreviousHistoryModal = ({
  open,
  onClose,
  payload,
  hideStartDate = false,
  hideEndDate = false,
}) => {
  const { t } = useTranslations()
  const [reportList, setReportList] = useState([])
  const [loader, setLoader] = useState(false)
  const columns = [
    {
      title: t('rpt_StartDate'),
      dataIndex: 'fromDate',
      hidden: hideStartDate,
    },
    {
      title: t('rpt_EndDate'),
      dataIndex: 'toDate',
      hidden: hideEndDate,
    },
    {
      title: t('rpt_CreatedDate'),
      dataIndex: 'dmsDetails',
      render: rowData => rowData?.modificationDate || '-',
    },
    {
      title: t('job_Status'),
      dataIndex: 'status',
    },
    {
      title: 'Excel',
      dataIndex: 'dmsDetails',
      render: rowData => (
        <img
          src={excelIcon}
          alt="excel"
          height={60}
          width={55}
          onClick={() => downloadReport(rowData?.fileUrl)}
          className={rowData?.fileUrl ? 'cursor-pointer' : 'disabled-illusion'}
        />
      ),
    },
  ].filter(({ hidden }) => !hidden)

  useEffect(() => {
    if (open) {
      getReportList({})
    }
  }, [open])

  const getReportList = async ({ pageNo = 1 } = {}) => {
    if (!payload?.reportType) return

    setLoader(true)
    try {
      const response = await getExcelReportListApi({
        pageNo,
        params: payload,
      })
      if (response?.data) {
        setReportList(response?.data)
      }
    } catch (error) {
    } finally {
      setLoader(false)
    }
  }

  const handleTableChange = pagination => {
    getReportList({ pageNo: pagination?.current })
  }

  return (
    <ANTDModal
      title={t('rpt_ReportHistorySheet')}
      centered
      open={open}
      onCancel={onClose}
      footer={false}
      width={1000}
      destroyOnClose={true}
    >
      <div className="mt-10">
        <ANTDTable
          dataSource={reportList?.list}
          columns={columns}
          onChange={handleTableChange}
          loading={loader}
        />
      </div>
    </ANTDModal>
  )
}

export default ViewPreviousHistoryModal
