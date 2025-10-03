const API_ROUTES = {
  REFRESH_TOKEN: `/user-management/v1/refresh/authtoken`,
  LOGIN: `/user-management/v1/login/password`,
  NON_LOGIN: `/user-management/v1/generate/nonLogin`,
  DIAIKIN_LOGIN: `/user-management/v1/login/daikincity`,
  LOGOUT: `/user-management/v1/logout`,
  FORGOT_PASSWORD: ({ userName }) =>
    `/user-management/v1/reset/password/${userName}`,
  RESET_PASSWORD: `/user-management/v1/save/password`,
  CHANGE_PASSWORD: `/user-management/v1/password`,
  ADD_NEW_USER: `user-management/v1/add/newuser`,
  UPDATE_USER: `user-management/v1/userprofile`,
  UPDATE_USER_CONTENT: `user-management/v1/user/content`,
  ADD_BUILDING: `user-management/v1/userbuilding`,
  GET_USER_PROFILE: id => `user-management/v1/userprofile/${id}`,
  GET_USER: ({ params }) => `user-management/v1/relation/users/${params}`,
  GET_BUILDING: ({ params }) => `user-management/v1/userbuilding/${params}`,
  SEARCH_USER: ({ params }) => `/user-management/v1/search/user/${params}`,
  ADD_ASSOCIATE: ({ params }) => `/user-management/v1/user/associate${params}`,
  DIS_ASSOCIATE: ({ params }) =>
    `/user-management/v1/user/disassociate${params}`,
  USER_VALIDATION: ({ params }) => `/user-management/v1/credvalidate${params}`,
  GET_BRAND: ({ id }) => `/user-management/v1/brand/${id}`,
  GET_ALL_BRAND: ({ params }) => `/user-management/v1/all/brand/${params}`,
  GET_IMAGE_FILE: ({ params }) => `/user-management/v1/file${params}`,
  DELETE_IMAGE_FILES: ({ params }) => `/user-management/v1/files${params}`,
  ADD_BRAND: ({ params }) => `user-management/v1/brand${params}`,
  SEARCH_BRAND: ({ params }) => `/user-management/v1/search/brand/${params}`,
  SEARCH_JOB_LIST: `/job-management/v1/search/job`,
  GET_ERROR_CODE: ({ pageNo, params }) =>
    `/job-management/v1/job/model/errorcode/${pageNo}${params}`,
  FISCAL_YEARS: `/job-management/v1/fiscalyear`,
  JOBS: '/job-management/v1/job',
  SCRATCH_TICKET_BOX: '/job-management/v1/box',
  SCRATCH_TICKET: '/job-management/v1/bookkeeping/scratchticket',
  SEARCH_SCRATCH_TICKET: '/job-management/v1/bookkeeping/scratchticket/search',
  SCRATCH_TICKET_BOOK: '/job-management/v1/scratchticket/book',
  TOTAL_VALUES: '/job-management/v1/total',
  TUBE: '/job-management/v1/tube',
  BOOK_KEEPING_TUBE: '/job-management/v1/bookkeeping/tube',
  SEARCH_TUBE: '/job-management/v1/bookkeeping/tube/search',
  MACHINES: '/job-management/v1/machines',
  MACHINE_TICKETS: '/job-management/v1/machinetickets',
  CASHBACK: '/job-management/v1/cashback',
  VENDOR_PAYOUT: '/job-management/v1/vendorpayout',
  INVENTORY: '/job-management/v1/inventory',
  SHIFT_REPORT: '/job-management/v1/shiftreport',
  TRIGGER_REPORT: '/job-management/v1/triggerreport',
  USER_REPORTS: '/job-management/v1/userreports',
  GET_EQUIPMENT: ({ params }) => `/user-management/v1/all/ein/${params}`,
  SEARCH_EQUIPMENT: ({ params }) => `/user-management/v1/search/ein/${params}`,
  GET_ADDRESS_DATA: ({ params }) =>
    `/dataviz-management/v1/statecitylist${params}`,
  GET_EQUIPMENT_DATA: ({ params }) =>
    `/dataviz-management/v1/brand/jobs/${params}`,
  GET_EQUIPMENT_PIE_CHART_DATA: ({ params }) =>
    `/dataviz-management/v1/piechart${params}`,
  GET_TOTAL_USER_DATA: ({ params }) =>
    `/dataviz-management/v1/user/job/total${params}`,
  GET_FE_USER_DATA: ({ params }) =>
    `/dataviz-management/v1/brand/user/jobs/${params}`,
  ADD_ERROR_CODE: `/user-management/v1/errorcode`,
  GET_FILTER_USER_DATA: ({ userType, pageNo }) =>
    `/dataviz-management/v1/filter/${userType}/${pageNo}`,
  GET_SEARCH_FILTER_DATA: ({ userType, pageNo, search }) =>
    `/dataviz-management/v1/filter/search/${userType}/${pageNo}?search=${search}`,
  GET_BUILDING_DETAILS: ({ buildingId }) =>
    `/dataviz-management/v1/building/${buildingId}`,
  GET_EQUIPMENT_DETAILS: ({ buildingId, equipmentId }) =>
    `/dataviz-management/v1/building/${buildingId}/equipment/${equipmentId}`,
  GET_REPORT: ({ jobId, jobType }) =>
    `/job-management/v1/report?jobId=${jobId}&jobType=${jobType}`,
  GET_BRAND_TOTAL: ({ params }) =>
    `/dataviz-management/v1/brand/jobs/total${params}`,
  SHARE_REPORT: `/job-management/v1/email-sms`,
  UPDATE_REPORT: `/job-management/v1/updation/report`,
  DASHBOARD_SHIFT_REPORT: '/dashboard-management/v1/shiftreport',
  DASHBOARD_DISCREPANCIES: '/dashboard-management/v1/discrepancies',
  DASHBOARD_PRINCIPAL_AUTHORITY_BAR_CHART:
    '/dashboard-management/v1/principal-authority/bar-chart',
  DASHBOARD_PRINCIPAL_AUTHORITY_HOSTELS: ({ params }) =>
    `/dashboard-management/v1/principal-authority/hostels/${params}`,
  GET_COLUMN_LIST: ({ params }) => `/job-management/v1/reportcolumn${params}`,
  SAVE_FLEXIBLE_REPORT: `/job-management/v1/userflexiblereport`,
  GET_SAVE_FLEXIBLE_REPORT: `/job-management/v1/userflexiblereport`,
  GET_SINGLE_REPORT: `/job-management/v1/userflexiblereport`,
  GET_FLEXIBLE_REPORT_CALCULATION: `/job-management/v1/flexible_report_calculation`,
  GET_GENERATED_REPORT: ({ params }) => `/job-management/v1/report${params}`,
  GET_DRINKING_WATER_BAR_CHART: `/dashboard-management/v1/drinking-water/bar-chart`,
  GET_DRINKING_WATER_HOSTELS: ({ pageNo }) =>
    `/dashboard-management/v1/drinking-water/hostels/${pageNo}`,
  GET_STAFF_AVAILABILITY_CHART: `/dashboard-management/v1/staff-nurse-availability/pie-chart`,
  GET_STAFF_AVAILABILITY_HOSTELS: ({ pageNo }) =>
    `/dashboard-management/v1/staff-nurse-availability/hostels/${pageNo}`,
  GET_AVAILABLE_TOILETS_CHART: `/dashboard-management/v1/hostel-toilets-available-chart`,
  GET_AVAILABLE_TOILETS_HOSTELS: ({ pageNo }) =>
    `/dashboard-management/v1/hostel-toilets-available-chart/hostels/${pageNo}`,
  DASHBOARD_RECORD_MAINTENANCE_BAR_CHART: `/dashboard-management/v1/record-maintenance/bar-chart`,
  DASHBOARD_RECORD_MAINTENANCE_HOSTELS: ({ params }) =>
    `/dashboard-management/v1/record-maintenance/hostels/${params}`,
  DASHBOARD_WASTE_MANAGEMENT_BAR_CHART: `/dashboard-management/v1/waste-management/bar-chart`,
  DASHBOARD_WASTE_MANAGEMENT_HOSTELS: ({ params }) =>
    `/dashboard-management/v1/waste-management/hostels/${params}`,
  DASHBOARD_TOILETS_SUFFICIENCY_BAR_CHART: `/dashboard-management/v1/toilets-sufficiency/bar-chart`,
  DASHBOARD_TOILETS_SUFFICIENCY_HOSTELS: ({ params }) =>
    `/dashboard-management/v1/toilets-sufficiency/hostels/${params}`,
  DASHBOARD_LOCATION_BEDS_MATTRESSES_BAR_CHART: `/dashboard-management/v1/location-beds-mattresses/bar-chart`,
  DASHBOARD_LOCATION_BEDS_MATTRESSES_HOSTELS: ({ params }) =>
    `/dashboard-management/v1/location-beds-mattresses/hostels/${params}`,
  DASHBOARD_MEDICAL_CARE_BAR_CHART: `/dashboard-management/v1/medical-care/bar-chart`,
  DASHBOARD_MEDICAL_CARE_HOSTELS: ({ pageNo }) =>
    `/dashboard-management/v1/medical-care/hostels/${pageNo}`,
  DASHBOARD_EDUCATION_FACILITIES_BAR_CHART: `/dashboard-management/v1/education-facilities/bar-chart`,
  DASHBOARD_EDUCATION_FACILITIES_HOSTELS: ({ pageNo }) =>
    `/dashboard-management/v1/education-facilities/hostels/${pageNo}`,
  DASHBOARD_FOOD_PROVISIONS_BAR_CHART: `/dashboard-management/v1/food-provisions/bar-chart`,
  DASHBOARD_FOOD_PROVISIONS_HOSTELS: ({ pageNo }) =>
    `/dashboard-management/v1/food-provisions/hostels/${pageNo}`,
  DASHBOARD_PRECAUTIONARY_MEASURES_BAR_CHART: `/dashboard-management/v1/precautionary-measures/bar-chart`,
  DASHBOARD_PRECAUTIONARY_MEASURES_HOSTELS: ({ pageNo }) =>
    `/dashboard-management/v1/precautionary-measures/hostels/${pageNo}`,
  DASHBOARD_ANIMAL_THREAT_BAR_CHART: `/dashboard-management/v1/animal-threat/bar-chart`,
  DASHBOARD_ANIMAL_THREAT_HOSTELS: ({ pageNo }) =>
    `/dashboard-management/v1/animal-threat/hostels/${pageNo}`,
  DASHBOARD_CONDUCTION_MEETINGS_BAR_CHART: `/dashboard-management/v1/conduction-meetings/bar-chart`,
  DASHBOARD_CONDUCTION_MEETINGS_HOSTELS: ({ pageNo }) =>
    `/dashboard-management/v1/conduction-meetings/hostels/${pageNo}`,
}
export default API_ROUTES
