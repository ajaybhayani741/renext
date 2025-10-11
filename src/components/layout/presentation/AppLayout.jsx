import '../layout.scss'

import classNames from 'classnames'
import { Suspense, memo } from 'react'
import { Outlet } from 'react-router-dom'

import Header from './Header'
import ANTDLayout, {
  ANTDContent,
  ANTDFooter,
  ANTDSider,
} from '../../../shared/antd/ANTDLayout'
import ANTDMenu from '../../../shared/antd/ANTDMenu'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import configData from '../../../utils/config'
import { CloseCircleOutlined } from '../../../utils/icons'
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
  } = appLayout()
  const { logo } = configData
  return (
    <div ref={ref}>
      <ANTDSider
        theme="light"
        className={classNames({
          'sidebar-open': toggleMenu,
          'mobile-view-sider': !isDesktop || toggleMenu,
        })}
      >
        <div className="brand-logo">
          <img src={logo} alt="Mat Next" /* height="75%" */ />
        </div>
        <div className="menu-list">
          <ANTDMenu
            theme="light"
            mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            selectedKeys={[activeItem]}
            items={items && transformItemsRecursive(items)}
            onClick={handleMenu}
          />
        </div>
      </ANTDSider>
      <ANTDLayout className="layout">
        {(!isDesktop || toggleMenu) && (
          <div
            className={classNames('close-sidebar', {
              'close-open': toggleMenu,
            })}
          >
            <CloseCircleOutlined
              className="mob-menu-back"
              onClick={() => setToggleMenu(false)}
            />
          </div>
        )}
        <Header setToggleMenu={setToggleMenu} />
        <ANTDLayout className="main-layout">
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
        <ANTDFooter className="footer">
          <span>©{new Date().getFullYear()} GenbaNEXT Limited</span>
        </ANTDFooter>
      </ANTDLayout>
    </div>
  )
}

export default memo(AppLayout)
