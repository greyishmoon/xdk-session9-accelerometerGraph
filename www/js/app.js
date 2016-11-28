var dpsX = [];   //dataPoints X coord. 
var dpsY = [];   //dataPoints X coord. 
var dpsZ = [];   //dataPoints X coord. 
var chart;
var startTime;

var watchID;
var accelerometerOptions = { frequency: 100 };  // Update every 2 seconds

function onAppReady() {
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
    
    //setup listener for the toggle switch
	$("#flipswitch").on("change", function() {
		
		if( $(this).val() == "on" ) startSensor();
		else if ( $(this).val() == "off" ) stopSensor();

	});
	
    //setup chart
    chart = new CanvasJS.Chart("chartContainer",{
        title :{
            text: "Accelerometer trace"
        },
        axisX: {						
            title: "Time (seconds)",
            valueFormatString: "#,.",
        },
        axisY: {						
            title: "Acceleration (m/s2)"
        },
        data: [
            {
                type: "line",
                showInLegend: true, 
                name: "series1",
                legendText: "X axis",
                dataPoints : dpsX
            },
            {
                type: "line",
                showInLegend: true, 
                name: "series2",
                legendText: "Y axis",
                dataPoints : dpsY
            },
            {
                type: "line",
                showInLegend: true, 
                name: "series3",
                legendText: "Z axis",
                dataPoints : dpsZ
            }
        ]
    });
}
document.addEventListener("app.Ready", onAppReady, false) ;


function startSensor() {
    //store start time in unixtime 
	startTime = Date.now();
	watchID = navigator.accelerometer.watchAcceleration( accelerometerSuccess, accelerometerError, accelerometerOptions);
}


function stopSensor() {
	navigator.accelerometer.clearWatch(watchID);
    // Empty array so next chart clean
    dpsX.length = 0;
    dpsY.length = 0;
    dpsZ.length = 0;
}

function accelerometerSuccess(acceleration) {
	
    updateChart(acceleration);
//	$('#sensorX').val(acceleration.x);
//	$('#sensorY').val(acceleration.y);
//	$('#sensorZ').val(acceleration.z);
//	$('#timestamp').val(convertTime(acceleration.timestamp));

}

function accelerometerError() {
   alert('Error');
}

function updateChart(acceleration) {
    //extract acceleration values
    xVal = acceleration.x;
    yVal = acceleration.y;
    zVal = acceleration.z;
		
    //x value is time since start 
    timeVal = Date.now() - startTime;
    //concert from milliseocnds to seconds (divide by a thousand)
    xVtimeValal = timeVal / 1000;

    //add them to the data points to draw
    dpsX.push({x: timeVal,y: xVal});
    dpsY.push({x: timeVal,y: yVal});
    dpsZ.push({x: timeVal,y: zVal});

    //don't let the chart get too big 
    //if there are more than 100 data points then start removing older data points
    if (dpsX.length >  100 )
    {
        dpsX.shift();	
        dpsY.shift();
        dpsZ.shift();
    }

    //redraw the chart
    chart.render();		
}