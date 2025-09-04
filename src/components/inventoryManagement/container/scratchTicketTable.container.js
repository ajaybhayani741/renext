import { useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { dayJs, DISPLAY_DATE_FORMAT } from '../../../utils/dayjs'
import { notEqual } from '../../../utils/javascript'

const scratchTicketTable = ({ type }) => {
  const { t } = useTranslations()
  const [viewSingleInventory, setViewSingleInventory] = useState({
    open: false,
    details: {},
  })

  const handleView = ({ rowData }) => {
    if (rowData) {
      setViewSingleInventory({ open: true, details: rowData })
    } else {
      setViewSingleInventory({ open: false, details: {} })
    }
  }

  const columns = [
    // {
    //   title: t('inv_BatchNumber'),
    //   dataIndex: 'batchNumber',
    //   key: 'batchNumber',
    // },
    {
      title: t('inv_BoxNumber'),
      dataIndex: 'sequentialId',
      key: 'inv_BoxNumber',
    },
    // {
    //   title: t('rpt_BookName'),
    //   dataIndex: 'bookName',
    //   key: 'bookName',
    // },
    {
      title: t('bkm_GameNumber'),
      dataIndex: 'gameNumber',
      key: 'bkm_GameNumber',
    },
    {
      title: t('bkm_BookNumber'),
      dataIndex: 'bookNumber',
      key: 'bkm_BookNumber',
    },
    {
      title: t('inv_AmountType'),
      dataIndex: 'amount',
      key: 'inv_AmountType',
      render: rawData => (rawData ? `$${rawData}` : '-'),
    },
    {
      title: t('inv_EndTicket'),
      dataIndex: 'endTicket',
      key: 'endTicket',
      hidden: notEqual(type, 'available'),
    },
    {
      title: t('inv_EndingNumber'),
      dataIndex: 'endingNo',
      key: 'inv_EndingNumber',
      hidden: notEqual(type, 'available'),
    },
    {
      title: t('inv_BoxCompletionDate'),
      dataIndex: 'modificationDate',
      key: 'inv_BoxCompletionDate',
      hidden: notEqual(type, 'used'),
      render: rawData =>
        rawData ? dayJs(rawData).format(DISPLAY_DATE_FORMAT) : '-',
    },
    {
      title: t('inv_LastUpdatedBy'),
      dataIndex: ['userInfo', 'businessName'],
      key: 'inv_LastUpdatedBy',
    },
    {
      title: t('txt_Action'),
      key: 'txt_Action',
      render: rowData => {
        return (
          <div className="flex-nowrap d-flex">
            <ANTDButton
              className="bg-view"
              onClick={() => handleView({ rowData })}
            >
              {t('btn_View')}
            </ANTDButton>
          </div>
        )
      },
    },
  ]

  return { t, columns, viewSingleInventory, handleView }
}

export default scratchTicketTable
