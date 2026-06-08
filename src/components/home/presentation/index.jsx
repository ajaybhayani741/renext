import ButtonLinkBox from './ButtonLinkBox'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import { entries, values } from '../../../utils/javascript'
import home from '../container/home.container'
import '../home.scss'

function Home() {
  const { t } = useTranslations()
  const { homeData } = home()

  return (
    <div>
      <h2 className="page-title">{t('menu_Home')}</h2>
      <ANTDRow className="list-column-row">
        {homeData?.map((group, index) =>
          values(group)?.[0]?.length ? (
            <ANTDColumn key={index} className="list-column-wrapper">
              {entries(group)?.map(([title, list], i) => {
                const themes = ['theme-purple', 'theme-green', 'theme-orange', 'theme-blue', 'theme-red', 'theme-yellow', 'theme-cyan', 'theme-teal']
                const themeClass = themes[(index + i) % themes.length]
                
                return (
                  <ANTDRow key={i} style={{ flexDirection: 'column' }}>
                    <ButtonLinkBox buttonGroup={list} title={title} key={i} themeClass={themeClass} />
                  </ANTDRow>
                )
              })}
            </ANTDColumn>
          ) : null,
        )}
      </ANTDRow>
    </div>
  )
}

export default Home
