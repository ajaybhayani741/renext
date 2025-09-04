import React from 'react'

import HightChart from '.'

const SankeyCharts = () => {
  const formateView = ({ name, id, virgin, pcr, className }) => {
    return `<div class=${className}>
        <h3>${name}</h3>
        <p>[${id}]</p>
         ${virgin ? `<p>Virgin : ${virgin}</p>` : ''}
        ${pcr ? `<p>Post Consumer recycled : ${pcr}</p>` : ''}
      </div>`
  }
  const options = {
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },
    credits: false,
    accessibility: {
      point: {
        valueDescriptionFormat: `{index}. {point.from} to {point.to},  {point.weight}.`,
      },
    },
    tooltip: {
      headerFormat: null,
      pointFormat:
        '{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight:.2f} ' +
        '',
      nodeFormat: '{point.name}: {point.sum:.2f} ',
    },
    series: [
      {
        keys: ['from', 'to', 'weight'],

        nodes: [
          {
            id: 'Scrap Vehicle 10034',
            dataLabels: {
              format: `${formateView({
                name: 'Scrap Vehicle',
                id: '10034',
              })}`,
              useHTML: true,
              x: 50,
              y: 1,
            },
          },
          {
            id: 'Scrap Vehicle 10101',
            dataLabels: {
              format: `${formateView({
                name: 'Scrap Vehicle',
                id: '10101',
              })}`,
              useHTML: true,
              x: 50,
              y: 1,
            },
          },
          {
            id: 'Scrap Vehicle 10108',
            dataLabels: {
              format: `${formateView({
                name: 'Scrap Vehicle',
                id: '10108',
              })}`,
              useHTML: true,
              x: 50,
              y: 1,
            },
          },
          {
            id: 'Recycle Job 29891',
            dataLabels: {
              format: `${formateView({
                name: 'Recycle Job',
                id: '29891',
              })}`,
              useHTML: true,
              x: 50,
              y: 1,
            },
          },
          {
            id: 'Recycle Job 29892',
            dataLabels: {
              format: `${formateView({
                name: 'Recycle Job',
                id: '29892',
              })}`,
              useHTML: true,
              x: 50,
              y: 1,
            },
          },
          {
            id: 'Recycle Job 29890',
            column: 1,
            offset: 83,
            dataLabels: {
              format: `${formateView({
                name: 'Recycle Job',
                id: '29890',
              })}`,
              useHTML: true,
              x: 50,
              y: 1,
            },
          },
          {
            id: 'Heat 31098',
            dataLabels: {
              format: `${formateView({
                name: 'Heat',
                id: '31098',
                virgin: 40,
                pcr: 60,
              })}`,
              useHTML: true,
              x: 80,
              y: -8,
            },
          },
          {
            id: 'Heat 31099',
            dataLabels: {
              format: `${formateView({
                name: 'Heat',
                id: '31099',
                virgin: 40,
                pcr: 60,
              })}`,
              useHTML: true,
              x: 80,
              y: -8,
            },
          },

          {
            id: 'Body:Part 40989',
            dataLabels: {
              format: `${formateView({
                name: 'Body:Part',
                id: '40989',
                virgin: 40,
                pcr: 60,
              })}`,
              useHTML: true,
              x: 78,
              y: 1,
            },
          },
          {
            id: 'Engine:Part 40990',
            dataLabels: {
              format: `${formateView({
                name: 'Engine:Part',
                id: '40990',
              })}`,
              useHTML: true,
              x: 50,
              y: 1,
            },
          },
          {
            id: 'Chassis:Part 40991',
            dataLabels: {
              format: `${formateView({
                name: 'Chassis:Part',
                id: '40991',
              })}`,
              useHTML: true,
              x: 50,
              y: 1,
            },
          },
          {
            id: 'Transmission:Part 40992',
            dataLabels: {
              format: `${formateView({
                name: 'Transmission:Part',
                id: '40992',
              })}`,
              useHTML: true,
              x: 68,
              y: 1,
            },
          },
          {
            id: 'Bumper:Part 40993',
            dataLabels: {
              format: `${formateView({
                name: 'Bumper:Part',
                id: '40993',
              })}`,
              useHTML: true,
              x: 50,
              y: 1,
            },
            column: 3,
          },
          {
            id: 'Steel 59089',
            dataLabels: {
              format: `<div class="text-end">
        <h3>${'Steel'}</h3>
        <p>Vehical Id : [59089]</p>
        <p>Virgin : 40</p>
        <p>Post Consumer recycled : 60</p>
      </div>
              `,
              useHTML: true,
              x: 0,
              y: 1,
            },
          },
          {
            id: 'Plastic 59089',
            dataLabels: {
              format: `<div class="text-end">
        <h3>${'Plastic'}</h3>
        <p>Vehical Id : [59089]</p>
      </div>`,
              useHTML: true,
              x: 50,
              y: 1,
            },
          },
        ],

        data: [
          ['Scrap Vehicle 10034', 'Recycle Job 29890 ', 12],
          ['Scrap Vehicle 10101', 'Recycle Job 29891', 14],
          ['Scrap Vehicle 10108', 'Recycle Job 29892', 18],

          ['Recycle Job 29890', 'Heat 31098', 12],
          ['Recycle Job 29891', 'Heat 31098', 14],
          ['Recycle Job 29892', 'Heat 31099', 18],

          ['Heat 31098', 'Body:Part 40989', 8],
          ['Heat 31098', 'Engine:Part 40990', 8],
          ['Heat 31098', 'Chassis:Part 40991', 10],
          ['Heat 31099', 'Transmission:Part 40992', 18],

          ['Body:Part 40989', 'Steel 59089', 8],
          ['Engine:Part 40990', 'Steel 59089', 8],
          ['Chassis:Part 40991', 'Steel 59089', 10],
          ['Transmission:Part 40992', 'Steel 59089', 18],
          ['Bumper:Part 40993', 'Plastic 59089', 10],
        ],
        type: 'sankey',
        name: 'Sankey demo series',
      },
    ],
  }
  return <HightChart {...{ options }} />
}

export default SankeyCharts
