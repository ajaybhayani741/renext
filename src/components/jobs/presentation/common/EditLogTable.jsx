import { useState, useEffect } from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import ANTDButton from '../../../../shared/antd/ANTDButton'
import ANTDModal from '../../../../shared/antd/ANTDModal'
import ANTDTable from '../../../../shared/antd/ANTDTable'
import { dayJs } from '../../../../utils/dayjs'
import { isEqual } from '../../../../utils/javascript'
// import JobManagementContext from '../../JobManagementContext'
import { getJobEditLogApi, patchJobEditLogApi } from '../../jobs.api'
import { APPROVED, REJECTED } from '../../jobs.description'

const EditLogTable = ({
  editLogModel,
  onEditLogModelClose,
  actionPermission,
}) => {
  const { t } = useTranslations()
  // const { jobListApiCall } = useContext(JobManagementContext)
  const [editLogData, setEditLogData] = useState({})

  const { list, loading, pageNo } = editLogData
  const PAGE_SIZE = 10

  useEffect(() => {
    getEditLogData()
  }, [])

  const getEditLogData = async () => {
    setEditLogData(prev => ({ ...prev, loading: true }))
    const response = await getJobEditLogApi({
      params: {
        keyName: editLogModel?.keyName,
        scrapId: editLogModel?.scrapId,
      },
    })

    if (!response?.data)
      return setEditLogData(prev => ({ ...prev, loading: false }))

    setEditLogData(prev => ({ ...prev, loading: false, ...response?.data }))
  }

  const handleTableChange = pagination => {
    setEditLogData(prev => ({ ...prev, pageNo: pagination.current }))
  }

  const handleActionChange = async (rowData, status) => {
    setEditLogData(prev => ({ ...prev, loading: true }))
    const response = await patchJobEditLogApi({
      payload: {
        editLogId: rowData?.id,
        keyName: rowData?.keyName,
        scrapId: rowData?.scrapId,
        jobId: rowData?.jobId,
        approved: status === APPROVED,
      },
    })

    setEditLogData(prev => ({ ...prev, loading: false }))
    return response?.data
  }

  const onApproveClick = async rowData => {
    const response = await handleActionChange(rowData, APPROVED)
    if (!response?.success) return
    const { dependentKey, dependentKeyValue } = response
    onEditLogModelClose({
      status: APPROVED,
      updatedValue: rowData?.requestedValue,
      dependentData: {
        [dependentKey]: dependentKeyValue,
      },
    })
    setEditLogData(prev => {
      const newList = prev?.list?.map(item => {
        if (item.id === rowData.id) {
          item.status = APPROVED
        }
        return item
      })
      return { ...prev, list: newList }
    })
    // jobListApiCall && jobListApiCall()
  }

  const onRejectClick = async rowData => {
    const response = await handleActionChange(rowData, REJECTED)
    if (!response) return
    onEditLogModelClose({
      status: REJECTED,
    })
    setEditLogData(prev => {
      const newList = prev?.list?.map(item => {
        if (item.id === rowData.id) {
          item.status = REJECTED
        }
        return item
      })
      return { ...prev, list: newList }
    })
    // jobListApiCall && jobListApiCall()
  }

  const valueRender = value => {
    const { record } = editLogModel || {}

    switch (record?.inputType) {
      case 'select':
        return t(
          record?.options?.find(
            item => item?.value?.toString() === value?.toString(),
          )?.label,
        )
      case 'dateTimePicker':
        return value ? dayJs(value, 'DD/MM/YYYY').format('YYYY/MM/DD') : '-'

      default:
        return value || isEqual(value, 0) ? value : '-'
    }
  }

  const columns = [
    {
      title: '#',
      render: (_, __, index) =>
        (pageNo ? pageNo - 1 : 0) * PAGE_SIZE + index + 1,
    },
    {
      title: t('txt_DateAndTime'),
      dataIndex: 'creationDate',
      render: rowData =>
        rowData ? dayJs(rowData).format('YYYY/MM/DD HH:mm:ss') : '-',
    },
    {
      title: t('txt_PreviousValue'),
      dataIndex: 'previousValue',
      render: valueRender,
    },
    {
      title: t('txt_NewValue'),
      dataIndex: 'requestedValue',
      render: valueRender,
    },
    {
      title: t('txt_EditedBy'),
      dataIndex: 'requestedByInfo',
      render: rowData => rowData?.businessName || rowData?.lastName,
    },
    {
      title: t('inv_Location'),
      dataIndex: 'address',
      render: rowData => rowData || '-',
    },
    {
      title: t('job_Status'),
      dataIndex: 'status',
    },
    {
      title: t('txt_Action'),
      align: 'center',
      hidden: !actionPermission,
      render: rowData => {
        if (rowData.status !== 'PENDING') return '-'
        return (
          <div className="d-flex flex-nowrap">
            <ANTDButton
              className="btn-approve"
              onClick={() => onApproveClick(rowData)}
            >
              {t('btn_Approve')}
            </ANTDButton>
            <ANTDButton
              className="btn-reject"
              onClick={() => onRejectClick(rowData)}
            >
              {t('btn_Reject')}
            </ANTDButton>
          </div>
        )
      },
    },
  ]

  return (
    <ANTDModal
      title={t('txt_EditLog')}
      centered
      open={editLogModel?.open}
      onCancel={onEditLogModelClose}
      footer={false}
      width={1000}
      destroyOnClose={true}
    >
      <div className="mt-10">
        <ANTDTable
          loading={loading}
          dataSource={list?.map(item => ({ ...item, key: item?.id }))}
          columns={columns}
          onChange={handleTableChange}
          pagination={{
            // lastFetched: pageNo,
            // current: pageNo,
            pageSize: PAGE_SIZE,
            // total: lastPage * PAGE_SIZE,
            responsive: true,
            hideOnSinglePage: true,
          }}
          scroll={{ x: 900 }}
        />
      </div>
    </ANTDModal>
  )
}

export default EditLogTable
