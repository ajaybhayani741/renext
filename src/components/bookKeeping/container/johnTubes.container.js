import { useEffect, useRef, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { userWiseRole } from '../../../utils/constant'
import debounce from '../../../utils/debounce'
import { include, nullOrUndefined } from '../../../utils/javascript'
import {
  getTotalValuesApi,
  getTubeListApi,
  searchTubeListApi,
  updateTubeApi,
} from '../bookKeeping.api'

const johnTubes = ({ readOnly, shiftId }) => {
  const { t } = useTranslations()
  const form = useFormFn()
  const { selector } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const loginUserDetails = selector(state => state.user?.profile_details)
  const [dataSource, setDataSource] = useState({ list: [], loader: false })
  const [addModel, setAddModel] = useState({ open: false })
  const [loader, setLoader] = useState(false)
  const [totalValues, setTotalValues] = useState({})
  const searchVal = useRef(null)

  const { admin, storeOwner } = userWiseRole
  const addRemovePermission = include(
    [admin, storeOwner],
    loginUserDetails?.roleId,
  )

  const PAGE_SIZE = 10

  useEffect(() => {
    if (storeId) {
      getTubeListCall()
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

  const getTubeListCall = async ({ pageNo = 1 } = {}) => {
    setDataSource(prev => ({ ...prev, loader: true }))
    const searchText = searchVal.current?.trim()
    const params = {
      storeId,
      shiftId,
      pageSize: PAGE_SIZE,
    }
    const response = searchText
      ? await searchTubeListApi({
          pageNo,
          params: {
            ...params,
            searchValue: searchText,
          },
        })
      : await getTubeListApi({
          pageNo,
          params,
        })

    if (response?.data) {
      setDataSource(prev => ({ ...response?.data, loader: false }))
    } else {
      setDataSource(prev => ({ ...prev, loader: false }))
    }
  }

  const onSearch = debounce(async e => {
    const { value } = e.target
    searchVal.current = value?.trim()
    getTubeListCall()
  }, 600)

  const handleTableChange = pagination => {
    getTubeListCall({ pageNo: pagination?.current })
  }

  const onAddModelClose = () => {
    setAddModel(prev => ({ ...prev, open: false }))
    addModel?.open && form.resetFields()
  }

  const handleSave = async values => {
    const currentTube = dataSource?.list?.find(val => val?.id === values?.id)
    const availableDiff = values?.available - currentTube?.available
    const numberOfTubes = currentTube?.numberOfTube - availableDiff
    const amount = (numberOfTubes || 0) * (values?.value || 0)
    const payload = {
      systemId: values?.id,
      storeId,
      shiftId,
      [availableDiff > 0 ? 'quantityToAdd' : 'quantityToSubtract']:
        Math.abs(availableDiff),
      numberOfTubes,
      amount,
    }
    const cloneCurrentTube = { ...currentTube }
    setDataSource(prev => {
      const cloneSource = { ...prev }
      const index = cloneSource?.list?.findIndex(val => val.id === values?.id)
      cloneSource.list[index] = {
        ...values,
        numberOfTube: numberOfTubes,
        amount,
      }
      return cloneSource
    })

    const response = await updateTubeApi({ payload })

    if (!response?.data?.success) {
      setDataSource(prev => {
        const cloneSource = { ...prev }
        const index = cloneSource?.list?.findIndex(val => val.id === values?.id)
        cloneSource.list[index] = cloneCurrentTube
        return cloneSource
      })
    }
    getTotalValues()
  }

  const onRefillClick = rawData => {
    setAddModel(prev => ({ ...prev, open: true, id: rawData?.id }))
  }

  const onRefillFinish = async values => {
    const currentTube = dataSource?.list?.find(val => val?.id === addModel?.id)
    if (!currentTube) return

    setLoader(true)
    const payload = {
      systemId: addModel?.id,
      storeId,
      shiftId,
      refill: values?.refill,
    }
    const cloneCurrentTube = { ...currentTube }
    setDataSource(prev => {
      const cloneSource = { ...prev }
      const index = cloneSource?.list?.findIndex(val => val.id === addModel?.id)
      cloneSource.list[index] = {
        ...currentTube,
        available: currentTube?.available + values?.refill,
      }
      return cloneSource
    })

    const response = await updateTubeApi({ payload })

    if (!response?.data?.success) {
      setDataSource(prev => {
        const cloneSource = { ...prev }
        const index = cloneSource?.list?.findIndex(val => val.id === values?.id)
        cloneSource.list[index] = cloneCurrentTube
        return cloneSource
      })
    } else {
      getTotalValues()
      getTubeListCall({ pageNo: dataSource?.pageNo })
    }
    setLoader(false)
    onAddModelClose()
  }

  const boldRender = rowData =>
    nullOrUndefined(rowData) ? '-' : <b>{rowData}</b>

  const columns = [
    {
      title: t('bkm_SafeNo'),
      // dataIndex: 'tubeId',
      key: 'bkm_SafeNo',
      width: '80px',
      hideInCard: true,
      render: (_, __, index) =>
        boldRender(
          (dataSource?.pageNo ? dataSource?.pageNo - 1 : 0) * PAGE_SIZE +
            index +
            1,
        ),
    },
    {
      title: t('bkm_SafeType'),
      dataIndex: 'safeType',
      key: 'safeType',
      render: rowData => (rowData ? boldRender(`$${rowData}`) : '-'),
    },
    {
      title: t('bkm_Value'),
      dataIndex: 'value',
      key: 'value',
      render: rowData => (rowData ? boldRender(`$${rowData}`) : '-'),
    },
    {
      title: t('bkm_StartingNo'),
      dataIndex: 'startingNumber',
      key: 'bkm_StartingNo',
      render: boldRender,
    },
    {
      title: t('inv_Available'),
      key: 'available',
      render: rawData => boldRender(rawData?.available),
      cellEditable: !readOnly,
      onCell: rowData => {
        return {
          record: rowData,
          editable: !readOnly,
          dataIndex: 'available',
          inputType: 'inputNumber',
          inputProps: {
            min: 0,
            max: rowData?.available + rowData?.numberOfTube,
          },
          handleSave,
        }
      },
    },
    {
      title: t('bkm_NoOfTubes'),
      key: 'bkm_NoOfTubes',
      dataIndex: 'numberOfTube',
      render: boldRender,
    },
    {
      title: t('bkm_Amount'),
      key: 'bkm_Amount',
      dataIndex: 'amount',
      render: boldRender,
    },
    {
      title: t('bkm_TubesAdded'),
      key: 'stg_JohnsTubes',
      dataIndex: 'tubesAdded',
      render: boldRender,
    },
    {
      title: t('bkm_AmountAdded'),
      key: 'bkm_AmountAdded',
      dataIndex: 'amountAdded',
      render: boldRender,
    },
    {
      title: t('txt_Action'),
      key: 'txt_Action',
      width: '120px',
      align: 'center',
      hidden: readOnly || !addRemovePermission,
      hideInCard: true,
      render: rawData => (
        <div className="flex-nowrap d-flex">
          <ANTDButton
            type="primary"
            className="btn ml-10"
            onClick={() => onRefillClick(rawData)}
          >
            {t('btn_Refill')}
          </ANTDButton>
        </div>
      ),
    },
  ]

  const refillFormFields = {
    refill: {
      label: t('bkm_QuantityToAdd'),
      inputType: 'inputNumber',
      className: 'w-100',
      required: true,
      xs: 24,
    },
  }

  return {
    t,
    form,
    dataSource,
    totalValues,
    columns,
    loader,
    addModel,
    refillFormFields,
    PAGE_SIZE,
    handleSave,
    onAddModelClose,
    onRefillFinish,
    onSearch,
    handleTableChange,
  }
}

export default johnTubes
