import { useEffect } from 'react'

import fiscalYearProvider from '../container/fiscalYearProvider.container'

const FiscalYearProvider = ({ children }) => {
  const { isInitialized } = fiscalYearProvider()

  // This component doesn't render anything, it just initializes fiscal year data
  return children
}

export default FiscalYearProvider
