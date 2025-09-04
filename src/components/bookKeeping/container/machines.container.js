import { MinusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import {
  addMachineTicketApi,
  deleteMachineTicketApi,
  getMachineListApi,
  getMachineTicketListApi,
  getTotalValuesApi,
  updateMachineTicketApi,
} from '../bookKeeping.api'

const machines = ({ readOnly, shiftId }) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const storeId = selector(state => state?.app?.store?.selected)
  const [machineList, setMachineList] = useState({ list: [], loader: false })
  const [selected, setSelected] = useState(null)
  const [dataSource, setDataSource] = useState({ list: [], loader: false })
  const [totalValues, setTotalValues] = useState({})

  const PAGE_SIZE = 10

  useEffect(() => {
    if (storeId) {
      getMachineList()
    }
  }, [storeId])

  const getTotalValues = async ({ machineId = selected } = {}) => {
    const response = await getTotalValuesApi({
      params: { storeId, shiftId, machineId },
    })
    if (response?.data) {
      setTotalValues(response?.data)
    }
  }

  const getMachineTicketListCall = async ({
    pageNo = 1,
    machineId = selected,
  } = {}) => {
    setDataSource(prev => ({ ...prev, loader: true }))
    const params = {
      storeId,
      shiftId,
      machineId,
      pageSize: PAGE_SIZE,
    }
    const response = await getMachineTicketListApi({
      pageNo,
      params,
    })

    setDataSource(prev => ({ ...response?.data, loader: false }))
  }

  const handleSelectChange = value => {
    setSelected(value)
    getMachineTicketListCall({ machineId: value })
    getTotalValues({ machineId: value })
  }

  const getMachineList = async () => {
    setMachineList(prev => ({ ...prev, loader: true }))
    const response = await getMachineListApi({ params: { storeId } })
    if (response?.data) {
      setMachineList(prev => ({ ...response?.data, loader: false }))
      handleSelectChange(response?.data?.list?.[0]?.id)
    }
  }

  const handleTableChange = pagination => {}

  const onAddClick = async () => {
    setDataSource(prev => ({ ...prev, loader: true }))
    const payload = {
      machineId: selected,
      ticketNumber: null,
      queenPayout: null,
      remarks: null,
      storeId,
    }
    const resp = await addMachineTicketApi({ payload })
    setDataSource(prev => ({ ...prev, loader: false }))
    if (!resp?.data?.success) return

    getMachineTicketListCall()
  }

  const onRemoveClick = async data => {
    const response = await deleteMachineTicketApi({ params: { id: data?.id } })
    if (!response?.data?.success) return

    getMachineTicketListCall()
  }

  const handleSave = async values => {
    const payload = {
      id: values?.id,
      ticketNumber: values?.ticketNumber,
      queenPayout: values?.queenPayout,
      remarks: values?.remarks,
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

    const response = await updateMachineTicketApi({ payload })

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

  const columns = [
    {
      title: t('bkm_TicketNumber'),
      dataIndex: 'ticketNumber',
      key: 'bkm_TicketNumber',
      align: 'center',
      editable: !readOnly,
      inputType: 'inputNumber',
    },
    {
      title: t('bkm_QueenPayout'),
      dataIndex: 'queenPayout',
      key: 'bkm_QueenPayout',
      align: 'center',
      editable: !readOnly,
      inputType: 'inputNumber',
    },
    {
      title: t('job_CustomerName'),
      dataIndex: 'customerName',
      key: 'job_CustomerName',
      align: 'center',
      editable: !readOnly,
      inputType: 'inputText',
      maxLength: 60,
    },
    {
      title: t('txt_Action'),
      key: 'txt_Action',
      width: '80px',
      align: 'center',
      hidden: readOnly,
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

  return {
    t,
    PAGE_SIZE,
    dataSource,
    columns,
    selected,
    machineList,
    totalValues,
    handleSave,
    onAddClick,
    handleTableChange,
    handleSelectChange,
  }
}

export default machines
