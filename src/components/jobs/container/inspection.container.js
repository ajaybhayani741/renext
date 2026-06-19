import { useCallback, useEffect, useRef, useState } from 'react'

import { notifyMethod } from '../../../App'
import usePromise from '../../../hooks/usePromise'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import {
  setNotificationList,
  setPopupMessageModel,
} from '../../../redux/app/reducer'
import { setJobActiveTab } from '../../../redux/jobs/reducer'
import pathName from '../../../routing/pathName.constant'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { getBase64 } from '../../../utils'
import { MAX_FILE_SIZE, userWiseRole } from '../../../utils/constant'
import {
  downloadReport,
  getLocation,
  modifyFileListKeys,
} from '../../../utils/customFunctions'
import { dayJs } from '../../../utils/dayjs'
import debounce from '../../../utils/debounce'
import {
  entries,
  include,
  isArray,
  isEqual,
  keys,
  length,
  notEqual,
  nullOrUndefined,
  values,
} from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { getNotificationsApi } from '../../notifications/notification.api'
import {
  addJobPostApi,
  getJobDetailApi,
  getLocationAddressApi,
  triggerJobReportApi,
  updateJobPatchApi,
} from '../jobs.api'
import { payloadType, tabKeys } from '../jobs.description'
import data from '../recoveryJobDataUpload.xlsx'
import inspectionFieldAttr from './inspectionFieldAttr.container'

const inspection = ({
  editData,
  setEditData,
  selectedUsers,
  setSelectedUsers,
  onFileUploadOrRemove,
  roleId,
  setNextBtnLoader,
  getPayloadForUserList,
  onSelectUser,
  onUserClear,
}) => {
  const { t } = useTranslations()
  const form = useFormFn()
  const { navigate, params, location } = useRouter()
  const { dispatch, selector } = useRedux()
  // eslint-disable-next-line no-unused-vars
  const { createPromise, resolvePromise } = usePromise()
  const [jobId, setJobId] = useState(null)
  const isEdit = !!params?.jobId
  const [current, setCurrent] = useState(0)
  const [loader, setLoader] = useState(false)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [activeKeys, setActiveKeys] = useState([])
  const [confirmModel, setConfirmModel] = useState({
    open: false,
    description: '',
  })
  const [activeFormField, setActiveFormField] = useState({ isOpen: false })
  const [formFieldPercentage, setFormFieldPercentage] = useState({})
  const [completeConfirmation, setCompleteConfirmation] = useState({
    open: false,
  })
  const [triggerLoader, setTriggerLoader] = useState({
    loader: false,
    updated: !editData?.inspectionJobReportDetails,
  })
  const locationRef = useRef(null)
  const inspectionInitialValues = {
    inspectionDate: dayJs(new Date()),
    jobType: payloadType?.[tabKeys?.inspection],
  }
  const showSave = isEdit || include([1], current)
  const { inspectionOfficer, hostel } = userWiseRole
  const userData = JSON.parse(getItem('userData'))
  const isMobile = selector(state => state.app.isMobile)
  const fromNotification = location?.state?.fromNotification || false

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
    if (fromNotification && jobId) {
      apiCall({ showMsg: false, isLoading: false, fromNotification })
        .then(resp => {
          if (resp?.success) {
            return getNotificationsApi({ pageNo: 1 })
          }
          return null
        })
        .then(response => {
          if (response?.data) {
            dispatch(setNotificationList(response?.data))
          }
        })
        .catch(error => {})
        .finally(() => {
          navigate(location.pathname, { replace: true, state: {} })
        })
    }
  }, [fromNotification, jobId])

  useEffect(() => {
    if (isEdit) {
      setCurrent(
        location?.state?.restart || !editData?.latitude || !editData?.longitude
          ? 0
          : (editData?.stepNumber || 1) - 1,
      )
      setEditApiDataToForm()
    } else {
      setSelectedUsers({
        ...selectedUsers,
        [inspectionOfficer]: [userData],
      })
    }
    setFieldsPercentageFn(editData, true)
  }, [])

  const getCurrentLocation = async () => {
    setConfirmModel({
      open: true,
      description:
        current === 3 ? t('msg_confirmEndLocation') : t('msg_confirmLocation'),
    })
    const isAccepted = await createPromise()
    if (isAccepted) {
      const data = await getLocation()
      locationRef.current = data
      const locationAddress = await getLocationAddressApi({
        params: { latitude: data?.latitude, longitude: data?.longitude },
      })
      const latLng =
        locationAddress?.data?.latitude && locationAddress?.data?.longitude
          ? `${locationAddress?.data?.latitude},${locationAddress?.data?.longitude}`
          : `${data?.latitude},${data?.longitude}`
      const address = locationAddress?.data?.address
        ? locationAddress?.data?.address
        : latLng
      form.setFieldsValue({
        ...form.getFieldsValue(),
        ...(current === 3
          ? {
              endAddressInspection: address,
              endLocationInspection: latLng,
            }
          : current === 0
            ? {
                addressInspection: address,
                locationInspection: latLng,
              }
            : {}),
      })

      jobId && debounceApiCall({})
    }
  }

  const setEditApiDataToForm = async () => {
    setJobId(editData?.id)
    setSelectedUsers(pre => ({
      ...pre,
      [inspectionOfficer]: [editData?.userInfo],
      [hostel]: [editData?.hostelInfo],
    }))
    if (location?.state?.restart) {
      apiCall({ hostelId: editData?.hostelInfo, currentJobId: editData?.id })
      return
    }

    const dateToDayJs = date => (date ? dayJs(date, 'DD/MM/YYYY') : null)

    const getUploadDetails = (details, key) => {
      const fallbackKey = key?.replace(/DmsIds$/, '')
      return (
        details?.[`${key}Details`] ||
        details?.[`${fallbackKey}DmsDetails`] ||
        details?.[`${fallbackKey}Details`] ||
        []
      )
    }

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

    const inspectionDetails = {
      hostelAdministrationRequestDto: {
        ...formValueFromResponse(editData, administrationAttrFn()),
      },
      foodNutritionRequestDto: {
        ...formValueFromResponse(editData, foodNutritionAttrFn()),
      },
      accommodationRequestDto: {
        ...formValueFromResponse(editData, accommodationAttrFn()),
      },
      sanitationDrainageRequestDto: {
        ...formValueFromResponse(editData, sanitationDrainageAttrFn()),
      },
      electricityLightingRequestDto: {
        ...formValueFromResponse(editData, electricityLightingAttrFn()),
      },
      healthMedicalCareRequestDto: {
        ...formValueFromResponse(editData, healthMedicalCareAttrFn()),
      },
      educationAcademicEnvironmentRequestDto: {
        ...formValueFromResponse(
          editData,
          educationAcademicEnvironmentAttrFn(),
        ),
      },
      safetySecurityRequestDto: {
        ...formValueFromResponse(editData, safetySecurityAttrFn()),
      },
      studentFeedbackRequestDto: {
        ...formValueFromResponse(editData, studentFeedbackAttrFn()),
      },
      overallAssessmentRequestDto: {
        ...formValueFromResponse(editData, overallAssessmentAttrFn()),
      },
      inspectingOfficerFeedbackRequestDto: {
        ...formValueFromResponse(editData, inspectingOfficerFeedbackAttrFn()),
      },
      // hostelAdministrationRequestDto: {
      //   ...formValueFromResponse(editData, administrationAttrFn()),
      // },
      // hostelInfraRoomsRequestDto: {
      //   ...formValueFromResponse(editData, hostelInfraRoomsAttrFn()),
      // },
      // hostelInfraSanitationRequestDto: {
      //   ...formValueFromResponse(editData, hostelInfraSanitationAttrFn()),
      // },
      // medicalCareRequestDto: {
      //   ...formValueFromResponse(editData, medicalCareAttrFn()),
      // },
      // educationFacilitiesRequestDto: {
      //   ...formValueFromResponse(editData, educationFacilitiesAttrFn()),
      // },
      // foodProvisionRequestDto: {
      //   ...formValueFromResponse(editData, foodProvisionAttrFn()),
      // },
      // safetyAndSecurityRequestDto: {
      //   ...formValueFromResponse(editData, safetyAndSecurityAttrFn()),
      // },
      // conductionMeetingsRequestDto: {
      //   ...formValueFromResponse(editData, conductionMeetingsAttrFn()),
      // },
      // feedbackRequestDto: {
      //   ...formValueFromResponse(editData, feedbackAttrFn()),
      // },
      // activitiesRequestDto: {
      //   ...formValueFromResponse(editData, curricularActivitiesAttrFn()),
      // },
    }

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'riceStockRegisterKg',
      val2Key: 'riceStockGroundBalanceKg',
      accumulationKey: 'variationInRice',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'dalStockRegisterKg',
      val2Key: 'dalStockGroundBalanceKg',
      accumulationKey: 'variationInDal',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'cookingOilStockRegisterKg',
      val2Key: 'cookingOilStockGroundBalanceKg',
      accumulationKey: 'variationInCookingOil',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'sugarStockRegisterKg',
      val2Key: 'sugarStockGroundBalanceKg',
      accumulationKey: 'variationInSugar',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'idliRavaStockRegister',
      val2Key: 'idliRavaStockGroundBalance',
      accumulationKey: 'variationInIdliRava',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'ragiMaltStockRegisterKg',
      val2Key: 'ragiMaltStockGroundBalanceKg',
      accumulationKey: 'variationInRagiMalt',
    })

    calPercentageInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'hostelInfraSanitationRequestDto',
      val1Key: 'numberOfToiletsAvailable',
      val2Key: 'numberOfToiletsFunctioning',
      accumulationKey: 'percentageOfToiletFunctioning',
    })

    const latLng =
      editData?.latitude && editData?.longitude
        ? `${editData?.latitude},${editData?.longitude}`
        : ''
    const latLng1 =
      editData?.latitude2 && editData?.longitude2
        ? `${editData?.latitude2},${editData?.longitude2}`
        : ''
    const preFormValues = {
      inspectionDate: editData?.inspectionDate
        ? dayJs(editData?.inspectionDate, 'DD/MM/YYYY HH:mm')
        : dayJs(new Date()),
      locationInspection:
        editData?.latitude && editData?.longitude ? latLng : '',
      endLocationInspection:
        editData?.latitude2 && editData?.longitude2 ? latLng1 : '',
      addressInspection: editData?.address ? editData?.address : latLng,
      endAddressInspection: editData?.address2 ? editData?.address2 : latLng1,
      inspectionList: [inspectionDetails],
      findingsRequestDto: {
        ...formValueFromResponse(editData, findingsAttrFn()),
      },
    }
    form.setFieldsValue(preFormValues)
  }

  const setFieldsPercentageFn = (editData, onEdit = false) => {
    const getVisibleFormFields = (formAttr, sectionData = {}) => {
      return Object.fromEntries(
        entries(formAttr)?.filter(([_, value]) => {
          if (!value?.label || value?.disabled) return false
          const isHidden = isEqual(typeof value?.hidden, 'function')
            ? value.hidden(sectionData)
            : value?.hidden
          return !isHidden
        }),
      )
    }

    const isFieldFilled = ({ fieldType, fieldValue }) => {
      if (isEqual(fieldType, 'formUpload')) {
        return onEdit
          ? fieldValue && length(fieldValue) > 0
          : fieldValue?.fileList && length(fieldValue?.fileList) > 0
      }

      if (isArray(fieldValue)) {
        return length(fieldValue) > 0
      }

      return (
        fieldValue !== null && fieldValue !== undefined && fieldValue !== ''
      )
    }

    const calculatePercentage = formAttr => {
      const formFields = getVisibleFormFields(formAttr, editData)
      const totalField = keys(formFields)?.length
      const filledField =
        keys(formFields)?.filter(v => {
          const fieldType = formFields?.[v]?.inputType
          const fieldValue = editData?.[v]
          return isFieldFilled({ fieldType, fieldValue })
        }).length || 0
      return Math.round((filledField / totalField) * 100) || 0
    }

    const inspectionPercentage = {
      hostelAdministrationRequestDto: calculatePercentage(
        administrationAttrFn(),
      ),
      foodNutritionRequestDto: calculatePercentage(foodNutritionAttrFn()),
      accommodationRequestDto: calculatePercentage(accommodationAttrFn()),
      sanitationDrainageRequestDto: calculatePercentage(
        sanitationDrainageAttrFn(),
      ),
      electricityLightingRequestDto: calculatePercentage(
        electricityLightingAttrFn(),
      ),
      healthMedicalCareRequestDto: calculatePercentage(
        healthMedicalCareAttrFn(),
      ),
      educationAcademicEnvironmentRequestDto: calculatePercentage(
        educationAcademicEnvironmentAttrFn(),
      ),
      safetySecurityRequestDto: calculatePercentage(safetySecurityAttrFn()),
      studentFeedbackRequestDto: calculatePercentage(studentFeedbackAttrFn()),
      overallAssessmentRequestDto: calculatePercentage(
        overallAssessmentAttrFn(),
      ),
      inspectingOfficerFeedbackRequestDto: calculatePercentage(
        inspectingOfficerFeedbackAttrFn(),
      ),
      // hostelAdministrationRequestDto: calculatePercentage(
      //   administrationAttrFn(),
      // ),
      // hostelInfraRoomsRequestDto: calculatePercentage(hostelInfraRoomsAttrFn()),
      // hostelInfraSanitationRequestDto: calculatePercentage(
      //   hostelInfraSanitationAttrFn(),
      // ),
      // medicalCareRequestDto: calculatePercentage(medicalCareAttrFn()),
      // educationFacilitiesRequestDto: calculatePercentage(
      //   educationFacilitiesAttrFn(),
      // ),
      // foodProvisionRequestDto: calculatePercentage(foodProvisionAttrFn()),
      // safetyAndSecurityRequestDto: calculatePercentage(
      //   safetyAndSecurityAttrFn(),
      // ),
      // conductionMeetingsRequestDto: calculatePercentage(
      //   conductionMeetingsAttrFn(),
      // ),
      // feedbackRequestDto: calculatePercentage(feedbackAttrFn()),
      // activitiesRequestDto: calculatePercentage(curricularActivitiesAttrFn()),
    }
    setFormFieldPercentage(inspectionPercentage)
  }

  const payloadConverter = (values, fieldsAttr) => {
    const data = {}
    entries(values)?.forEach(([key, value]) => {
      const fieldType = fieldsAttr?.[key]?.inputType
      if (
        !fieldsAttr?.[key] ||
        include(fieldsAttr?.[key]?.maskedForRole, roleId)
      )
        return

      if (isEqual(fieldType, 'dateTimePicker')) {
        data[key] = value ? dayJs(value)?.format('DD/MM/YYYY') : null
      } else if (isEqual('formUpload', fieldType)) {
        data[key] = value?.fileList?.map(({ dmsId }) => dmsId)
      } else {
        data[key] = value
      }
    })
    return data
  }

  const countProgressPercentage = ({ formData }) => {
    if (location?.state?.restart) {
      return { percentage: 0 }
    }

    const sectionDetails = formData?.inspectionList?.[0] || {}
    const getVisibleFieldKeys = (formAttr, sectionData = {}) => {
      return (
        entries(formAttr)
          ?.filter(([_, value]) => {
            if (!value?.label || !value?.inputType) return false
            const isHidden = isEqual(typeof value?.hidden, 'function')
              ? value.hidden(sectionData)
              : value?.hidden
            return !isHidden
          })
          ?.map(([key]) => key) || []
      )
    }

    const inspectionJobData = [
      ...getVisibleFieldKeys(
        administrationAttrFn(),
        sectionDetails?.hostelAdministrationRequestDto,
      ),
      ...getVisibleFieldKeys(
        foodNutritionAttrFn(),
        sectionDetails?.foodNutritionRequestDto,
      ),
      ...getVisibleFieldKeys(
        accommodationAttrFn(),
        sectionDetails?.accommodationRequestDto,
      ),
      ...getVisibleFieldKeys(
        sanitationDrainageAttrFn(),
        sectionDetails?.sanitationDrainageRequestDto,
      ),
      ...getVisibleFieldKeys(
        electricityLightingAttrFn(),
        sectionDetails?.electricityLightingRequestDto,
      ),
      ...getVisibleFieldKeys(
        healthMedicalCareAttrFn(),
        sectionDetails?.healthMedicalCareRequestDto,
      ),
      ...getVisibleFieldKeys(
        educationAcademicEnvironmentAttrFn(),
        sectionDetails?.educationAcademicEnvironmentRequestDto,
      ),
      ...getVisibleFieldKeys(
        safetySecurityAttrFn(),
        sectionDetails?.safetySecurityRequestDto,
      ),
      ...getVisibleFieldKeys(
        studentFeedbackAttrFn(),
        sectionDetails?.studentFeedbackRequestDto,
      ),
      ...getVisibleFieldKeys(
        overallAssessmentAttrFn(),
        sectionDetails?.overallAssessmentAttrFn,
      ),
      ...getVisibleFieldKeys(
        inspectingOfficerFeedbackAttrFn(),
        sectionDetails?.inspectingOfficerFeedbackAttrFn,
      ),
      // ...getVisibleFieldKeys(
      //   hostelInfraRoomsAttrFn(),
      //   sectionDetails?.hostelInfraRoomsRequestDto,
      // ),
      // ...getVisibleFieldKeys(
      //   hostelInfraSanitationAttrFn(),
      //   sectionDetails?.hostelInfraSanitationRequestDto,
      // ),
      // ...getVisibleFieldKeys(
      //   medicalCareAttrFn(),
      //   sectionDetails?.medicalCareRequestDto,
      // ),
      // ...getVisibleFieldKeys(
      //   educationFacilitiesAttrFn(),
      //   sectionDetails?.educationFacilitiesRequestDto,
      // ),
      // ...getVisibleFieldKeys(
      //   foodProvisionAttrFn(),
      //   sectionDetails?.foodProvisionRequestDto,
      // ),
      // ...getVisibleFieldKeys(
      //   safetyAndSecurityAttrFn(),
      //   sectionDetails?.safetyAndSecurityRequestDto,
      // ),
      // ...getVisibleFieldKeys(
      //   conductionMeetingsAttrFn(),
      //   sectionDetails?.conductionMeetingsRequestDto,
      // ),
      // ...getVisibleFieldKeys(
      //   feedbackAttrFn(),
      //   sectionDetails?.feedbackRequestDto,
      // ),
      ...getVisibleFieldKeys(findingsAttrFn(), formData?.findingsRequestDto),
      // ...getVisibleFieldKeys(
      //   curricularActivitiesAttrFn(),
      //   sectionDetails?.activitiesRequestDto,
      // ),
    ]

    const jobData = {
      locationInspection: formData?.locationInspection,
      endLocationInspection: formData?.endLocationInspection,
      inspectionDate: formData?.inspectionDate,
      ...inspectionJobData?.reduce((acc, key) => {
        acc[key] =
          formData?.findingsRequestDto?.[key] ??
          values(sectionDetails)?.reduce(
            (nestedAcc, curr) => ({ ...nestedAcc, ...curr }),
            {},
          )?.[key]
        return acc
      }, {}),
    }

    const totalFieldCount = keys(jobData)?.length
    const filledFieldCount =
      keys(jobData)?.filter(key => {
        const fieldValue = jobData?.[key]
        const sectionAttr =
          administrationAttrFn()?.[key] ||
          foodNutritionAttrFn()?.[key] ||
          accommodationAttrFn()?.[key] ||
          sanitationDrainageAttrFn()?.[key] ||
          electricityLightingAttrFn()?.[key] ||
          healthMedicalCareAttrFn()?.[key] ||
          educationAcademicEnvironmentAttrFn()?.[key] ||
          safetySecurityAttrFn()?.[key] ||
          studentFeedbackAttrFn()?.[key] ||
          overallAssessmentAttrFn()?.[key] ||
          inspectingOfficerFeedbackAttrFn()?.[key] ||
          // hostelInfraRoomsAttrFn()?.[key] ||
          // hostelInfraSanitationAttrFn()?.[key] ||
          // medicalCareAttrFn()?.[key] ||
          // educationFacilitiesAttrFn()?.[key] ||
          // foodProvisionAttrFn()?.[key] ||
          // safetyAndSecurityAttrFn()?.[key] ||
          // conductionMeetingsAttrFn()?.[key] ||
          // feedbackAttrFn()?.[key] ||
          findingsAttrFn()?.[key] ||
          // curricularActivitiesAttrFn()?.[key] ||
          {}
        const fieldType = sectionAttr?.inputType

        if (isEqual(fieldType, 'formUpload')) {
          return fieldValue?.fileList
            ? length(fieldValue.fileList) > 0
            : length(fieldValue) > 0
        }

        if (isArray(fieldValue)) {
          return length(fieldValue) > 0
        }

        return (
          fieldValue !== null && fieldValue !== undefined && fieldValue !== ''
        )
      })?.length || 0

    const percentage = Math.round((filledFieldCount / totalFieldCount) * 100)
    return { percentage }
  }

  const apiCall = async ({
    isComplete,
    showMsg,
    redirect,
    confirm = false,
    isLoading = false,
    key,
    index,
    hostelId = null,
    currentJobId = null,
    fromNotification = false,
  } = {}) => {
    if (isApiRunning && !jobId) return
    setIsApiRunning(true)

    const formData = { ...form.getFieldValue() }
    const latLng = formData.locationInspection
      ? formData.locationInspection?.split(',')
      : []
    const latLng2 = formData.endLocationInspection
      ? formData.endLocationInspection?.split(',')
      : []
    const payload = {
      id: jobId || currentJobId,
      jobType: payloadType?.[tabKeys?.inspection],
      inspectionDate: formData.inspectionDate.format('DD/MM/YYYY HH:MM'),
      hostelId: selectedUsers?.[userWiseRole?.hostel]?.[0]?.id || hostelId?.id,
      latitude: latLng?.[0] ? parseFloat(latLng?.[0]) : null,
      longitude: latLng?.[1] ? parseFloat(latLng?.[1]) : null,
      latitude2: latLng2?.[0] ? parseFloat(latLng2?.[0]) : null,
      longitude2: latLng2?.[1] ? parseFloat(latLng2?.[1]) : null,
      stepNumber: location?.state?.restart ? 1 : current + 1,
      progressPercentage: fromNotification
        ? 0
        : countProgressPercentage({ formData })?.percentage,
      restartJob: !!location?.state?.restart,
    }

    const inspectionDetails = formData?.inspectionList?.[0]
    Object.assign(payload, {
      ...payloadConverter(
        inspectionDetails?.hostelAdministrationRequestDto,
        administrationAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.foodNutritionRequestDto,
        foodNutritionAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.accommodationRequestDto,
        accommodationAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.sanitationDrainageRequestDto,
        sanitationDrainageAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.electricityLightingRequestDto,
        electricityLightingAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.healthMedicalCareRequestDto,
        healthMedicalCareAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.educationAcademicEnvironmentRequestDto,
        educationAcademicEnvironmentAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.safetySecurityRequestDto,
        safetySecurityAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.studentFeedbackRequestDto,
        studentFeedbackAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.overallAssessmentRequestDto,
        overallAssessmentAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.inspectingOfficerFeedbackRequestDto,
        inspectingOfficerFeedbackAttrFn(),
      ),
      // ...payloadConverter(
      //   inspectionDetails?.hostelAdministrationRequestDto,
      //   administrationAttrFn(),
      // ),
      // ...payloadConverter(
      //   inspectionDetails?.hostelInfraRoomsRequestDto,
      //   hostelInfraRoomsAttrFn(),
      // ),
      // ...payloadConverter(
      //   inspectionDetails?.hostelInfraSanitationRequestDto,
      //   hostelInfraSanitationAttrFn(),
      // ),
      // ...payloadConverter(
      //   inspectionDetails?.medicalCareRequestDto,
      //   medicalCareAttrFn(),
      // ),
      // ...payloadConverter(
      //   inspectionDetails?.educationFacilitiesRequestDto,
      //   educationFacilitiesAttrFn(),
      // ),
      // ...payloadConverter(
      //   inspectionDetails?.foodProvisionRequestDto,
      //   foodProvisionAttrFn(),
      // ),
      // ...payloadConverter(
      //   inspectionDetails?.safetyAndSecurityRequestDto,
      //   safetyAndSecurityAttrFn(),
      // ),
      // ...payloadConverter(
      //   inspectionDetails?.conductionMeetingsRequestDto,
      //   conductionMeetingsAttrFn(),
      // ),
      // ...payloadConverter(
      //   inspectionDetails?.feedbackRequestDto,
      //   feedbackAttrFn(),
      // ),
      // ...payloadConverter(
      //   inspectionDetails?.activitiesRequestDto,
      //   curricularActivitiesAttrFn(),
      // ),
      ...payloadConverter(formData?.findingsRequestDto, findingsAttrFn()),
    })

    setNextBtnLoader(isLoading)
    let updatedResponse = null
    if (!payload?.id || isComplete) {
      const response = await addJobPostApi({ payload })
      setNextBtnLoader(false)
      if (response?.data?.data) {
        if (!payload?.id && !isComplete) {
          notifyMethod.success({
            message: t('msg_JobCreatedSuccessfully', {
              jobId: response?.data?.data?.id,
            }),
          })
          setJobId(response?.data?.data?.id)
          form.setFieldValue('jobId', response?.data?.data?.id)
        }
        isComplete &&
          response?.data?.data &&
          isEqual(current, 3) &&
          triggerJobReport(isComplete)
        if (!isComplete) {
          Object.assign(payload, { id: response?.data?.data?.id })
          const res = await updateJobPatchApi({ payload })
          setNextBtnLoader(false)
          setLoader(false)
          setIsApiRunning(false)
          if (!res?.data?.data) return false
          if (res?.data?.data) {
            setFieldsPercentageFn(res?.data?.data, true)
          }
        }
      }
      setIsApiRunning(false)
      setLoader(false)
      if (!response?.data?.data) return false
    } else {
      const res = await updateJobPatchApi({ payload })
      setNextBtnLoader(false)
      setLoader(false)
      setIsApiRunning(false)
      if (!res?.data?.data) return false
      if (res?.data?.data) {
        setFieldsPercentageFn(res?.data?.data, true)
        isEqual(current, 2) && triggerLoader?.updated && triggerJobReport()
        updatedResponse = res?.data?.data
      }
      if (location?.state?.restart) {
        navigate('.', {
          replace: true,
          state: {
            ...location.state,
            restart: false,
          },
        })
      }
      if (res?.data?.data && showMsg) {
        notifyMethod.success({
          message: t('msg_JobUpdatedSuccessfully', {
            jobId: res?.data?.data?.id,
          }),
        })
      }
    }
    key && handleActiveFieldModal(key, index)

    if (confirm) {
      // reportPolling()
    }
    if (redirect) {
      dispatch(
        setJobActiveTab({
          status: tabKeys.active,
          type: tabKeys.inspection,
        }),
      )
      navigate(pathName.JOBS)
    }
    return updatedResponse || true
  }

  const triggerJobReport = async (isComplete = false) => {
    const [reportResp, sheetResp] = await Promise.all([
      triggerJobReportApi({
        payload: { jobId: jobId, type: payloadType?.['inspectionReport'] },
      }),

      triggerJobReportApi({
        payload: { jobId: jobId, type: payloadType?.['inspectionSheet'] },
      }),
    ])
    setTriggerLoader({ ...triggerLoader, loader: true })
    if ((sheetResp?.data || reportResp?.data) && isComplete) {
      const resp = await getJobDetailApi({
        params: {
          id: jobId,
          jobType: payloadType?.[tabKeys?.inspection],
        },
      })
      if (resp?.data) {
        setEditData({ ...resp?.data })
      }
    }
    setTriggerLoader({ loader: false, updated: false })
  }

  const debounceApiCall = useCallback(debounce(apiCall, 700), [
    jobId,
    isApiRunning,
    selectedUsers,
  ])

  // const handleOCRScan = async ({ file, source, elvIndex }) => {
  //   const isLt5MB =
  //     !(file?.file?.size || file?.file?.originFileObj?.size) ||
  //     Number(file?.file?.size || file?.file?.originFileObj?.size) <
  //       MAX_FILE_SIZE

  //   if (!isLt5MB) {
  //     notifyMethod.warning({
  //       message: t('msg_MaximumSizeAllowed', {
  //         maxSize: MAX_FILE_SIZE / 1024 / 1024,
  //       }),
  //     })
  //     return null
  //   }

  //   const systemId = form.getFieldValue(['inspectionList', elvIndex, 'systemId'])
  //   setLoader(true)
  //   if (!jobId || !systemId) {
  //     const isSuccess = await apiCall({})
  //     if (!isSuccess) {
  //       setLoader(false)
  //       return null
  //     }
  //   }
  //   const dmsId = await onFileUploadOrRemove({ file, source: 'OCR' })

  //   if (!dmsId) {
  //     setLoader(false)
  //     return null
  //   }

  //   const payload = {
  //     jobType: 'RECOVERY',
  //     source,
  //     jobId: form.getFieldValue('jobId'),
  //     scrapId: form.getFieldValue(['inspectionList', elvIndex, 'systemId']),
  //     dmsId,
  //   }

  //   const response = await getOcrDataApi({ payload })
  //   setLoader(false)
  //   return response?.data
  // }

  const handleFileUpload = async ({ file, fileList, filePath }) => {
    const isLt5MB =
      !(file?.file?.size || file?.file?.originFileObj?.size) ||
      Number(file?.file?.size || file?.file?.originFileObj?.size) <
        MAX_FILE_SIZE

    if (!isLt5MB) {
      notifyMethod.warning({
        message: t('msg_MaximumSizeAllowed', {
          maxSize: MAX_FILE_SIZE / 1024 / 1024,
        }),
      })
      return form.setFieldValue(filePath, {
        fileList: fileList?.slice(0, -1),
      })
    }
    const dmsId = await onFileUploadOrRemove({ file })
    if (dmsId) {
      const fileDetails = fileList[length(fileList) - 1]
      fileList[length(fileList) - 1] = {
        url: await getBase64(fileDetails?.originFileObj),
        uid: fileDetails?.uid,
        type: fileDetails?.type,
        dmsId,
      }
      form.setFieldValue(filePath, {
        fileList,
      })
    }
    jobId && debounceApiCall({})
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

  const onValuesChange = async value => {
    const formValues = form.getFieldValue()

    if (value?.inspectionList) {
      const changeIndex = value.inspectionList?.findIndex(val => val)
      const changedKey = keys(value?.inspectionList?.[changeIndex])?.[0]
      const changedValue = value?.inspectionList?.[changeIndex]?.[changedKey]
      const nestedKey = keys(changedValue)?.[0]
      // const nestedChangedValue = changedValue?.[nestedKey]
      const updatedValues = formValues?.inspectionList || []
      const nestedUpdatedValues = updatedValues[changeIndex]

      if (isEqual('foodProvisionRequestDto', changedKey)) {
        if (
          include(
            ['riceStockRegisterKg', 'riceStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'riceStockRegisterKg',
            val2Key: 'riceStockGroundBalanceKg',
            accumulationKey: 'variationInRice',
          })
        } else if (
          include(['dalStockRegisterKg', 'dalStockGroundBalanceKg'], nestedKey)
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'dalStockRegisterKg',
            val2Key: 'dalStockGroundBalanceKg',
            accumulationKey: 'variationInDal',
          })
        } else if (
          include(
            ['cookingOilStockRegisterKg', 'cookingOilStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'cookingOilStockRegisterKg',
            val2Key: 'cookingOilStockGroundBalanceKg',
            accumulationKey: 'variationInCookingOil',
          })
        } else if (
          include(
            ['sugarStockRegisterKg', 'sugarStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'sugarStockRegisterKg',
            val2Key: 'sugarStockGroundBalanceKg',
            accumulationKey: 'variationInSugar',
          })
        } else if (
          include(
            ['idliRavaStockRegister', 'idliRavaStockGroundBalance'],
            nestedKey,
          )
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'idliRavaStockRegister',
            val2Key: 'idliRavaStockGroundBalance',
            accumulationKey: 'variationInIdliRava',
          })
        } else if (
          include(
            ['ragiMaltStockRegisterKg', 'ragiMaltStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'ragiMaltStockRegisterKg',
            val2Key: 'ragiMaltStockGroundBalanceKg',
            accumulationKey: 'variationInRagiMalt',
          })
        } else if (
          include(
            ['foodStorageVegetablesPhoto', 'foodStorageDryItemsPhoto'],
            nestedKey,
          )
        ) {
          const file = changedValue?.[nestedKey]
          const fileList =
            nestedUpdatedValues?.[changedKey]?.[nestedKey]?.fileList

          await handleFileUpload({
            file,
            fileList: fileList && length(fileList) ? fileList : [],
            filePath: ['inspectionList', changeIndex, changedKey, nestedKey],
          })

          // Update percentage after file upload completes
          const updatedFormValues = form.getFieldValue()
          const updatedFieldValues = values(
            updatedFormValues?.inspectionList?.[changeIndex],
          )?.reduce((acc, curr) => {
            return { ...acc, ...curr }
          }, 0)
          setFieldsPercentageFn(updatedFieldValues)
          return
        }
      } else if (isEqual('hostelInfraSanitationRequestDto', changedKey)) {
        if (
          include(
            ['numberOfToiletsAvailable', 'numberOfToiletsFunctioning'],
            nestedKey,
          )
        ) {
          calPercentageInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'numberOfToiletsAvailable',
            val2Key: 'numberOfToiletsFunctioning',
            accumulationKey: 'percentageOfToiletFunctioning',
          })
        } else if (
          include(
            ['toiletsBathroomsPhoto1', 'toiletsBathroomsPhoto2'],
            nestedKey,
          )
        ) {
          const file = changedValue?.[nestedKey]
          const fileList =
            nestedUpdatedValues?.[changedKey]?.[nestedKey]?.fileList

          await handleFileUpload({
            file,
            fileList: fileList && length(fileList) ? fileList : null,
            filePath: ['inspectionList', changeIndex, changedKey, nestedKey],
          })

          // Update percentage after file upload completes
          const updatedFormValues = form.getFieldValue()
          const updatedFieldValues = values(
            updatedFormValues?.inspectionList?.[changeIndex],
          )?.reduce((acc, curr) => {
            return { ...acc, ...curr }
          }, 0)
          setFieldsPercentageFn(updatedFieldValues)
          return
        }
      }

      form.setFieldsValue({
        inspectionList: updatedValues,
      })

      const fieldValues = values(updatedValues?.[changeIndex])?.reduce(
        (acc, curr) => {
          return { ...acc, ...curr }
        },
        0,
      )
      setFieldsPercentageFn(fieldValues)
    }
    if (value?.findingsRequestDto) {
      const nestedUpdatedValues = formValues

      const changedKey = keys(value)?.[0]
      const changedValue = value?.[changedKey]
      const nestedKey = keys(changedValue)?.[0]
      if (
        include(
          [
            'inspectingOfficerWithStaffPhoto',
            'inspectingOfficerWithChildrenPhoto',
            'hostelPhotos',
          ],
          nestedKey,
        )
      ) {
        const file = changedValue?.[nestedKey]
        const fileList =
          nestedUpdatedValues?.[changedKey]?.[nestedKey]?.fileList

        await handleFileUpload({
          file,
          fileList,
          filePath: [changedKey, nestedKey],
        })
      }
      form.setFieldsValue({
        findingsRequestDto: nestedUpdatedValues?.findingsRequestDto,
      })
    }
    setTriggerLoader({ ...triggerLoader, updated: true })
  }

  // eslint-disable-next-line no-unused-vars
  const checkUserSelection = () => {
    const inspectionList = form.getFieldValue('inspectionList')

    const messages = {
      producer: [],
      consumer: [],
      collectionCenter: [],
      dealer: [],
    }
    inspectionList?.forEach((value, index) => {
      // const checkUser = (role, idx) => selectedUsers?.[role]?.[idx]?.id

      // // producer is required for all vehicle types
      // if (!checkUser(producer, index)) {
      //   messages.producer.push(index + 1)
      // }

      return false
    })

    const hasInvalidUserSelection = values(messages)?.flat(1)?.length
    if (hasInvalidUserSelection) {
      const msgByUser = {
        producer: 'msg_PleaseSelectProducerAtELV',
        consumer: 'msg_PleaseSelectConsumerAtELV',
        collectionCenter: 'msg_PleaseSelectCollectionCenterAtELV',
        dealer: 'msg_PleaseSelectDealerAtELV',
      }
      const msgArr = []
      entries(messages)?.forEach(([key, value]) => {
        if (value?.length) {
          msgArr.push(t(msgByUser[key], { number: value?.join(', ') }))
        }
      })
      dispatch(
        setPopupMessageModel({
          open: true,
          msgList: msgArr,
        }),
      )
    }
    return !hasInvalidUserSelection
  }

  const validatorFn = async ({ validateAll, onSave, validateOnly }) => {
    const inspectionList = form.getFieldValue(['inspectionList'])
    try {
      if (validateAll && !onSave) {
        await form.validateFields(['inspectionList'], {
          recursive: true,
          validateOnly,
        })
      }
    } catch (error) {
      const inspectionValid = inspectionList?.every((_, index) => {
        const errorFieldName = error?.errorFields?.[index]?.name
        if (length(errorFieldName)) {
          if (!validateOnly) {
            // eslint-disable-next-line no-unused-vars
            let [_, hostelNumber, dtoKey] = errorFieldName
            if (!include(activeKeys?.[hostelNumber], dtoKey)) {
              setActiveKeys(prev => {
                const clonePrev = [...(prev || [])]
                clonePrev[hostelNumber] = [
                  ...(prev?.[hostelNumber] || []),
                  dtoKey,
                ]
                return clonePrev
              })
            }
            setTimeout(() => {
              form.scrollToField(errorFieldName)
            }, 300)
          }
          return false
        }
        return true
      })
      if (!inspectionValid) return false
    }
    return true
  }

  const validationFn = async ({ onSave, validateAll }) => {
    switch (current) {
      case 0:
      case 3:
        try {
          await form.validateFields()
        } catch (error) {
          return false
        }
        return true

      case 1:
        const hostelId = selectedUsers?.[userWiseRole?.hostel]?.[0]?.id
        if (!hostelId) {
          dispatch(
            setPopupMessageModel({
              open: true,
              message: ['msg_PleaseSelectHostel'],
            }),
          )
          return false
        }
        try {
          const isValid = await validatorFn({ onSave, validateAll })
          if (!isValid && isMobile) {
            dispatch(
              setPopupMessageModel({
                open: true,
                message: 'msg_PleaseFillMandatory',
              }),
            )
          }
          return isValid
        } catch (error) {
          return false
        }
      case 2:
        try {
          return await form.validateFields()
        } catch (error) {
          if (isMobile) {
            dispatch(
              setPopupMessageModel({
                open: true,
                message: 'msg_PleaseFillMandatory',
              }),
            )
          }
          return false
        }

      default:
        return true
    }
  }

  const handleNext = async () => {
    let isValid = await validationFn({ validateAll: true })
    if (!isValid) return
    if (include([1, 2], current)) {
      isValid = await apiCall({
        showMsg: true,
        isLoading: true,
      })
    } else if (isEqual(current, 3)) {
      setCompleteConfirmation({ open: true })
      return
    }
    if (!isValid) return

    return setCurrent(isEqual(current, 1) ? current + 2 : current + 1)
  }

  const handlePrevious = () => {
    setCurrent(isEqual(current, 3) ? current - 2 : current - 1)
  }

  const onCompleteConfirmationClose = () => {
    setCompleteConfirmation({ open: false })
  }

  const onAcceptCompleteConfirmation = async () => {
    setCompleteConfirmation({ open: false })
    const isValid = await apiCall({
      showMsg: true,
      isComplete: true,
      isLoading: true,
    })
    if (!isValid) return
    setCurrent(current + 1)
  }

  const handleSave = async ({ redirect = true, key, index } = {}) => {
    const isValid = await validationFn({ onSave: true })
    if (!isValid) return
    setLoader(true)
    apiCall({
      showMsg: true,
      redirect,
      key,
      index,
    })
  }

  const onDownloadTemplate = async () => {
    try {
      let link = document.createElement('a')
      link.href = data
      link.download = `Recovery_Job_Data_Upload_template`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {}
  }

  const onActiveKeysChange = (keys, index) => {
    if (isMobile) {
      const currentKey = keys?.filter(
        item => !activeKeys?.[index]?.includes(item),
      )
      setActiveFormField({ isOpen: true, key: currentKey?.[0] })
    }
    setActiveKeys(prev => {
      const clonePrev = [...(prev || [])]
      clonePrev[index] = keys
      return clonePrev
    })
  }

  const handleActiveFieldModal = (key, index) => {
    setActiveFormField({ isOpen: false, key: null })
    const updatedKeys = activeKeys?.[index]?.filter(v => notEqual(v, key))
    setActiveKeys(prev => {
      const clonePrev = [...(prev || [])]
      clonePrev[index] = updatedKeys
      return clonePrev
    })
  }

  const onConfirmModelClose = () => {
    resolvePromise(false)
    setConfirmModel({ open: false, description: '' })
  }

  const onAcceptConfirmation = () => {
    setConfirmModel({ open: false, description: '' })
    resolvePromise(true)
  }

  const inspectionFormFieldsAttr = {
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
    // curricularActivitiesAttrFn,
  }

  const downloadInspectionData = () => {
    downloadReport(
      editData?.inspectionJobReportDetails?.fileUrl,
      editData?.inspectionJobReportDetails?.fileName,
    )
  }

  return {
    form,
    loader,
    current,
    showSave,
    inspectionInitialValues,
    inspectionFormFieldsAttr,
    activeKeys,
    confirmModel,
    handleNext,
    handleSave,
    handlePrevious,
    onValuesChange,
    onDownloadTemplate,
    onActiveKeysChange,
    onConfirmModelClose,
    onAcceptConfirmation,
    findingsAttrFn,
    getCurrentLocation,
    activeFormField,
    handleActiveFieldModal,
    formFieldPercentage,
    completeConfirmation,
    onCompleteConfirmationClose,
    onAcceptCompleteConfirmation,
    apiCall,
    downloadInspectionData,
    triggerLoader,
  }
}

export default inspection
