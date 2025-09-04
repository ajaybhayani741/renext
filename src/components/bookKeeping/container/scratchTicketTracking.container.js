import { MinusOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { userWiseRole } from '../../../utils/constant'
import debounce from '../../../utils/debounce'
import { include, nullOrUndefined } from '../../../utils/javascript'
import {
  addBookApi,
  deleteBookApi,
  getScratchTicketListApi,
  getTotalValuesApi,
  searchScratchTicketListApi,
  updateScratchTicketApi,
} from '../bookKeeping.api'

const scratchTicketTracking = ({ readOnly, shiftId }) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const loginUserDetails = selector(state => state.user?.profile_details)
  const [dataSource, setDataSource] = useState({ list: [], loader: false })
  const [totalValues, setTotalValues] = useState({})
  const searchVal = useRef(null)
  const [loader, setLoader] = useState(false)

  const { admin, storeOwner } = userWiseRole
  const addRemovePermission = include(
    [admin, storeOwner],
    loginUserDetails?.roleId,
  )

  const PAGE_SIZE = 10

  useEffect(() => {
    if (storeId) {
      getScratchTicketListCall()
      getTotalValues()
    }
  }, [storeId])

  const getTotalValues = async () => {
    const response = await getTotalValuesApi({
      params: { storeId, shiftId },
    })
    if (response?.data) {
      setTotalValues(response?.data)
    }
  }

  const getScratchTicketListCall = async ({ pageNo = 1 } = {}) => {
    setDataSource(prev => ({ ...prev, loader: true }))
    const searchText = searchVal.current?.trim()
    const params = {
      storeId,
      shiftId,
      pageSize: PAGE_SIZE,
    }
    const response = searchText
      ? await searchScratchTicketListApi({
          pageNo,
          params: {
            ...params,
            searchValue: searchText,
          },
        })
      : await getScratchTicketListApi({
          pageNo,
          params,
        })

    setDataSource(prev => ({ ...response?.data, loader: false }))
  }

  const onSearch = debounce(async e => {
    const { value } = e.target
    searchVal.current = value?.trim()
    getScratchTicketListCall()
  }, 600)

  const handleTableChange = pagination => {
    getScratchTicketListCall({ pageNo: pagination?.current })
  }

  const calcTicketSold = rowData => {
    const { endingNo, startingNo } = rowData || {}
    return (endingNo || 0) - (startingNo || 0)
  }

  const calcTotalAmountSold = rowData => {
    const { ticketSold, amount } = rowData || {}
    const num = parseFloat(amount) || 0
    return (ticketSold || 0) * num
  }

  const onRemoveClick = async data => {
    setLoader(true)
    const response = await deleteBookApi({ params: { id: data?.id } })
    setLoader(false)
    if (!response?.data?.success) return
    getScratchTicketListCall()
  }

  const handleSave = async values => {
    const ticketSold = calcTicketSold(values)
    const totalAmount = calcTotalAmountSold({ ...values, ticketSold })
    const payload = {
      systemId: values?.id,
      endingNumber: values?.endingNo,
      ticketSold,
      totalAmount,
    }
    const currentBox = dataSource?.list?.find(val => val?.id === values?.id)
    const cloneCurrentBox = { ...currentBox }
    setDataSource(prev => {
      const cloneSource = { ...prev }
      const index = cloneSource?.list?.findIndex(val => val.id === values?.id)
      cloneSource.list[index] = {
        ...values,
        ticketSold,
        totalAmount,
      }
      return cloneSource
    })

    const response = await updateScratchTicketApi({ payload })

    if (!response?.data?.success) {
      setDataSource(prev => {
        const cloneSource = { ...prev }
        const index = cloneSource?.list?.findIndex(val => val.id === values?.id)
        cloneSource.list[index] = cloneCurrentBox
        return cloneSource
      })
    }
    getTotalValues()
  }

  const onAddNewBookClick = async rowData => {
    setLoader(true)
    const response = await addBookApi({
      id: rowData?.id,
    })
    setLoader(false)
    if (!response?.data?.success) return

    getScratchTicketListCall()
  }

  const boldRender = rowData =>
    nullOrUndefined(rowData) ? '-' : <b>{rowData}</b>

  const columns = [
    {
      title: t('bkm_BoxNo'),
      dataIndex: 'sequentialId',
      key: 'sequentialId',
      width: '80px',
      hideInCard: true,
      render: boldRender,
      // render: (_, __, index) =>
      //   boldRender(
      //     (dataSource?.pageNo ? dataSource?.pageNo - 1 : 0) * PAGE_SIZE +
      //       index +
      //       1,
      //   ),
    },
    // {
    //   title: t('rpt_BookName'),
    //   dataIndex: 'bookName',
    //   key: 'bookName',
    //   render: rowData => rowData || '-',
    //   onCell: rowData => {
    //     if (rowData?.isNew) {
    //       return {
    //         record: rowData,
    //         editable: true,
    //         dataIndex: 'bookName',
    //         inputType: 'input',
    //         handleSave,
    //       }
    //     }
    //     return {}
    //   },
    // },
    {
      title: t('bkm_GameNumber'),
      dataIndex: 'gameNumber',
      key: 'bkm_GameNumber',
      render: boldRender,
    },
    {
      title: t('bkm_BookNumber'),
      dataIndex: 'bookNumber',
      key: 'bkm_BookNumber',
      render: boldRender,
    },
    {
      title: t('bkm_Amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: rowData => (
        <b>{nullOrUndefined(rowData) ? null : `$${rowData}`}</b>
      ),
    },
    {
      title: t('bkm_EndTicket'),
      dataIndex: 'ticketCount',
      key: 'bkm_EndTicket',
      render: boldRender,
    },
    {
      title: t('bkm_StartingNo'),
      dataIndex: 'startingNo',
      key: 'startingNo',
      render: boldRender,
    },
    {
      title: t('bkm_EndingNo'),
      key: 'endingNo',
      render: rawData => boldRender(rawData?.endingNo),
      cellEditable: !readOnly,
      onCell: rowData => {
        return {
          record: rowData,
          editable: !readOnly,
          dataIndex: 'endingNo',
          inputType: 'inputNumber',
          inputProps: {
            min: rowData?.startingNo || 0,
            max: rowData?.ticketCount,
          },
          handleSave,
        }
      },
    },
    // ...(newBookCount
    //   ? Array.from({ length: newBookCount }, (_, i) => [
    //       {
    //         title: t('bkm_NewBookStart'),
    //         dataIndex: `newBookStart${i + 1}`,
    //         key: `newBookStart${i + 1}`,
    //         editable: true,
    //         inputType: 'inputNumber',
    //       },
    //       {
    //         title: t('bkm_NewBookEnd'),
    //         dataIndex: `newBookEnd${i + 1}`,
    //         key: `newBookEnd${i + 1}`,
    //         editable: true,
    //         inputType: 'inputNumber',
    //       },
    //     ]).flat(1)
    //   : []),
    {
      title: t('bkm_TicketsSold'),
      key: 'bkm_TicketsSold',
      dataIndex: 'ticketSold',
      render: rowData => boldRender(rowData),
    },
    {
      title: t('bkm_TotalAmtSold'),
      key: 'bkm_TotalAmtSold',
      dataIndex: 'totalAmount',
      render: rowData => {
        return boldRender(rowData)
      },
    },
    {
      title: t('txt_Action'),
      key: 'txt_Action',
      width: '170px',
      align: 'center',
      hidden: readOnly || !addRemovePermission,
      hideInCard: true,
      render: rowData => (
        <div className="flex-nowrap d-flex">
          {rowData?.shiftFirstBook ? (
            <ANTDButton
              type="primary"
              className="btn"
              disabled={loader}
              onClick={() => onAddNewBookClick(rowData)}
            >
              {t('btn_AddNewBook')}
            </ANTDButton>
          ) : (
            <ANTDButton
              type="primary"
              className="btn"
              disabled={loader}
              onClick={() => onRemoveClick(rowData)}
              icon={<MinusOutlined />}
            />
          )}
        </div>
      ),
    },
  ]

  return {
    t,
    PAGE_SIZE,
    columns,
    dataSource,
    totalValues,
    onSearch,
    handleSave,
    handleTableChange,
  }
}

export default scratchTicketTracking
