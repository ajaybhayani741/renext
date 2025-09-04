import { lazy, memo } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import pathName from './pathName.constant'
import ProtectedRoute from './PrivateRoute'
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
const BookKeeping = lazy(
  () => import('../components/bookKeeping/presentation/Index'),
)
const Settings = lazy(() => import('../components/settings/presentation'))
const InventoryManagement = lazy(
  () => import('../components/inventoryManagement/presentation'),
)
const Report = lazy(() => import('../components/report/presentation'))

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
          path: pathName.DASHBOARD,
          element: <Dashboard />,
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
          path: pathName.BOOK_KEEPING,
          element: <BookKeeping />,
        },
        {
          path: pathName.INVENTORY,
          element: <InventoryManagement />,
        },
        {
          path: pathName.REPORTING,
          element: <Report />,
        },
        {
          path: pathName.SETTINGS,
          element: <Settings />,
        },
        { path: '*', element: <PageNotFound /> },
      ],
    },
    { path: pathName.LOGIN, element: <Auth /> },
    { path: pathName.FORGOT_PASSWORD, element: <Auth /> },
  ])

  return routes
}

export default memo(Routing)
