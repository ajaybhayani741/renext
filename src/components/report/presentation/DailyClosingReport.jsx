import { useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { dayJs } from '../../../utils/dayjs'
import EditableTable from '../../common/presentation/EditableTable'

const DailyClosingReport = () => {
  const { t } = useTranslations()
  const [loader, setLoader] = useState(false)
  const [dataSource, setDataSource] = useState(() => {
    const getDaysOfCurrentMonth = () => {
      const days = []
      const now = dayJs()
      const startOfMonth = now.startOf('month')
      const endOfMonth = now.endOf('month')

      for (
        let date = startOfMonth;
        date.isBefore(endOfMonth) || date.isSame(endOfMonth);
        date = date.add(1, 'day')
      ) {
        days.push(date.format('MM/DD/YYYY'))
      }

      return days
    }
    const currentMonthDays = getDaysOfCurrentMonth()

    const dummyData = [
      {
        credit: 2687.4,
        debit: 81.37,
        cash: 2309.51,
        prepaid: 2748.14,
      },
      {
        credit: 1144.95,
        debit: 92.02,
        cash: 1462.4,
        prepaid: 1959.06,
      },
      {
        credit: 1157.26,
        debit: 8.35,
        cash: 575.04,
        prepaid: 1246.52,
      },
      {
        credit: 1421.65,
        debit: 51.3,
        cash: 1323.73,
        prepaid: 984.26,
      },
    ]
    return currentMonthDays.map((day, index) => ({
      id: index + 1,
      date: day,
      credit: null,
      debit: null,
      cash: null,
      prepaid: null,
      ...dummyData[index],
    }))
  })

  const onSaveClick = () => {
    setLoader(true)
    setTimeout(() => {
      setLoader(false)
    }, 1000)
  }

  const columns = [
    {
      title: t('job_Date'),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: t('rpt_Credit'),
      dataIndex: 'credit',
      key: 'credit',
      editable: true,
      inputType: 'inputNumber',
    },
    {
      title: t('rpt_Debit'),
      dataIndex: 'debit',
      key: 'debit',
      editable: true,
      inputType: 'inputNumber',
    },
    {
      title: t('rpt_Cash'),
      dataIndex: 'cash',
      key: 'cash',
      editable: true,
      inputType: 'inputNumber',
    },
    {
      title: t('rpt_Prepaid'),
      dataIndex: 'prepaid',
      key: 'prepaid',
      editable: true,
      inputType: 'inputNumber',
    },
    {
      title: t('txt_Action'),
      key: 'txt_Action',
      width: '100px',
      align: 'center',
      render: rowData => (
        <ANTDButton type="primary" className="btn" onClick={onSaveClick}>
          {t('btn_Save')}
        </ANTDButton>
      ),
    },
  ]

  const handleSave = values => {
    setDataSource(prev => {
      const cloneSource = [...prev]
      const index = cloneSource.findIndex(val => val.id === values?.id)
      cloneSource[index] = {
        ...cloneSource[index],
        ...values,
      }
      return cloneSource
    })
  }

  return (
    <>
      <EditableTable
        {...{
          loader,
          dataSource,
          defaultColumns: columns,
          handleSave,
          scroll: {
            x: 800,
            y: 'calc(100vh - 220px)',
          },
        }}
      />
    </>
  )
}

export default DailyClosingReport
