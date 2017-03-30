var express = require('express')
var exec = require('child_process').exec;
var http = require('http');
var bodyParser = require('body-parser');


var app = express()
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({type: 'application/*+json'}));

app.get('/', function (req, res) {
  res.send(`
 <!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="smoothie.js"></script>
    <script type="text/javascript" src="jquery-3.2.0.min.js"></script>
    <script type="text/javascript">

      // Randomly add a data point every 500ms
      var random = new TimeSeries();


      
      function myYRangeFunction(range) {
  // TODO implement your calculation using range.min and range.max
  //var min = ...;
  //var max = ...;
  var min = 0;
  var max = 100;
  return {min: min, max: max};
}

      setInterval(function() {
        
		var dater = 'requesterino comrade';
		$.ajax({
			url: 'http://localhost:3000/endpoint',
			type: 'POST',
			//data: JSON.stringify(obj),
			data: "",
			ContentType: 'application/json',						
			success: function(data) {
				var stats = $.parseJSON(data);
				console.log('success');
				console.log(stats);
				console.log(stats.gpus[0]['utilization.gpu']);
        		random.append(new Date().getTime(), stats.gpus[0]['utilization.gpu']);
			}
		});

      }, 500);
      
      function createTimeline() {
                var windowWidth = $(window).width();
      
      $('#chart')[0].width = windowWidth;
      $('#chart')[0].height = windowWidth / 4;

      console.log($('canvas'))
        var chart = new SmoothieChart({millisPerPixel:20,labels:{fillStyle:'#000000'},grid:{sharpLines:true,verticalSections:8,fillStyle:'rgba(231,230,230,1)'}, timestampFormatter: SmoothieChart.timeFormatter,
        minValue: 0, maxValue: 100 });
        chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
        chart.streamTo(document.getElementById("chart"), 500);
      }
    </script>
  </head>
  <body onload="createTimeline()">


  <!-- http://bl.ocks.org/sirrobert/1203446 
  		Use this instead
  -->
    <canvas id="chart" width="" height=""></canvas>

  </body>
</html>
  `)
});

app.post('/endpoint', function(req, res){
	//var obj = {'this': 'that'};
	//console.log(obj);
	console.log(req.body);
  	//res.json(req.body);
	exec('gpustat', function(error, stdout, stderr) {
		console.log(stdout);
		res.send(stdout);
	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})