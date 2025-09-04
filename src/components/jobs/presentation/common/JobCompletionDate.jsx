import useTranslations from '../../../../hooks/useTranslations'
import { ANTDDatePicker } from '../../../../shared/antd/ANTDDatePicker'
import { ANTDFormItem } from '../../../../shared/antd/ANTDForm'
import { validationTag } from '../../../../utils/customFunctions'
import { ternary } from '../../../../utils/javascript'
import { getItem } from '../../../../utils/localstorage'

function JobCompletionDate({ readOnly }) {
  const { t } = useTranslations()
  const lang = getItem('lang')
  return (
    <ANTDFormItem
      label={t('job_CompletionDate')}
      name={'jobCompletionDate'}
      className={`${ternary(readOnly, '', validationTag(lang))} date-label`}
      rules={[
        {
          required: ternary(readOnly, false, true),
          message: t('error_FieldISRequire'),
        },
      ]}
    >
      <ANTDDatePicker
        className="w-100"
        name="jobCompletionDate"
        placeholder={t('job_SelectDate')}
        allowClear={false}
        format={'YYYY/MM/DD'}
        disabled={readOnly}
      />
    </ANTDFormItem>
  )
}

export default JobCompletionDate
