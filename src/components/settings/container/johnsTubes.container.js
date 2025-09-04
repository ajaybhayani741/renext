import { useEffect, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { nullOrUndefined } from '../../../utils/javascript'
import {
  addTubesApi,
  deleteTubesApi,
  getTubesApi,
  updateTubesApi,
} from '../setting.api'

const johnsTubes = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const isDesktop = selector(state => state.app.isDesktop)
  const loginUserDetails = selector(state => state.user?.profile_details)
  const form = useFormFn()
  const [confirmModel, setConfirmModel] = useState({
    open: false,
    tubeId: null,
  })
  const [dataSource, setDataSource] = useState({
    loader: false,
    list: [],
    pageNo: 1,
  })
  const [addModel, setAddModel] = useState({ open: false })
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (storeId) {
      getTubesCall()
    }
  }, [storeId])

  const getTubesCall = async ({ pageNo = 1 } = {}) => {
    setDataSource(prev => ({ ...prev, loader: true }))
    const response = await getTubesApi({
      pageNo,
      params: { storeId, pageSize: PAGE_SIZE },
    })

    setDataSource(prev => ({ ...response?.data, loader: false }))
  }

  const onConfirmModelClose = () => {
    setConfirmModel(prev => ({ ...prev, open: false, tubeId: null }))
  }

  const onEditClick = rowData => {
    form.setFieldsValue(rowData)
    onAddModelToggle()
  }

  const onDeleteClick = rowData => {
    setConfirmModel(prev => ({ ...prev, open: true, tubeId: rowData?.id }))
  }
  const handleConfirmDelete = async () => {
    onConfirmModelClose()
    setDataSource(prev => ({ ...prev, loader: true }))
    const resp = await deleteTubesApi({
      params: { id: confirmModel?.tubeId, storeId },
    })
    setDataSource(prev => ({ ...prev, loader: false }))
    if (resp?.data?.success) {
      getTubesCall()
      notifyMethod.success({
        message: 'msg_TubeDeletedSuccessfully',
      })
    }
  }

  const handleTableChange = pagination => {
    getTubesCall({ pageNo: pagination?.current })
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
      ? await updateTubesApi({ payload: { id, ...payload } })
      : await addTubesApi({ payload })
    setLoader(false)
    if (resp?.data?.success) {
      getTubesCall()
      onAddModelToggle()

      notifyMethod.success({
        message: id
          ? 'msg_TubeUpdatedSuccessfully'
          : 'msg_TubeAddedSuccessfully',
      })
    }
  }

  const PAGE_SIZE = 10

  const boldRender = rowData =>
    nullOrUndefined(rowData) ? '-' : <b>{rowData}</b>

  const columns = [
    {
      title: t('bkm_SafeNumber'),
      key: 'bkm_SafeNumber',
      width: 130,
      render: (_, __, index) =>
        boldRender(
          (dataSource?.pageNo ? dataSource?.pageNo - 1 : 0) * PAGE_SIZE +
            index +
            1,
        ),
    },
    {
      title: t('bkm_SafeTypeDollar'),
      dataIndex: 'safeType',
      key: 'safeType',
      render: boldRender,
    },
    {
      title: t('bkm_Value'),
      dataIndex: 'value',
      key: 'value',
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

  const tubesFormFieldsAttr = {
    safeType: {
      label: 'bkm_SafeTypeDollar',
      inputType: 'inputNumber',
      className: 'w-100',
      required: true,
      md: 12,
      sm: 24,
    },
    value: {
      label: 'bkm_Value',
      inputType: 'inputNumber',
      className: 'w-100',
      required: true,
      md: 12,
      sm: 24,
    },
  }

  const cardViewFn = item => [
    { label: 'Safe Number', value: item?.safeNumber },
    { label: 'Safe Type', value: item?.safeType },
    { label: 'Value', value: item?.value },
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
    handleConfirmDelete,
    handleTableChange,
    onConfirmModelClose,
    onAddModelToggle,
    onSaveClick,
    tubesFormFieldsAttr,
    isDesktop,
    cardViewFn,
    onEditClick,
    onDeleteClick,
  }
}

export default johnsTubes
