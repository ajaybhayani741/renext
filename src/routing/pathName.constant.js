const USER_TXT = '/user'

const ADMIN = 'admin'
const STORE_OWNER = 'store-owner'
const STORE = 'store'
const STORE_MANAGER = 'store-manager'
const STORE_EMPLOYEE = 'store-employee'
const VENDOR = 'vendor'
const CUSTOMER = 'customer'
const MANUFACTURER = 'manufacturer'

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

const pathName = {
  ROOT: '/',
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
  DASHBOARD: '/dashboard',
  BOOK_KEEPING: `${BOOK_KEEPING_TXT}/:type`,
  REPORTING: `${REPORTING_TXT}/:type`,
  SETTINGS: `/settings`,
}
export default pathName

export {
  USER_TXT,
  ADMIN,
  STORE_OWNER,
  STORE_MANAGER,
  STORE_EMPLOYEE,
  VENDOR,
  CUSTOMER,
  MANUFACTURER,
  STORE,
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
}
