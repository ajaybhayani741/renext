export const generateFrequencyBins = (
  data: any[],
  field: string,
  binSize: number,
  customMin?: number | string,
  customMax?: number | string,
) => {
  if (!data || data.length === 0 || binSize <= 0) return []

  const validValues = data.map(item => item[field] || 0).filter(val => val > 0)
  if (validValues.length === 0) return []

  const dataMin = Math.min(...validValues)
  const dataMax = Math.max(...validValues)

  const min =
    customMin !== undefined && customMin !== '' ? Number(customMin) : dataMin
  const max =
    customMax !== undefined && customMax !== '' ? Number(customMax) : dataMax

  if (min > max) return []

  const numBins = Math.max(1, Math.ceil((max - min + 1) / binSize))
  const bins: Record<number, number> = {}

  validValues.forEach(val => {
    if (val >= min && val <= max) {
      const binIndex = Math.floor((val - min) / binSize)
      bins[binIndex] = (bins[binIndex] || 0) + 1
    }
  })

  const result = []
  for (let i = 0; i < numBins; i++) {
    const start = min + i * binSize
    const end = Math.min(start + binSize - 1, max)

    // Only include bins that actually have data
    if (bins[i] && bins[i] > 0) {
      result.push({
        range: start === end ? `${start}` : `${start}-${end}`,
        hostels: bins[i],
      })
    }
  }

  return result
}

export const aggregateYesNoData = (
  data: any[],
  fieldsContext: { key: string; label: string }[],
) => {
  return fieldsContext.map(fc => {
    let yes = 0
    let no = 0
    data.forEach(item => {
      const val = item[fc.key]
      if (val === 'Yes' || val === true) yes++
      else if (val === 'No' || val === false) no++
    })
    return {
      variable: fc.label,
      item: fc.label, // some components use "item" instead of "variable"
      yesCount: yes, // for Variation in Food
      noCount: no,
      yes,
      no,
    }
  })
}

export const filterHostels = (
  data: any[],
  districtFilter: string,
  hostelFilter: string,
) => {
  let filtered = data
  if (districtFilter !== 'All') {
    filtered = filtered.filter(h => h.district === districtFilter)
  }
  if (hostelFilter !== 'All') {
    filtered = filtered.filter(h => h.hostelName === hostelFilter)
  }
  return filtered
}
