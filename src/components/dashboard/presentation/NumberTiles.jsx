import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import React from 'react'
import CountUp from 'react-countup'

import ANTDCard from '../../../shared/antd/ANTDCard'
import { numberFormat } from '../../../utils/customFunctions'
import { isEqual, ternary } from '../../../utils/javascript'

const NumberTiles = ({
  title,
  subtitle,
  count,
  color,
  footerTitle,
  disabled,
  icon,
  suffix,
  suffixElement,
  prefix,
  onClick,
  data,
  showStock,
  decimals = 0,
}) => {
  return (
    <ANTDCard
      className={`mb-10 text-center number-tiles ${ternary(
        disabled,
        'disable',
        '',
      )} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        backgroundColor: color,
        borderRadius: '10px',
        height: 'calc(100% - 10px)',
      }}
      onClick={onClick}
    >
      <div className="dash-icon">
        {icon && <img src={icon} alt={title} height={80} width={80} />}
      </div>
      <h4 className="f-weight-600">{title}</h4>
      {subtitle && <span>{subtitle}</span>}
      {count ? (
        <div className="d-flex mt-auto">
          <CountUp
            className="font-28 f-weight-600 mt-auto word-break"
            start={0}
            end={count}
            duration={2.75}
            suffix={suffix ? ` ${suffix}` : ''}
            prefix={prefix ? `${prefix} ` : ''}
            decimals={decimals}
            formattingFn={value =>
              `${prefix ? prefix : ''}${numberFormat(value)}${
                suffix ? suffix : ''
              }`
            }
          />
          {suffixElement}
        </div>
      ) : showStock ? null : (
        '__ __'
      )}
      {footerTitle && <p>{footerTitle}</p>}
      {showStock && (
        <>
          <h2>{data?.title || ''}</h2>
          <div
            className="d-flex"
            style={{ fontSize: 38, fontWeight: 'bold', marginTop: 0 }}
          >
            <div className="">
              {data?.current}{' '}
              {isEqual(data?.color, 'green') ? (
                <ArrowUpOutlined
                  style={{ color: data?.color, fontSize: 24, marginTop: 0 }}
                />
              ) : (
                <ArrowDownOutlined
                  style={{ color: data?.color, fontSize: 24, marginTop: 0 }}
                />
              )}
            </div>
            <div style={{ color: data?.color, fontSize: 18, marginTop: 20 }}>
              {data?.point}
            </div>
          </div>
          <div style={{ marginTop: 10, color: 'gray' }}>
            Previous {data?.previous}
          </div>
        </>
      )}
    </ANTDCard>
  )
}

export default React.memo(NumberTiles)
