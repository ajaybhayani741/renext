import pathName, {
  ADMIN,
  DISTRICT_ADMIN_OFFICER,
  DISTRICT_COLLECTOR,
  DISTRICT_COLLECTOR_ADMIN,
  DISTRICT_HOSTEL_DEPARTMENT,
  HOSTEL,
  INSPECTION_OFFICER,
  STATE_ADMIN_OFFICER,
  STATE_HOSTEL_DEPARTMENT,
  USER_TXT,
} from '../../routing/pathName.constant'
import { userWiseRole } from '../../utils/constant'
import {
  AdminIcon,
  ClipboardIcon,
  DashboardIcon,
  DealerIcon,
  HomeIcon,
  // JobsIcon,
  // Purchasing,
  UserIcon,
} from '../../utils/icons'
import { userRelationKey } from '../userManagement/user.description'

const { HOME, DASHBOARD, JOBS } = pathName

const {
  admin,
  stateHostelDepartment,
  stateAdminOfficer,
  districtCollector,
  districtCollectorAdmin,
  districtHostelDepartment,
  districtAdminOfficer,
  inspectionOfficer,
  hostel,
} = userWiseRole

const allUser = [
  admin,
  stateHostelDepartment,
  stateAdminOfficer,
  districtCollector,
  districtCollectorAdmin,
  districtHostelDepartment,
  districtAdminOfficer,
  inspectionOfficer,
  hostel,
]

const { associate } = userRelationKey

const userChildrenList = [
  {
    key: ADMIN,
    userId: admin,
    Icon: AdminIcon,
    label: 'user_Admin',
    sidebar: allUser,
    addEdit: [admin],
    level: {},
    userView: {},
  },
  {
    key: STATE_HOSTEL_DEPARTMENT,
    userId: stateHostelDepartment,
    Icon: DealerIcon,
    label: 'user_StateHostelDepartment',
    sidebar: allUser,
    addEdit: [admin],
    level: {},
    userView: {
      user_StateAdminOfficer: [
        {
          payload: { roleId: stateAdminOfficer },
        },
      ],
      user_AssociatedDistrictCollector: [
        {
          payload: { roleId: districtCollector, relationType: associate },
          addAssociate: [admin],
        },
      ],
      user_AssociatedDistrictHostelDepartment: [
        {
          payload: {
            roleId: districtHostelDepartment,
            relationType: associate,
          },
          addAssociate: [admin],
        },
      ],
      user_Hostel: [
        {
          payload: { roleId: hostel, relationType: associate },
        },
      ],
    },
    parent: { label: 'user_Admin', id: admin },
  },
  {
    key: STATE_ADMIN_OFFICER,
    userId: stateAdminOfficer,
    Icon: UserIcon,
    label: 'user_StateAdminOfficer',
    sidebar: [admin, stateHostelDepartment],
    addEdit: [admin, stateHostelDepartment],
    level: { 'sub-menu': [admin] },
    userView: {},
    parent: { label: 'user_StateHostelDepartment', id: stateHostelDepartment },
  },
  {
    key: DISTRICT_COLLECTOR,
    userId: districtCollector,
    Icon: DealerIcon,
    label: 'user_DistrictCollector',
    sidebar: allUser,
    addEdit: [admin],
    level: {},
    userView: {
      user_DistrictCollectorAdmin: [
        {
          payload: { roleId: districtCollectorAdmin },
        },
      ],
      user_AssociatedStateHostelDepartmentList: [
        {
          payload: { roleId: stateHostelDepartment, relationType: associate },
          addAssociate: [admin],
        },
      ],
      user_AssociatedDistrictHostelDepartmentList: [
        {
          payload: {
            roleId: districtHostelDepartment,
            relationType: associate,
          },
          addAssociate: [admin],
        },
      ],
      user_Hostel: [
        {
          payload: { roleId: hostel, relationType: associate },
        },
      ],
    },
    parent: { label: 'user_Admin', id: admin },
  },
  {
    key: DISTRICT_COLLECTOR_ADMIN,
    userId: districtCollectorAdmin,
    Icon: UserIcon,
    label: 'user_DistrictCollectorAdmin',
    sidebar: [admin, districtCollector],
    addEdit: [admin, districtCollector],
    level: { 'sub-menu': [admin] },
    userView: {},
    parent: { label: 'user_DistrictCollector', id: districtCollector },
  },
  {
    key: DISTRICT_HOSTEL_DEPARTMENT,
    userId: districtHostelDepartment,
    Icon: DealerIcon,
    label: 'user_DistrictHostelDepartment',
    sidebar: allUser,
    addEdit: [admin],
    level: {},
    userView: {
      user_DistrictAdminOfficer: [
        {
          payload: { roleId: districtAdminOfficer },
        },
      ],
      user_InspectionOfficer: [
        {
          payload: { roleId: inspectionOfficer },
        },
      ],
      user_AssociatedStateHostelDepartmentList: [
        {
          payload: { roleId: stateHostelDepartment, relationType: associate },
          addAssociate: [admin],
        },
      ],
      user_AssociatedDistrictCollector: [
        {
          payload: { roleId: districtCollector, relationType: associate },
          addAssociate: [admin],
        },
      ],
      user_Hostel: [
        {
          payload: { roleId: hostel, relationType: associate },
        },
      ],
    },
    parent: { label: 'user_Admin', id: admin },
  },
  {
    key: DISTRICT_ADMIN_OFFICER,
    userId: districtAdminOfficer,
    Icon: UserIcon,
    label: 'user_DistrictAdminOfficer',
    sidebar: [admin, districtHostelDepartment],
    addEdit: [admin, districtHostelDepartment],
    level: { 'sub-menu': [admin] },
    userView: {},
    parent: {
      label: 'user_DistrictHostelDepartment',
      id: districtHostelDepartment,
    },
  },
  {
    key: INSPECTION_OFFICER,
    userId: inspectionOfficer,
    Icon: UserIcon,
    label: 'user_InspectionOfficer',
    sidebar: [admin, districtHostelDepartment],
    addEdit: [admin, districtHostelDepartment],
    level: { 'sub-menu': [admin] },
    userView: {},
    parent: {
      label: 'user_DistrictHostelDepartment',
      id: districtHostelDepartment,
    },
  },
  {
    key: HOSTEL,
    userId: hostel,
    Icon: DealerIcon,
    label: 'user_Hostel',
    sidebar: [admin, districtHostelDepartment],
    addEdit: [admin, districtHostelDepartment],
    level: { 'sub-menu': [admin] },
    userView: {},
    parent: {
      label: 'user_DistrictHostelDepartment',
      id: districtHostelDepartment,
    },
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
    sidebar: allUser,
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
    Icon: ClipboardIcon,
    label: 'menu_Jobs',
    disabled: false,
    sidebar: [admin, districtHostelDepartment, inspectionOfficer],
  },
]

const buildingAddEditPermission = [admin]

export { buildingAddEditPermission, sidebarMenus, userChildrenList }
