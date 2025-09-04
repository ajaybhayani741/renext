import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'

import useTranslations from '../../../hooks/useTranslations'
import ANTDTable, {
  ANTDTableCell,
  ANTDTableRow,
} from '../../../shared/antd/ANTDTable'
import { fixedNumber, numberFormat } from '../../../utils/customFunctions'

const DiscrepanciesTable = ({ data }) => {
  const { t } = useTranslations()

  const dataSource = [
    {
      type: 'txt_ScratchSalesDifference',
      amount: data?.totalScratchDifference,
    },
    {
      type: 'txt_LottoSalesDifference',
      amount: data?.totalLottoDifference,
    },
    {
      type: 'txt_PrepaidSalesDifference',
      amount: data?.totalPrepaidDifference,
    },
    {
      type: 'txt_PayoutDifference',
      amount: data?.payoutDifference,
    },
    {
      type: 'rpt_SalesDifference',
      amount: data?.salesDifference,
    },
    {
      type: 'rpt_SafeTubesDifference',
      amount: data?.safeTubesDifference,
    },
    {
      type: 'rpt_BanillaDifference',
      amount: data?.banillaDifference,
    },
    {
      type: 'rpt_FrontierBalance',
      amount: data?.frontierBalance,
    },
  ]

  const numberWithArrow = number =>
    number === 0 ? (
      number
    ) : number < 0 ? (
      <span className="red-color-text">
        {numberFormat(Math.abs(number))}
        <ArrowDownOutlined
          style={{
            color: 'red',
            fontSize: 12,
            verticalAlign: 'unset',
            marginLeft: '4px',
          }}
        />
      </span>
    ) : (
      <span className="green-color-text">
        {numberFormat(number)}
        <ArrowUpOutlined
          style={{
            color: 'green',
            fontSize: 12,
            verticalAlign: 'unset',
            marginLeft: '4px',
          }}
        />
      </span>
    )

  const columns = [
    {
      title: t('txt_DiscrepancyType'),
      dataIndex: 'type',
      key: 'type',
      render: rawData => t(rawData),
    },
    {
      title: t('bkm_AmountDollar'),
      dataIndex: 'amount',
      key: 'amount',
      render: rawData => (
        <span style={{ fontWeight: 500 }}>{numberWithArrow(rawData)}</span>
      ),
    },
  ]

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
      }}
    >
      <ANTDTable
        bordered
        loading={data?.loader}
        dataSource={dataSource?.map(item => ({
          ...item,
          key: item?.title,
          amount: fixedNumber(item?.amount),
        }))}
        columns={columns}
        pagination={false}
        summary={() => {
          return (
            <>
              <ANTDTableRow>
                <ANTDTableCell>
                  <b>{t('txt_TotalAmount')}</b>
                </ANTDTableCell>
                <ANTDTableCell>
                  <b className="red-color-text">
                    {numberWithArrow(data?.total)}
                  </b>
                </ANTDTableCell>
              </ANTDTableRow>
            </>
          )
        }}
      />
    </div>
  )
}

export default DiscrepanciesTable
