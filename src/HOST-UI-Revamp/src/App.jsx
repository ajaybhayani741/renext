import './App.scss'

// import { getToken, onMessage } from 'firebase/messaging'
import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

import useFiscalYearInitializer from './hooks/useFiscalYearInitializer'
import useNotify from './hooks/useNotify'
import useRedux from './hooks/useRedux'
import useTranslations from './hooks/useTranslations'
import { setPopupMessageModel } from './redux/app/reducer'
import Routing from './routing'
// import { messaging } from './services/firebase'
import ANTDConfigProvider from './shared/antd/ANTDConfigProvider'
import PopUpConfirm from './shared/PopUpConfirm'

let notifyMethod

function App() {
  const { t } = useTranslations()
  const { notify, contextHolder } = useNotify()
  const { selector, dispatch } = useRedux()
  const popup = selector(state => state?.app?.popUpMsgModel)
  const { open, message, success } = { ...popup }

  // Initialize fiscal year data globally once
  useFiscalYearInitializer()

  // useEffect(() => {
  //   Notification.requestPermission()
  //     .then(() =>
  //       getToken(messaging, {
  //         vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
  //       }),
  //     )
  //     .then(currentToken => {
  //       if (currentToken) {
  //         setItem('FCMToken', currentToken)
  //       } else {
  //         // Show permission request UI
  //       }
  //     })
  //     .catch(err => {})

  //   onMessage(messaging, payload => {
  //     // ...
  //   })
  // }, [])
  notifyMethod = notify
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="main-loader">
            <span>{t('txt_Loading')}</span>
          </div>
        }
      >
        <ANTDConfigProvider
          theme={{
            token: {
              colorPrimary: '#4F46E5',
              colorInfo: '#4F46E5',
              colorSuccess: '#16A34A',
              colorWarning: '#D97706',
              colorError: '#DC2626',
              colorBgBase: '#ffffff',
              colorBgLayout: '#F4F5F8', // Cool premium gray background
              colorText: '#0F172A',
              colorTextSecondary: '#64748B',
              borderRadius: 12,
              borderRadiusLG: 16,
              borderRadiusSM: 9,
              fontFamily:
                '"Inter", "Noto Sans JP", "-apple-system", "BlinkMacSystemFont", "Roboto", sans-serif',
              colorBorder: '#E6E9EF',
              colorBorderSecondary: '#EEF0F4',
              controlHeight: 42,
              controlHeightLG: 48,
              motionDurationMid: '0.22s',
              motionEaseInOut: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
            },
            components: {
              Button: {
                borderRadius: 9999, // Pill buttons
                borderRadiusLG: 9999,
                borderRadiusSM: 9999,
                controlHeight: 42,
                controlHeightLG: 48,
                fontWeight: 600,
                paddingInline: 22,
                primaryShadow:
                  '0 10px 24px rgba(79,70,229,0.34), 0 2px 6px rgba(79,70,229,0.22)',
                defaultShadow: '0 1px 2px rgba(15,23,42,0.05)',
              },
              Card: {
                borderRadiusLG: 20,
                boxShadowTertiary: '0 6px 22px rgba(15,23,42,0.06), 0 2px 6px rgba(15,23,42,0.035)',
              },
              Input: {
                borderRadius: 12,
                colorBgContainer: '#FBFCFE',
                controlHeight: 46,
                paddingInline: 16,
                hoverBorderColor: '#A5B4FC',
                activeBorderColor: '#4F46E5',
                activeShadow: '0 0 0 4px #EEF2FF',
              },
              Select: {
                borderRadius: 12,
                colorBgContainer: '#FBFCFE',
                controlHeight: 46,
              },
              Menu: {
                itemBorderRadius: 12,
                itemHeight: 46,
                itemSelectedBg: '#EEF2FF',
                itemSelectedColor: '#4338CA',
                itemHoverBg: '#F1F3F8',
                itemMarginInline: 10,
              },
              Table: {
                headerBg: 'transparent',
                headerColor: '#94A3B8',
                headerSplitColor: 'transparent',
                borderColor: '#EEF0F4',
                rowHoverBg: '#FBFCFE',
                paddingContentVertical: 16,
              },
              Modal: { borderRadiusLG: 20 },
              Tag: { borderRadiusSM: 9999 },
              Tabs: { itemSelectedColor: '#4338CA', inkBarColor: '#4F46E5' },
            }
          }}
        >
          {contextHolder}
          <Routing />
          {open && (
            <PopUpConfirm
              isOpen={open}
              success={success}
              description={t(message)}
              onCancelModel={() =>
                dispatch(
                  setPopupMessageModel({
                    open: false,
                    message: '',
                    success: false,
                  }),
                )
              }
            />
          )}
        </ANTDConfigProvider>
      </Suspense>
    </BrowserRouter>
  )
}

export { notifyMethod }
export default App
