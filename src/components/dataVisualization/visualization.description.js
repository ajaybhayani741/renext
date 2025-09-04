import EquipmentView from './presentation/EquipmentView'
import FinalProductView from './presentation/FinalProductView'
import MapView from './presentation/MapView'
import { userWiseRole } from '../../utils/constant'

const { contractor, dealer, fieldEngineer } = userWiseRole

const filterByTypes = {
  equipment: 'txt_Equipment',
  finalProduct: 'tag_FinalProduct',
}

const getCurrentAddressType = {
  user_State: 'STATE',
  user_City: 'CITY',
  user_Pincode: 'PINCODE',
  user_Site: 'BUILDING',
  txt_Equipment: 'EQUIPMENT',
}

const tabList = [
  {
    label: 'txt_ListView',
    key: 'txt_ListView',
    subTabList: [
      {
        label: 'job_Scrap',
        Component: EquipmentView,
        key: 'scrap',
        filterByType: filterByTypes.equipment,
      },
      {
        label: 'tag_FinalProduct',
        Component: FinalProductView,
        key: 'finalProduct',
        filterByType: filterByTypes.equipment,
      },
    ],
  },
  {
    label: 'txt_MapView',
    key: 'mapView',
    subTabList: [
      {
        label: 'job_Scrap',
        Component: MapView,
        key: 'mapScrap',
        filterByType: filterByTypes.equipment,
      },
      {
        label: 'tag_FinalProduct',
        Component: MapView,
        key: 'mapFinalProduct',
        filterByType: filterByTypes.equipment,
      },
    ],
  },
]

const equipmentFilterByOptions = t => [
  { value: 'customer', label: t('user_Customer') },
  { value: 'recoveryAgent', label: t('user_RecoveryAgent') },
  { value: 'smelter', label: t('user_MaterialProducer') },
]
const feFilterByOptions = t => [
  { value: 'customer', label: t('user_Customer') },
  { value: 'contractor', label: t('user_RecoveryAgent') },
]

const buildingDetails = {
  Kalbadevi: {
    name: 'Kalbadevi',
    address: '',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: 400002,
  },
  Thakurdwar: {
    name: 'Thakurdwar',
    address: '',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: 400002,
  },
}

const feInitial = {
  user_Dealer: {
    selected: null,
    search: '',
    list: [],
    filtered: [],
  },
  user_Contractor: { selected: null, search: '', list: [], filtered: [] },
  user_FieldEngineer: { selected: null, search: '', list: [], filtered: [] },
}

const userLabelRoleId = {
  user_Dealer: dealer,
  user_Contractor: contractor,
  user_FieldEngineer: fieldEngineer,
}

export const stateList = [
  { id: 1, name: 'Gujarat', latitude: 22.2587, longitude: 71.1924 },
  { id: 3, name: 'Maharashtra', latitude: 19.7515, longitude: 75.7139 },
  { id: 84, name: 'Rajasthan', latitude: 27.0238, longitude: 74.2179 },
  { id: 110, name: 'Haryana', latitude: 29.0588, longitude: 76.0856 },
]

export const cityList = {
  3: [
    { id: 4, name: 'Mumbai', latitude: 19.07609, longitude: 72.877426 },
    { id: 44, name: 'Pune', latitude: 18.5204, longitude: 73.8567 },
    { id: 444, name: 'Mashik', latitude: 19.9975, longitude: 73.7898 },
  ],
}

export const pincodeList = {
  4: [
    { id: 8881, name: '400001', latitude: 18.9385, longitude: 72.8363 },
    { id: 8959, name: '400002', latitude: 18.9484, longitude: 72.8259 },
    { id: 8960, name: '400003', latitude: 18.9532, longitude: 72.8353 },
  ],
}

export const buildingList = {
  8959: [
    {
      id: 378416,
      name: 'Kalbadevi',
      latitude: 18.9497685,
      longitude: 72.8293831,
    },
    {
      id: 378417,
      name: 'Thakurdwar',
      latitude: 18.949847,
      longitude: 72.822745,
    },
  ],
}
export const customerNames = ['KJ1801', 'KJ1802']

const equipmentInitial = {
  user_State: {
    selected: null,
    search: '',
    list: stateList,
    filtered: stateList,
  },
  user_City: { selected: null, search: '', list: [], filtered: [] },
  user_Pincode: { selected: null, search: '', list: [], filtered: [] },
  user_Site: { selected: null, search: '', list: [], filtered: [] },
}

const materialDataList = [
  {
    key: 1,
    materialType: 'job_Aluminium',
    cO2EmissionFactor: 8.4,
    recoveryAmountKg: 560,
    recycledAmountKg: 500,
    smeltedAmountKg: 460,
    tradedAmountKg: 400,
    soldToEndUserKg: 350,
  },
  {
    key: 2,
    materialType: 'job_Glass',
    cO2EmissionFactor: 3.08,
    recoveryAmountKg: 100,
    recycledAmountKg: 90,
    smeltedAmountKg: 70,
    tradedAmountKg: 50,
    soldToEndUserKg: 40,
  },
  {
    key: 3,
    materialType: 'job_Paper',
    cO2EmissionFactor: 2.42,
    recoveryAmountKg: 450,
    recycledAmountKg: 300,
    smeltedAmountKg: 280,
    tradedAmountKg: 200,
    soldToEndUserKg: 200,
  },
  {
    key: 4,
    materialType: 'job_Plastic',
    cO2EmissionFactor: 5.44,
    recoveryAmountKg: 750,
    recycledAmountKg: 700,
    smeltedAmountKg: 600,
    tradedAmountKg: 520,
    soldToEndUserKg: 500,
  },
  {
    key: 5,
    materialType: 'job_Rubber',
    cO2EmissionFactor: 3.18,
    recoveryAmountKg: 50,
    recycledAmountKg: 40,
    smeltedAmountKg: 35,
    tradedAmountKg: 30,
    soldToEndUserKg: 30,
  },
  {
    key: 9,
    materialType: 'job_Steel',
    cO2EmissionFactor: 1.27,
    recoveryAmountKg: 120,
    recycledAmountKg: 110,
    smeltedAmountKg: 80,
    tradedAmountKg: 60,
    soldToEndUserKg: 40,
  },
  {
    key: 7,
    materialType: 'job_Textile',
    cO2EmissionFactor: 3.41,
    recoveryAmountKg: 560,
    recycledAmountKg: 500,
    smeltedAmountKg: 460,
    tradedAmountKg: 400,
    soldToEndUserKg: 350,
  },
]
const finalProductList = [
  {
    key: 1,
    materialType: 'job_Aluminium',
    cO2EmissionFactor: 8.4,
    recycledQuantity: 560,
    virginQuantity: 300,
  },
  {
    key: 2,
    materialType: 'job_Glass',
    cO2EmissionFactor: 3.08,
    recycledQuantity: 400,
    virginQuantity: 300,
  },
  {
    key: 3,
    materialType: 'job_Paper',
    cO2EmissionFactor: 2.42,
    recycledQuantity: 650,
    virginQuantity: 350,
  },
  {
    key: 4,
    materialType: 'job_Plastic',
    cO2EmissionFactor: 5.44,
    recycledQuantity: 860,
    virginQuantity: 800,
  },
  {
    key: 5,
    materialType: 'job_Rubber',
    cO2EmissionFactor: 3.18,
    recycledQuantity: 900,
    virginQuantity: 600,
  },
  {
    key: 6,
    materialType: 'job_Steel',
    cO2EmissionFactor: 1.27,
    recycledQuantity: 1200,
    virginQuantity: 1152,
  },
  {
    key: 7,
    materialType: 'job_Textile',
    cO2EmissionFactor: 3.41,
    recycledQuantity: 7000,
    virginQuantity: 5600,
  },
]

export {
  tabList,
  feInitial,
  filterByTypes,
  buildingDetails,
  userLabelRoleId,
  finalProductList,
  materialDataList,
  equipmentInitial,
  getCurrentAddressType,
  equipmentFilterByOptions,
  feFilterByOptions,
}
