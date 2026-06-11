export const setLineChartSeriesData = ({ respData, tempSeriesData, key }) => {
  if (respData?.data) {
    const series = respData?.data?.hostleAndCountNumberlist?.map(
      ({ countValue, numberOfHostels }) => [countValue, numberOfHostels],
    )
    const data = {
      series,
      total: respData?.data?.totalCount,
      highestCount: respData?.data?.highestCount,
    }
    if (tempSeriesData) {
      tempSeriesData[key] = data
    } else {
      return data
    }
  }
}

export const getHostelChartParams = hostelFilter => {
  if (hostelFilter === 'All') {
    return { allHostels: true }
  }

  if (hostelFilter) {
    return { hostelId: hostelFilter }
  }

  return {}
}
