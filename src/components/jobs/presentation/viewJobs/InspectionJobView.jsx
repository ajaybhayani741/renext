import { useEffect, useState } from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import ANTDForm, { useFormFn } from '../../../../shared/antd/ANTDForm'
import { userWiseRole } from '../../../../utils/constant'
import { modifyFileListKeys } from '../../../../utils/customFunctions'
import { dayJs, DISPLAY_DATE_FORMAT } from '../../../../utils/dayjs'
import {
  entries,
  isArray,
  isEqual,
  keys,
  length,
  nullOrUndefined,
} from '../../../../utils/javascript'
import UserTable from '../../../userManagement/presentation/UserTable'
import inspectionFieldAttr from '../../container/inspectionFieldAttr.container'
import InspectionDetailsView from '../addJobs/inspection/InspectionDetailsView'
import InspectionFormField from '../addJobs/inspection/InspectionFormField'
import DetailListView from '../common/DetailListView'

const InspectionJobView = ({ data }) => {
  const { t } = useTranslations()
  const form = useFormFn()
  const [inspectionData, setInspectionData] = useState([])

  const { inspectionOfficer } = userWiseRole
  const infoData = {
    user_BasicInformation: [
      { label: 'user_ID', value: data?.id },
      { label: 'job_DateOfInspectionAndTime', value: data?.inspectionDate },
      {
        label: 'user_CreationDate',
        value: data?.creationDate
          ? dayJs(data?.creationDate).format(DISPLAY_DATE_FORMAT)
          : '-',
      },
      { label: 'job_Status', value: t(data?.status) },
    ],
  }

  const {
    administrationAttrFn,
    foodNutritionAttrFn,
    accommodationAttrFn,
    sanitationDrainageAttrFn,
    electricityLightingAttrFn,
    healthMedicalCareAttrFn,
    educationAcademicEnvironmentAttrFn,
    safetySecurityAttrFn,
    studentFeedbackAttrFn,
    overallAssessmentAttrFn,
    inspectingOfficerFeedbackAttrFn,
    // administrationAttrFn,
    // hostelInfraRoomsAttrFn,
    // hostelInfraSanitationAttrFn,
    // medicalCareAttrFn,
    // educationFacilitiesAttrFn,
    // foodProvisionAttrFn,
    // safetyAndSecurityAttrFn,
    // conductionMeetingsAttrFn,
    // feedbackAttrFn,
    findingsAttrFn,
    // curricularActivitiesAttrFn,
  } = inspectionFieldAttr()

  useEffect(() => {
    setViewData()
  }, [])

  const setViewData = () => {
    const getUploadDetails = (values, key) => {
      const fallbackKey = key?.replace(/DmsIds$/, '')
      return (
        values?.[`${key}Details`] ||
        values?.[`${fallbackKey}DmsDetails`] ||
        values?.[`${fallbackKey}Details`] ||
        []
      )
    }

    const mapKeyValue = (attributes, values) => {
      const details = {}
      entries(attributes)?.forEach(([key, item]) => {
        if (item.inputType === 'select') {
          const optKeyMap = item.options?.reduce((acc, item) => {
            acc[item?.value] = item?.label
            return acc
          }, {})
          if (item.mode === 'multiple') {
            details[key] = isArray(values?.[key])
              ? values?.[key]
                  ?.map(stgKey => t(optKeyMap?.[stgKey]) || '-')
                  ?.join(', ')
              : '-'
          } else {
            details[key] = optKeyMap?.[values?.[key]] || '-'
          }
          details[`${key}Selected`] = values?.[key]
        } else if (item.inputType === 'formUpload') {
          details[key] = getUploadDetails(values, key)
        } else {
          details[key] = values?.[key] ?? '-'
        }
      })
      return details
    }
    const inspectionValues = {
      hostel: data?.hostelInfo,
      hostelAdministrationRequestDto: mapKeyValue(administrationAttrFn(), data),
      foodNutritionRequestDto: mapKeyValue(foodNutritionAttrFn(), data),
      accommodationRequestDto: mapKeyValue(accommodationAttrFn(), data),
      sanitationDrainageRequestDto: mapKeyValue(
        sanitationDrainageAttrFn(),
        data,
      ),
      electricityLightingRequestDto: mapKeyValue(
        electricityLightingAttrFn(),
        data,
      ),
      healthMedicalCareRequestDto: mapKeyValue(healthMedicalCareAttrFn(), data),
      educationAcademicEnvironmentRequestDto: mapKeyValue(
        educationAcademicEnvironmentAttrFn(),
        data,
      ),
      safetySecurityRequestDto: mapKeyValue(safetySecurityAttrFn(), data),
      studentFeedbackRequestDto: mapKeyValue(studentFeedbackAttrFn(), data),
      overallAssessmentRequestDto: mapKeyValue(overallAssessmentAttrFn(), data),
      inspectingOfficerFeedbackRequestDto: mapKeyValue(
        inspectingOfficerFeedbackAttrFn(),
        data,
      ),
      // hostelAdministrationRequestDto: mapKeyValue(administrationAttrFn(), data),
      // hostelInfraRoomsRequestDto: mapKeyValue(hostelInfraRoomsAttrFn(), data),
      // hostelInfraSanitationRequestDto: mapKeyValue(
      //   hostelInfraSanitationAttrFn(),
      //   data,
      // ),
      // medicalCareRequestDto: mapKeyValue(medicalCareAttrFn(), data),
      // educationFacilitiesRequestDto: mapKeyValue(
      //   educationFacilitiesAttrFn(),
      //   data,
      // ),
      // foodProvisionRequestDto: mapKeyValue(foodProvisionAttrFn(), data),
      // safetyAndSecurityRequestDto: mapKeyValue(safetyAndSecurityAttrFn(), data),
      // conductionMeetingsRequestDto: mapKeyValue(
      //   conductionMeetingsAttrFn(),
      //   data,
      // ),
      // feedbackRequestDto: mapKeyValue(feedbackAttrFn(), data),
      // activitiesRequestDto: mapKeyValue(curricularActivitiesAttrFn(), data),
    }

    const calDifferenceInValue = ({
      nestedUpdatedValues,
      changedKey,
      val1Key,
      val2Key,
      accumulationKey,
    }) => {
      const val1 = nestedUpdatedValues?.[changedKey]?.[val1Key]
      const val2 = nestedUpdatedValues?.[changedKey]?.[val2Key]
      nestedUpdatedValues[changedKey] = {
        ...nestedUpdatedValues?.[changedKey],
        [accumulationKey]:
          nullOrUndefined(val1) && nullOrUndefined(val2)
            ? null
            : (val1 || 0) - (val2 || 0),
      }
      return nestedUpdatedValues
    }
    const calPercentageInValue = ({
      nestedUpdatedValues,
      changedKey,
      val1Key,
      val2Key,
      accumulationKey,
    }) => {
      const val1 = nestedUpdatedValues?.[changedKey]?.[val1Key]
      const val2 = nestedUpdatedValues?.[changedKey]?.[val2Key]
      nestedUpdatedValues[changedKey] = {
        ...nestedUpdatedValues?.[changedKey],
        [accumulationKey]:
          nullOrUndefined(val1) || nullOrUndefined(val2)
            ? null
            : (((val2 || 0) / (val1 || 0)) * 100).toFixed(2),
      }

      return nestedUpdatedValues
    }

    calDifferenceInValue({
      nestedUpdatedValues: inspectionValues,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'riceStockRegisterKg',
      val2Key: 'riceStockGroundBalanceKg',
      accumulationKey: 'variationInRice',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionValues,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'dalStockRegisterKg',
      val2Key: 'dalStockGroundBalanceKg',
      accumulationKey: 'variationInDal',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionValues,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'cookingOilStockRegisterKg',
      val2Key: 'cookingOilStockGroundBalanceKg',
      accumulationKey: 'variationInCookingOil',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionValues,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'sugarStockRegisterKg',
      val2Key: 'sugarStockGroundBalanceKg',
      accumulationKey: 'variationInSugar',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionValues,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'idliRavaStockRegisterKg',
      val2Key: 'idliRavaStockGroundBalanceKg',
      accumulationKey: 'variationInIdliRava',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionValues,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'ragiMaltStockRegisterKg',
      val2Key: 'ragiMaltStockGroundBalanceKg',
      accumulationKey: 'variationInRagiMalt',
    })

    calPercentageInValue({
      nestedUpdatedValues: inspectionValues,
      changedKey: 'hostelInfraSanitationRequestDto',
      val1Key: 'numberOfToiletsAvailable',
      val2Key: 'numberOfToiletsFunctioning',
      accumulationKey: 'percentageOfToiletFunctioning',
    })
    setInspectionData([inspectionValues])

    //for finding section
    const dateToDayJs = date => (date ? dayJs(date, 'DD/MM/YYYY') : null)
    const formValueFromResponse = (details, formAttr) => {
      const data = {}
      entries(details)?.forEach(([key, value]) => {
        if (!formAttr?.[key]) return
        const fieldType = formAttr?.[key]?.inputType

        if (isEqual(fieldType, 'dateTimePicker')) {
          data[key] = dateToDayJs(value)
        } else if (isEqual(fieldType, 'formUpload')) {
          const uploadDetails = getUploadDetails(details, key)
          data[key] = length(uploadDetails)
            ? {
                fileList: modifyFileListKeys(uploadDetails),
              }
            : null
        } else {
          data[key] = value
        }
      })
      return data
    }
    form.setFieldsValue({
      findingsRequestDto: {
        ...formValueFromResponse(data, findingsAttrFn()),
      },
    })
  }

  return (
    <>
      <DetailListView infoData={infoData} title="job_InspectionJob" />

      <h2 className="content-title">{t('user_InspectionOfficer')}</h2>
      <UserTable
        className="mb-15"
        userData={{
          loader: false,
          list: length(keys(data?.userInfo)) ? [data?.userInfo] : [],
        }}
        payload={{ roleId: inspectionOfficer }}
        permission={false}
        pagination={false}
      />

      <InspectionDetailsView inspectionData={inspectionData} />

      <ANTDForm
        name="inspection"
        initialValues={{}}
        form={form}
        layout="vertical"
      >
        <InspectionFormField
          {...{
            attrList: findingsAttrFn(),
            name: 'findingsRequestDto',
            disabledAll: true,
          }}
        />
      </ANTDForm>
    </>
  )
}

export default InspectionJobView
