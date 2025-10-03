export const setLineChartSeriesData = ({ respData, tempSeriesData, key }) => {
  if (respData?.data) {
    const series = respData?.data?.hostleAndCountNumberlist?.map(
      ({ countValue, numberOfHostels }) => [countValue, numberOfHostels],
    )
    tempSeriesData[key] = {
      series,
      total: respData?.data?.totalCount,
    }
  }
}
