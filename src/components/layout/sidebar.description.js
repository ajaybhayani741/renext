import { SettingOutlined } from '@ant-design/icons'

import pathName, {
  ADMIN,
  BOOK_KEEPING_TXT,
  CASHBACK,
  CATEGORIES,
  CUSTOMER,
  DAILY_CLOSING,
  FLEXIBLE,
  INVENTORY_ACTION,
  INVENTORY_TXT,
  JOHN_TUBES,
  MACHINES,
  MANUFACTURER,
  REPORTING_TXT,
  SALES,
  SCRATCH_TICKET_TRACKING,
  SHIFT,
  STOCK,
  STORE,
  STORE_EMPLOYEE,
  STORE_MANAGER,
  STORE_OWNER,
  STRUCTURE_SUGGESTION,
  TALLY,
  USER_TXT,
  VENDOR,
  VENDOR_PAYOUT,
} from '../../routing/pathName.constant'
import { userWiseRole } from '../../utils/constant'
import {
  CategoryManagementIcon,
  DashboardIcon,
  GeneralLedger,
  HomeIcon,
  InventoryIcon,
  // Payables,
  // ContractManagementIcon,
  JobsIcon,
  // ItemVendorMapping,
  MaterialManagement,
  Purchasing,
  UserIcon,
} from '../../utils/icons'
import { userRelationKey } from '../userManagement/user.description'

const { HOME, DASHBOARD, JOBS, SETTINGS } = pathName

const {
  admin,
  storeOwner,
  store,
  storeManager,
  storeEmployee,
  vendor,
  manufacturer,
  customer,
} = userWiseRole

const allUser = [
  admin,
  storeOwner,
  storeManager,
  storeEmployee,
  vendor,
  customer,
  manufacturer,
  store,
]

const { associate } = userRelationKey

const userChildrenList = [
  {
    key: ADMIN,
    userId: admin,
    Icon: UserIcon,
    label: 'user_Admin',
    sidebar: [admin],
    addEdit: [admin],
    level: {},
    userView: {},
  },
  {
    key: STORE_OWNER,
    userId: storeOwner,
    Icon: UserIcon,
    label: 'user_StoreOwner',
    sidebar: [admin, store, storeManager],
    addEdit: [admin],
    level: {},
    userView: {
      user_Store: [
        {
          payload: { roleId: store },
          subTitle: 'user_Child',
        },
        {
          payload: { roleId: store, relationType: associate },
          addAssociate: [admin],
          subTitle: 'user_Associate',
        },
      ],
      user_StoreManager: [
        {
          payload: { roleId: storeManager },
          subTitle: 'user_Child',
        },
        {
          payload: { roleId: storeManager, relationType: associate },
          addAssociate: [admin],
          subTitle: 'user_Associate',
        },
      ],
      user_StoreEmployee: [
        {
          payload: { roleId: storeEmployee },
          subTitle: 'user_Child',
        },
        {
          payload: { roleId: storeEmployee, relationType: associate },
          addAssociate: [admin],
          subTitle: 'user_Associate',
        },
      ],
    },
    parent: { label: 'user_Admin', id: admin },
  },
  {
    key: STORE,
    userId: store,
    Icon: UserIcon,
    label: 'user_Store',
    sidebar: [
      admin,
      storeOwner,
      storeManager,
      storeEmployee,
      vendor,
      manufacturer,
    ],
    addEdit: [admin, storeOwner],
    level: {},
    userView: {
      user_StoreOwner: [
        {
          payload: { roleId: storeOwner },
          subTitle: 'user_Parent',
        },
        {
          payload: { roleId: storeOwner, relationType: associate },
          subTitle: 'user_Associate',
          addAssociate: [admin],
        },
      ],
      user_StoreManager: [
        {
          payload: { roleId: storeManager },
        },
      ],
      user_StoreEmployee: [
        {
          payload: { roleId: storeEmployee },
        },
      ],
      user_AssociatedVendor: [
        {
          payload: { roleId: vendor, relationType: associate },
          addAssociate: [admin],
        },
      ],
      user_AssociatedManufacturer: [
        {
          payload: { roleId: manufacturer, relationType: associate },
          addAssociate: [admin],
        },
      ],
    },
    parent: { label: 'user_StoreOwner', id: storeOwner },
  },
  {
    key: STORE_MANAGER,
    userId: storeManager,
    Icon: UserIcon,
    label: 'user_StoreManager',
    sidebar: [admin, storeOwner, store, storeEmployee],
    addEdit: [admin, storeOwner, store],
    level: {},
    userView: {
      user_Store: [
        {
          payload: { roleId: store },
        },
      ],
      user_StoreOwner: [
        {
          payload: { roleId: storeOwner },
          needParent: true,
          subTitle: 'user_Parent',
        },
        {
          payload: { roleId: storeOwner, relationType: associate },
          needParent: true,
          addAssociate: [admin],
          subTitle: 'user_Associate',
        },
      ],
      user_AssociatedStoreEmployee: [
        {
          payload: { roleId: storeEmployee, relationType: associate },
          addAssociate: [admin],
        },
      ],
    },
    parent: { label: 'user_Store', id: store },
  },
  {
    key: STORE_EMPLOYEE,
    userId: storeEmployee,
    Icon: UserIcon,
    label: 'user_StoreEmployee',
    sidebar: [admin, storeOwner, store, storeManager],
    addEdit: [admin, storeOwner, store, storeManager],
    level: {},
    userView: {
      user_Store: [
        {
          payload: { roleId: store },
        },
      ],
      user_StoreOwner: [
        {
          payload: { roleId: storeOwner },
          needParent: true,
          subTitle: 'user_Parent',
        },
        {
          payload: { roleId: storeOwner, relationType: associate },
          needParent: true,
          addAssociate: [admin],
          subTitle: 'user_Associate',
        },
      ],
      user_AssociatedStoreManager: [
        {
          payload: { roleId: storeManager, relationType: associate },
          addAssociate: [admin],
        },
      ],
    },
    parent: { label: 'user_Store', id: store },
  },
  {
    key: VENDOR,
    userId: vendor,
    Icon: UserIcon,
    label: 'user_Vendor',
    sidebar: [admin, storeOwner, store, storeManager, storeEmployee],
    addEdit: [admin],
    level: {},
    userView: {
      user_AssociatedStore: [
        {
          payload: { roleId: store, relationType: associate },
          addAssociate: [admin],
        },
      ],
    },
    parent: { label: 'user_Admin', id: admin },
  },
  {
    key: MANUFACTURER,
    userId: manufacturer,
    Icon: UserIcon,
    label: 'user_Manufacturer',
    sidebar: [admin, storeOwner, store, storeManager, storeEmployee],
    addEdit: [admin],
    level: {},
    userView: {
      user_AssociatedStore: [
        {
          payload: { roleId: store, relationType: associate },
          addAssociate: [admin, storeOwner],
        },
      ],
    },
    parent: { label: 'user_Admin', id: admin },
  },
  {
    key: CUSTOMER,
    userId: customer,
    Icon: UserIcon,
    label: 'user_Customer',
    sidebar: allUser,
    addEdit: [admin, storeOwner, store],
    level: {},
    userView: {},
    parent: { label: 'user_Admin', id: admin },
  },
]

const sidebarMenus = [
  {
    key: HOME,
    Icon: HomeIcon,
    label: 'menu_Home',
    sidebar: allUser,
  },
  {
    key: DASHBOARD,
    Icon: DashboardIcon,
    label: 'job_Dashboard',
    sidebar: [admin, storeOwner, store, storeManager],
  },
  {
    key: USER_TXT,
    Icon: UserIcon,
    label: 'menu_User',
    sidebar: allUser,
    children: userChildrenList.map(prop => ({
      ...prop,
      key: `${USER_TXT}/${prop.key}`,
    })),
  },
  {
    key: JOBS,
    Icon: Purchasing,
    label: 'txt_JobManagement',
    disabled: false,
    sidebar: [storeOwner, storeManager, storeEmployee],
  },
  {
    key: BOOK_KEEPING_TXT,
    Icon: GeneralLedger,
    label: 'menu_ShiftActivities',
    disabled: false,
    sidebar: [storeOwner, storeManager, storeEmployee],
    children: [
      {
        key: `${BOOK_KEEPING_TXT}/${SCRATCH_TICKET_TRACKING}`,
        label: 'menu_ScratchTicketTracking',
        Icon: JobsIcon,
        sidebar: [storeOwner, storeManager, storeEmployee],
      },
      {
        key: `${BOOK_KEEPING_TXT}/${JOHN_TUBES}`,
        label: 'menu_JohnTubes',
        Icon: CategoryManagementIcon,
        sidebar: [storeOwner, storeManager, storeEmployee],
      },
      {
        key: `${BOOK_KEEPING_TXT}/${MACHINES}`,
        label: 'menu_Machines',
        Icon: MaterialManagement,
        sidebar: [storeOwner, storeManager, storeEmployee],
      },
      {
        key: `${BOOK_KEEPING_TXT}/${CASHBACK}`,
        label: 'menu_Cashback',
        Icon: GeneralLedger,
        sidebar: [storeOwner, storeManager, storeEmployee],
      },
      {
        key: `${BOOK_KEEPING_TXT}/${VENDOR_PAYOUT}`,
        label: 'menu_VendorPayout',
        Icon: GeneralLedger,
        sidebar: [storeOwner, storeManager, storeEmployee],
      },
      {
        key: `${BOOK_KEEPING_TXT}/${SHIFT}`,
        label: 'menu_ShiftReport',
        Icon: GeneralLedger,
        sidebar: [storeOwner, storeManager, storeEmployee],
      },
    ],
  },
  {
    key: INVENTORY_TXT,
    Icon: InventoryIcon,
    label: 'menu_InventoryManagement',
    sidebar: [storeOwner, storeManager, storeEmployee],
    children: [
      {
        key: `${INVENTORY_TXT}/${CATEGORIES}`,
        label: 'menu_Categories',
        Icon: JobsIcon,
        sidebar: [storeOwner, storeManager, storeEmployee],
      },
      {
        key: `${INVENTORY_TXT}/${STRUCTURE_SUGGESTION}`,
        label: 'menu_StructureSuggestion',
        Icon: CategoryManagementIcon,
        sidebar: [storeOwner, storeManager, storeEmployee],
      },
      {
        key: `${INVENTORY_TXT}/${INVENTORY_ACTION}`,
        label: 'menu_InventoryAction',
        Icon: MaterialManagement,
        sidebar: [storeOwner, storeManager, storeEmployee],
      },
    ],
  },
  {
    key: REPORTING_TXT,
    Icon: GeneralLedger,
    label: 'menu_Reporting',
    disabled: false,
    sidebar: [storeOwner, storeManager],
    children: [
      {
        key: `${REPORTING_TXT}/${DAILY_CLOSING}`,
        label: 'menu_DailyClosingReport',
        Icon: GeneralLedger,
        sidebar: [storeOwner, storeManager],
      },
      {
        key: `${REPORTING_TXT}/${FLEXIBLE}`,
        label: 'menu_FlexibleReport',
        Icon: GeneralLedger,
        sidebar: [storeOwner, storeManager],
      },
      {
        key: `${REPORTING_TXT}/${SALES}`,
        label: 'menu_SalesReport',
        Icon: GeneralLedger,
        sidebar: [storeOwner, storeManager],
      },
      {
        key: `${REPORTING_TXT}/${STOCK}`,
        label: 'menu_StockReport',
        Icon: GeneralLedger,
        sidebar: [storeOwner, storeManager],
      },
      {
        key: `${REPORTING_TXT}/${TALLY}`,
        label: 'menu_TallyReport',
        Icon: GeneralLedger,
        sidebar: [storeOwner, storeManager],
      },
    ],
  },
  {
    key: SETTINGS,
    Icon: SettingOutlined,
    label: 'menu_StoreSetup',
    sidebar: [admin, storeOwner],
  },
]

const buildingAddEditPermission = [admin]

export { buildingAddEditPermission, sidebarMenus, userChildrenList }
