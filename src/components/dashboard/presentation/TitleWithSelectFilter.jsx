import { useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import { isArray, isEqual, length, notEqual } from '../../../utils/javascript'

const TitleWithSelectFilter = ({
  title,
  options,
  defaultValue,
  onChange,
  type,
  ...restProps
}) => {
  const { t } = useTranslations()
  const [selectedValue, setSelectedValue] = useState(
    isArray(defaultValue) ? defaultValue : [],
  )

  const onSelectChange = value => {
    let valueArr = [...selectedValue, value]

    if (isEqual(value, 'Select All')) {
      valueArr = options?.map(item => item?.value)
      valueArr.push('Select All')
    } else if (length(valueArr) === length(options)) {
      valueArr.push('Select All')
    }

    setSelectedValue(valueArr)
    onChange && onChange(valueArr, type)
  }

  const onDeselectChange = value => {
    let valueArr = [...selectedValue]
    if (isEqual(value, 'Select All')) {
      valueArr = []
    } else {
      valueArr = valueArr?.filter(
        item => notEqual(item, 'Select All') && notEqual(item, value),
      )
    }

    setSelectedValue(valueArr)
    onChange && onChange(valueArr, type)
  }

  return (
    <div className="chart-select-title-header">
      <h3>{t(title)}</h3>
      <div className="select-wrapper">
        <ANTDSelect
          showSearch={false}
          mode={'multiple'}
          maxTagCount="responsive"
          value={selectedValue}
          options={[
            { label: 'job_SelectAll', value: 'Select All' },
            ...options,
          ]?.map(({ label, value }) => ({
            label: t(label),
            value,
          }))}
          onSelect={onSelectChange}
          onDeselect={onDeselectChange}
          {...restProps}
        />
      </div>
    </div>
  )
}

export default TitleWithSelectFilter
