import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import React, { Fragment, memo } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDDivider from '../../../shared/antd/ANTDDivider'
import { ANTDFormItem, ANTDFormList } from '../../../shared/antd/ANTDForm'
import ANTDRow from '../../../shared/antd/ANTDRow'
import getFormInput from '../../../shared/form.description'
import { validationTag } from '../../../utils/customFunctions'
import { entries, length, ternary } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'

const AddMoreForm = ({
  formFieldAttributes,
  listName,
  addonAfterFn,
  onRemoveClick,
  onAddMoreClick,
  addMoreLabel = 'job_AddMore',
  addMoreDisabled,
  className = '',
}) => {
  const { t } = useTranslations()
  const lang = getItem('lang')
  return (
    <div className={`card-box mt-20 ${className}`}>
      <ANTDFormList name={listName} initialValue={['']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }, index) => (
              <div key={key} className="mb-20 grey-card-body">
                <div className="d-flex flex-end align-end">
                  {length(fields) > 1 && (
                    <CloseOutlined
                      className="cursor-pointer"
                      onClick={() => {
                        if (onRemoveClick) {
                          onRemoveClick({ remove, name, index })
                        } else {
                          remove(name)
                        }
                      }}
                    />
                  )}
                </div>
                <ANTDRow gutter={10} className="align-end">
                  {entries(formFieldAttributes)?.map(
                    ([attrKey, attributes]) => {
                      const {
                        label,
                        inputType,
                        md,
                        sm,
                        xs,
                        required,
                        validateKey,
                        options,
                        divider,
                        hidden,
                        btnLabel,
                        ...restProps
                      } = attributes || {}
                      const optionList = options?.map(val => ({
                        ...val,
                        label: t(val.label),
                      }))

                      if (restProps.addonAfter && addonAfterFn) {
                        restProps.addonAfter = addonAfterFn(name)
                      }

                      const InputComponent = getFormInput({ inputType })
                      return (
                        <Fragment key={attrKey}>
                          {!hidden && (
                            <>
                              <ANTDColumn md={md} sm={sm} xs={xs}>
                                <ANTDFormItem
                                  name={[name, attrKey]}
                                  label={t(label)}
                                  validateTrigger={'onChange'}
                                  rules={ternary(
                                    required,
                                    [
                                      {
                                        required: true,
                                        message: t('error_FieldISRequire'),
                                      },
                                    ],
                                    [],
                                  )}
                                  className={ternary(
                                    required,
                                    validationTag(lang),
                                    '',
                                  )}
                                >
                                  <InputComponent
                                    {...restProps}
                                    options={optionList}
                                  />
                                </ANTDFormItem>
                              </ANTDColumn>
                              {divider && (
                                <ANTDDivider className="form-divider" />
                              )}
                            </>
                          )}
                        </Fragment>
                      )
                    },
                  )}
                </ANTDRow>
              </div>
            ))}
            {
              <ANTDFormItem className="d-flex justify-center mb-10">
                <ANTDButton
                  type="primary"
                  className="btn"
                  disabled={addMoreDisabled}
                  onClick={() => {
                    if (onAddMoreClick) {
                      onAddMoreClick({
                        addMore: add,
                      })
                    } else {
                      add()
                    }
                  }}
                  icon={<PlusOutlined />}
                  block
                >
                  {t(addMoreLabel)}
                </ANTDButton>
              </ANTDFormItem>
            }
          </>
        )}
      </ANTDFormList>
    </div>
  )
}

export default memo(AddMoreForm)
