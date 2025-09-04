import useTranslations from '../../../hooks/useTranslations'
import {
  entries,
  include,
  isEqual,
  length,
  ternary,
} from '../../../utils/javascript'

const selectionTableColumn = ({
  t,
  name,
  parentName,
  formData,
  hasChildren,
  searchInput,
  childTable,
  listViewElem,
}) => {
  const renderMethod = rowData => {
    if (rowData.id === 'search') return rowData.Component
    const value = ternary(
      include(
        ['user_Dealer', 'user_Contractor', 'user_Child', 'user_Associate'],
        name,
      ),
      rowData?.businessName,
      ternary(
        isEqual('user_FieldEngineer', name),
        rowData?.lastName,
        rowData?.name,
      ),
    )
    const checkField = isEqual(name, 'txt_Country') ? 'name' : 'id'
    const selected = isEqual(
      ternary(
        parentName,
        formData?.selected?.[checkField],
        formData?.[name]?.selected?.[checkField],
      ),
      rowData?.[checkField],
    )
    return listViewElem({ rowData, parentName, name, value, selected })
  }

  return [
    {
      title: t(name),
      align: 'center',
      key: name,
      sorter: !(formData?.[name]?.disabled || hasChildren)
        ? (a, b) => a?.name?.localeCompare(b?.name)
        : false,
      ...(hasChildren
        ? {
            render: () =>
              childTable({
                dataSource: formData?.[name],
                parentName: name,
              }),
          }
        : {
            children: [
              {
                title: searchInput({
                  value: formData?.[name]?.search,
                  name,
                  disabled: !length(formData?.[name]?.list),
                }),
                render: renderMethod,
              },
            ],
          }),
    },
  ]
}

const materialColumn = t => [
  {
    title: t('job_MaterialType'),
    key: 'materialType',
    dataIndex: 'materialType',
    render: rowData => t(rowData),
  },
  {
    title: t('dsv_CO2EmissionFactor'),
    key: 'dsv_CO2EmissionFactor',
    dataIndex: 'cO2EmissionFactor',
  },
  {
    title: t('dsv_RecoveryAmountKg'),
    key: 'dsv_RecoveryAmountKg',
    dataIndex: 'recoveryAmountKg',
  },
  {
    title: t('dsv_RecycledAmountKg'),
    key: 'dsv_RecycledAmountKg',
    dataIndex: 'recycledAmountKg',
  },
  {
    title: t('dsv_SmeltedAmountKg'),
    key: 'dsv_SmeltedAmountKg',
    dataIndex: 'smeltedAmountKg',
  },
  {
    title: t('dsv_TradedAmountKg'),
    key: 'dsv_TradedAmountKg',
    dataIndex: 'tradedAmountKg',
  },
  {
    title: t('dsv_SoldToEndUserKg'),
    key: 'dsv_SoldToEndUserKg',
    dataIndex: 'soldToEndUserKg',
  },
]

const finalProductColumn = t => [
  {
    title: t('job_MaterialType'),
    key: 'materialType',
    dataIndex: 'materialType',
    render: rowData => t(rowData),
  },
  {
    title: t('dsv_CO2EmissionFactor'),
    key: 'dsv_CO2EmissionFactor',
    dataIndex: 'cO2EmissionFactor',
  },
  {
    title: t('dsv_RecycledQuantityUsedKg'),
    key: 'dsv_RecycledQuantityUsedKg',
    dataIndex: 'recycledQuantity',
  },
  {
    title: t('dsv_VirginQuantityUsedKg'),
    key: 'dsv_VirginQuantityUsedKg',
    dataIndex: 'virginQuantity',
  },
]

const getColumns = ({ title, indexType }) => {
  const { t } = useTranslations()

  const commonProps = {
    title: t(title),
    dataIndex: indexType,
    key: indexType,
  }

  switch (title) {
    case 'txt_Brand':
      return {
        ...commonProps,
        width: '90px',
        render: rowData => rowData || 'Daikin',
      }
    case 'txt_ProductSeries':
      return {
        ...commonProps,
        width: '90px',
        render: rowData => rowData || 'Daikin',
      }
    case 'txt_Model':
      return {
        ...commonProps,
        width: '90px',
        render: rowData => rowData || 'VRV10',
      }
    case 'job_Maintenance':
    case 'job_Repair':
      return {
        ...commonProps,
        width: '90px',
        children: [
          {
            title: t('txt_JobsCreated'),
            key: 'created',
            width: 110,
            render: rowData => rowData?.repairJobsCreated || 0,
          },
          {
            title: () => <>{t('txt_JobsClosed')} </>,
            key: 'closed',
            width: 110,
            render: rowData => rowData?.repairJobsClosed || 0,
          },
        ],
      }
    // case 'txt_MaintenanceJobsClosed':
    //   return {
    //     title: t('Number of maintenance jobs closed'),
    //     dataIndex: 'maintenanceCount',
    //     key: 'maintenanceCount',
    //     width: '90px',
    //     align: 'center',
    //     render: rowData => rowData || 0,
    //   }
    case 'txt_RepairJobsClosed':
      return {
        title: t('Number of repair jobs closed'),
        key: 'repairCount',
        width: '90px',
        align: 'center',
        render: rowData => rowData?.repairJobsClosed || 0,
      }

    default:
      break
  }
}
const equipmentColumn = () => {
  const columns = {
    txt_Brand: { indexType: 'brandName' },
    txt_ProductSeries: { indexType: 'productSeriesName' },
    txt_Model: { indexType: 'modelName' },
    // job_Maintenance: { indexType: 'maintenance' },
    job_Repair: { indexType: 'repair' },
  }
  return entries(columns).map(([key, value]) =>
    getColumns({ title: key, indexType: value?.indexType }),
  )
}

const feColumn = () => {
  const columns = {
    txt_Brand: { indexType: 'brandName' },
    // txt_MaintenanceJobsClosed: { indexType: 'maintenanceCount' },
    txt_RepairJobsClosed: { indexType: 'repairJobsClosed' },
  }
  return entries(columns).map(([key, value]) =>
    getColumns({ title: key, indexType: value?.indexType }),
  )
}

export {
  equipmentColumn,
  feColumn,
  selectionTableColumn,
  materialColumn,
  finalProductColumn,
}
