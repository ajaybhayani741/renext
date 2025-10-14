import { InputNumber } from 'antd'

import useTranslations from '../../hooks/useTranslations'

function ANTDInputNumber({
  form,
  namePath,
  onKeyDown,
  onChange,
  ...restProps
}) {
  const { t } = useTranslations()
  const handleKeyDown = e => {
    if (onKeyDown) return onKeyDown(e)
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Enter',
    ]
    const isCtrlCombo = e.ctrlKey || e.metaKey
    const isAllowedKey =
      allowedKeys.includes(e.key) || isCtrlCombo || /[0-9.-]/.test(e.key)
    if (!isAllowedKey) {
      e.preventDefault()
      if (form && namePath) {
        form.setFields([
          {
            name: namePath,
            errors: [t('error_OnlyNumericValuesAllowed')],
          },
        ])
      }
    }
  }

  const handleChange = val => {
    if (onChange) onChange(val)
    if (form && namePath) {
      if (
        val === undefined ||
        val === null ||
        val === '' ||
        !Number.isNaN(Number(val))
      ) {
        form.setFields([
          {
            name: namePath,
            errors: [],
          },
        ])
      }
    }
  }

  return (
    <InputNumber
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...restProps}
    />
  )
}
export default ANTDInputNumber
