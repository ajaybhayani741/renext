import InspectionDetailsView from './InspectionDetailsView'
import InspectionFormField from './InspectionFormField'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDButton from '../../../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../../../shared/antd/ANTDColumn'
import ANTDConfigProvider from '../../../../../shared/antd/ANTDConfigProvider'
import { ANTDDatePicker } from '../../../../../shared/antd/ANTDDatePicker'
import ANTDDivider from '../../../../../shared/antd/ANTDDivider'
import {
  ANTDFormItem,
  useFormInstanceFn,
} from '../../../../../shared/antd/ANTDForm'
import ANTDInput from '../../../../../shared/antd/ANTDInput'
import ANTDRow from '../../../../../shared/antd/ANTDRow'
import { userWiseRole } from '../../../../../utils/constant'
import { validationTag } from '../../../../../utils/customFunctions'
import { dayJs } from '../../../../../utils/dayjs'
import { entries, isArray } from '../../../../../utils/javascript'
import { getItem } from '../../../../../utils/localstorage'

const ConfirmView = ({
  selectedUsers,
  inspectionFormFieldsAttr,
  findingsAttrFn,
  getCurrentLocation,
}) => {
  const { t } = useTranslations()
  const form = useFormInstanceFn()
  const inspectionListData = form?.getFieldValue('inspectionList')
  const { hostel } = userWiseRole
  const dateToString = date => (date ? dayJs(date)?.format('DD/MM/YYYY') : '')
  const lang = getItem('lang')
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
      activitiesRequestDto,
    } = details || {}

    const mapKeyValue = (attributes, values) => {
      const data = {}
      entries(attributes)?.forEach(([key, item]) => {
        if (item.inputType === 'select') {
          const optKeyMap = item.options?.reduce((acc, item) => {
            acc[item?.value] = item?.label
            return acc
          }, {})
          if (item.mode === 'multiple') {
            data[key] = isArray(values?.[key])
              ? values?.[key]
                  ?.map(stgKey => t(optKeyMap?.[stgKey]) || '-')
                  ?.join(', ')
              : '-'
          } else {
            data[key] = optKeyMap?.[values?.[key]] || '-'
          }
          data[`${key}Selected`] = values?.[key]
        } else if (item.inputType === 'dateTimePicker') {
          data[key] = dateToString(values?.[key])
        } else if (item.inputType === 'formUpload') {
          data[key] = values?.[key]?.fileList || []
        } else {
          data[key] = values?.[key] ?? '-'
        }
      })
      return data
    }

    return {
      hostel: selectedUsers?.[hostel]?.[index],

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
      activitiesRequestDto: mapKeyValue(
        inspectionFormFieldsAttr?.curricularActivitiesAttrFn(),
        activitiesRequestDto,
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
      <ANTDRow
        align="center"
        className="date-management-number"
        gutter={[10, 10]}
      >
        <ANTDColumn md={12} lg={12} sm={24} xs={24}>
          <ANTDFormItem
            label={t('job_DateOfInspectionAndTime')}
            name={'inspectionDate'}
            className={`${validationTag(lang)} date-label`}
            rules={[
              {
                required: true,
                message: t('error_FieldISRequire'),
              },
            ]}
          >
            <ANTDDatePicker
              showTime
              className="w-100"
              name="inspectionDate"
              placeholder={t('job_SelectDate')}
              allowClear={false}
              format={'DD/MM/YYYY HH:mm'}
              disabled={true}
            />
          </ANTDFormItem>
        </ANTDColumn>
        <ANTDColumn
          md={12}
          lg={12}
          sm={24}
          xs={24}
          className="d-flex space-between"
          style={{ alignItems: 'baseline' }}
        >
          <ANTDFormItem
            label={t('job_LocationOfInspection')}
            name={'endAddressInspection'}
            className={`${validationTag(lang)} date-label w-100`}
            rules={[
              {
                required: true,
                message: t('error_FieldISRequire'),
              },
            ]}
          >
            <ANTDInput disabled />
          </ANTDFormItem>
          <ANTDFormItem label=" " layout="vertical" className="ml-5">
            <ANTDButton type="primary" onClick={getCurrentLocation}>
              {t('job_CaptureLocation')}
            </ANTDButton>
          </ANTDFormItem>
        </ANTDColumn>
      </ANTDRow>
      <InspectionDetailsView
        inspectionData={inspectionData}
        currentForm={form}
      />
      <InspectionFormField
        {...{
          attrList: findingsAttrFn(),
          name: 'findingsRequestDto',
          disabledAll: true,
        }}
      />
    </ANTDConfigProvider>
  )
}

export default ConfirmView
