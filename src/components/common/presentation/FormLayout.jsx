import '../common.scss'
import { PlusOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { Fragment } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDDivider from '../../../shared/antd/ANTDDivider'
import { ANTDFormItem, ANTDFormList } from '../../../shared/antd/ANTDForm'
import ANTDRow from '../../../shared/antd/ANTDRow'
import getFormInput from '../../../shared/form.description'
import { validationTag } from '../../../utils/customFunctions'
import { CloseOutlined } from '../../../utils/icons'
import { entries, isEqual, length, ternary } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { userValidation } from '../../../utils/validation'

const FormLayout = ({
  name = [],
  formFieldAttributes,
  form,
  getAddressData,
  currentAddress,
}) => {
  const { t } = useTranslations()
  const lang = getItem('lang')

  const addMoreClick = ({ fields, fieldName, addMoreError, add }) => {
    const isError = fields.some(({ name }) => {
      const errArr = form.getFieldError([...fieldName, name])
      return length(errArr)
    })
    if (isError) return
    const valArr = form.getFieldValue(fieldName)
    const emptyIndex = valArr?.findIndex(val => !val)
    if (emptyIndex >= 0)
      return form.setFields([
        {
          name: [...fieldName, emptyIndex],
          errors: [t(addMoreError)],
        },
      ])
    add()
  }

  return (
    <ANTDRow gutter={10} className="w-100 align-end">
      {entries(formFieldAttributes)?.map(([key, attributes]) => {
        const {
          label,
          inputType,
          md,
          sm,
          xs,
          child,
          title,
          divider,
          addMore,
          addMoreLabel,
          addMoreError,
          maxField = 10,
          additionalLabel,
          rules,
          required,
          validateKey,
          hidden,
          validateTrigger,
          options,
          initialValue,
          placeholder,
          render,
          extra,
          colClassName,
          ...restProps
        } = attributes || {}
        const fieldName = name.concat(key)
        const InputComponent = getFormInput({ inputType })
        const optionList = options?.map(val => ({
          ...val,
          label: t(val.label),
        }))
        const rulesArr = ternary(
          required,
          [
            { required: true, message: t('error_FieldISRequire') },
            ...(rules || []),
            ...userValidation({ type: validateKey, t, fieldName }),
          ],
          [
            ...(rules || []),
            ...userValidation({ type: validateKey, t, fieldName }),
          ],
        )

        if (isEqual(inputType, 'formUpload')) {
          restProps.name = fieldName
          restProps.form = form
        }

        if (isEqual(inputType, 'autoCompleteAddress')) {
          restProps.getAddressData = getAddressData
          restProps.currentAddress = currentAddress
        }

        if (isEqual(inputType, 'inputNumber')) {
          restProps.form = form
          restProps.namePath = fieldName
        }

        if (typeof render === 'function')
          return (
            <ANTDColumn
              md={md}
              sm={sm}
              xs={xs}
              key={key}
              className={colClassName}
            >
              {render(fieldName)}
            </ANTDColumn>
          )

        return (
          <Fragment key={key}>
            {title && <h3 className="mb-10 w-100">{t(title)}</h3>}
            {child ? (
              <>
                <FormLayout
                  name={fieldName}
                  formFieldAttributes={child}
                  form={form}
                />
              </>
            ) : (
              <>
                {addMore ? (
                  <ANTDFormList name={fieldName} initialValue={['']}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <ANTDFormItem
                            {...field}
                            label={ternary(
                              isEqual(index, 0),
                              t(label),
                              `${t(additionalLabel)}${index}`,
                            )}
                            key={field.key}
                            validateTrigger={validateTrigger}
                            rules={rulesArr}
                            className={classNames('w-100', {
                              [validationTag(lang)]: required,
                            })}
                            initialValue={initialValue}
                          >
                            <InputComponent
                              {...restProps}
                              suffix={
                                length(fields) > 1 ? (
                                  <CloseOutlined
                                    className="cursor-pointer"
                                    onClick={() => remove(field.name)}
                                  />
                                ) : null
                              }
                            />
                          </ANTDFormItem>
                        ))}

                        {length(fields) < maxField && (
                          <ANTDFormItem className="d-flex flex-end w-100">
                            <ANTDButton
                              type="primary"
                              onClick={() =>
                                addMoreClick({
                                  fields,
                                  fieldName,
                                  addMoreError,
                                  add,
                                })
                              }
                              style={{
                                width: '100%',
                              }}
                              icon={<PlusOutlined />}
                            >
                              {t(addMoreLabel)}
                            </ANTDButton>
                          </ANTDFormItem>
                        )}
                      </>
                    )}
                  </ANTDFormList>
                ) : (
                  <>
                    {hidden ? null : (
                      <ANTDColumn
                        md={md}
                        sm={sm}
                        xs={xs}
                        className={colClassName}
                      >
                        <ANTDFormItem
                          name={fieldName}
                          label={t(label)}
                          validateTrigger={validateTrigger}
                          rules={rulesArr}
                          className={ternary(required, validationTag(lang), '')}
                          initialValue={initialValue}
                          extra={extra}
                        >
                          <InputComponent
                            {...restProps}
                            options={optionList}
                            placeholder={t(placeholder)}
                          />
                        </ANTDFormItem>
                      </ANTDColumn>
                    )}
                  </>
                )}
              </>
            )}
            {divider && <ANTDDivider className="form-divider" />}
          </Fragment>
        )
      })}
    </ANTDRow>
  )
}

export default FormLayout
