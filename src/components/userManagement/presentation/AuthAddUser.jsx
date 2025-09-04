import AddUser from './AddUser'
import withAddRoute from '../../../hoc/withAddRoute'
import ANTDConfigProvider from '../../../shared/antd/ANTDConfigProvider'

const AuthAddUser = () => {
  return (
    <ANTDConfigProvider
      theme={{
        token: {
          colorPrimary: '#6495ed',
          colorBgContainerDisabled: '#e2e2e2',
          colorTextDisabled: '#000000',
        },
      }}
    >
      <AddUser />
    </ANTDConfigProvider>
  )
}

export default withAddRoute(AuthAddUser)
