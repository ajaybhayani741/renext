import { MinusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { nullOrUndefined } from '../../../utils/javascript'
import {
  addVendorPayoutApi,
  deleteVendorPayoutApi,
  getTotalValuesApi,
  getVendorPayoutListApi,
  updateVendorPayoutApi,
} from '../bookKeeping.api'

const vendorPayout = ({ readOnly, shiftId }) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const [dataSource, setDataSource] = useState({ list: [], loader: false })
  const [totalValues, setTotalValues] = useState({})

  const PAGE_SIZE = 10

  useEffect(() => {
    if (storeId) {
      getVendorPayoutListCall()
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

  const getVendorPayoutListCall = async ({ pageNo = 1 } = {}) => {
    setDataSource(prev => ({ ...prev, loader: true }))
    const params = {
      storeId,
      shiftId,
      pageSize: PAGE_SIZE,
    }
    const response = await getVendorPayoutListApi({
      pageNo,
      params,
    })

    setDataSource(prev => ({ ...response?.data, loader: false }))
  }

  const handleTableChange = pagination => {
    getVendorPayoutListCall({ pageNo: pagination?.current })
  }

  const onAddClick = async () => {
    setDataSource(prev => ({ ...prev, loader: true }))
    const payload = {
      name: '',
      checkNo: '',
      amount: 0,
      storeId,
    }
    const resp = await addVendorPayoutApi({ payload })
    setDataSource(prev => ({ ...prev, loader: false }))
    if (!resp?.data?.success) return

    getVendorPayoutListCall()
  }

  const onRemoveClick = async data => {
    const response = await deleteVendorPayoutApi({ params: { id: data?.id } })
    if (!response?.data?.success) return

    getVendorPayoutListCall()
  }

  const boldRender = rowData =>
    nullOrUndefined(rowData) ? '-' : <b>{rowData}</b>

  const columns = [
    {
      title: t('inv_SrNo'),
      key: 'inv_SrNo',
      align: 'center',
      hideInCard: true,
      render: (_, __, index) =>
        boldRender(
          (dataSource?.pageNo ? dataSource?.pageNo - 1 : 0) * PAGE_SIZE +
            index +
            1,
        ),
    },
    {
      title: t('menu_VendorPayout'),
      dataIndex: 'name',
      key: 'menu_VendorPayout',
      align: 'center',
      editable: !readOnly,
      inputType: 'input',
      render: boldRender,
    },
    {
      title: t('bkm_CheckNo'),
      dataIndex: 'checkNo',
      key: 'bkm_CheckNo',
      align: 'center',
      editable: !readOnly,
      inputType: 'inputNumber',
      render: boldRender,
    },
    {
      title: t('bkm_AmountDollar'),
      dataIndex: 'amount',
      key: 'bkm_AmountDollar',
      align: 'center',
      editable: !readOnly,
      inputType: 'inputNumber',
      render: boldRender,
    },
    {
      title: t('txt_Action'),
      key: 'txt_Action',
      width: '80px',
      align: 'center',
      hidden: readOnly,
      hideInCard: true,
      render: rowData => (
        <ANTDButton
          type="primary"
          className="btn"
          onClick={() => onRemoveClick(rowData)}
          icon={<MinusOutlined />}
        />
      ),
    },
  ]

  const handleSave = async values => {
    const payload = {
      id: values?.id,
      name: values?.name,
      checkNo: values?.checkNo,
      amount: values?.amount,
      storeId,
      shiftId,
    }
    const currentBox = dataSource?.list?.find(val => val?.id === values?.id)
    const cloneCurrentBox = { ...currentBox }
    setDataSource(prev => {
      const cloneSource = { ...prev }
      const index = cloneSource?.list?.findIndex(val => val.id === values?.id)
      cloneSource.list[index] = { ...values }
      return cloneSource
    })

    const response = await updateVendorPayoutApi({ payload })

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

  return {
    t,
    columns,
    dataSource,
    totalValues,
    PAGE_SIZE,
    handleSave,
    onAddClick,
    handleTableChange,
  }
}

export default vendorPayout
