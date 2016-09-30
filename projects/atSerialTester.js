
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

var SERIAL = Serial2;

SERIAL.setup(57600, SERIAL2_OPTIONS);

var at = require("AT").connect(SERIAL);

at.debug();

at.cmd("sys reset\r\n", 2000, function cb(d) {
  
  console.log(d);
  
  at.cmd("sys factoryRESET\r\n", 2000, function cc(e) {
  
  console.log(e);
  
});
  
});



