import React from 'react'
import Chart from "react-apexcharts";

const ChartRealtime = ({admin,dispatch, authData}) => {
    let firstDayToToday = []
    let userCreated= []
    let postCreated = []

    if (admin.users.length > 0) {
        userCreated = admin.users.map(user => new Date(user.createdAt.slice(0,10)).getTime())
        postCreated = admin.posts.map(post => new Date(post.createdAt.slice(0,10)).getTime())
        const firstDay = admin.users[0].createdAt.slice(0,10)
        const today = new Date().getTime()

        let x = new Date(firstDay).getTime()
        
        while (x <= new Date(today).getTime()) {
            firstDayToToday.push(x)
            x += 60*60*24*1000
        }
    
    }

    const series = [
        {
        name: "New Users",
        data: 
            firstDayToToday.map(day => 
                ({
                    x: day,
                    y: userCreated.filter(date => date === day).length
                })
            )
        },
        {
        name: "New Posts",
        data: firstDayToToday.map(day => 
            ({
                x: day,
                y: postCreated.filter(date => date === day).length
            })
        )
        }
      ]

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
            text: 'Realtime Chart',
            align: 'left'
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'datetime',
            // range: XAXISRANGE,
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
    <Chart options={options} series={series} type="line" height={350} />
  )
}

export default ChartRealtime