import { useEffect, useState } from 'react'

import CreateReport from './CreateReport'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDBreadcrumb from '../../../shared/antd/ANTDBreadcrumb'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDSwitch from '../../../shared/antd/ANTDSwitch'
import ANTDTable from '../../../shared/antd/ANTDTable'
import { dayJs, DISPLAY_DATE_FORMAT } from '../../../utils/dayjs'
import { length } from '../../../utils/javascript'
import {
  getSaveReportListApi,
  getSingleReportApi,
  updateFlexibleReportApi,
} from '../report.api'

const SavedReports = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const [editMode, setEditMode] = useState({ flag: false, reportData: {} })
  const [dataSource, setDataSource] = useState({ list: [] })
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    getSaveReportList({ pageNo: 1 })
  }, [])

  const getSaveReportList = async ({ pageNo = 1 }) => {
    setLoader(true)
    const response = await getSaveReportListApi({ pageNo, params: { storeId } })
    if (response?.data) {
      setDataSource(response?.data)
    }
    setLoader(false)
  }

  const handleTableChange = pagination => {
    getSaveReportList({ pageNo: pagination?.current })
  }

  const getSingleReportAPI = async ({ rowData }) => {
    const response = await getSingleReportApi({ params: { id: rowData?.id } })
    if (response?.data) {
      setEditMode({ flag: true, reportData: response?.data })
    }
  }

  const onEmailOptToggle = async ({ checked, rowData }) => {
    const response = await updateFlexibleReportApi({
      payload: {
        id: rowData?.id,
        sendEmail: checked,
      },
    })
    if (response?.data?.success) {
      getSaveReportList({ pageNo })
    }
  }

  const columns = [
    {
      key: 'user_Name',
      title: t('user_Name'),
      render: rowData => {
        return (
          <ANTDButton
            type="link"
            onClick={() => getSingleReportAPI({ rowData })}
          >
            {rowData?.name}
          </ANTDButton>
        )
      },
    },
    {
      key: 'inv_Description',
      title: t('inv_Description'),
      dataIndex: 'description',
      render: rowData => rowData || '-',
    },
    {
      key: 'job_CreatedBy',
      title: t('job_CreatedBy'),
      dataIndex: 'userInfo',
      render: rowData => rowData?.businessName || rowData?.name || '-',
    },
    {
      key: 'inv_DateOfCreation',
      title: t('inv_DateOfCreation'),
      dataIndex: 'creationDate',
      render: rowData => {
        return rowData ? dayJs(rowData).format(DISPLAY_DATE_FORMAT) : '-'
      },
    },
    {
      title: t('rpt_OptInForEmail'),
      key: 'rpt_OptInForEmail',
      render: rowData => {
        return (
          <div className="flex-nowrap d-flex">
            <ANTDSwitch
              onChange={checked =>
                onEmailOptToggle({
                  checked,
                  rowData,
                })
              }
              checked={rowData?.sendEmail}
              className="mt-5"
            />
          </div>
        )
      },
    },
  ]

  const PAGE_SIZE = 10
  const { list = [], lastPage, pageNo } = dataSource || {}

  return (
    <>
      {editMode.flag ? (
        <>
          <ANTDBreadcrumb
            separator={<span className="c-white">/</span>}
            items={[
              {
                title: (
                  <p
                    className="cursor-pointer primary-color"
                    onClick={() => setEditMode({ flag: false, reportData: {} })}
                  >
                    {t('rpt_SavedReports')}
                  </p>
                ),
              },

              {
                title: <p className="c-white">{editMode.reportData.name}</p>,
              },
            ]}
          />

          <CreateReport editData={editMode.reportData} />
        </>
      ) : (
        <ANTDTable
          className="mt-15"
          tableLayout="fixed"
          columns={columns}
          loading={loader}
          dataSource={
            length(list)
              ? list?.map(item => ({
                  ...item,
                  key: item?.id,
                }))
              : []
          }
          pagination={{
            lastFetched: pageNo,
            current: pageNo,
            pageSize: PAGE_SIZE,
            total: lastPage * PAGE_SIZE,
            responsive: true,
            hideOnSinglePage: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 'max-content' }}
          onChange={handleTableChange}
        />
      )}
    </>
  )
}

export default SavedReports
