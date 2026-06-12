const USER_TXT = '/user'
const DASHBOARD_TXT = '/dashboard'
const NEW_DASHBOARD_TXT = '/new-dashboard'

const ADMIN = 'admin'
const STATE_HOSTEL_DEPARTMENT = 'state-hostel-department'
const STATE_ADMIN_OFFICER = 'state-admin-officer'
const DISTRICT_COLLECTOR = 'district-collector'
const INSPECTION_OFFICER = 'inspection-officer'
const HOSTEL = 'hostel'

//book keeping path
const BOOK_KEEPING_TXT = '/book-keeping'
const SCRATCH_TICKET_TRACKING = 'scratch-ticket-tracking'
const JOHN_TUBES = 'john-tubes'
const MACHINES = 'machines'
const CASHBACK = 'cashback'
const VENDOR_PAYOUT = 'vendor-payout'
const SHIFT = 'shift'

//inventory path
const INVENTORY_TXT = '/inventory'
const CATEGORIES = 'categories'
const STRUCTURE_SUGGESTION = 'structure-suggestion'
const INVENTORY_ACTION = 'inventory-action'

//reporting path
const REPORTING_TXT = '/reporting'
const DAILY_CLOSING = 'daily-closing'
const FLEXIBLE = 'flexible'
const SALES = 'sales'
const STOCK = 'stock'
const TALLY = 'tally'
const PHOTOS = 'photos'

const pathName = {
  ROOT: '/',
  LANDING: '/landing',
  HOME: '/home',
  USER: `${USER_TXT}/:userType`,
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/forgot-password?:uuid',
  ADD_USER: `${USER_TXT}/:userType/add`,
  PROFILE: `/profile`,
  JOBS: '/jobs',
  INVENTORY: `${INVENTORY_TXT}/:type`,
  ADD_JOB: '/jobs/:jobType/add',
  EDIT_JOB: '/jobs/:jobType/edit/:jobId',
  DASHBOARD: `${DASHBOARD_TXT}/:type`,
  PHOTO_DASHBOARD: `${DASHBOARD_TXT}/${PHOTOS}/:photoType`,
  BOOK_KEEPING: `${BOOK_KEEPING_TXT}/:type`,
  REPORTING: `${REPORTING_TXT}/:type`,
  SETTINGS: `/settings`,
  NOTIFICATIONS: `/notifications`,
  ICC: '/icc',
}
export default pathName

export {
  USER_TXT,
  DASHBOARD_TXT,
  ADMIN,
  STATE_HOSTEL_DEPARTMENT,
  STATE_ADMIN_OFFICER,
  DISTRICT_COLLECTOR,
  INSPECTION_OFFICER,
  HOSTEL,
  BOOK_KEEPING_TXT,
  SCRATCH_TICKET_TRACKING,
  JOHN_TUBES,
  MACHINES,
  CASHBACK,
  VENDOR_PAYOUT,
  INVENTORY_TXT,
  CATEGORIES,
  STRUCTURE_SUGGESTION,
  INVENTORY_ACTION,
  REPORTING_TXT,
  SHIFT,
  DAILY_CLOSING,
  FLEXIBLE,
  SALES,
  STOCK,
  TALLY,
  PHOTOS,
  NEW_DASHBOARD_TXT,
}
