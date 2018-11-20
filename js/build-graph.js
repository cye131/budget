function buildGraph(history) {
            
    // Re-factor into array
    let tsData = [];
    Object.keys(history).forEach(function(acctName) {
        tsData.push({
            name: acctName,
            data: history[acctName],
            type: 'line'
        });
    });
    console.log('tsData', tsData);
    
    let options = {
        chart: {
            marginRight: 10,
            backgroundColor: 'rgba(225, 233, 240,.6)',
            plotBackgroundColor: '#FFFFFF',
            plotBorderColor: '#C0C0C0',
            //plotBorderWidth: 1,
            height: 400
        },
        title: {
            text: null
        },
        credits: {
            enabled: false
        },
        exporting :{
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        rangeSelector : {
            selected: 4,
            
            buttonTheme: {
                width:60
            },
            
            buttons: [
                {                                                 
                    type: 'month',
                    count: 1,
                    text: '1mo'
                },
                {                                                 
                type: 'month',
                    count: 3,
                    text: '3mo'
                },
                {
                    type: 'ytd',
                    count: 1,
                    text: 'YTD'
                },
                {
                    type: 'year',
                    count: 1,
                    text: '1Y'
                },
                {
                    type: 'all',
                    text: 'All'
                }
                ]
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { 
                day: "%b %e",
                week: "%b %e",
                month: "%b %Y"
            },
            gridLineWidth: 1,
        },
        yAxis: {
            title: {
                text: '',
            },
            opposite: true,
            min: 0
        },
        tooltip: {
            useHTML: true,
            formatter: function () {
                text = '';
                for (i = 0; i < this.points.length; i++) {
                    text += '<span style="font-weight:bold;color:'+this.points[i].series.color+'">' + this.points[i].series.name + ': </span>' +
                    this.points[i].y.toLocaleString('en-US', {style: 'currency',currency: 'USD',}) + '</br>';
                }
                return text;
            },
            shared: true
        },
        plotOptions: {
            series: {
                //compare: undefined,
                showInNavigator: true,
                dataGrouping: {
                        units: [[
                                'day',
                                [1]
                        ]]
                }
            },
            line: {
                turboThreshold: 0
            }
        },
        series: [
        ]
    };
    
    for (i=0;i<tsData.length;i++) {
        if (! ['Equity', 'Retirement Investments', 'Mid-Term Investments', 'Liquid Assets'].includes(tsData[i].name)) continue;
        options.series.push(tsData[i]);
    }
    console.log(options);
    
    new Highcharts.stockChart('tsChart', options);
    console.log($('#tsChart').highcharts());

}