import '../layout.scss'

import { LeftOutlined, RightOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { Suspense, memo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import FloatButtonUI from './FloatButtonUI'
import Header from './Header'
import header from '../container/header.container'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDLayout, {
  ANTDContent,
  ANTDFooter,
  ANTDSider,
} from '../../../shared/antd/ANTDLayout'
import ANTDMenu from '../../../shared/antd/ANTDMenu'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import ANTDToolTip from '../../../shared/antd/ANTDTooltip'
import pathName from '../../../routing/pathName.constant'
import configData from '../../../utils/config'
import { userWiseRole } from '../../../utils/constant'
import {
  CloseCircleOutlined,
  hostIcon,
  PoweroffOutlined,
  noImage,
} from '../../../utils/icons'
import { isEqual } from '../../../utils/javascript'
import appLayout from '../container/appLayout'

function AppLayout() {
  const navigate = useNavigate()
  const {
    t,
    defaultOpenKeys,
    activeItem,
    items,
    ref,
    isDesktop,
    toggleMenu,
    setToggleMenu,
    handleMenu,
    transformItemsRecursive,
    collapsed,
    toggleCollapsed,
    handleLogoClick,
    roleId,
  } = appLayout()
  const { profileDetails, handleProfile, handleLogout } = header()
  const { logo } = configData

  const displayName =
    profileDetails?.businessName ||
    profileDetails?.lastName ||
    profileDetails?.firstName ||
    'User'
  const avatarText = (displayName || 'U').trim().charAt(0).toUpperCase()

  return (
    <div ref={ref}>
      <ANTDSider
        theme="light"
        className={classNames({
          'collapsed-sider': collapsed,
          'expanded-sider': !collapsed,
          'sidebar-open': toggleMenu,
          'mobile-view-sider': !isDesktop || toggleMenu,
        })}
        collapsed={isDesktop ? collapsed : false}
      >
        <div
          className="logo_collapsed-menu"
          style={{
            justifyContent: collapsed ? 'center' : 'space-between',
          }}
        >
          <div className="brand-logo">
            <img
              className={
                isEqual(roleId, userWiseRole.districtCollector)
                  ? 'cursor-pointer'
                  : ''
              }
              src={isDesktop && collapsed ? hostIcon : logo}
              alt="Mat Next"
              onClick={handleLogoClick}
            />
          </div>
        </div>

        <div className="menu-list">
          <ANTDMenu
            theme="light"
            mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            selectedKeys={[activeItem]}
            items={items && transformItemsRecursive(items)}
            onClick={handleMenu}
            triggerSubMenuAction="hover"
            inlineCollapsed={collapsed}
          />
        </div>

        {/* Profile + Sign out + Collapse anchored to the bottom of the sidebar */}
        <div className="sidebar-footer">
          <ANTDToolTip title={collapsed ? t('btn_Collapse', 'Expand Sidebar') : ''}>
            <button
              type="button"
              className="sb-collapse-toggle"
              onClick={toggleCollapsed}
              aria-label="Toggle Sidebar"
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              {!collapsed && <span>{t('btn_Collapse', 'Collapse Sidebar')}</span>}
            </button>
          </ANTDToolTip>
          <div
            className="sb-profile"
            role="button"
            tabIndex={0}
            onClick={handleProfile}
            onKeyDown={e => e.key === 'Enter' && handleProfile()}
          >
            <span className="sb-avatar">
              {profileDetails?.profileUrl ? (
                <img src={profileDetails?.profileUrl || noImage} alt="profile" />
              ) : (
                avatarText
              )}
            </span>
            {!collapsed && (
              <span className="sb-profile-meta">
                <ANTDToolTip>
                  <span className="sb-name">{displayName}</span>
                </ANTDToolTip>
                <span className="sb-link">{t('txt_Profile')}</span>
              </span>
            )}
          </div>
          <ANTDToolTip title={collapsed ? t('btn_Logout') : ''}>
            <button
              type="button"
              className="sb-logout"
              onClick={handleLogout}
              aria-label={t('btn_Logout')}
            >
              <PoweroffOutlined />
              {!collapsed && <span>{t('btn_Logout')}</span>}
            </button>
          </ANTDToolTip>
        </div>
      </ANTDSider>

      <ANTDLayout className={classNames('layout', { collapsed })}>
        {(!isDesktop || toggleMenu) && (
          <div
            className={classNames('close-sidebar', {
              'close-open': toggleMenu && collapsed,
              'close-none': !toggleMenu,
            })}
          >
            <CloseCircleOutlined
              className="mob-menu-back"
              onClick={() => setToggleMenu(false)}
            />
          </div>
        )}
        <ANTDLayout 
          className={classNames('main-layout', { collapsed }, (() => {
            if (activeItem?.includes('/user')) return 'theme-purple'
            if (activeItem?.includes('/jobs')) return 'theme-green'
            if (activeItem?.includes('/inventory')) return 'theme-orange'
            if (activeItem?.includes('/book-keeping')) return 'theme-blue'
            if (activeItem?.includes('/reporting')) return 'theme-red'
            if (activeItem?.includes('/hostel')) return 'theme-yellow'
            if (activeItem?.includes('/notifications')) return 'theme-cyan'
            if (activeItem?.includes('/settings')) return 'theme-teal'
            return ''
          })())}
        >
          <Header setToggleMenu={setToggleMenu} collapsed={collapsed} />
          <div
            className={classNames({ 'bg-opaque': toggleMenu })}
            onClick={() => setToggleMenu(false)}
          />
          <ANTDContent>

            <Suspense
              fallback={
                <div className="lazy-loader">
                  <ANTDSpin size="large" />
                  <span>{t('txt_Loading')}</span>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </ANTDContent>
        </ANTDLayout>
        <ANTDFooter
          className={classNames('footer', { 'footer-collapsed': collapsed })}
        >
          <div className="text-end w-100">
            <span>©{new Date().getFullYear()} GenbaNEXT Limited</span>
          </div>
        </ANTDFooter>
      </ANTDLayout>
      <FloatButtonUI />
    </div>
  )
}

export default memo(AppLayout)
