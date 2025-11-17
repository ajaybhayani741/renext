import { useMemo } from 'react'

import useRedux from '../../../hooks/useRedux'
import { USER_TXT } from '../../../routing/pathName.constant'
import { deepClone } from '../../../utils/customFunctions'
import { include, isArray, isEqual, values } from '../../../utils/javascript'
import { jobTabList } from '../../jobs/jobs.description'
import { sidebarMenus } from '../../layout/sidebar.description'
import roleWiseData from '../home.description'

const home = () => {
  const { selector } = useRedux()
  const loginUserDetails = selector(state => state.user?.profile_details)

  const { roleId } = { ...loginUserDetails }

  const homeData = useMemo(() => {
    const userManagementMenus = sidebarMenus.find(menu =>
      isEqual(menu.key, USER_TXT),
    ).children
    const menus = userManagementMenus
      .filter(menu => include(menu.sidebar, roleId))
      ?.map(menu => ({
        btnLabel: isEqual(menu.label, 'user_InspectionOfficer')
          ? 'user_ListOfInspectionOfficer'
          : isEqual(menu.label, 'user_Hostel')
            ? 'user_ListOfHostels'
            : menu.label,
        BtnIcon: menu.Icon,
        path: menu.key,
      }))

    const roleData = deepClone(roleWiseData[roleId] || [])

    const checkJobPermission = jobs =>
      jobs.map(info => ({
        ...info,
        disabled:
          isArray(loginUserDetails?.jobAccess) &&
          !include(loginUserDetails.jobAccess, info?.jobKey),
      }))
    //role-wise active jobs
    roleData.forEach(btnGroup => {
      if (btnGroup?.home_ActiveJobs) {
        btnGroup.home_ActiveJobs = checkJobPermission(
          btnGroup.home_ActiveJobs.filter(({ jobKey }) => {
            const jobTab = jobTabList.type.find(({ key }) =>
              isEqual(key, jobKey),
            )
            return (
              include(jobTab?.permission, roleId) &&
              !(typeof jobTab?.hidden === 'function'
                ? jobTab?.hidden({
                    ...loginUserDetails,
                    materialType:
                      loginUserDetails?.materialTypes?.[0]?.materialTypeKey,
                  })
                : jobTab?.hidden)
            )
          }),
        )
      }

      if (btnGroup?.home_Refurbishment) {
        btnGroup.home_Refurbishment = checkJobPermission(
          btnGroup?.home_Refurbishment,
        )
      }

      values(btnGroup)?.forEach(value => {
        if (isArray(value)) {
          value.forEach(item => {
            if (typeof item.hidden === 'function') {
              item.hidden = item.hidden(loginUserDetails)
            }
            if (typeof item.disabled === 'function') {
              item.disabled = item.disabled(loginUserDetails)
            }
          })
        }
      })

      if (btnGroup?.job_MaterialSalesMaterialProducer) {
        btnGroup.job_MaterialSalesMaterialProducer = checkJobPermission(
          btnGroup?.job_MaterialSalesMaterialProducer,
        )
      }
    })

    roleData?.unshift({
      txt_UserManagement: menus,
    })
    return roleData
  }, [roleId, loginUserDetails])

  return { homeData }
}

export default home
