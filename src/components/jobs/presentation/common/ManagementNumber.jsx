import useTranslations from '../../../../hooks/useTranslations'
import ANTDCollapse from '../../../../shared/antd/ANTDCollapse'
import { ANTDFormItem } from '../../../../shared/antd/ANTDForm'
import ANTDInput from '../../../../shared/antd/ANTDInput'

function ManagementNumber({ collapseHeader, ...rest }) {
  const { t } = useTranslations()
  const fieldUI = (
    <ANTDFormItem
      label={t('job_ManagementNumberOptional')}
      name="managementNumber"
    >
      <ANTDInput {...rest} placeholder={t('job_ManagementNumberOptional')} />
    </ANTDFormItem>
  )

  const items = [
    {
      key: '1',
      label: t('job_ManagementNumberOptional'),
      className: 'coll collapse-header',
      children: fieldUI,
    },
  ]
  return collapseHeader ? (
    <ANTDCollapse
      {...{
        items,
        ...(rest?.value && {
          defaultActiveKey: ['1'],
        }),
      }}
    />
  ) : (
    fieldUI
  )
}

export default ManagementNumber
