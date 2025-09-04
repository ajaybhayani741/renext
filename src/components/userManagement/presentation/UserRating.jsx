import { StarFilled } from '@ant-design/icons'
import { Progress, Rate } from 'antd'
import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import { newArray } from '../../../utils/javascript'
import { RATING_LENGTH } from '../user.description'

const UserRating = () => {
  const { t } = useTranslations()

  return (
    <div className="rating-info mb-30 ">
      <h2 className="content-title">{t('user_Rating')}</h2>
      <div className="rating-detail">
        <ANTDRow gutter={[16, 16]}>
          <ANTDColumn sm={12} xs={24}>
            <h2 className="rating-title">{t('user_RatingDetails')}:</h2>
            <h4>{t('user_AverageAdminRating')}</h4>
            <h2 className="rating-title">0/5</h2>
            <div className="rating">
              <Rate disabled />
            </div>
            <h3>0 {t('user_Reviews')}</h3>
          </ANTDColumn>
          <ANTDColumn sm={12} xs={24}>
            <h2>{t('user_RatingsBreakDown')}:</h2>
            {newArray(RATING_LENGTH)?.map((_, index) => (
              <div className="rating-bar" key={index}>
                <div className="rating-num">
                  <span> {5 - index} </span>
                  <StarFilled />
                </div>
                <Progress
                  strokeColor={{
                    '0%': '#62c669',
                    '100%': '#62c669',
                  }}
                  strokeLinecap="circle"
                  percent={0}
                />
              </div>
            ))}
          </ANTDColumn>
        </ANTDRow>
      </div>
    </div>
  )
}

export default UserRating
