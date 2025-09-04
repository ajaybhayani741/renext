import BasicInformation from './presentation/BasicInformation'
import Password from './presentation/Password'

const tabKeys = {
  basicInfo: 'basicInfo',
  password: 'password',
}

const tabList = [
  {
    label: 'user_BasicInformation',
    key: tabKeys.basicInfo,
    Component: BasicInformation,
  },
  {
    label: 'auth_Password',
    key: tabKeys.password,
    Component: Password,
  },
]

export { tabList, tabKeys }
