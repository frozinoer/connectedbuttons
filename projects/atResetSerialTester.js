// PICO


  var SERIAL1_OPTIONS = {
      "rx": B7,
      "tx": B6,
      "bytesize": 8,
      "parity": null,
      "stopbits": 1,
      "flow": null
  };

  var SERIAL2_OPTIONS = {
      "rx": A3,
      "tx": A2,
      "bytesize": 8,
      "parity": null,
      "stopbits": 1,
      "flow": null
  };


  var SERIAL6_OPTIONS = {
      "rx": A12,
      "tx": A11,
      "bytesize": 8,
      "parity": null,
      "stopbits": 1,
      "flow": null
  };


  digitalWrite(A3,true);
  digitalWrite(A2,true);
  digitalWrite(B10,true);

  var SERIAL = Serial2;
  SERIAL.setup(57600, SERIAL2_OPTIONS);

  var at = require("AT").connect(SERIAL);

  //at.debug();

  at.registerLine("RN2483", function() {
      console.log("reset done");
      setTimeout(function() {
         at.cmd("mac get deveui\r\n", 1000, function cb(d) {
             console.log(d);
       });
      }, 2000);
  });

  setTimeout(function() {
    console.log("Attend avant reset");
    digitalWrite(B10, false);
    setTimeout(function() {
      digitalWrite(B10, true);
      console.log("reset lance");
    }, 500); 
  }, 3000);
  

