import '../layout.scss'

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { Suspense, memo } from 'react'
import { Outlet } from 'react-router-dom'

import Header from './Header'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDLayout, {
  ANTDContent,
  ANTDFooter,
  ANTDSider,
} from '../../../shared/antd/ANTDLayout'
import ANTDMenu from '../../../shared/antd/ANTDMenu'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import configData from '../../../utils/config'
import { userWiseRole } from '../../../utils/constant'
import { CloseCircleOutlined, hostIcon } from '../../../utils/icons'
import { isEqual } from '../../../utils/javascript'
import appLayout from '../container/appLayout'

function AppLayout() {
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
  const { logo } = configData
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
      </ANTDSider>
      <ANTDButton
        onClick={toggleCollapsed}
        className={classNames(
          'ant-menu-collapse',
          'd-flex',
          'justify-center',
          'align-center',
          {
            'ant-menu-collapse-dimensions': collapsed,
            'ant-menu-uncollapse-dimensions': !collapsed,
            'ant-menu-collapse-mobile': true,
          },
        )}
      >
        {collapsed ? (
          <RightOutlined
            className={classNames('fold_icon', 'justify-center')}
          />
        ) : (
          <LeftOutlined className={classNames('fold_icon', 'justify-center')} />
        )}
      </ANTDButton>
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
        <Header setToggleMenu={setToggleMenu} collapsed={collapsed} />
        <ANTDLayout className={classNames('main-layout', { collapsed })}>
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
            {/* <div className="">Host</div> */}
            <span>©{new Date().getFullYear()} GenbaNEXT Limited</span>
          </div>
        </ANTDFooter>
      </ANTDLayout>
    </div>
  )
}

export default memo(AppLayout)
