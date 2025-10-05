export const setLineChartSeriesData = ({ respData, tempSeriesData, key }) => {
  if (respData?.data) {
    const series = respData?.data?.hostleAndCountNumberlist?.map(
      ({ countValue, numberOfHostels }) => [countValue, numberOfHostels],
    )
    const data = {
      series,
      total: respData?.data?.totalCount,
    }
    if (tempSeriesData) {
      tempSeriesData[key] = data
    } else {
      return data
    }
  }
}
