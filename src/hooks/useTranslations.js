import { useTranslation } from 'react-i18next'

const useTranslations = () => {
  const { t, i18n } = useTranslation()
  return { t, i18n }
}
export default useTranslations
