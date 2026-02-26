import React, { useEffect, useState } from 'react'

import excelIcon from '../../../assets/excel.png'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDPagination from '../../../shared/antd/ANTDPagination'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import ANTDTable from '../../../shared/antd/ANTDTable'
import { downloadReport } from '../../../utils/customFunctions'
import { payloadType } from '../../jobs/jobs.description'
import { getPreviousExportRequestsApi } from '../user.api'

const ViewPreviousRequests = ({ modal }) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
  const [sheetData, setSheetData] = useState({ loader: false, list: [] })

  const getRequestSheetData = async ({ pageNo = 1 } = {}) => {
    setSheetData(prev => ({ ...prev, loader: true }))
    try {
      const resp = await getPreviousExportRequestsApi({
        pageNo,
        params: { type: payloadType?.['hostelListSheet'] },
      })
      if (resp) {
        setSheetData(prev => ({
          ...prev,
          ...resp?.data,
          loader: false,
        }))
      } else {
        setSheetData(prev => ({ ...prev, loader: false }))
      }
    } catch (error) {
      setSheetData(prev => ({ ...prev, loader: false }))
    }
  }

  useEffect(() => {
    if (modal?.open) {
      getRequestSheetData({ pageNo: 1 })
    } else {
      setSheetData({ loader: false, list: [] })
    }
  }, [modal])

  const handleTableChange = pagination => {
    getRequestSheetData({ pageNo: pagination?.current || 1 })
  }

  const columns = [
    {
      title: t('rpt_StartDate'),
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: val => val || '-',
    },
    {
      title: t('rpt_EndDate'),
      dataIndex: 'toDate',
      key: 'toDate',
      render: val => val || '-',
    },
    {
      title: t('rpt_CreatedDate'),
      dataIndex: 'dmsDetails',
      key: 'createdDate',
      render: rowData => rowData?.modificationDate || '-',
    },
    {
      title: t('job_Status'),
      dataIndex: 'status',
      key: 'status',
      render: val => val || '-',
    },
    {
      title: t('user_Excel'),
      dataIndex: 'dmsDetails',
      key: 'excel',
      render: (rowData, record) => {
        const fileUrl = rowData?.fileUrl || record?.dmsDetails?.fileUrl
        const fileName = rowData?.fileName || record?.dmsDetails?.fileName
        return (
          <img
            src={excelIcon}
            alt="excel"
            width={60}
            className="cursor-pointer"
            onClick={e => {
              e.preventDefault()
              downloadReport(fileUrl, fileName, 'xls')
            }}
          />
        )
      },
    },
  ]

  const getExcelIcon = (rowData, record) => {
    const fileUrl = rowData?.fileUrl || record?.dmsDetails?.fileUrl
    const fileName = rowData?.fileName || record?.dmsDetails?.fileName

    return (
      <img
        src={excelIcon}
        alt="excel"
        width={60}
        className={fileUrl ? 'cursor-pointer' : 'disabled-illusion'}
        style={{
          cursor: fileUrl ? 'pointer' : 'not-allowed',
          opacity: fileUrl ? 1 : 0.5,
        }}
        onClick={e => {
          e.preventDefault()
          if (fileUrl) {
            downloadReport(fileUrl, fileName, 'xls')
          }
        }}
      />
    )
  }

  const scrollElem = document.querySelector('.main-layout > main')
  const list = sheetData?.list || []

  return (
    <div className="mt-10">
      {isDesktop ? (
        <ANTDTable
          dataSource={list.map((item, index) => ({
            ...item,
            key: item?.id ?? index,
          }))}
          columns={columns}
          onChange={handleTableChange}
          loading={sheetData?.loader}
          pagination={{
            current: sheetData?.pageNo || 1,
            pageSize: sheetData?.pageSize || 10,
            total: (sheetData?.lastPage || 1) * (sheetData?.pageSize || 10),
            responsive: true,
            hideOnSinglePage: true,
          }}
        />
      ) : (
        <div>
          {sheetData?.loader && (
            <div className="opacity-loader fixed-loader">
              <ANTDSpin size="large" />
            </div>
          )}
          {list.length
            ? list.map((item, index) => (
                <ANTDCard
                  key={item?.id ?? index}
                  className="list-card-view mb-10"
                  style={{
                    marginBottom: index === list.length - 1 ? '0' : '',
                  }}
                  title={null}
                  extra={getExcelIcon(item?.dmsDetails, item)}
                >
                  <div className="card-details-container">
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <b>{t('rpt_StartDate')}</b>
                          </td>
                          <td>: {item?.fromDate || '-'}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>{t('rpt_EndDate')}</b>
                          </td>
                          <td>: {item?.toDate || '-'}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>{t('job_Status')}</b>
                          </td>
                          <td>: {item?.status || '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </ANTDCard>
              ))
            : !sheetData?.loader && (
                <ANTDCard className="list-card-view">
                  <h4 className="text-center">{t('txt_NoData')}</h4>
                </ANTDCard>
              )}
          <div className="pagination-container mt-10">
            <ANTDPagination
              current={sheetData?.pageNo || 1}
              pageSize={sheetData?.pageSize || 10}
              total={(sheetData?.lastPage || 1) * (sheetData?.pageSize || 10)}
              showSizeChanger={false}
              responsive
              hideOnSinglePage
              onChange={current => {
                scrollElem?.scrollTo({ top: 0, behavior: 'auto' })
                handleTableChange({ current })
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewPreviousRequests
