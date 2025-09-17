export const LOGOUT = 'LOGOUT'

const userWiseRole = {
  admin: 1,
  stateHostelDepartment: 2,
  stateAdminOfficer: 3,
  districtCollector: 4,
  inspectionOfficer: 5,
  hostel: 6,
}

const { stateAdminOfficer, inspectionOfficer, hostel } = userWiseRole

const childUsers = [stateAdminOfficer, inspectionOfficer, hostel]

const MAX_FILE_SIZE = 1024 * 1024 * 5 //5MB

export { childUsers, MAX_FILE_SIZE, userWiseRole }
