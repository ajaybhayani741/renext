import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import ANTDBadge from '../../../shared/antd/ANTDBadge'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDToolTip from '../../../shared/antd/ANTDTooltip'

function ButtonLinkBox({ buttonGroup, title, themeClass = '' }) {
  const { t } = useTranslations()
  const { navigate } = useRouter()
  const { dispatch } = useRedux()

  const handleOnClick = (path, dispatchAction, state) => {
    if (dispatchAction) dispatch(dispatchAction)
    navigate(path, { state })
  }

  return (
    <ANTDColumn className={`list-columns ${themeClass}`}>
      <h3 className="name-wrapper">{t(title)}</h3>
      {buttonGroup?.map(
        (
          {
            badge,
            BtnIcon,
            btnLabel,
            path,
            dispatchAction,
            state,
            jobKey,
            ...btnProps
          },
          i,
        ) => (
          <ANTDBadge count={badge} overflowCount={99} key={i}>
            <ANTDButton
              type="primary"
              shape="round"
              size="large"
              onClick={() => handleOnClick(path, dispatchAction, state)}
              {...btnProps}
              block
            >
              <div className="d-flex align-center inner-btn">
                {BtnIcon && <BtnIcon />}
                <ANTDToolTip className="wrap-text-3 text-start">
                  {t(btnLabel)}
                </ANTDToolTip>
              </div>
            </ANTDButton>
          </ANTDBadge>
        ),
      )}
    </ANTDColumn>
  )
}

export default ButtonLinkBox
