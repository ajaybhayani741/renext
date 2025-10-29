import { Fragment, memo } from 'react'

import useRedux from '../../../../../hooks/useRedux'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDButton from '../../../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../../../shared/antd/ANTDColumn'
import ANTDDivider from '../../../../../shared/antd/ANTDDivider'
import {
  ANTDFormItem,
  useFormInstanceFn,
  useWatchFn,
} from '../../../../../shared/antd/ANTDForm'
import ANTDRow from '../../../../../shared/antd/ANTDRow'
import ANTDSelect from '../../../../../shared/antd/ANTDSelect'
import getFormInput from '../../../../../shared/form.description'
import { validationTag } from '../../../../../utils/customFunctions'
import { entries, isEqual } from '../../../../../utils/javascript'
import { getItem } from '../../../../../utils/localstorage'

const InspectionFormField = ({
  attrList,
  name,
  index,
  nestedKey,
  className = '',
  showSaveBtn,
  disabledAll,
  onSaveClick,
}) => {
  const { t } = useTranslations()
  const form = useFormInstanceFn()
  const inspectionListData = useWatchFn(
    ['inspectionList', name, ...(nestedKey ? [nestedKey] : [])],
    form,
  )
  const lang = getItem('lang')
  const { selector } = useRedux()
  const isMobile = selector(state => state.app.isMobile)

  const FIELD_LAYOUTS = {
    vertical: {
      layout: 'vertical',
    },
    horizontal: {
      layout: 'horizontal',
      labelCol: { xs: 16, sm: 16, md: 14, lg: 12 },
      wrapperCol: { xs: 8, sm: 8, md: 10, lg: 12 },
    },
  }
  const FIELD_TYPE_LAYOUT = {
    textArea: isMobile ? 'vertical' : 'horizontal',
    select: isMobile ? 'vertical' : 'horizontal',
    input: 'horizontal',
    inputNumber: 'horizontal',
    dateTimePicker: 'horizontal',
    formUpload: 'horizontal',
    RADIO_BUTTON: 'horizontal',
  }

  return (
    <>
      <ANTDRow
        gutter={10}
        className={`form-field-row align-end ${className}`}
        key={index}
      >
        {entries(attrList)?.map(([attrKey, attributes]) => {
          const {
            title,
            label,
            inputType,
            md,
            sm,
            xs,
            required,
            validateKey,
            options,
            divider,
            dividerText,
            hidden,
            disabled,
            maxSize,
            uploadSingle,
            rules = [],
            dependencies,
            render,
            initialValue,
            extra,
            fieldSuffix = null,
            fieldPrefix = null,
            colClassName,
            responsiveInputType = null,
            ...restProps
          } = attributes || {}
          const isHidden = isEqual(typeof hidden, 'function')
            ? hidden(inspectionListData)
            : hidden
          const isDisabled = isEqual(typeof disabled, 'function')
            ? disabled({ ...inspectionListData, disabledAll })
            : (disabled ?? disabledAll) //individual field has more precedence than section disabled
          const optionList = options?.map(val => ({
            ...val,
            label: typeof val.label === 'object' ? val.label : t(val.label),
          }))
          const fieldPath = [name, ...(nestedKey ? [nestedKey] : [])]
          const rulesArr = isEqual(typeof rules, 'function')
            ? rules(fieldPath)
            : rules
          const dependenciesArr = isEqual(typeof dependencies, 'function')
            ? dependencies(fieldPath)
            : dependencies
          if (isEqual(attrKey, 'scrapQuantity')) {
            restProps.addonAfter = (
              <ANTDFormItem
                name={[...fieldPath, 'unit']}
                initialValue="kgs"
                noStyle
              >
                <ANTDSelect
                  options={[
                    { label: t('job_Kgs'), value: 'kgs' },
                    { label: t('job_Tons'), value: 'tons' },
                  ]}
                />
              </ANTDFormItem>
            )
          }
          if (isEqual(inputType, 'inputNumber')) {
            restProps.formatter = val => val && Number(val)
            restProps.precision = 2 //upto 2 decimal places
            // pass form and name path to ANTDInputNumber so it can show inline errors on invalid key press
            restProps.form = form
            restProps.namePath = ['inspectionList', ...fieldPath, attrKey]
          }
          if (isEqual(inputType, 'vehicleModelSelector')) {
            restProps.fieldName = ['inspectionList', ...fieldPath, attrKey]
          }
          const currentInputType = isMobile
            ? responsiveInputType || inputType
            : inputType
          const InputComponent = getFormInput({
            inputType: currentInputType,
          })
          const layoutType = FIELD_TYPE_LAYOUT[currentInputType] || 'vertical'
          const layoutProps = FIELD_LAYOUTS[layoutType]

          if (!isHidden && title)
            return (
              <h3 className="mb-10 w-100 px-5" key={attrKey}>
                {t(title)}
              </h3>
            )

          if (!isHidden && render)
            return (
              <ANTDColumn
                md={md}
                sm={sm}
                xs={xs}
                key={attrKey}
                className={colClassName}
              >
                {render(fieldPath, inspectionListData, disabledAll)}
              </ANTDColumn>
            )

          return (
            <Fragment key={attrKey}>
              {!isHidden && (
                <>
                  <ANTDColumn
                    md={md}
                    sm={sm}
                    xs={xs}
                    key={attrKey}
                    className={colClassName}
                  >
                    {fieldPrefix}
                    <ANTDFormItem
                      name={[...fieldPath, attrKey]}
                      label={t(label)}
                      validateTrigger={'onChange'}
                      rules={
                        required
                          ? [
                              ...(disabledAll
                                ? []
                                : [
                                    {
                                      required: true,
                                      message: t('error_FieldISRequire'),
                                    },
                                  ]),
                              ...rulesArr,
                            ]
                          : [...rulesArr]
                      }
                      dependencies={dependenciesArr}
                      className={
                        required && !disabledAll ? validationTag(lang) : ''
                      }
                      initialValue={initialValue}
                      extra={extra}
                      {...layoutProps}
                    >
                      <InputComponent
                        {...restProps}
                        options={optionList}
                        disabled={isDisabled}
                      />
                    </ANTDFormItem>
                    {fieldSuffix}
                  </ANTDColumn>
                  {divider && (
                    <ANTDDivider className="form-divider">
                      {dividerText && t(dividerText)}
                    </ANTDDivider>
                  )}
                </>
              )}
            </Fragment>
          )
        })}
      </ANTDRow>
      {showSaveBtn && (
        <div className="text-center mt-10">
          <ANTDButton type="primary" className="btn " onClick={onSaveClick}>
            {t('btn_Save')}
          </ANTDButton>
        </div>
      )}
    </>
  )
}

export default memo(InspectionFormField)
