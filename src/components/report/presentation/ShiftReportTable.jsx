import '../report.scss'

import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import { numberFormat } from '../../../utils/customFunctions'
import { include, nullOrUndefined } from '../../../utils/javascript'
import EditableTable from '../../common/presentation/EditableTable'
import {
  allPayoutData,
  banillaReportData,
  finalReportData,
  frontierReportData,
  queenReportData,
  salesReportData,
} from '../report.description'

const ShiftReportTable = ({
  readOnly,
  disabled,
  handleSave,
  dataSource,
  loader,
}) => {
  const { t } = useTranslations()

  const boldRender = rawData =>
    nullOrUndefined(rawData) ? '-' : <b>{rawData}</b>
  const boldRenderNumber = (rawData, isRed) =>
    nullOrUndefined(rawData) ? (
      '-'
    ) : (
      <b className={isRed ? 'red-color-text' : ''}>
        {numberFormat(rawData?.toFixed?.(2))}
      </b>
    )

  const tableViewList = [
    {
      key: 1,
      data: allPayoutData,
      columns: [
        {
          title: `${t('rpt_AllPayouts')} ($)`,
          dataIndex: 'title',
          key: 'rpt_AllPayouts',
          colSpan: 2,
          render: rawData => boldRender(t(rawData)),
        },
        {
          title: '',
          dataIndex: 'dataIndex',
          key: 'dataIndex',
          colSpan: 0,
          render: (rawData, record) => boldRenderNumber(record?.[rawData] || 0),
          onCell: record => {
            if (!readOnly && include([2, 3, 6, 7, 8], record?.id)) {
              return {
                record: record,
                editable: true,
                dataIndex: record?.dataIndex,
                inputType: 'inputNumber',
                handleSave: val => handleSave(val, 'payout'),
                disabled,
              }
            }
            return {}
          },
        },
      ],
    },
    {
      key: 2,
      data: salesReportData,
      columns: [
        {
          title: `${t('rpt_SalesReports')} ($)`,
          dataIndex: 'title',
          key: 'rpt_SalesReports',
          colSpan: 2,
          render: rawData => boldRender(t(rawData)),
        },
        {
          title: '',
          dataIndex: 'dataIndex',
          key: 'dataIndex',
          colSpan: 0,
          render: (rawData, record) => {
            if (include([7, 8, 9, 10], record?.id)) {
              return boldRenderNumber(record?.[rawData] || 0, true)
            }

            return boldRenderNumber(record?.[rawData] || 0)
          },
          onCell: record => {
            if (!readOnly && include([2, 3, 4, 5, 6], record?.id)) {
              return {
                record,
                editable: true,
                dataIndex: record?.dataIndex,
                inputType: 'inputNumber',
                handleSave: val => handleSave(val, 'sales'),
                disabled,
              }
            }
            return {}
          },
        },
      ],
    },
    {
      key: 3,
      data: finalReportData,
      columns: [
        {
          title: `${t('rpt_FinalReports')} ($)`,
          dataIndex: 'title',
          key: 'rpt_FinalReports',
          colSpan: 2,
          render: rawData => boldRender(t(rawData)),
        },
        {
          title: '',
          dataIndex: 'dataIndex',
          key: 'dataIndex',
          colSpan: 0,
          render: (rawData, record) => {
            if (include([6, 7, 16], record?.id)) {
              return boldRenderNumber(record?.[rawData] || 0, true)
            }

            return boldRenderNumber(record?.[rawData] || 0)
          },
          onCell: record => {
            if (!readOnly && include([1, 2, 3, 5], record?.id)) {
              return {
                record,
                editable: true,
                dataIndex: record?.dataIndex,
                inputType: 'inputNumber',
                handleSave: val => handleSave(val, 'final'),
                disabled,
              }
            }
            return {}
          },
        },
      ],
    },
    {
      key: 4,
      data: queenReportData,
      columns: [
        {
          title: `${t('rpt_Queen')} ($)`,
          dataIndex: 'title',
          key: 'rpt_Queen',
          colSpan: 2,
          render: rawData => boldRender(t(rawData)),
        },
        {
          title: '',
          dataIndex: 'dataIndex',
          key: 'dataIndex',
          colSpan: 0,
          render: (rawData, record) => {
            return boldRenderNumber(record?.[rawData] || 0)
          },
          onCell: record => {
            if (!readOnly && include([9, 10, 11], record?.id)) {
              return {
                record,
                editable: true,
                dataIndex: record?.dataIndex,
                inputType: 'inputNumber',
                handleSave: val => handleSave(val, 'final'),
                disabled,
              }
            }
            return {}
          },
        },
      ],
    },
    {
      key: 5,
      data: banillaReportData,
      columns: [
        {
          title: `${t('rpt_Banilla')} ($)`,
          dataIndex: 'title',
          key: 'rpt_Banilla',
          colSpan: 2,
          render: rawData => boldRender(t(rawData)),
        },
        {
          title: '',
          dataIndex: 'dataIndex',
          key: 'dataIndex',
          colSpan: 0,
          render: (rawData, record) => {
            if (include([16], record?.id)) {
              return boldRenderNumber(record?.[rawData] || 0, true)
            }

            return boldRenderNumber(record?.[rawData] || 0)
          },
          onCell: record => {
            if (!readOnly && include([13, 14], record?.id)) {
              return {
                record,
                editable: true,
                dataIndex: record?.dataIndex,
                inputType: 'inputNumber',
                handleSave: val => handleSave(val, 'final'),
                disabled,
              }
            }
            return {}
          },
        },
      ],
    },
    {
      key: 6,
      data: frontierReportData,
      columns: [
        {
          title: `${t('rpt_Frontier')} ($)`,
          dataIndex: 'title',
          key: 'rpt_Frontier',
          colSpan: 2,
          render: rawData => boldRender(t(rawData)),
        },
        {
          title: '',
          dataIndex: 'dataIndex',
          key: 'dataIndex',
          colSpan: 0,
          render: (rawData, record) => {
            if (include([3], record?.id)) {
              return boldRenderNumber(record?.[rawData] || 0, true)
            }

            return boldRenderNumber(record?.[rawData] || 0)
          },
          onCell: record => {
            if (!readOnly && include([1, 2], record?.id)) {
              return {
                record,
                editable: true,
                dataIndex: record?.dataIndex,
                inputType: 'inputNumber',
                handleSave: val => handleSave(val, 'frontier'),
                disabled,
              }
            }
            return {}
          },
        },
      ],
    },
  ]

  return (
    <ANTDRow gutter={[15, 15]}>
      {tableViewList.map(({ key, data, columns, summary }) => (
        <ANTDColumn key={key} xs={24} sm={24} md={12} lg={8}>
          <EditableTable
            {...{
              className:
                'bold-cell-border bold-table-cell-text input-align-text',
              loader,
              dataSource: data?.map(item => ({
                ...item,
                key: item?.key || item?.id,
                [item?.dataIndex]: dataSource?.[item?.dataIndex] ?? 0,
              })),
              defaultColumns: columns,
              scroll: {
                x: 300,
              },
              summary,
            }}
          />
        </ANTDColumn>
      ))}
    </ANTDRow>
  )
}

export default ShiftReportTable
