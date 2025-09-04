import { memo } from 'react'

import { useWatchFn } from '../../../../../shared/antd/ANTDForm'
import { userWiseRole } from '../../../../../utils/constant'
import { getTranslationKeyById } from '../../../../../utils/customFunctions'
import { include, isEqual, notEqual } from '../../../../../utils/javascript'
import { userRelationKey } from '../../../../userManagement/user.description'
import {
  COLLECTION_CENTER,
  DIRECT_DEALER,
  OEM,
} from '../../../jobs.description'
import JobUserSelect from '../../common/JobUserSelect'

const RecoveryUserSelection = ({
  form,
  roleId,
  index,
  selectedUsers,
  onSelectUser,
  onUserClear,
  getPayloadForUserList,
  elvSourceList,
  isEdit,
}) => {
  const elvSourceId = useWatchFn(['recoverList', index, 'elvSourceId'], form)
  const sourceValue = getTranslationKeyById(elvSourceId, elvSourceList)
  const {
    consumer,
    producer,
    dealer,
    collectionCenter,
    // dataEntry,
    accounts,
    finance,
  } = userWiseRole
  // const disableFieldsForTech = include([dataEntry, accounts, finance], roleId)
  const userSelectionList = [
    {
      key: 'dealer',
      selectTitle: 'job_SelectDealer',
      roleId: dealer,
      apiPayload: getPayloadForUserList(dealer, {
        relationType: userRelationKey.associate,
      }),
      isHidden: notEqual(sourceValue, DIRECT_DEALER),
      disableSelect: isEdit && include([accounts, finance], roleId),
      disableClear: isEdit && include([accounts, finance], roleId),
    },
    {
      key: 'collectionCenter',
      selectTitle: 'job_SelectCollectionCenter',
      roleId: collectionCenter,
      apiPayload: getPayloadForUserList(collectionCenter, {
        relationType: userRelationKey.associate,
      }),
      isHidden: notEqual(sourceValue, COLLECTION_CENTER),
      disableSelect: isEdit && include([accounts, finance], roleId),
      disableClear: isEdit && include([accounts, finance], roleId),
    },
    {
      key: 'customer',
      selectTitle: 'job_SelectConsumer',
      roleId: consumer,
      showAdd: true,
      apiPayload: getPayloadForUserList(consumer),
      isHidden: isEqual(sourceValue, OEM),
      disableSelect: isEdit && include([accounts, finance], roleId),
      disableClear: isEdit && include([accounts, finance], roleId),
    },
    {
      key: 'producer',
      selectTitle: 'job_SelectProducer',
      roleId: producer,
      apiPayload: getPayloadForUserList(producer),
      disableSelect: isEdit && include([accounts, finance], roleId),
      disableClear: isEdit && include([accounts, finance], roleId),
    },
  ].filter(val => !val.isHidden)
  return (
    <>
      {userSelectionList?.map(({ isHidden, key, ...val }) => (
        <JobUserSelect
          key={key}
          {...{
            ...val,
            userData: selectedUsers?.[val?.roleId]?.[index]
              ? [selectedUsers?.[val?.roleId]?.[index]]
              : [],
            onSelectUser,
            selectedUsers,
            onUserClear,
            userIndex: index,
            allowDuplicateSelect: true,
          }}
        />
      ))}
    </>
  )
}

export default memo(RecoveryUserSelection)
