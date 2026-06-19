import {
  // CalendarOutlined,
  EditOutlined,
  SaveOutlined,
  // UserOutlined,
} from '@ant-design/icons'
import classNames from 'classnames'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { notifyMethod } from '../../../../../App'
import usePromise from '../../../../../hooks/usePromise'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDCollapse from '../../../../../shared/antd/ANTDCollapse'
import ANTDColumn from '../../../../../shared/antd/ANTDColumn'
import ANTDForm, {
  ANTDFormItem,
  useFormFn,
  useFormInstanceFn,
} from '../../../../../shared/antd/ANTDForm'
import ANTDImage from '../../../../../shared/antd/ANTDImage'
import ANTDRow from '../../../../../shared/antd/ANTDRow'
import ANTDTable from '../../../../../shared/antd/ANTDTable'
import getFormInput from '../../../../../shared/form.description'
import PopUpConfirm from '../../../../../shared/PopUpConfirm'
import { getBase64 } from '../../../../../utils'
import { MAX_FILE_SIZE, userWiseRole } from '../../../../../utils/constant'
import { dayJs } from '../../../../../utils/dayjs'
// import { MapPin } from '../../../../../utils/icons'
import {
  entries,
  include,
  isArray,
  isEqual,
  keys,
  length,
  notEqual,
  nullOrUndefined,
} from '../../../../../utils/javascript'
import { getItem } from '../../../../../utils/localstorage'
// import FormUpload from '../../../../common/presentation/FormUpload'
import inspectionFieldAttr from '../../../container/inspectionFieldAttr.container'
import jobContext from '../../../container/jobContext.container'
import { /* getGeoTagDataApi, */ quickEditAPI } from '../../../jobs.api'
import { APPROVED, PENDING } from '../../../jobs.description'
import EditLogTable from '../../common/EditLogTable'
import JobUserSelect from '../../common/JobUserSelect'

const CellRender = ({
  record,
  rowData,
  editLogStatus,
  onEditLogClick,
  onSaveClick,
  showEdit,
}) => {
  const { t } = useTranslations()
  const form = useFormInstanceFn()
  const [isEdit, setIsEdit] = useState(null)
  const {
    options,
    inputType,
    key,
    detailKey,
    editable = true,
    apiKey,
    rules = [],
    required = false,
    ...restProps
  } = record || {}

  const isEditDisabled = isEqual(editLogStatus?.status, PENDING)

  const onEditClick = ({ value }) => {
    setIsEdit(true)
    if (nullOrUndefined(value)) return

    const fieldValue = isEqual(record?.inputType, 'dateTimePicker')
      ? value
        ? dayJs(value, 'DD/MM/YYYY')
        : null
      : isEqual(record?.inputType, 'select') && record?.apiKey
        ? record?.options?.find(item => t(item?.label) === value)?.value
        : value

    form.setFieldsValue({
      [record?.key]: fieldValue,
    })
  }

  const handleSaveClick = async ({ record, detailKey }) => {
    try {
      await form.validateFields([key])
    } catch (error) {
      return
    }
    setIsEdit(false)
    onSaveClick({ record, detailKey })
  }

  if (include(['select', 'dateTimePicker'], inputType)) {
    restProps.className = `${restProps.className || ''} w-100`.trim()
  }

  const InputComponent = getFormInput({ inputType })
  const optionList = options?.map(val => ({
    ...val,
    label: typeof val.label === 'object' ? val.label : t(val.label),
  }))
  return (
    <div className="d-flex space-between tabuler-cell-wrapper">
      <span className="mr-5 w-100 tabuler-cell-content">
        {isEdit ? (
          <ANTDFormItem
            className="tabuler-form-item"
            name={key}
            rules={
              required
                ? [
                    { required: true, message: t('error_FieldISRequire') },
                    ...rules,
                  ]
                : rules
            }
          >
            <InputComponent {...restProps} options={optionList} />
          </ANTDFormItem>
        ) : isEqual(inputType, 'select') ? (
          t(options?.find(item => item?.value === rowData)?.label || rowData)
        ) : isEqual(inputType, 'formUpload') ? (
          rowData?.map?.(item => (
            <ANTDImage
              className="inspection-images"
              key={item?.id || item?.uid}
              src={item?.fileUrl || item?.url}
              height={70}
              width={70}
              visible={false}
            />
          ))
        ) : isEqual(inputType, 'dateTimePicker') ? (
          rowData ? (
            rowData
          ) : (
            '-'
          )
        ) : (
          (rowData?.toString() ?? '-')
        )}
      </span>
      {showEdit && editable && (
        <span className="d-flex" style={{ maxHeight: '32px' }}>
          {isEdit ? (
            <SaveOutlined
              height="20px"
              width="20px"
              onClick={() =>
                handleSaveClick({
                  record: { key, inputType, apiKey, options },
                  detailKey,
                })
              }
            />
          ) : (
            <EditOutlined
              height="20px"
              width="20px"
              className={classNames({
                'disabled-illusion': isEditDisabled,
              })}
              onClick={() =>
                onEditClick({
                  record,
                  value: rowData,
                })
              }
            />
          )}

          {/* {!!editLogStatus?.status && (
            <RewindTimeIcon
              className="rewind-icon"
              onClick={() => onEditLogClick(record, editLogStatus?.canApprove)}
            />
          )} */}
        </span>
      )}
    </div>
  )
}

const TabulerView = ({ inspectionDetails, userSelectionList, currentForm }) => {
  const { t } = useTranslations()
  const form = useFormFn()
  const { /* createPromise, */ resolvePromise } = usePromise()
  const [data, setData] = useState(inspectionDetails)
  const [confirmModel, setConfirmModel] = useState({ open: false })
  // const [geoTagData, setGeoTagData] = useState({})
  const locationRef = useRef(null)
  const userData = JSON.parse(getItem('userData'))
  const { roleId } = { ...userData }
  const { districtHostelDepartment, inspectionOfficer } = userWiseRole

  const { onFileUploadOrRemove } = jobContext()
  const [editLogModel, setEditLogModel] = useState({ open: false })

  useEffect(() => {
    if (data?.imageList) {
      const tempImageList = {}
      data?.imageList?.forEach(item => {
        const fieldKey = fileUploadAttr[item?.label]?.name
        tempImageList[fieldKey] = {
          fileList: isArray(item?.value) ? item.value : [],
        }
      })
      form.setFieldsValue({ ...tempImageList })
    }
    // const getCurrentLocation = async () => {
    //   const data = await getLocation()
    //   locationRef.current = data
    // }
    // getCurrentLocation()

    //read only fields which are not stored on backend
    setData(prev => {
      const { basicDetailsResponseDto, rcFormTwoDetailsResponseDto } = prev
      return {
        ...prev,
        rcFormTwoDetailsResponseDto: {
          ...rcFormTwoDetailsResponseDto,
          weighmentAtScrapFacilityInKgs:
            basicDetailsResponseDto?.weightAsPerMsti,
          differenceInWeightAsPerMakerAndScrapFacility:
            rcFormTwoDetailsResponseDto?.weightAsPerMaker
              ? rcFormTwoDetailsResponseDto?.weightAsPerMaker -
                (basicDetailsResponseDto?.weightAsPerMsti || 0)
              : null,
        },
      }
    })
  }, [])

  const imageFieldsKeys = [
    'formTwoDmsIds',
    'codDmsIds',
    'cvsDmsIds',
    'paymentConfirmationDmsIds',
    'mstiCertDmsIds',
    'elvImagesDmsIds',
    'otherFilesDmsIds',
    'registrationCertDmsIds',
  ]

  const fileUploadAttr = {
    job_Form2: {
      name: 'formTwoDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_COD: {
      name: 'codDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_CVS: {
      name: 'cvsDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_PaymentConfirmation: {
      name: 'paymentConfirmationDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_MSTICertificate: {
      name: 'mstiCertDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_ElvImages: {
      name: 'elvImagesDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp',
      uploadSingle: true,
    },
    job_OtherFiles: {
      name: 'otherFilesDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
    },
    job_RegistrationCertificate: {
      name: 'registrationCertDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
  }

  // const onRemove = file => {
  //   setConfirmModel(prev => ({ ...prev, open: true }))
  //   return createPromise()
  // }

  const onConfirmModelClose = () => {
    resolvePromise(false)
    setConfirmModel(prev => ({ ...prev, open: false }))
  }

  const onConfirmRemove = () => {
    resolvePromise(true)
    onConfirmModelClose()
  }

  const modifyDataValue = ({
    record,
    updatedValue,
    detailKey,
    dependentData,
  }) => {
    setData(prev => ({
      ...prev,
      [detailKey]: {
        ...prev[detailKey],
        [record.key]:
          isEqual(record?.inputType, 'select') && record?.apiKey
            ? t(
                record?.options?.find(item => item?.value === updatedValue)
                  ?.label,
              )
            : updatedValue,
        ...(record.apiKey && {
          [record.apiKey]: updatedValue,
        }),
        ...dependentData,
      },
    }))
  }

  const onSaveClick = async ({ record, detailKey }) => {
    // const fieldValue = form.getFieldValue(record?.key) ?? null
    // const updatedValue = isEqual(record?.inputType, 'dateTimePicker')
    //   ? fieldValue?.format('DD/MM/YYYY') || null
    //   : fieldValue
    // const keyName = record?.apiKey || record?.key
    // const prevValue = data?.[detailKey]?.[keyName]
    // if (isEqual(prevValue, updatedValue)) return
    // const payload = {
    //   jobId: data?.jobId,
    //   scrapId: data?.systemId,
    //   keyName,
    //   value: nullOrUndefined(updatedValue) ? -1 : updatedValue, // -1 for removing the value as per backend,
    //   ...locationRef.current,
    // }
    // try {
    //   const response = await postJobEditLogApi({ payload })
    //   if (response?.data?.success) {
    //     if (include([recycler, scrappingFacilityManager, superUser], roleId)) {
    //       const { dependentKey, dependentKeyValue } = response?.data
    //       modifyDataValue({
    //         record,
    //         updatedValue,
    //         detailKey,
    //         dependentData: {
    //           [dependentKey]: dependentKeyValue,
    //         },
    //       })
    //     }
    //     //disable edit button when pending approval
    //     setData(prev => ({
    //       ...prev,
    //       editLogKeyStatus: {
    //         ...prev?.editLogKeyStatus,
    //         [keyName]: {
    //           ...prev?.editLogKeyStatus?.[keyName],
    //           status: include(
    //             [recycler, scrappingFacilityManager, superUser],
    //             roleId,
    //           )
    //             ? APPROVED
    //             : PENDING,
    //         },
    //       },
    //     }))
    //   }
    // } catch (error) {}
  }

  const onEditLogClick = (record, canApprove) => {
    setEditLogModel({
      open: true,
      scrapId: data?.systemId,
      keyName: record?.apiKey || record?.key,
      record,
      canApprove,
    })
  }

  const onEditLogModelClose = ({
    status = null,
    updatedValue,
    dependentData,
  } = {}) => {
    setEditLogModel({ open: false })
    if (status) {
      isEqual(status, APPROVED) &&
        modifyDataValue({
          record: editLogModel?.record,
          updatedValue,
          detailKey: editLogModel?.record?.detailKey,
          dependentData,
        })

      setData(prev => ({
        ...prev,
        editLogKeyStatus: {
          ...prev?.editLogKeyStatus,
          [editLogModel?.record?.apiKey || editLogModel?.record?.key]: {
            ...prev?.editLogKeyStatus?.[
              editLogModel?.record?.apiKey || editLogModel?.record?.key
            ],
            status,
          },
        },
      }))
    }
  }

  const tabulerDetailColumn = showEdit => [
    {
      title: '',
      dataIndex: 'label',
      key: 'label',
      render: rowData => <b>{t(rowData)}</b>,
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
      width: '49%',
      className: 'tabuler-value-cell',
      render: (rowData, record) => {
        return (
          <CellRender
            showEdit={showEdit}
            record={record}
            rowData={rowData}
            editLogStatus={
              data?.editLogKeyStatus?.[record?.apiKey || record?.key]
            }
            onEditLogClick={onEditLogClick}
            onSaveClick={onSaveClick}
          />
        )
      },
    },
  ]

  const getHiddenCheckData = details =>
    entries(details || {}).reduce((acc, [key, value]) => {
      if (key.endsWith('Selected')) {
        acc[key.replace(/Selected$/, '')] = value
      } else if (acc[key] === undefined) {
        acc[key] = value
      }
      return acc
    }, {})

  const getGroupedVisibleTableData = ({ attributes, details, detailKey }) => {
    const hiddenCheckData = getHiddenCheckData(details)
    const groups = []
    let currentGroup = []

    entries(attributes)?.forEach(([key, attr]) => {
      const isHidden = isEqual(typeof attr?.hidden, 'function')
        ? attr.hidden(hiddenCheckData)
        : attr?.hidden

      if (!attr?.hidden && length(currentGroup)) {
        groups.push(currentGroup)
        currentGroup = []
      }

      if (!isHidden) {
        currentGroup.push({
          key,
          ...attr,
          detailKey,
          value: details?.[key],
        })
      }
    })

    if (length(currentGroup)) {
      groups.push(currentGroup)
    }

    return groups
  }

  const dataViewUI = useCallback(
    ({ details, detailKey, attributes, showEdit }) => {
      const groupedData = getGroupedVisibleTableData({
        attributes,
        details,
        detailKey,
      })
      const halfLength = Math.ceil(length(groupedData) / 2)
      const leftTable = groupedData?.slice(0, halfLength)?.flat() || []
      const rightTable = groupedData?.slice(halfLength)?.flat() || []

      const partitions = [
        leftTable,
        ...(length(rightTable) ? [rightTable] : []),
      ]

      return (
        <>
          <ANTDRow gutter={10} className="mb-10">
            {partitions.map((dataSource, i) => (
              <ANTDColumn lg={12} xs={24} key={i}>
                <ANTDTable
                  className="tebuler-table"
                  dataSource={dataSource}
                  columns={tabulerDetailColumn(showEdit)}
                  pagination={false}
                  bordered
                  size="small"
                  // scroll={{ x: 900 }}
                  // loading={loader}
                />
              </ANTDColumn>
            ))}
          </ANTDRow>
        </>
      )
    },
    [data],
  )

  const collapseItemUI = useCallback(
    ({ fieldAttr = [], detailKey, showEdit }) =>
      fieldAttr.map((item, index) => (
        <Fragment key={index}>
          <h3 className="mb-5 w-100 px-5 primary-color">{t(item.title)}</h3>
          {dataViewUI({
            details: data?.[detailKey],
            detailKey,
            attributes: item.fields,
            showEdit,
          })}
        </Fragment>
      )),
    [data],
  )

  const geoTaggingAPI = async () => {
    // const commonParams = {
    //   jobType: 'RECOVERY',
    //   scrapId: data?.systemId,
    // }
    // const [
    //   codDmsIds,
    //   cvsDmsIds,
    //   elvImagesDmsIds,
    //   mstiCertDmsIds,
    //   formTwoDmsIds,
    //   paymentConfirmationDmsIds,
    //   registrationCertDmsIds,
    //   otherFilesDmsIds,
    // ] = await Promise.all([
    //   getGeoTagDataApi({
    //     params: { ...commonParams, fieldName: 'codDmsIds' },
    //   }),
    //   getGeoTagDataApi({
    //     params: { ...commonParams, fieldName: 'cvsDmsIds' },
    //   }),
    //   getGeoTagDataApi({
    //     params: { ...commonParams, fieldName: 'elvImagesDmsIds' },
    //   }),
    //   getGeoTagDataApi({
    //     params: { ...commonParams, fieldName: 'mstiCertDmsIds' },
    //   }),
    //   getGeoTagDataApi({
    //     params: { ...commonParams, fieldName: 'formTwoDmsIds' },
    //   }),
    //   getGeoTagDataApi({
    //     params: { ...commonParams, fieldName: 'paymentConfirmationDmsIds' },
    //   }),
    //   getGeoTagDataApi({
    //     params: { ...commonParams, fieldName: 'registrationCertDmsIds' },
    //   }),
    //   getGeoTagDataApi({
    //     params: { ...commonParams, fieldName: 'otherFilesDmsIds' },
    //   }),
    // ])
    // setGeoTagData({
    //   codDmsIds,
    //   cvsDmsIds,
    //   elvImagesDmsIds,
    //   mstiCertDmsIds,
    //   formTwoDmsIds,
    //   paymentConfirmationDmsIds,
    //   registrationCertDmsIds,
    //   otherFilesDmsIds,
    // })
  }

  const onFileUploadCollapse = value => {
    if (include(value, 'job_FilesUploads')) geoTaggingAPI()
  }

  const onValuesChange = async (value, formValues) => {
    const changedKey = keys(value)?.[0]
    if (include(imageFieldsKeys, changedKey)) {
      const file = value?.[changedKey]
      const isLt5MB =
        !(file?.file?.size || file?.file?.originFileObj?.size) ||
        Number(file?.file?.size || file?.file?.originFileObj?.size) <
          MAX_FILE_SIZE

      const fileList = formValues?.[changedKey]?.fileList
      if (!isLt5MB) {
        notifyMethod.warning({
          message: t('msg_MaximumSizeAllowed', {
            maxSize: MAX_FILE_SIZE / 1024 / 1024,
          }),
        })
        return form.setFieldValue(changedKey, {
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
        form.setFieldValue(changedKey, {
          fileList,
        })
      }
      const payload = {
        scrapId: data?.systemId,
        processed: null,
        fileUploadSectionRequestDto: imageFieldsKeys.reduce((init, imgKey) => {
          init[imgKey] = formValues?.[imgKey]?.fileList?.map(val => val?.dmsId)
          return init
        }, {}),
        ...locationRef.current,
      }
      const response = await quickEditAPI({ payload })
      if (response?.data?.data?.success) {
        // const resp = await getGeoTagDataApi({
        //   params: {
        //     jobType: 'RECOVERY',
        //     scrapId: data?.systemId,
        //     fieldName: changedKey,
        //   },
        // })
        // setGeoTagData(prev => ({ ...prev, [changedKey]: resp }))
      }
    } else if (
      include(
        ['vehicleRegistrationNumber', 'registrationNumber', 'vehicleNumber'],
        changedKey,
      )
    ) {
      form.setFieldValue(changedKey, value?.[changedKey]?.toUpperCase())
    }
  }

  const allPermissionRoles = [districtHostelDepartment, inspectionOfficer]

  const showEditPermission = ({ section }) => {
    if (notEqual(data?.status, 'RECOVERY_COMPLETED')) return false

    switch (section) {
      case 'job_BasicVehicleDetails':
        return include([...allPermissionRoles], roleId)

      case 'job_SourceAndCommercials':
        return include([...allPermissionRoles], roleId)

      case 'job_OptionalDetails':
        return include([...allPermissionRoles], roleId)

      default:
        return false
    }
  }

  const selectedUserTable = collapseKey => {
    const selectedList = userSelectionList?.filter(val =>
      isEqual(val.section, collapseKey),
    )

    return length(selectedList)
      ? selectedList.map(({ key, slot, ...props }) => {
          const Slot = slot || JobUserSelect
          return (
            <Slot
              key={key}
              {...{
                ...props,
                readOnly: true,
                currentForm,
              }}
            />
          )
        })
      : null
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
    // curricularActivitiesAttrFn,
    // findingsAttrFn,
  } = inspectionFieldAttr()

  const mapAttributeToTableAttr = attr => {
    const attrList = []
    let obj = { title: '', fields: {} }
    entries(attr)?.forEach(([key, value], ind) => {
      if (ind === 0 && value?.title) {
        return (obj.title = value.title)
      } else if (value?.title) {
        attrList.push(Object.assign({}, obj))
        obj = { title: value?.title, fields: {} }
        return
      }

      obj.fields[key] = { ...value, editable: false }
      if (ind === length(entries(attr)) - 1) {
        attrList.push(Object.assign({}, obj))
      }
    })
    return attrList
  }

  return (
    <ANTDForm initialValues={{}} form={form} onValuesChange={onValuesChange}>
      <ANTDCollapse
        bordered={false}
        onChange={onFileUploadCollapse}
        items={[
          // {
          //   label: t('job_AdministrationGovernance'),
          //   key: 'hostelAdministrationRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('hostelAdministrationRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(administrationAttrFn()),
          //         detailKey: 'hostelAdministrationRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'hostelAdministrationRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_HostelInfraRooms'),
          //   key: 'hostelInfraRoomsRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('hostelInfraRoomsRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(hostelInfraRoomsAttrFn()),
          //         detailKey: 'hostelInfraRoomsRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'hostelInfraRoomsRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_HostelInfraSanitation'),
          //   key: 'hostelInfraSanitationRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('hostelInfraSanitationRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(
          //           hostelInfraSanitationAttrFn(),
          //         ),
          //         detailKey: 'hostelInfraSanitationRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'hostelInfraSanitationRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_MedicalCare'),
          //   key: 'medicalCareRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('medicalCareRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(medicalCareAttrFn()),
          //         detailKey: 'medicalCareRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'medicalCareRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_EducationFacilities'),
          //   key: 'educationFacilitiesRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('educationFacilitiesRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(
          //           educationFacilitiesAttrFn(),
          //         ),
          //         detailKey: 'educationFacilitiesRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'educationFacilitiesRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_ExtraCurricularActivities'),
          //   key: 'activitiesRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('activitiesRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(
          //           curricularActivitiesAttrFn(),
          //         ),
          //         detailKey: 'activitiesRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'activitiesRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_FoodProvisions'),
          //   key: 'foodProvisionRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('foodProvisionRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(foodProvisionAttrFn()),
          //         detailKey: 'foodProvisionRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'foodProvisionRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_SafetyAndSecurity'),
          //   key: 'safetyAndSecurityRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('safetyAndSecurityRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(safetyAndSecurityAttrFn()),
          //         detailKey: 'safetyAndSecurityRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'safetyAndSecurityRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_ConductionMeetings'),
          //   key: 'conductionMeetingsRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('conductionMeetingsRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(
          //           conductionMeetingsAttrFn(),
          //         ),
          //         detailKey: 'conductionMeetingsRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'conductionMeetingsRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_Feedback'),
          //   key: 'feedbackRequestDto',
          //   className: 'coll collapse-header',
          //   children: (
          //     <>
          //       {selectedUserTable('feedbackRequestDto')}
          //       {collapseItemUI({
          //         fieldAttr: mapAttributeToTableAttr(feedbackAttrFn()),
          //         detailKey: 'feedbackRequestDto',
          //         showEdit: showEditPermission({
          //           section: 'feedbackRequestDto',
          //         }),
          //       })}
          //     </>
          //   ),
          // },
          // {
          //   label: t('job_FilesUploads'),
          //   key: 'job_FilesUploads',
          //   className: 'coll collapse-header',
          //   hidden: true,
          //   children: (
          //     <>
          //       <div className="mt-20 geotagging-details">
          //         <ANTDRow gutter={10}>
          //           {data?.imageList?.map(({ label, md = 12 }, ind) => {
          //             const geoData =
          //               geoTagData?.[fileUploadAttr?.[label]?.name]?.data
          //             return (
          //               <ANTDColumn key={ind} md={md} xs={24} className="mt-10">
          //                 <b className="d-block">{t(label)}</b>
          //                 <div className="d-flex">
          //                   <ANTDFormItem
          //                     name={fileUploadAttr?.[label]?.name}
          //                     noStyle
          //                   >
          //                     <FormUpload
          //                       {...fileUploadAttr?.[label]}
          //                       name={fileUploadAttr?.[label]?.name}
          //                       takePhotoFlag={false}
          //                       form={form}
          //                       onRemove={onRemove}
          //                     />
          //                   </ANTDFormItem>
          //                   {geoData?.userInfo?.id && (
          //                     <div className="ml-10" style={{ flex: 1 }}>
          //                       <p>
          //                         <CalendarOutlined /> :{' '}
          //                         {geoData?.updatedDate || '-'}
          //                       </p>
          //                       <p>
          //                         <UserOutlined /> :{' '}
          //                         {geoData?.userInfo?.businessName ||
          //                           geoData?.userInfo?.lastName ||
          //                           '-'}
          //                       </p>
          //                       <p>
          //                         <span>
          //                           <MapPin
          //                             alt="location"
          //                             className="updateAt-location"
          //                           />
          //                         </span>
          //                         : {geoData?.address || '-'}
          //                       </p>
          //                       <p>
          //                         <span>{t('job_Latitude')}</span> :{' '}
          //                         {geoData?.latitude || '-'}
          //                       </p>
          //                       <p>
          //                         <span>{t('job_Longitude')}</span>:{' '}
          //                         {geoData?.longitude || '-'}
          //                       </p>
          //                     </div>
          //                   )}
          //                 </div>
          //               </ANTDColumn>
          //             )
          //           })}
          //         </ANTDRow>
          //       </div>
          //     </>
          //   ),
          // },
          {
            label: t('job_AdministrationGovernance'),
            key: 'hostelAdministrationRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('hostelAdministrationRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(administrationAttrFn()),
                  detailKey: 'hostelAdministrationRequestDto',
                  showEdit: showEditPermission({
                    section: 'hostelAdministrationRequestDto',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_FoodNutritionSection'),
            key: 'foodNutritionRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('foodNutritionRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(foodNutritionAttrFn()),
                  detailKey: 'foodNutritionRequestDto',
                  showEdit: showEditPermission({
                    section: 'foodNutritionRequestDto',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_AccommodationSection'),
            key: 'accommodationRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('accommodationRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(accommodationAttrFn()),
                  detailKey: 'accommodationRequestDto',
                  showEdit: showEditPermission({
                    section: 'accommodationRequestDto',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_SanitationDrainageSection'),
            key: 'sanitationDrainageRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('sanitationDrainageRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(
                    sanitationDrainageAttrFn(),
                  ),
                  detailKey: 'sanitationDrainageRequestDto',
                  showEdit: showEditPermission({
                    section: 'sanitationDrainageRequestDto',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_ElectricityLightingSection'),
            key: 'electricityLightingRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('electricityLightingRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(
                    electricityLightingAttrFn(),
                  ),
                  detailKey: 'electricityLightingRequestDto',
                  showEdit: showEditPermission({
                    section: 'electricityLightingRequestDto',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_HealthMedicalCareSection'),
            key: 'healthMedicalCareRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('healthMedicalCareRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(healthMedicalCareAttrFn()),
                  detailKey: 'healthMedicalCareRequestDto',
                  showEdit: showEditPermission({
                    section: 'healthMedicalCareRequestDto',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_EducationAcademicEnvironmentSection'),
            key: 'educationAcademicEnvironmentRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('educationAcademicEnvironmentRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(
                    educationAcademicEnvironmentAttrFn(),
                  ),
                  detailKey: 'educationAcademicEnvironmentRequestDto',
                  showEdit: showEditPermission({
                    section: 'educationAcademicEnvironmentRequestDto',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_SafetySecuritySection'),
            key: 'safetySecurityRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('safetySecurityRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(safetySecurityAttrFn()),
                  detailKey: 'safetySecurityRequestDto',
                  showEdit: showEditPermission({
                    section: 'safetySecurityRequestDto',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_StudentFeedbackSection'),
            key: 'studentFeedbackRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('studentFeedbackRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(studentFeedbackAttrFn()),
                  detailKey: 'studentFeedbackRequestDto',
                  showEdit: false,
                })}
              </>
            ),
          },
          {
            label: t('job_OverallAssessmentSection'),
            key: 'overallAssessmentRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('overallAssessmentRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(overallAssessmentAttrFn()),
                  detailKey: 'overallAssessmentRequestDto',
                  showEdit: false,
                })}
              </>
            ),
          },
          {
            label: t('job_Feedback'),
            key: 'inspectingOfficerFeedbackRequestDto',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('inspectingOfficerFeedbackRequestDto')}
                {collapseItemUI({
                  fieldAttr: mapAttributeToTableAttr(
                    inspectingOfficerFeedbackAttrFn(),
                  ),
                  detailKey: 'inspectingOfficerFeedbackRequestDto',
                  showEdit: false,
                })}
              </>
            ),
          },
        ].filter(({ hidden }) => !hidden)}
      />
      <PopUpConfirm
        isOpen={confirmModel?.open}
        onCancelModel={onConfirmModelClose}
        onAccept={onConfirmRemove}
        onReject={onConfirmModelClose}
        description={t('msg_AreYouSureYouWantRemoveThis')}
      />
      {editLogModel?.open && (
        <EditLogTable
          editLogModel={editLogModel}
          onEditLogModelClose={onEditLogModelClose}
          actionPermission={editLogModel?.canApprove}
        />
      )}
    </ANTDForm>
  )
}

export default TabulerView
