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
              colorPrimary: '#7f5539',
            },
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
