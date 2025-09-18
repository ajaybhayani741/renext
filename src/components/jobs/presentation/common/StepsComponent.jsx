import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useEffect, useRef } from 'react'

import useRedux from '../../../../hooks/useRedux'
import useRouter from '../../../../hooks/useRouter'
import useTranslations from '../../../../hooks/useTranslations'
import { setJobActiveTab } from '../../../../redux/jobs/reducer'
import pathName from '../../../../routing/pathName.constant'
import ANTDButton from '../../../../shared/antd/ANTDButton'
import ANTDSpin from '../../../../shared/antd/ANTDSpin'
import ANTDSteps, { ANTDStep } from '../../../../shared/antd/ANTDSteps'
import { isEqual, length, notEqual } from '../../../../utils/javascript'
import { tabKeys as jobTabKeys } from '../../jobs.description'

function StepsComponent({
  steps,
  current,
  loader,
  completeStep,
  displayForm,
  handleNext,
  handlePrevious,
  handleSave,
  showSave,
  backToLabel,
  jobType,
  size,
  showPrevious = false,
  btnIcon = false,
}) {
  const { t } = useTranslations()
  const { navigate } = useRouter()
  const { dispatch } = useRedux()
  const scrollElem = useRef()

  useEffect(() => {
    scrollElem.current?.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [current])

  const gotoJobList = () => {
    dispatch(
      setJobActiveTab({
        status: jobTabKeys.active,
        type: jobType,
      }),
    )
    navigate(pathName.JOBS)
  }

  return (
    <div>
      <ANTDSteps current={current} className="mt-3 job-step" size={size}>
        {steps &&
          steps.length &&
          steps.map(item => <ANTDStep key={item} title={t(item)} />)}
      </ANTDSteps>
      {loader && (
        <div className="job-apiLoader">
          <ANTDSpin size="large" />
        </div>
      )}
      {showSave && (
        <div className="text-end mr-15 mt-10">
          <ANTDButton type="primary" className="btn" onClick={handleSave}>
            {t('btn_Save')}
          </ANTDButton>
        </div>
      )}
      <div
        className={`steps-content ${showSave ? 'with-save-btn' : ''}`}
        ref={scrollElem}
      >
        <div className="steps-section" id="steps-section">
          {displayForm?.[current]}
        </div>
      </div>
      <div className={`text-center ${btnIcon ? 'mt-10' : 'mt-20'}`}>
        {(showPrevious ||
          (current > 0 && notEqual(current, length(steps) - 1))) && (
          <ANTDButton
            type="primary"
            className="btn submit-btn"
            onClick={handlePrevious}
          >
            {btnIcon ? <ArrowLeftOutlined /> : t('btn_Previous')}
          </ANTDButton>
        )}

        {!showPrevious && !!length(steps) && current <= completeStep ? (
          <ANTDButton
            type="primary"
            className="btn submit-btn ml-15"
            onClick={handleNext}
          >
            {btnIcon ? (
              <ArrowRightOutlined />
            ) : (
              t(
                isEqual(current, completeStep) && !showPrevious
                  ? 'job_Complete'
                  : 'btn_Next',
              )
            )}
          </ANTDButton>
        ) : (
          !showPrevious && (
            <ANTDButton
              type="primary"
              className="btn submit-btn ml-15"
              onClick={gotoJobList}
            >
              {t(backToLabel)}
            </ANTDButton>
          )
        )}
      </div>
    </div>
  )
}

export default StepsComponent
