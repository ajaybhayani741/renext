import '../layout.scss'

import React from 'react'

import { ReactComponent as GlobeIcon } from '../../../assets/layout/globe.svg'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import { entries } from '../../../utils/javascript'
import languageSelector from '../container/languageSelector'
import { languagesList } from '../layout.description'

function LanguageSelector() {
  const { selected, handleSelect } = languageSelector()

  return (
    <ANTDSelect
      className="lang-selector"
      placement="bottomRight"
      classNames={{ popup: { root: 'language-dropdown-menu' } }}
      suffixIcon={<GlobeIcon width={18} height={18} />}
      value={selected}
      onSelect={handleSelect}
      getPopupContainer={node => node.parentNode}
      options={entries(languagesList).map(([key, value]) => ({
        value: key,
        label: value,
      }))}
    />
  )
}

export default LanguageSelector
