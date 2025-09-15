import useTranslations from '../../../hooks/useTranslations'

const dashboardWrapper = () => {
  const { t } = useTranslations()

  const columns = [
    {
      title: t('dash_ListOfSchools'),
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
      render: rowData => (rowData ? `${rowData}` : '-'),
      // hidden: true,
    },
    {
      title: t('user_Hostel'),
      dataIndex: ['hostel', 'name'],
      key: 'hostel',
      render: rowData => (rowData ? `${rowData}` : '-'),
      hidden: true,
    },
    {
      title: t('dash_Students'),
      dataIndex: 'total_students',
      key: 'students',
      render: rowData => (rowData ? `${rowData}` : '-'),
      hidden: true,
    },
  ].filter(item => !item.hidden)

  return { columns }
}

export default dashboardWrapper
