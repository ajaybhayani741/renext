import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import React from 'react'

import useTranslations from '../../../../../hooks/useTranslations'
import ANTDButton from '../../../../../shared/antd/ANTDButton'
import { ANTDFormItem, useWatchFn } from '../../../../../shared/antd/ANTDForm'
import ANTDInputNumber from '../../../../../shared/antd/ANTDInputNumber'
import ANTDTable, {
  ANTDTableCell,
  ANTDTableRow,
} from '../../../../../shared/antd/ANTDTable'
import { length } from '../../../../../utils/javascript'

const ChallanFormTable = ({
  form,
  name,
  totalCalculated,
  totalEntered,
  disableFieldsForTech,
}) => {
  const { t } = useTranslations()
  const commercialDto = useWatchFn(['recoverList', ...name], form)

  const challanFieldColumn = [
    {
      title: t(
        'job_ChallanAmountDeductedFromCustomerQuotedPriceAgainstTotalChallanAmount',
      ),
      dataIndex: 'index',
      key: 'challanCustomerQuotedPrice',
      render: rowData => {
        return (
          <ANTDFormItem
            name={[
              ...name,
              'challanDetailsDtos',
              rowData,
              'challanCustomerQuotedPrice',
            ]}
            className="w-100"
            noStyle
          >
            <ANTDInputNumber
              className="w-100"
              disabled={disableFieldsForTech}
            />
          </ANTDFormItem>
        )
      },
    },
    {
      title: t(
        'job_ChallanAmountDeductedFromDealerCommissionPriceAgainstTotalChallanAmount',
      ),
      dataIndex: 'index',
      key: 'challanDealerCommissionPrice',
      render: rowData => {
        return (
          <ANTDFormItem
            name={[
              ...name,
              'challanDetailsDtos',
              rowData,
              'challanDealerCommissionPrice',
            ]}
            className="w-100"
            noStyle
          >
            <ANTDInputNumber
              className="w-100"
              disabled={disableFieldsForTech}
            />
          </ANTDFormItem>
        )
      },
    },
    {
      title: t('job_TotalChallanValueChallanDeduction'),
      dataIndex: 'index',
      key: 'totalAmount',
      render: rowData => {
        return (
          <ANTDFormItem
            name={[...name, 'challanDetailsDtos', rowData, 'totalAmount']}
            className="w-100"
            noStyle
          >
            <ANTDInputNumber className="w-100" disabled />
          </ANTDFormItem>
        )
      },
    },
    {
      title: '',
      dataIndex: 'index',
      render: rowData =>
        length(commercialDto?.challanDetailsDtos) > 1 && (
          <ANTDButton
            type="primary"
            className="btn"
            disabled={totalCalculated >= totalEntered}
            onClick={() => {
              const updatedDto = [...(commercialDto?.challanDetailsDtos || [])]
              updatedDto?.splice(rowData, 1)
              form.setFieldValue(
                ['recoverList', ...name, 'challanDetailsDtos'],
                updatedDto,
              )
            }}
            icon={<MinusOutlined />}
          />
        ),
    },
  ]

  return (
    <>
      <ANTDTable
        columns={challanFieldColumn}
        className="mt-10 mb-20"
        dataSource={
          commercialDto?.challanDetailsDtos?.map((_, index) => ({
            key: index,
            index,
          })) || [{ key: 0, index: 0 }]
        }
        pagination={{
          pageSize: 9,
          responsive: true,
          hideOnSinglePage: true,
        }}
        scroll={{
          x: '100%',
        }}
        summary={() => {
          const totalChallanAmountDeductedCustomer =
            commercialDto?.challanDetailsDtos?.reduce(
              (init, val) =>
                (init += parseInt(val?.challanCustomerQuotedPrice || 0)),
              0,
            )
          const totalChallanAmountDeductedDealer =
            commercialDto?.challanDetailsDtos?.reduce(
              (init, val) =>
                (init += parseInt(val?.challanDealerCommissionPrice || 0)),
              0,
            )
          const totalChallanValueChallanDeduction =
            commercialDto?.challanDetailsDtos?.reduce(
              (init, val) => (init += parseInt(val?.totalAmount || 0)),
              0,
            )
          return (
            <>
              <ANTDTableRow>
                <ANTDTableCell>
                  <span>{t('dvz_Total')}: </span>{' '}
                  <b>{totalChallanAmountDeductedCustomer}</b>
                </ANTDTableCell>
                <ANTDTableCell /* className="text-end" */>
                  <span>{t('dvz_Total')}: </span>{' '}
                  <b>{totalChallanAmountDeductedDealer}</b>
                </ANTDTableCell>
                <ANTDTableCell /* className="text-end" */>
                  <span>{t('dvz_Total')}: </span>{' '}
                  <b>{totalChallanValueChallanDeduction}</b>
                </ANTDTableCell>
                <ANTDTableCell>
                  <ANTDButton
                    type="primary"
                    className="btn"
                    disabled={totalCalculated >= totalEntered}
                    onClick={() => {
                      form.setFieldValue(
                        ['recoverList', ...name, 'challanDetailsDtos'],
                        [...(commercialDto?.challanDetailsDtos || [{}]), {}],
                      )
                    }}
                    icon={<PlusOutlined />}
                  />
                </ANTDTableCell>
              </ANTDTableRow>
            </>
          )
        }}
      />
    </>
  )
}

export default ChallanFormTable
