import pathName, {
  ADMIN,
  DASHBOARD_TXT,
  DISTRICT_COLLECTOR,
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

const { HOME, JOBS } = pathName

const {
  admin,
  stateHostelDepartment,
  stateAdminOfficer,
  districtCollector,
  inspectionOfficer,
  hostel,
} = userWiseRole

const allUser = [
  admin,
  stateHostelDepartment,
  stateAdminOfficer,
  // districtCollector,
  // inspectionOfficer,
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
    sidebar: [
      admin,
      stateAdminOfficer,
      // districtCollector,
      // inspectionOfficer,
      hostel,
    ],
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
    sidebar: [
      admin,
      stateAdminOfficer,
      stateHostelDepartment,
      // inspectionOfficer,
      hostel,
    ],
    addEdit: [admin],
    level: {},
    userView: {
      user_InspectionOfficer: [
        {
          payload: { roleId: inspectionOfficer },
        },
      ],
      user_Hostel: [
        {
          payload: { roleId: hostel },
        },
        // {
        //   subTitle: 'dash_Assigned',
        //   payload: { roleId: hostel, relationType: userRelationKey?.associate },
        // },
        // {
        //   subTitle: 'dash_Unassigned',
        //   payload: {
        //     roleId: hostel,
        //     relationType: userRelationKey?.nonAssociate,
        //   },
        // },
      ],
      user_AssociatedStateHostelDepartment: [
        {
          payload: { roleId: stateHostelDepartment, relationType: associate },
          addAssociate: [admin],
        },
      ],
    },
    parent: { label: 'user_Admin', id: admin },
  },
  {
    key: INSPECTION_OFFICER,
    userId: inspectionOfficer,
    Icon: UserIcon,
    label: 'user_InspectionOfficer',
    sidebar: [admin, districtCollector, hostel],
    addEdit: [admin, districtCollector],
    level: { 'sub-menu': [admin, hostel] },
    userView: {
      user_Hostel: [
        {
          payload: { roleId: hostel, relationType: associate },
          addAssociate: [admin, districtCollector],
        },
      ],
      user_AssociatedStateHostelDepartment: [
        {
          payload: { roleId: stateHostelDepartment, relationType: associate },
          addAssociate: [admin],
          needParent: true,
          hideInProfile: true,
        },
      ],
    },
    parent: {
      label: 'user_DistrictCollector',
      id: districtCollector,
    },
  },
  {
    key: HOSTEL,
    userId: hostel,
    Icon: DealerIcon,
    label: 'user_Hostel',
    sidebar: [admin, districtCollector],
    addEdit: [admin, districtCollector],
    level: { 'sub-menu': [admin, inspectionOfficer] },
    userView: {
      user_InspectionOfficer: [
        {
          payload: { roleId: inspectionOfficer, relationType: associate },
          addAssociate: [admin, districtCollector],
        },
      ],
      user_AssociatedStateHostelDepartment: [
        {
          payload: { roleId: stateHostelDepartment, relationType: associate },
          addAssociate: [admin],
          needParent: true,
          hideInProfile: true,
        },
      ],
    },
    parent: {
      label: 'user_DistrictCollector',
      id: districtCollector,
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
    key: `/${HOSTEL}`,
    Icon: ClipboardIcon,
    label: 'user_AssignHostelToInspectionOfficer',
    sidebar: [districtCollector],
  },
  {
    key: `${USER_TXT}/${INSPECTION_OFFICER}`,
    Icon: UserIcon,
    label: 'user_AssignInspectionOfficerToHostel',
    sidebar: [districtCollector],
  },
  {
    key: JOBS,
    Icon: ClipboardIcon,
    label: 'job_InspectionJob',
    disabled: false,
    sidebar: [admin, districtCollector, inspectionOfficer],
  },
  {
    key: DASHBOARD_TXT,
    Icon: DashboardIcon,
    label: 'job_Dashboard',
    sidebar: [districtCollector],
  },
]

const buildingAddEditPermission = [admin]

export { buildingAddEditPermission, sidebarMenus, userChildrenList }
