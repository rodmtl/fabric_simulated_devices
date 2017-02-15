'use strict';

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var d3 = require('d3-random');

var connectionString = 'HostName=rodIndustries.azure-devices.net;DeviceId=Factory3;SharedAccessKey=zGpdOyCZ77x4EXDNQSlD5dGEgs/+LHjcIHY8G/TCqzQ=';
var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

var connectCallback = function(err) {
    var temp = d3.randomUniform(19,26)();
    console.log('temp: ' + temp);
    var humidity = d3.randomUniform(50,70)();
    console.log('humidity: ' + humidity);
    var mov = d3.randomUniform(0,1)();
    console.log('movement: ' + mov);
    var movement = false;
    if(mov>0.5)
      movement=true;
    else
      movement=false;

    if (err) {
        console.log('Could not connect: ' + err);
    } else {
        console.log('Client connected');
        //Send First Event    
       
        var data = JSON.stringify({ site: 'Factory3', temperature: temp, humidity: humidity, movement: movement });
        var message = new Message(data);
        message.properties.add("temperature", temp);
        message.properties.add("humidity", humidity);
        message.properties.add("movement", movement);  
        message.properties.add("site", "Factory3");                
        console.log("Sending message: " + message.getData());
        client.sendEvent(message, printResultFor('send'));
        // Create a message and send it to the IoT Hub {timeinterval}
        setInterval(function() {
          var temp = d3.randomUniform(19,26)();
          var humidity = d3.randomUniform(50,70)();            
          var mov = d3.randomUniform(0,1)();    
          var movement = false;
          if(mov>0.5)
            movement=true;
          else
            movement=false;
          var data = JSON.stringify({ site: 'Factory3', temperature: temp, humidity: humidity, movement: movement });
          var message = new Message(data);
          message.properties.add("temperature", temp);
          message.properties.add("humidity", humidity);
          message.properties.add("movement", movement);
          message.properties.add("site", "Factory3");  
          console.log("Sending message: " + message.getData());
          client.sendEvent(message, printResultFor('send'));
        }, 10000);
    }
};

client.open(connectCallback);
