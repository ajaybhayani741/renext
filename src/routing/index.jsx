import { lazy, memo } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import pathName, {
  DASHBOARD_TXT,
  HOSTEL,
  NEW_DASHBOARD_TXT,
} from './pathName.constant'
import ProtectedRoute from './PrivateRoute'
import DashboardView from '../components/dashboard/presentation/DashboardView'
import PageNotFound from '../components/PageNotFound'
import UserManagement from '../components/userManagement/presentation'

const AppLayout = lazy(
  () => import('../components/layout/presentation/AppLayout'),
)
const Auth = lazy(() => import('../components/layout/presentation'))
const Home = lazy(() => import('../components/home/presentation'))
const Dashboard = lazy(() => import('../components/dashboard/presentation'))
const AuthAddUser = lazy(
  () => import('../components/userManagement/presentation/AuthAddUser'),
)
const Profile = lazy(() => import('../components/profile/presentation/index'))
const JobManagement = lazy(() => import('../components/jobs/presentation'))
const UnassignedHostels = lazy(
  () => import('../components/jobs/presentation/viewJobs/UnassignedHostels'),
)
const Notifications = lazy(
  () => import('../components/notifications/presentation'),
)
const AddEditJobs = lazy(
  () => import('../components/jobs/presentation/addJobs'),
)
const SelectedPhotoDashboard = lazy(
  () => import('../components/dashboard/presentation/SelectedPhotoDashboard'),
)
const UpdatedDashboard = lazy(
  () => import('../components/dashboard/presentation/UpdatedDashboard'),
)
// const BookKeeping = lazy(
//   () => import('../components/bookKeeping/presentation/Index'),
// )
// const Settings = lazy(() => import('../components/settings/presentation'))
// const InventoryManagement = lazy(
//   () => import('../components/inventoryManagement/presentation'),
// )
// const Report = lazy(() => import('../components/report/presentation'))

const Landing = lazy(() => import('../components/landing/presentation/Landing'))

const Routing = () => {
  const routes = useRoutes([
    {
      path: pathName.ROOT,
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={pathName.HOME} replace={true} />,
        },
        {
          path: pathName.HOME,
          element: <Home />,
        },
        {
          path: DASHBOARD_TXT,
          index: true,
          element: <Dashboard />,
        },
        {
          path: pathName.DASHBOARD,
          element: <DashboardView />,
        },
        {
          path: NEW_DASHBOARD_TXT,
          element: <UpdatedDashboard />,
        },
        {
          path: pathName.PHOTO_DASHBOARD,
          element: <SelectedPhotoDashboard />,
        },
        {
          path: pathName.USER,
          element: <UserManagement />,
        },
        {
          path: pathName.ADD_USER,
          element: <AuthAddUser />,
        },
        {
          path: pathName.PROFILE,
          element: <Profile />,
        },
        {
          path: pathName.JOBS,
          element: <JobManagement />,
        },
        {
          path: pathName.ADD_JOB,
          element: <AddEditJobs />,
        },
        {
          path: pathName.EDIT_JOB,
          element: <AddEditJobs />,
        },
        {
          path: `/${HOSTEL}`,
          element: <UnassignedHostels />,
        },
        {
          path: pathName.NOTIFICATIONS,
          element: <Notifications />,
        },
        { path: '*', element: <PageNotFound /> },
      ],
    },
    { path: pathName.LANDING, element: <Landing /> },
    { path: pathName.LOGIN, element: <Auth /> },
    { path: pathName.FORGOT_PASSWORD, element: <Auth /> },
  ])

  return routes
}

export default memo(Routing)
