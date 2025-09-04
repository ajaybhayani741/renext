import useTranslations from '../../../../hooks/useTranslations'
import { ANTDFormItem } from '../../../../shared/antd/ANTDForm'
import { ANTDTextArea } from '../../../../shared/antd/ANTDInput'

function Remarks({ readOnly }) {
  const { t } = useTranslations()
  return (
    <ANTDFormItem label={t('job_Remarks')} name="remark">
      <ANTDTextArea placeholder={t('job_Remarks')} disabled={readOnly} />
    </ANTDFormItem>
  )
}

export default Remarks
