import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getItem, setItem } from '../../../utils/localstorage'

const languageSelector = () => {
  const language = getItem('lang')
  const { i18n } = useTranslation()
  const [selected, setSelected] = useState(language ?? 'en')

  useEffect(() => {
    i18n.changeLanguage(language ?? 'en')
  }, [language])

  const handleSelect = value => {
    setSelected(value)
    setItem('lang', value)
  }

  return { selected, handleSelect }
}

export default languageSelector
