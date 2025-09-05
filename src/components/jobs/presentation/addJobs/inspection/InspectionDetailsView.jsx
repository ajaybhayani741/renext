import TabulerView from './TabulerView'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDCard from '../../../../../shared/antd/ANTDCard'

const InspectionDetailsView = ({ inspectionData, currentForm }) => {
  const { t } = useTranslations()

  return (
    <ANTDCard className="mb-15">
      <h2 className="content-title mb-10">{t('job_InspectionDetails')}</h2>
      {inspectionData?.map((details, index) => (
        <ANTDCard key={index} className="grey-card-body elv-card">
          {/* {userSelectionList?.map(({ key, ...props }) => (
        <JobUserSelect
          key={key}
          {...{
            ...props,
            readOnly: true,
          }}
        />
      ))} */}
          <TabulerView
            inspectionDetails={details}
            // userSelectionList={userSelectionList}
            currentForm={currentForm}
          />
        </ANTDCard>
      ))}
    </ANTDCard>
  )
}

export default InspectionDetailsView
