import ButtonLinkBox from './ButtonLinkBox'
import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import '../home.scss'
import { entries } from '../../../utils/javascript'
import home from '../container/home.container'

function Home() {
  const { t } = useTranslations()
  const { homeData } = home()

  return (
    <div>
      <h2 className="page-title">{t('menu_Home')}</h2>
      <ANTDRow className="list-column-row">
        {homeData?.map((group, index) => (
          <ANTDColumn key={index} className="list-column-wrapper">
            {entries(group)?.map(([title, list], i) => (
              <ANTDRow key={i} style={{ flexDirection: 'column' }}>
                <ButtonLinkBox buttonGroup={list} title={title} key={i} />
              </ANTDRow>
            ))}
          </ANTDColumn>
        ))}
      </ANTDRow>
    </div>
  )
}

export default Home
