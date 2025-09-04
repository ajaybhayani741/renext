import './style.scss'

import i18next from 'i18next'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'

import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import i18n from './i18n/i18n'
import store from './redux/index'
import reportWebVitals from './reportWebVitals'

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <ErrorBoundary>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </ErrorBoundary>,
  // </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
