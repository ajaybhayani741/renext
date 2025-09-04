import { useEffect, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { include, keys, nullOrUndefined } from '../../../utils/javascript'
import {
  addBoxApi,
  deleteBoxApi,
  getBoxListApi,
  updateBoxApi,
} from '../setting.api'

const scratchTickets = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const storeDetails = selector(state => state?.app?.store)
  const isDesktop = selector(state => state.app.isDesktop)
  const { selected: storeId, companyCode, storeCode } = storeDetails
  const loginUserDetails = selector(state => state.user?.profile_details)
  const form = useFormFn()
  const [confirmModel, setConfirmModel] = useState({ open: false, boxId: null })
  const [dataSource, setDataSource] = useState({
    loader: false,
    list: [],
    pageNo: 1,
  })
  const [addModel, setAddModel] = useState({ open: false })
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (storeId) {
      getBoxListCall()
    }
  }, [storeId])

  const getBoxListCall = async ({ pageNo = 1 } = {}) => {
    setDataSource(prev => ({ ...prev, loader: true }))
    const response = await getBoxListApi({
      pageNo,
      params: { storeId, pageSize: PAGE_SIZE },
    })

    setDataSource(prev => ({ ...response?.data, loader: false }))
  }

  const onConfirmModelClose = () => {
    setConfirmModel(prev => ({ ...prev, open: false, boxId: null }))
  }

  const onEditClick = rowData => {
    form.setFieldsValue(rowData)
    onAddModelToggle()
  }

  const onDeleteClick = rowData => {
    setConfirmModel(prev => ({ ...prev, open: true, boxId: rowData?.id }))
  }
  const handleDeleteBox = async () => {
    onConfirmModelClose()
    setDataSource(prev => ({ ...prev, loader: true }))
    const resp = await deleteBoxApi({
      params: { id: confirmModel?.boxId, storeId },
    })
    setDataSource(prev => ({ ...prev, loader: false }))
    if (resp?.data?.success) {
      getBoxListCall()
      notifyMethod.success({
        message: 'msg_BoxDeletedSuccessfully',
      })
    }
  }

  const handleTableChange = pagination => {
    getBoxListCall({ pageNo: pagination?.current })
  }

  const onAddModelToggle = () => {
    setAddModel(prev => ({ ...prev, open: !prev.open }))
    addModel?.open && form.resetFields()
  }

  const onSaveClick = async values => {
    setLoader(true)
    const id = form.getFieldValue('id')
    const payload = { storeId, userId: loginUserDetails?.id, ...values }
    const resp = id
      ? await updateBoxApi({ payload: { id, ...payload } })
      : await addBoxApi({ payload })
    setLoader(false)
    if (resp?.data?.success) {
      getBoxListCall()
      onAddModelToggle()

      notifyMethod.success({
        message: id ? 'msg_BoxUpdatedSuccessfully' : 'msg_BoxAddedSuccessfully',
      })
    }
  }

  const PAGE_SIZE = 10

  const boldRender = rowData =>
    nullOrUndefined(rowData) ? '-' : <b>{rowData}</b>

  const columns = [
    {
      title: t('bkm_BoxNo'),
      dataIndex: 'sequentialId',
      key: 'bkm_BoxNo',
      render: boldRender,
      // render: (_, __, index) =>
      //   boldRender(
      //     (dataSource?.pageNo ? dataSource?.pageNo - 1 : 0) * PAGE_SIZE +
      //       index +
      //       1,
      //   ),
    },
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
      key: 'bkm_Amount',
      render: boldRender,
    },
    {
      title: t('bkm_EndTicket'),
      dataIndex: 'ticketCount',
      key: 'bkm_EndTicket',
      render: rowData => <b>{rowData}</b>,
    },
    {
      title: t('bkm_NumberOfBooks'),
      dataIndex: 'numberOfBooks',
      key: 'bkm_NumberOfBooks',
      render: boldRender,
    },
    {
      title: t('txt_Action'),
      key: 'txt_Action',
      width: '200px',
      render: rowData => (
        <div className="flex-nowrap d-flex">
          <ANTDButton className="bg-edit" onClick={() => onEditClick(rowData)}>
            {t('btn_Edit')}
          </ANTDButton>
          <ANTDButton
            className="bg-danger"
            onClick={() => onDeleteClick(rowData)}
          >
            {t('btn_Delete')}
          </ANTDButton>
        </div>
      ),
    },
  ]

  const onValuesChange = value => {
    const changeKey = keys(value)?.[0]
    if (include(['gameNumber', 'bookNumber'], changeKey)) {
      form.setFieldValue(changeKey, value[changeKey]?.replace(/\D/g, ''))
    }
  }

  const boxFormFieldsAttr = {
    // boxNo: {
    //   label: 'bkm_BoxNo',
    //   inputType: 'inputNumber',
    //   className: 'w-100',
    //   required: true,
    //   xs: 24,
    //   md: 8,
    // },
    gameNumber: {
      label: 'bkm_GameNumber',
      inputType: 'input',
      required: true,
      rules: [{ type: 'string', max: 4 }],
      xs: 24,
      md: 12,
    },
    bookNumber: {
      label: 'bkm_BookNumber',
      inputType: 'input',
      required: true,
      rules: [{ type: 'string', max: 6 }],
      xs: 24,
      md: 12,
    },
    amount: {
      label: 'bkm_Amount',
      inputType: 'inputNumber',
      className: 'w-100',
      required: true,
      xs: 24,
      md: 8,
    },
    ticketCount: {
      label: 'bkm_EndTicket',
      inputType: 'inputNumber',
      className: 'w-100',
      required: true,
      xs: 24,
      md: 8,
    },
    numberOfBooks: {
      label: 'bkm_NumberOfBooks',
      inputType: 'inputNumber',
      className: 'w-100',
      required: true,
      xs: 24,
      md: 8,
    },
  }

  const cardViewFn = item => [
    { label: 'Box Number', value: item?.sequentialId },
    { label: 'Game Number', value: item?.gameNumber },
    { label: 'Book Number', value: item?.bookNumber },
    { label: 'Amount', value: item?.amount },
    { label: 'End Ticket', value: item?.ticketCount },
    { label: 'Number of Books', value: item?.numberOfBooks },
  ]

  return {
    t,
    form,
    loader,
    PAGE_SIZE,
    dataSource,
    confirmModel,
    columns,
    addModel,
    boxFormFieldsAttr,
    companyCode,
    storeCode,
    handleDeleteBox,
    handleTableChange,
    onConfirmModelClose,
    onAddModelToggle,
    onSaveClick,
    onValuesChange,
    isDesktop,
    cardViewFn,
    onEditClick,
    onDeleteClick,
  }
}

export default scratchTickets
