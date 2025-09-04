import { useEffect } from 'react'

import CollapsibleCard from './CollapsibleCard'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDCheckbox from '../../../shared/antd/ANTDCheckbox'
import { ANTDDatePicker } from '../../../shared/antd/ANTDDatePicker'
import ANTDForm, {
  ANTDFormItem,
  useFormFn,
  useFormInstanceFn,
} from '../../../shared/antd/ANTDForm'
import ANTDInput from '../../../shared/antd/ANTDInput'
import ANTDInputNumber from '../../../shared/antd/ANTDInputNumber'
import ANTDPagination from '../../../shared/antd/ANTDPagination'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import ANTDTable from '../../../shared/antd/ANTDTable'
import { isArray, isEqual, length } from '../../../utils/javascript'

const EditableRow = ({ index, ...props }) => {
  return <tr {...props} />
}
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  inputType,
  disabled,
  inputProps,
  ...restProps
}) => {
  const form = useFormInstanceFn()
  const fieldNamePath = [record?.id, dataIndex]
  const save = async () => {
    try {
      const values = await form.validateFields([fieldNamePath])
      handleSave({
        ...record,
        ...values?.[record?.id],
      })
    } catch (errInfo) {
      // console.log('Save failed:', errInfo)
    }
  }
  let childNode = children
  if (editable) {
    const commonProps = {
      disabled,
      ...inputProps,
    }
    childNode = (
      <ANTDFormItem
        style={{
          margin: 0,
        }}
        name={fieldNamePath}
        {...(isEqual(inputType, 'checkbox') && { valuePropName: 'checked' })}
      >
        {isArray(record?.options) ? (
          <ANTDSelect
            className="w-100"
            options={record?.options}
            allowClear={true}
            onBlur={save}
            {...commonProps}
          />
        ) : isEqual(inputType, 'checkbox') ? (
          <div className="text-center">
            <ANTDCheckbox className="big-checkbox" {...commonProps} />
          </div>
        ) : isEqual(inputType, 'datePicker') ? (
          <ANTDDatePicker {...commonProps} />
        ) : isEqual(inputType, 'inputNumber') ? (
          <ANTDInputNumber
            onPressEnter={save}
            onBlur={save}
            className="w-100"
            {...commonProps}
          />
        ) : (
          <ANTDInput onPressEnter={save} onBlur={save} />
        )}
      </ANTDFormItem>
    )
  }
  return <td {...restProps}>{childNode}</td>
}

const EditableTable = ({
  loader,
  dataSource,
  defaultColumns,
  handleSave,
  className,
  bordered = true,
  size,
  summary,
  pagination = false,
  handleTableChange,
  scroll = {
    x: 600,
  },
  responsive = false,
  collapseLabelFn = item => `ID - ${item?.id}`,
  mobViewSummary,
}) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
  const form = useFormFn()

  useEffect(() => {
    form.setFieldsValue(
      dataSource?.reduce((acc, data) => {
        acc[data?.id] = {
          ...data,
        }
        return acc
      }, {}),
    )
  })

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const columns = defaultColumns.map(col => {
    if (isArray(col?.children)) {
      col?.children?.map(val => {
        if (!val.editable) {
          return val
        }
        return {
          ...val,
          onCell: record => {
            return {
              record,
              editable: val.editable,
              dataIndex: val.dataIndex,
              title: val.title,
              handleSave,
            }
          },
        }
      })
    }
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        inputType: col.inputType,
      }),
    }
  })
  return (
    <ANTDForm form={form} component={false}>
      {!responsive || isDesktop ? (
        <ANTDTable
          size={size}
          components={components}
          bordered={bordered}
          loading={loader}
          dataSource={dataSource?.map(item => ({
            ...item,
            key: item?.key || item?.id,
          }))}
          columns={columns}
          pagination={pagination}
          tableLayout="fixed"
          scroll={scroll}
          className={className}
          summary={summary}
          onChange={handleTableChange}
        />
      ) : (
        <>
          {loader && (
            <div className="opacity-loader fixed-loader">
              <ANTDSpin size="large" />
            </div>
          )}
          {!length(dataSource) ? (
            <ANTDCard className="list-card-view">
              <h4 className="text-center">{t('txt_NoData')}</h4>
            </ANTDCard>
          ) : (
            <>
              <CollapsibleCard
                items={dataSource.map((item, index) => ({
                  key: item?.key || item?.id,
                  label: collapseLabelFn(item, index),
                  children: (
                    <div>
                      <table>
                        {columns
                          .filter(col => !col?.hideInCard)
                          .map((col, i) => (
                            <tr key={i}>
                              <td>
                                <b>{col.title}</b>
                              </td>
                              <td>: </td>
                              <td>
                                {col?.cellEditable || col?.editable ? (
                                  <EditableCell {...{ ...col?.onCell(item) }} />
                                ) : col?.render ? (
                                  col?.render(
                                    col?.dataIndex ? item[col.dataIndex] : item,
                                  )
                                ) : (
                                  item[col.dataIndex]
                                )}
                              </td>
                            </tr>
                          ))}
                      </table>
                    </div>
                  ),
                }))}
              />
              <div className="pagination-container">
                <ANTDPagination
                  showSizeChanger={false}
                  responsive
                  hideOnSinglePage
                  {...{ ...pagination }}
                  onChange={current => {
                    handleTableChange({ current })
                  }}
                />
              </div>
              {typeof mobViewSummary === 'function' && mobViewSummary()}
            </>
          )}
        </>
      )}
    </ANTDForm>
  )
}

export default EditableTable
