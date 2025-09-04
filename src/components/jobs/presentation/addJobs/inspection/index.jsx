import InspectionFormList from './InspectionFormList'
import { ANTDDatePicker } from '../../../../../shared/antd/ANTDDatePicker'
import ANTDForm, { ANTDFormItem } from '../../../../../shared/antd/ANTDForm'
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
      selectTitle: 'job_SelectInspectionOfficer',
      roleId: inspectionOfficer,
    },
  ]

  const displayForm = {
    0: (
      <>
        <div className="date-management-number">
          <ANTDFormItem
            label={t('job_DateOfInspectionAndTime')}
            name={'jobCompletionDate'}
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
              name="jobCompletionDate"
              placeholder={t('job_SelectDate')}
              allowClear={false}
              format={'YYYY/MM/DD'}
            />
          </ANTDFormItem>
        </div>
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
      <InspectionFormList
        removeMaterialClick={removeMaterialClick}
        onDownloadTemplate={onDownloadTemplate}
        inspectionFormFieldsAttr={inspectionFormFieldsAttr}
        onSaveClick={() => handleSave({ redirect: false })}
        activeKeys={activeKeys}
        onActiveKeysChange={onActiveKeysChange}
      />
    ),
    2: <></>,
    // 3: (
    //   <ConfirmView
    //     selectedUsers={selectedUsers}
    //     isDirect={isDirectRecovery}
    //     isELVnPartsSelected={isELVnPartsSelected}
    //     scrapSource={scrapSource}
    //     vehicleCategoryList={vehicleCategoryList}
    //     providedByList={providedByList}
    //     elvSourceList={elvSourceList}
    //     fuelTypeList={fuelTypeList}
    //     challanPaidTypeList={challanPaidTypeList}
    //     categoryELVOptions={categoryELVOptions}
    //   />
    // ),
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
        <h2 className="content-title">{t('job_InspectionJob')}</h2>
        <ANTDForm
          name="inspection"
          initialValues={inspectionInitialValues}
          form={form}
          layout="vertical"
          onValuesChange={onValuesChange}
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
              showSave,
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
