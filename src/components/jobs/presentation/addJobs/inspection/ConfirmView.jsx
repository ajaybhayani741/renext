import InspectionDetailsView from './InspectionDetailsView'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDConfigProvider from '../../../../../shared/antd/ANTDConfigProvider'
import { ANTDDatePicker } from '../../../../../shared/antd/ANTDDatePicker'
import ANTDDivider from '../../../../../shared/antd/ANTDDivider'
import {
  ANTDFormItem,
  useFormInstanceFn,
} from '../../../../../shared/antd/ANTDForm'
import { userWiseRole } from '../../../../../utils/constant'
import { dayJs } from '../../../../../utils/dayjs'
import { entries } from '../../../../../utils/javascript'

const ConfirmView = ({
  selectedUsers,
  inspectionFormFieldsAttr,
  findingsAttrFn,
}) => {
  const { t } = useTranslations()
  const form = useFormInstanceFn()
  const inspectionListData = form?.getFieldValue('inspectionList')
  const { hostel } = userWiseRole
  const dateToString = date => (date ? dayJs(date)?.format('DD/MM/YYYY') : '')
  const inspectionData = inspectionListData?.map((details, index) => {
    const {
      hostelAdministrationRequestDto,
      hostelInfraRoomsRequestDto,
      hostelInfraSanitationRequestDto,
      medicalCareRequestDto,
      educationFacilitiesRequestDto,
      foodProvisionRequestDto,
      safetyAndSecurityRequestDto,
      conductionMeetingsRequestDto,
      feedbackRequestDto,
    } = details || {}

    const mapKeyValue = (attributes, values) => {
      const data = {}
      entries(attributes)?.forEach(([key, item]) => {
        if (item.inputType === 'select') {
          data[key] = item.options?.find(
            option => option?.value === values?.[key],
          )?.label
          data[`${key}Selected`] = values?.[key]
        } else if (item.inputType === 'dateTimePicker') {
          data[key] = dateToString(values?.[key])
        } else {
          data[key] = values?.[key]
        }
      })
      return data
    }

    return {
      hostel: [selectedUsers?.[hostel]?.[index]],
      systemId: details?.systemId,
      hostelAdministrationRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.hostelAdministrationAttrFn(),
        hostelAdministrationRequestDto,
      ),
      hostelInfraRoomsRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.hostelInfraRoomsAttrFn(),
        hostelInfraRoomsRequestDto,
      ),
      hostelInfraSanitationRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.hostelInfraSanitationAttrFn(),
        hostelInfraSanitationRequestDto,
      ),
      medicalCareRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.medicalCareAttrFn(),
        medicalCareRequestDto,
      ),
      educationFacilitiesRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.educationFacilitiesAttrFn(),
        educationFacilitiesRequestDto,
      ),
      foodProvisionRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.foodProvisionAttrFn(),
        foodProvisionRequestDto,
      ),
      safetyAndSecurityRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.safetyAndSecurityAttrFn(),
        safetyAndSecurityRequestDto,
      ),
      conductionMeetingsRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.conductionMeetingsAttrFn(),
        conductionMeetingsRequestDto,
      ),
      feedbackRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.feedbackAttrFn(),
        feedbackRequestDto,
      ),
    }
  })
  return (
    <ANTDConfigProvider
      theme={{
        token: {
          colorBgContainerDisabled: '#ffffff',
        },
      }}
    >
      <h2 className="content-title mb-15">{t('job_Preview')}</h2>
      <ANTDDivider className="mb-10" />
      <div className="confirm-date">
        <ANTDFormItem
          label={t('job_DateOfInspectionAndTime')}
          name={'jobCompletionDate'}
          className={`date-label`}
        >
          <ANTDDatePicker
            showTime
            className="w-100"
            name="jobCompletionDate"
            placeholder={t('job_SelectDate')}
            allowClear={false}
            format={'YYYY/MM/DD HH:mm'}
            disabled={true}
          />
        </ANTDFormItem>
      </div>
      <InspectionDetailsView
        inspectionData={inspectionData}
        currentForm={form}
      />
    </ANTDConfigProvider>
  )
}

export default ConfirmView
