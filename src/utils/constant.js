export const LOGOUT = 'LOGOUT'

const userWiseRole = {
  admin: 1,
  stateHostelDepartment: 2,
  stateAdminOfficer: 3,
  districtCollector: 4,
  inspectionOfficer: 5,
  hostel: 6,
  mandalSpecialOfficer: 7,
}

const { stateAdminOfficer, inspectionOfficer, hostel, mandalSpecialOfficer } =
  userWiseRole

const childUsers = [
  stateAdminOfficer,
  inspectionOfficer,
  hostel,
  mandalSpecialOfficer,
]

const MAX_FILE_SIZE = 1024 * 1024 * 5 //5MB

export { childUsers, MAX_FILE_SIZE, userWiseRole }
