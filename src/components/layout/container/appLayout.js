import { useCallback, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { setDeviceStatus } from '../../../redux/app/reducer'
import ANTDTooltip from '../../../shared/antd/ANTDTooltip'
import {
  entries,
  include,
  isEqual,
  length,
  notEqual,
} from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { sidebarMenus } from '../sidebar.description'

const appLayout = () => {
  const { t } = useTranslations()
  const userData = JSON.parse(getItem('userData'))
  const { roleId } = { ...userData }
  const { navigate, location } = useRouter()
  const { dispatch, selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
  const [toggleMenu, setToggleMenu] = useState(false)
  const activeItem1 = location.pathname
  const defaultOpenKeys = [`/${activeItem1.split('/')?.[1]}`]
  const [collapsed, setCollapsed] = useState(false)

  const removeAddFromLastPath = () => {
    let url = ''
    const pathSegments = activeItem1.split('/')
    const lastSegmentIndex = length(pathSegments) - 1
    if (
      lastSegmentIndex >= 0 &&
      isEqual(pathSegments[lastSegmentIndex], 'add')
    ) {
      pathSegments.pop() // Remove the last path segment ("add")
      url = pathSegments.join('/')
    } else {
      url = activeItem1
    }
    return url.toString()
  }

  const onResize = width => {
    if (!width) return
    const isGreaterWidth = width > 991
    notEqual(isGreaterWidth, isDesktop) &&
      dispatch(setDeviceStatus(isGreaterWidth))
    return isGreaterWidth && toggleMenu && setToggleMenu(false)
  }
  const { ref } = useResizeDetector({
    onResize,
  })

  const filterMenuByRoleId = useCallback(
    (menus, roleIdToFilter) =>
      menus.reduce((filtered, menu) => {
        let newClass = ''
        length(entries(menu.level)) &&
          entries(menu.level).forEach(([key, value]) => {
            if (include(value, roleId)) {
              newClass = key
            }
          })
        if (
          Array.isArray(menu.sidebar) &&
          menu.sidebar.includes(roleIdToFilter)
        ) {
          const { key, label, Icon, disabled } = menu
          const filteredMenu = {
            key,
            label: <ANTDTooltip>{t(label)}</ANTDTooltip>,
            className: newClass,
            Icon,
            disabled,
          }
          if (menu.children) {
            filteredMenu.children = filterMenuByRoleId(
              menu.children,
              roleIdToFilter,
            )
          }
          filtered.push(filteredMenu)
        } else if (menu.children) {
          const filteredChildren = filterMenuByRoleId(
            menu.children,
            roleIdToFilter,
          )
          if (filteredChildren.length > 0) {
            const { key, label, Icon, disabled } = menu
            const filteredMenu = {
              key,
              label: <ANTDTooltip>{t(label)}</ANTDTooltip>,
              children: filteredChildren,
              className: newClass,
              Icon,
              disabled,
            }
            filtered.push(filteredMenu)
          }
        }
        return filtered
      }, []),
    [],
  )
  const transformItemsRecursive = items => {
    if (!items || !Array.isArray(items)) {
      return []
    }
    return items.map(({ Icon: ParentIcon, children, ...value }) => {
      const transformedItem = {
        icon: <ParentIcon />,
        ...value,
      }

      if (children && Array.isArray(children)) {
        transformedItem.children = transformItemsRecursive(children)
      }

      return transformedItem
    })
  }

  const handleMenu = e => {
    navigate(e?.key)
    !isDesktop && toggleMenu && setToggleMenu(false)
  }

    const toggleCollapsed = () => {
      setCollapsed(!collapsed)
    }

  return {
    t,
    ref,
    isDesktop,
    activeItem: removeAddFromLastPath(),
    defaultOpenKeys,
    toggleMenu,
    setToggleMenu,
    items: filterMenuByRoleId(sidebarMenus, roleId),
    handleMenu,
    transformItemsRecursive,
    toggleCollapsed,
    collapsed,
  }
}

export default appLayout
