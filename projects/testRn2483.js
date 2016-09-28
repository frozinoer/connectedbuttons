

var SERIAL_BAUDRATE = 57600;
var SERIAL_PINS = { rx : A3, tx : A2};
var SERIAL_OPTIONS = {
    "rx": SERIAL_PINS.rx,
    "tx": SERIAL_PINS.tx,
    "bytesize": 8,
    "parity": 'none',
    "stopbits": 1,
    "flow": 'none'
};

/**
 * Initialise la ligne série
 */
function initialiseModuleSerialCom() {
    Serial2.setup(SERIAL_BAUDRATE, SERIAL_OPTIONS);
}


initialiseModuleSerialCom();

Serial2.on('data', function (data) {
  console.log(data);
});

Serial2.on('parity', function() {
  console.log("Oh no!");
});

Serial2.on('framing', function() {
  console.log("Oh no!");
});

console.log("end of synchronous job");

Serial2.println("sys reset");