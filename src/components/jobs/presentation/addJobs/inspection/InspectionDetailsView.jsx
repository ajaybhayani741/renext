import TabulerView from './TabulerView'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDCard from '../../../../../shared/antd/ANTDCard'
import { userWiseRole } from '../../../../../utils/constant'
import JobUserSelect from '../../common/JobUserSelect'

const InspectionDetailsView = ({ inspectionData, currentForm }) => {
  const { t } = useTranslations()
  const { hostel } = userWiseRole

  return (
    <ANTDCard className="mb-15">
      <h2 className="content-title mb-10">{t('job_InspectionDetails')}</h2>
      {inspectionData?.map((details, index) => (
        <ANTDCard key={index} className="grey-card-body elv-card">
          <JobUserSelect
            {...{
              selectTitle: 'user_Hostel',
              roleId: hostel,
              userData: details?.hostel,
              readOnly: true,
            }}
          />

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
