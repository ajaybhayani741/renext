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
              colorPrimary: '#4F46E5', // Keep vibrant primary color
              colorBgBase: '#ffffff',
              colorBgLayout: '#F5F5F7', // Apple-like subtle gray background
              colorText: '#1d1d1f', // Softer, premium black
              borderRadius: 12,
              fontFamily: '"Inter", "-apple-system", "BlinkMacSystemFont", "Roboto", sans-serif',
              colorBorder: 'transparent', // Remove harsh borders globally
            },
            components: {
              Button: {
                borderRadius: 9999, // Pill buttons
                controlHeight: 40,
                fontWeight: 600,
              },
              Card: {
                borderRadiusLG: 20,
                boxShadowTertiary: '0 4px 24px rgba(0,0,0,0.04)',
              },
              Input: {
                colorBgContainer: '#F5F5F7', // Filled look instead of outlined
                controlHeight: 44, // Taller, luxurious inputs
                hoverBorderColor: '#4F46E5',
                activeBorderColor: '#4F46E5',
              },
              Select: {
                colorBgContainer: '#F5F5F7',
                controlHeight: 44,
              },
              Table: {
                headerBg: 'transparent', // Remove ugly colored headers
                headerColor: '#86868b', // Subtle gray header text
                headerSplitColor: 'transparent',
                rowHoverBg: '#F5F5F7',
                paddingContentVertical: 16,
              }
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
