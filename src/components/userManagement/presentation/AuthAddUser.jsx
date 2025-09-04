import AddUser from './AddUser'
import withAddRoute from '../../../hoc/withAddRoute'

const AuthAddUser = () => {
  return <AddUser />
}

export default withAddRoute(AuthAddUser)
