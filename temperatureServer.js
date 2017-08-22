//modified code from http://adilmoujahid.com/posts/2015/07/practical-introduction-iot-arduino-nodejs-plotly/
var serialport = require('serialport'),
    plotly = require('plotly')('userName','APIKey'),
    token = 'token';

var portName = '/dev/cu.usbmodem14611';

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const sp = new SerialPort(portName);
const parser = new Readline();
sp.pipe(parser);

// helper function to get a nicely formatted date string
function getDateString() {
    var time = new Date().getTime();
    // 36000000 is AEST (Australia Melbourne TimeZone)
    var datestr = new Date(time +36000000).toISOString().replace(/T/, ' ').replace(/Z/, '');
    return datestr;
}



var initdata = [{x:[], y:[], stream:{token:token, maxpoints: 5000}}];
var initlayout = {fileopt : "extend", filename : "temperature"};

plotly.plot(initdata, initlayout, function (err, msg) {
    if (err) return console.log(err)

    console.log(msg);
    var stream = plotly.stream(token, function (err, res) {
        console.log(err, res);
    });

    parser.on('data', function(input) {
      console.log(input);
        if(isNaN(input) || input > 1023) return;

    var streamObject = JSON.stringify({ x : getDateString(), y : input });
    console.log(streamObject);
    stream.write(streamObject+'\n');
    });
});
