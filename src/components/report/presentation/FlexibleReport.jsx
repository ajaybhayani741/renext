import CreateReport from './CreateReport'
import SavedReports from './SavedReports'
import useTranslations from '../../../hooks/useTranslations'
import ANTDTab from '../../../shared/antd/ANTDTab'

const FlexibleReport = () => {
  const { t } = useTranslations()
  return (
    <>
      <ANTDTab
        size="small"
        items={[
          {
            label: t('rpt_CreateReport'),
            key: 'create-report',
            children: <CreateReport />,
          },
          {
            label: t('rpt_SavedReports'),
            key: 'saved-reports',
            children: <SavedReports />,
            destroyInactiveTabPane: true,
          },
        ]}
        centered
      />
    </>
  )
}

export default FlexibleReport
