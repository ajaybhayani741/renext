import HightChart from '.'
import useTranslations from '../../hooks/useTranslations'
import { numberFormat } from '../../utils/customFunctions'
import { length } from '../../utils/javascript'
import TitleWithSelectFilter from '../dashboard/presentation/TitleWithSelectFilter'

const LineCharts = ({
  title,
  max = 200000,
  categories,
  series,
  showSelect,
  selectOption,
  defaultValue,
  onSelectChange,
  yAxisTitle,
  type,
  loading,
}) => {
  const { t } = useTranslations()
  const options = {
    // chart: {
    //   zoomType: 'x', // Enables zooming along the x-axis
    // },
    title: {
      text: showSelect ? '' : t(title),
      align: 'left',
    },
    subtitle: {
      text: '',
      align: 'left',
    },
    yAxis: {
      // min: 0,
      max: max,
      title: {
        text: yAxisTitle,
      },
      labels: {
        formatter: function () {
          return numberFormat(this.value)
        },
      },
    },
    credits: false,
    xAxis: {
      categories,
      accessibility: {
        // rangeDescription: 'Range: 2009 to 2023',
      },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        // pointStart: 2009,
      },
    },
    series: series?.map(item => ({
      ...item,
      name: t(item?.name),
    })),
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
    tooltip: {
      formatter: function () {
        return `<span style="font-size: 12px">
               ${this.point?.series?.name?.replace(/_/g, ' ')} : ${numberFormat(
                 this.point.y,
               )}
               </span>`
      },
    },
  }

  return (
    <>
      <HightChart
        options={options}
        header={
          showSelect ? (
            <TitleWithSelectFilter
              title={title}
              options={selectOption}
              defaultValue={defaultValue}
              onChange={onSelectChange}
              type={type}
            />
          ) : null
        }
        isLoader={length(options?.series) && !loading}
        loading={loading}
      />
    </>
  )
}

export default LineCharts
