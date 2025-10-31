import ConfirmView from './ConfirmView'
import InspectionFormField from './InspectionFormField'
import InspectionFormList from './InspectionFormList'
import ANTDButton from '../../../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../../../shared/antd/ANTDColumn'
import { ANTDDatePicker } from '../../../../../shared/antd/ANTDDatePicker'
import ANTDForm, { ANTDFormItem } from '../../../../../shared/antd/ANTDForm'
import ANTDInput from '../../../../../shared/antd/ANTDInput'
import ANTDRow from '../../../../../shared/antd/ANTDRow'
import PopUpConfirm from '../../../../../shared/PopUpConfirm'
import { userWiseRole } from '../../../../../utils/constant'
import { validationTag } from '../../../../../utils/customFunctions'
import { clipboardsImage } from '../../../../../utils/icons'
import { getItem } from '../../../../../utils/localstorage'
import inspection from '../../../container/inspection.container'
import jobContext from '../../../container/jobContext.container'
import {
  inspectionSteps,
  tabKeys as jobTabKeys,
} from '../../../jobs.description'
import JobUserSelect from '../../common/JobUserSelect'
import StepsComponent from '../../common/StepsComponent'

const InspectionJob = ({ editData }) => {
  const {
    t,
    roleId,
    selectedUsers,
    nextBtnLoader,
    setNextBtnLoader,
    onUserClear,
    onSelectUser,
    setSelectedUsers,
    onFileUploadOrRemove,
    getPayloadForUserList,
  } = jobContext()

  const {
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
    removeMaterialClick,
    onActiveKeysChange,
    onConfirmModelClose,
    onAcceptConfirmation,
    findingsAttrFn,
    getCurrentLocation,
    activeFormField,
    handleActiveFieldModal,
    formFieldPercentage,
  } = inspection({
    editData,
    selectedUsers,
    setSelectedUsers,
    onFileUploadOrRemove,
    roleId,
    setNextBtnLoader,
    getPayloadForUserList,
    onSelectUser,
    onUserClear,
  })
  const lang = getItem('lang')

  const { inspectionOfficer } = userWiseRole

  const userSelectionList = [
    {
      key: 'inspector',
      selectTitle: 'user_InspectionOfficer',
      roleId: inspectionOfficer,
      readOnly: true,
    },
  ]

  const displayForm = {
    0: (
      <>
        <ANTDRow className="date-management-number" gutter={10}>
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
                format={'YYYY/MM/DD HH:mm'}
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
              name={'locationInspection'}
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
        {userSelectionList
          .filter(val => !val.isHidden)
          ?.map(({ isHidden, key, ...val }) => (
            <JobUserSelect
              key={key}
              {...{
                ...val,
                apiPayload: getPayloadForUserList(val?.roleId),
                userData: selectedUsers?.[val?.roleId],
                onSelectUser,
                selectedUsers,
                onUserClear,
              }}
            />
          ))}
      </>
    ),
    1: (
      <div className="inspection-form-list">
        <InspectionFormList
          removeMaterialClick={removeMaterialClick}
          onDownloadTemplate={onDownloadTemplate}
          inspectionFormFieldsAttr={inspectionFormFieldsAttr}
          onSaveClick={props => handleSave({ redirect: false, ...props })}
          activeKeys={activeKeys}
          onActiveKeysChange={onActiveKeysChange}
          {...{
            onSelectUser,
            selectedUsers,
            onUserClear,
            activeFormField,
            handleActiveFieldModal,
            formFieldPercentage,
          }}
        />
      </div>
    ),
    2: (
      <>
        <InspectionFormField
          {...{
            attrList: findingsAttrFn(),
            name: 'findingsRequestDto',
          }}
        />
      </>
    ),
    3: (
      <ConfirmView
        selectedUsers={selectedUsers}
        inspectionFormFieldsAttr={inspectionFormFieldsAttr}
        findingsAttrFn={findingsAttrFn}
        getCurrentLocation={getCurrentLocation}
      />
    ),
    4: (
      <>
        <div className="text-center align-center">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              className=""
              src={clipboardsImage}
              alt="clipboard"
              height="150px"
              width="150px"
            />
          </div>
          <h2 className="mt-10">{t('msg_JobCompleted')}</h2>
        </div>
      </>
    ),
  }

  return (
    <>
      <div className="inner-repair-wrapper">
        <h2 className="content-title d-flex space-between align-center">
          <span>{t('job_InspectionJob')}</span>
          {showSave && (
            <ANTDButton
              type="primary"
              className="save-btn m-2 mr-10"
              onClick={handleSave}
            >
              {t('btn_Save')}
            </ANTDButton>
          )}
        </h2>
        <ANTDForm
          name="inspection"
          initialValues={inspectionInitialValues}
          form={form}
          onValuesChange={onValuesChange}
          colon={false}
          labelAlign="left"
        >
          <StepsComponent
            {...{
              steps: inspectionSteps,
              current,
              loader,
              completeStep: 3,
              displayForm,
              handleNext,
              handlePrevious,
              handleSave,
              showSave: false,
              jobType: jobTabKeys.inspection,
              backToLabel: 'btn_BackToInspectionJob',
              nextBtnLoader,
            }}
          />
        </ANTDForm>
      </div>
      <PopUpConfirm
        isOpen={confirmModel?.open}
        onCancelModel={onConfirmModelClose}
        onAccept={onAcceptConfirmation}
        onReject={onConfirmModelClose}
        description={t(confirmModel?.description)}
      />
    </>
  )
}

export default InspectionJob
