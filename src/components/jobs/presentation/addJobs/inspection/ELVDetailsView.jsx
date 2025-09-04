import RecoveryDealerSelect from './RecoveryDealerSelect'
import TabulerView from './TabulerView'
import ANTDCard from '../../../../../shared/antd/ANTDCard'
import { userWiseRole } from '../../../../../utils/constant'
// import { maskNumber } from '../../../../../utils/customFunctions'
import { include, isEqual, notEqual } from '../../../../../utils/javascript'
import {
  COLLECTION_CENTER,
  DIRECT_DEALER,
  OEM,
  TEST_VEHICLE_REGISTERED,
  TEST_VEHICLE_UNREGISTERED,
} from '../../../jobs.description'

const ELVDetailsView = ({
  details,
  scrapSource,
  index,
  hideHeading,
  currentForm,
}) => {
  // const { t } = useTranslations()
  const { consumer, producer, dealer, collectionCenter } = userWiseRole
  const elvSourceKey = details?.sourceCommercialDetailsResponseDto?.elvSourceKey
  const elvScrapTypeKey = details?.basicDetailsResponseDto?.elvScrapTypeKey

  const { sourceCommercialDetailsResponseDto, rcFormTwoDetailsResponseDto } =
    details || {}

  const dealerInfo = sourceCommercialDetailsResponseDto?.dealerInfo
  const rcConsumerInfo = rcFormTwoDetailsResponseDto?.consumerInfo
  const sourceConsumerInfo = sourceCommercialDetailsResponseDto?.consumerInfo
  const producerInfo = rcFormTwoDetailsResponseDto?.producerInfo
  const collectionCenterInfo =
    sourceCommercialDetailsResponseDto?.collectionCenterInfo

  const userSelectionList = [
    {
      key: 'dealer',
      selectTitle: 'user_Dealer',
      roleId: dealer,
      userData: dealerInfo ? [dealerInfo] : [],
      isHidden: notEqual(elvSourceKey, DIRECT_DEALER),
      section: 'sourceCommercialDetailsResponseDto',
      slot: RecoveryDealerSelect,
      fieldPath: [0, 'sourceCommercialDetailsRequestDto'],
      label: 'user_Dealer',
      fieldKey: 'dealerLocation',
    },
    {
      key: 'collectionCenter',
      selectTitle: 'user_CollectionCenter',
      roleId: collectionCenter,
      userData: collectionCenterInfo ? [collectionCenterInfo] : [],
      isHidden: notEqual(elvSourceKey, COLLECTION_CENTER),
      section: 'sourceCommercialDetailsResponseDto',
      slot: RecoveryDealerSelect,
      fieldPath: [0, 'sourceCommercialDetailsRequestDto'],
      label: 'user_CollectionCenter',
      fieldKey: 'collectionCenterLocation',
    },
    {
      key: 'customer',
      selectTitle: 'user_Consumer',
      roleId: consumer,
      userData: rcConsumerInfo ? [rcConsumerInfo] : [],
      section: 'rcFormTwoDetailsResponseDto',
    },
    {
      key: 'customer',
      selectTitle: 'user_Consumer',
      roleId: consumer,
      userData: sourceConsumerInfo ? [sourceConsumerInfo] : [],
      isHidden: !elvSourceKey || isEqual(elvSourceKey, OEM),
      section: 'sourceCommercialDetailsResponseDto',
    },
    {
      key: 'producer',
      selectTitle: 'user_Producer',
      roleId: producer,
      userData: producerInfo ? [producerInfo] : [],
      section: 'rcFormTwoDetailsResponseDto',
    },
    {
      key: 'producer',
      selectTitle: 'user_Producer',
      roleId: producer,
      userData: producerInfo ? [producerInfo] : [],
      isHidden: !include(
        [TEST_VEHICLE_REGISTERED, TEST_VEHICLE_UNREGISTERED],
        elvScrapTypeKey,
      ),
      section: 'basicDetailsResponseDto',
    },
  ].filter(val => !val.isHidden)

  return (
    <ANTDCard className="grey-card-body elv-card">
      {/* {!hideHeading && (
        <h2 className=" mb-10">{`${t(
          isEqual(scrapSource, 'Parts') ? 'job_Part' : 'job_ELV',
        )} ${index + 1}`}</h2>
      )} */}

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
        elvDetails={details}
        userSelectionList={userSelectionList}
        currentForm={currentForm}
      />
    </ANTDCard>
  )
}

export default ELVDetailsView
