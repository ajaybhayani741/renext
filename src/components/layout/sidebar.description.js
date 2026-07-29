import pathName, {
  ADMIN,
  DASHBOARD_TXT,
  DISTRICT_COLLECTOR,
  HOSTEL,
  INSPECTION_OFFICER,
  MANDAL_SPECIAL_OFFICER,
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
  UserIcon,
} from '../../utils/icons'
import { tabKeys } from '../jobs/jobs.description'
import { userRelationKey } from '../userManagement/user.description'

const { HOME, JOBS } = pathName

const {
  admin,
  stateHostelDepartment,
  stateAdminOfficer,
  districtCollector,
  inspectionOfficer,
  hostel,
  mandalSpecialOfficer,
} = userWiseRole

const allUser = [
  admin,
  stateHostelDepartment,
  stateAdminOfficer,
  districtCollector,
  inspectionOfficer,
  hostel,
  mandalSpecialOfficer,
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
    sidebar: [admin, stateAdminOfficer, hostel],
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
    sidebar: [admin, stateAdminOfficer, stateHostelDepartment, hostel],
    addEdit: [admin],
    level: {},
    userView: {
      user_MandalSpecialOfficer: [
        {
          payload: { roleId: mandalSpecialOfficer },
        },
      ],
      user_InspectionOfficer: [
        {
          payload: { roleId: inspectionOfficer },
        },
      ],
      user_Hostel: [
        {
          payload: { roleId: hostel },
        },
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
    key: MANDAL_SPECIAL_OFFICER,
    userId: mandalSpecialOfficer,
    Icon: UserIcon,
    label: 'user_MandalSpecialOfficer',
    sidebar: [districtCollector],
    addEdit: [districtCollector],
    level: {},
    userView: {
      user_AssociatedInspectionOfficer: [
        {
          payload: { roleId: inspectionOfficer },
          // addAssociate: [districtCollector],
        },
      ],
      user_AssociatedHostel: [
        {
          payload: {
            roleId: hostel,
            // userId: mandalSpecialOfficer,
          },
          // addAssociate: [districtCollector],
        },
      ],
    },
    parent: {
      label: 'user_DistrictCollector',
      id: districtCollector,
    },
  },
  {
    key: INSPECTION_OFFICER,
    userId: inspectionOfficer,
    Icon: UserIcon,
    label: 'user_InspectionOfficer',
    sidebar: [admin, districtCollector, hostel, mandalSpecialOfficer],
    addEdit: [admin, districtCollector],
    level: { 'sub-menu': [admin, hostel] },
    userView: {
      user_AssignedHostelsForInspection: [
        {
          payload: { roleId: hostel },
        },
      ],
      user_AssociatedMSO: [
        {
          payload: { roleId: mandalSpecialOfficer },
          // addAssociate: [admin, districtCollector],
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
    sidebar: [admin, districtCollector, mandalSpecialOfficer],
    addEdit: [admin, districtCollector],
    level: { 'sub-menu': [admin, inspectionOfficer] },
    userView: {
      user_InspectionOfficer: [
        {
          payload: { roleId: inspectionOfficer },
        },
      ],
      user_PreviousInspections: [
        {
          viewJobs: true,
          payload: { jobType: tabKeys.inspection, active: false },
        },
      ],
      user_AssociatedMSO: [
        {
          payload: { roleId: mandalSpecialOfficer },
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

const allUserExceptIO = allUser.filter(role => role !== inspectionOfficer)

const sidebarMenus = [
  {
    key: HOME,
    Icon: HomeIcon,
    label: 'menu_Home',
    sidebar: allUserExceptIO,
  },
  {
    key: `${USER_TXT}/${MANDAL_SPECIAL_OFFICER}`,
    Icon: UserIcon,
    label: 'user_MandalSpecialOfficer',
    sidebar: [districtCollector],
  },
  {
    key: `${USER_TXT}/${INSPECTION_OFFICER}`,
    Icon: UserIcon,
    label: 'user_ListOfInspectionOfficer',
    sidebar: [mandalSpecialOfficer, districtCollector],
  },
  {
    key: `${USER_TXT}/${HOSTEL}`,
    Icon: DealerIcon,
    label: 'user_ListOfHostels',
    sidebar: [mandalSpecialOfficer, districtCollector],
  },
  {
    key: USER_TXT,
    Icon: UserIcon,
    label: 'menu_User',
    sidebar: allUserExceptIO,
    children: userChildrenList
      .filter(prop => prop.key !== ADMIN)
      .map(prop => ({
        ...prop,
        key: `${USER_TXT}/${prop.key}`,
      })),
  },
  {
    key: `${USER_TXT}/${HOSTEL}`,
    Icon: ClipboardIcon,
    label: 'user_Hostel',
    sidebar: [],
  },
  {
    key: `${USER_TXT}/${INSPECTION_OFFICER}`,
    Icon: UserIcon,
    label: 'user_InspectionOfficer',
    sidebar: [],
  },
  {
    key: JOBS,
    Icon: ClipboardIcon,
    label: 'job_InspectionJob',
    disabled: false,
    sidebar: [
      admin,
      districtCollector,
      inspectionOfficer,
      mandalSpecialOfficer,
    ],
  },
  {
    key: DASHBOARD_TXT,
    Icon: DashboardIcon,
    label: 'job_Dashboard',
    sidebar: [districtCollector, mandalSpecialOfficer],
  },
]

const buildingAddEditPermission = [admin]

export { buildingAddEditPermission, sidebarMenus, userChildrenList }
