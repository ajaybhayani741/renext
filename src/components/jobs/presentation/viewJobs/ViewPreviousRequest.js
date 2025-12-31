import React, { Fragment, useEffect, useState } from 'react'

import excelIcon from '../../../../assets/excel.png'
import useRedux from '../../../../hooks/useRedux'
import useTranslations from '../../../../hooks/useTranslations'
import ANTDCard from '../../../../shared/antd/ANTDCard'
import ANTDPagination from '../../../../shared/antd/ANTDPagination'
import ANTDSpin from '../../../../shared/antd/ANTDSpin'
import ANTDTable from '../../../../shared/antd/ANTDTable'
import { downloadReport } from '../../../../utils/customFunctions'
import { length, notEqual, ternary } from '../../../../utils/javascript'
import { getMasterSheetApi } from '../../jobs.api'

const ViewPreviousRequest = ({ sheetType, modal }) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
  const [sheetData, setSheetData] = useState({ loader: false })

  const getRequestSheetData = async ({ pageNo = 1 } = {}) => {
    setSheetData(prev => ({ ...prev, loader: true }))
    try {
      const resp = await getMasterSheetApi({
        pageNo,
        params: { type: sheetType },
      })
      if (resp?.data) {
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
    if (modal?.open && sheetType) {
      getRequestSheetData({ pageNo: 1 })
    }
  }, [modal?.open, sheetType])

  const handleTableChange = pagination => {
    getRequestSheetData({ pageNo: pagination?.current || 1 })
  }

  const columns = [
    {
      title: t('rpt_StartDate'),
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: rowData => rowData || '-',
    },
    {
      title: t('rpt_EndDate'),
      dataIndex: 'toDate',
      key: 'toDate',
      render: rowData => rowData || '-',
    },
    {
      title: t('rpt_CreatedDate'),
      dataIndex: 'dmsDetails',
      key: 'createdDate',
      render: rowData => {
        return rowData?.modificationDate || '-'
      },
    },
    {
      title: t('job_Status'),
      dataIndex: 'status',
      key: 'status',
      render: rowData => rowData || '-',
    },
    {
      title: 'Excel',
      dataIndex: 'dmsDetails',
      key: 'excel',
      render: (rowData, record) => {
        return getExcelIcon(rowData, record)
      },
    },
  ]

  const getExcelIcon = (rowData, item) => {
    const fileUrl = rowData?.fileUrl || item?.dmsDetails?.fileUrl
    const fileName = rowData?.fileName || item?.dmsDetails?.fileName
    return (
      <img
        src={excelIcon}
        alt="excel"
        height={30}
        width={30}
        onClick={() => fileUrl && downloadReport(fileUrl, fileName, 'xls')}
        className={fileUrl ? 'cursor-pointer' : 'disabled-illusion'}
        style={{
          cursor: fileUrl ? 'pointer' : 'not-allowed',
          opacity: fileUrl ? 1 : 0.5,
        }}
      />
    )
  }

  const scrollElem = document.querySelector('.main-layout > main')

  return (
    <div className="mt-10">
      {ternary(
        isDesktop,
        <ANTDTable
          dataSource={sheetData?.list?.map((item, index) => ({
            ...item,
            key: item?.id || index,
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
        />,
        <div>
          {sheetData?.loader && (
            <div className="opacity-loader fixed-loader">
              <ANTDSpin size="large" />
            </div>
          )}
          {length(sheetData?.list)
            ? sheetData?.list?.map((item, index) => (
                <Fragment key={item?.id || index}>
                  <ANTDCard
                    className="list-card-view"
                    style={{
                      marginBottom:
                        index === sheetData?.list?.length - 1 ? '0' : '',
                    }}
                    title={null}
                    extra={getExcelIcon(item?.dmsDetails, item)}
                  >
                    <div className="card-details-container">
                      <div>
                        <table>
                          <tbody>
                            {columns?.map(
                              ({ render, ...value }) =>
                                notEqual(value?.key, 'excel') && (
                                  <tr key={value?.key}>
                                    <td>
                                      <b>{value?.title}</b>
                                    </td>
                                    <td>
                                      : {render(item?.[value?.dataIndex])}
                                    </td>
                                  </tr>
                                ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </ANTDCard>
                </Fragment>
              ))
            : !sheetData?.loader && (
                <ANTDCard className="list-card-view">
                  <h4 className="text-center">{t('txt_NoData')}</h4>
                </ANTDCard>
              )}
          <div className="pagination-container">
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
        </div>,
      )}
    </div>
  )
}

export default ViewPreviousRequest
