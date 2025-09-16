import useTranslations from '../../../hooks/useTranslations'
import { include } from '../../../utils/javascript'

const dashboardWrapper = ({ title }) => {
  const { t } = useTranslations()
  const condition = include(
    [
      'job_HostelAuthority',
      'job_RecordMaintenance',
      'dash_LocationBedsMattresses',
      'dash_WasteManagement',
      'dash_ToiletsSufficiency',
      'job_DrinkingWater',
    ],
    title,
  )

  const columns = [
    {
      title: condition ? t('dash_ListOfSchools') : t('user_Hostel'),
      key: 'id',
      colSpan: 2,
      render: (_, __, index) => {
        return index + 1
      },
    },
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      colSpan: 0,
      render: rowData => (rowData ? `${rowData}` : '-'),
      hidden: !condition,
    },
    {
      title: '',
      dataIndex: ['hostel', 'name'],
      key: 'hostel',
      colSpan: 0,
      render: rowData => (rowData ? `${rowData}` : '-'),
      hidden: condition,
    },
    {
      title: t('dash_Students'),
      dataIndex: 'total_students',
      key: 'students',
      render: rowData => (rowData ? `${rowData}` : '-'),
      hidden: condition,
    },
  ].filter(item => !item.hidden)

  return { columns }
}

export default dashboardWrapper
