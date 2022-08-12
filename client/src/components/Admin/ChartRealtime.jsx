import React from 'react'

const ChartRealtime = () => {
    const series = [{
        data: data.slice()
      }]

    const options = {
        chart: {
            id: 'realtime',
            height: 350,
            type: 'line',
            animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
            }
            },
            toolbar: {
            show: false
            },
            zoom: {
            enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'Dynamic Updating Chart',
            align: 'left'
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'datetime',
            range: XAXISRANGE,
        },
        yaxis: {
            max: 24,
            min: 0
        },
        legend: {
            show: false
        },
    }  
    
    
    
  return (
    <div>ChartRealtime</div>
  )
}

export default ChartRealtime