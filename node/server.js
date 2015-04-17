var express = require('express');
var app = express();
var ArduinoFirmata = require('arduino-firmata');


var arduino = new ArduinoFirmata();
arduino.connect('/dev/cu.usbmodem1421');
 
arduino.on('connect', function(){
  console.log('board version' + arduino.boardVersion);
});

// Var who contain the value to guess
var valueToGuessArray = null;

app.get('/', function(req, res) {
	// Every code needs to print "Hello world"
    res.send('Hello World!');
}).get('/:param', function(req, res){
    var playerAnswer = req.param('param').split('');
    res.send(startGame(playerAnswer));
});

/**
* @function
* @name shutDownLEDs
* @desc Shuts down all LEDs
*
* @return null
*/

function shutDownLEDs() {
  var arrayLeds = new Array(2,3,4,5);
  for (var i = arrayLeds.length - 1; i >= 0; i--) {
    arduino.digitalWrite(arrayLeds[i], false);
  };

  arduino.digitalWrite(10, false);
  arduino.digitalWrite(11, false);
  arduino.digitalWrite(12, false);
  arduino.digitalWrite(13, false);
}

/**
* @function
* @name generateRandomVal
* @desc Generate a random value on four numbers
*
* @return the number generate in array
*/

function generateRandomVal() {
  
  var randNum = '';
  for (var i = 3; i >= 0; i--) {
      randNum += Math.floor((Math.random() * 9) + 1); 
  };
  console.log(randNum.split(''));

  return randNum.split('');
}


/**
* @function
* @name startGame
* @desc Ring the piezo buzzer
*
* @return array of results DELs
*/

function startGame(enteredNumber) {
  var win = true, delArray = new Array();

  if (enteredNumber[0] == valueToGuessArray[0]) {
   delArray.push({"del": true});
   arduino.digitalWrite(2, true);
   arduino.digitalWrite(10, true);
  } else {
   arduino.digitalWrite(2, false);
   arduino.digitalWrite(10, false);
   delArray.push({"del": false});
   win = false;
  }

  if (enteredNumber[1] == valueToGuessArray[1]) {
   arduino.digitalWrite(3, true);
   arduino.digitalWrite(11, true);
   delArray.push({"del": true});
  } else {
   arduino.digitalWrite(3, false);
   delArray.push({"del": false});
   arduino.digitalWrite(11, false);
   win = false;
  }

  if (enteredNumber[2] == valueToGuessArray[2]) {
   arduino.digitalWrite(4, true);
   delArray.push({"del": true});

   arduino.digitalWrite(12, true);
  } else {
   arduino.digitalWrite(4, false);
   delArray.push({"del": false});

   arduino.digitalWrite(12, false);
   win = false;
  }

  if (enteredNumber[3] == valueToGuessArray[3]) {
   arduino.digitalWrite(5, true);
   delArray.push({"del": true});

   arduino.digitalWrite(13, true);
  } else {
   arduino.digitalWrite(5, false);
   delArray.push({"del": false});

   arduino.digitalWrite(13, false);
   win = false;
  }

  if (win) {
    tone(true);
    valueToGuessArray = generateRandomVal();
    setTimeout(function() {
      shutDownLEDs();
    }, 1500);
    

  } else {
    tone(false);
  }

  return delArray;
}

/**
*
* Ring the piezo buzzer
*
*/

function tone(isUserWin) {
  // for (var i = 0; i < 90; i++) {
  //   var an = Math.floor(Math.random()*1023);
  //   arduino.analogWrite(9, an, null);
  //   setTimeout(function() {
  //       arduino.analogWrite(9, 0, null);
  //     }, 200);
  // }
  // var foo = setInterval(function(){
  //   var an = Math.floor(Math.random()*1023); // 0 ~ 255
  //   arduino.analogWrite(9, an, null);
  //   i++;
  // }, 100);
  // setTimeout(function() {
  //   clearInterval(foo);
  // }, 100);

  if (isUserWin) {
    for (var i = 0; i < 90; i++) {
     arduino.digitalWrite(9, false);
     arduino.digitalWrite(9, true);
      setTimeout(function() {
        arduino.digitalWrite(9, false);
      }, 200);
    };
  } else {
    for (var i = 0; i < 90; i++) {
     arduino.digitalWrite(9, true);
     arduino.digitalWrite(9, false);
     arduino.digitalWrite(9, true);
      setTimeout(function() {
        arduino.digitalWrite(9, false);
      }, 50);
    };
  }
  
}


// Start the node server
var server = app.listen(1280, function(){
    valueToGuessArray = generateRandomVal();
    
    console.log("server started");
});

