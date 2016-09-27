var at = require('AT').connect(Serial1);

var SERIAL = Serial1;
var SERIAL_BAUDRATE = 57600;
var SERIAL_PINS = { rx : A10, tx : A9};
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
    SERIAL.setup(SERIAL_BAUDRATE, SERIAL_OPTIONS);
}

var modeRandom = false;
var globalDuration = 500;

var cmdAndRespSet = [
  [ ["sys sleep"],  [ ["ok"] ] ],
  [ ["sys reset"], [ ["ok"] ] ],
  [ ["sys eraseFW"], [ ] ],
  [ ["sys factoryRESET" ], [ ["RN2483"] ] ],
  [ ["sys set nvm 300" ], [ ["ok"] , ["X25"] ] ],
  [ ["sys set nvm 800" ], [ ["invalid_param"] ] ],
  [ ["sys set pinmode GPIO0" ], [ ["ok"]    ] ],
  [ ["sys set pinmode GPIO20" ], [ ["invalid_param"]    ] ],
  [ ["sys set pindig GPIO0" ], [ ["ok"]    ] ],
  [ ["sys set pindig GPIO20" ], [ ["invalid_param"]    ] ],
  [ ["sys get ver" ],  [ ["RN2483"]  ] ],
  [ ["sys get nvm 300" ], [ ["0x00"] ] ],
  [ ["sys get nvm 800" ], [ ["invalid_param"] ] ],
  [ ["sys get vdd" ], [ ["1200"]  ] ],
  [ ["sys get hweui" ], [ ["00:00:00:00:00:00:00:00"]    ] ],
  [ ["sys get pindig GPIO0" ], [ ["1"]     ] ],
  [ ["sys get pindig GPIO20" ], [ ["invalid_param"]     ] ],
  [ ["sys get pinana GPIO5" ], [ ["527"]  ] ],
  [ ["sys get pinana GPIO" ], [ ["invalid_param"]  ] ],
  [ ["mac reset 868" ], [ ["ok"]  ] ],
  [ ["mac tx uncnf 1 Mon_message'" ], [ ["ok"], ["mac_tx_ok"]  ] ],
  [ ["mac tx uncnf 1 NonJoined" ], [ ["not_joined"]  ] ],
  [ ["mac tx join otaa" ], [ ["ok"],["accepted"]  ] ],
  [ ["mac forceENABLE" ], [ ["ok"]  ] ],
  [ ["mac pause" ], [ ["8739"] ] ],
  [ ["mac resume" ], [ ["ok"] ] ],
  [ ["mac setdevaddr 00000000" ], [ ["ok"] ] ],
  [ ["mac set deveui 0004A30B001A55ED" ], [ ["ok"] ] ],
  [ ["mac set appeui FEDCBA9876543210" ], [ ["ok"] ] ],
  [ ["mac set nwkskey 1029384756AFBECD5647382910DACFEB" ], [ ["ok"] ] ],
  [ ["mac set appskey A00112233445566778899AABBCCDDEEFFFBECD56473829100192837465FAEBDC" ], [ ["ok"] ] ],
  [ ["mac set appkey 00112233445566778899AABBCCDDEEFF" ], [ ["ok"] ] ],
  [ ["mac set pwridx 1" ], [ ["ok"] ] ],
  [ ["mac set dr 5" ], [ ["ok"] ] ],
  [ ["mac set adr off" ], [ ["ok"] ] ],
  [ ["mac set bat 175" ], [ ["ok"] ] ],
  [ ["mac set retx 3" ], [ ["ok"] ] ],
  [ ["mac set linkchk 10" ], [ ["ok"] ] ],
  [ ["mac set rxdelay1 1000" ], [ ["ok"] ] ],
  [ ["mac set ar no" ], [ ["ok"] ] ],
  [ ["mac set rx2 3 865000000" ], [ ["ok"] ] ],
  [ ["mac set sync 34" ], [ ["ok"] ] ],
  [ ["mac set upctr 10" ], [ ["ok"] ] ],
  [ ["mac set dnctr 30" ], [ ["ok"] ] ],
  [ ["mac set ch freq 13 864000000" ], [ ["ok"] ] ],
  [ ["mac set ch dcycle 13 9" ], [ ["ok"] ] ],
  [ ["mac set ch drrange 13 0 2" ], [ ["ok"] ] ],
  [ ["mac set ch status 4 off" ], [ ["ok"] ] ],
  [ ["mac get devaddr" ], [ ["00000000"] ] ],
  [ ["mac get deveui" ], [ ["00800000A4769C4D"] ] ],
  [ ["mac get appeui" ], [ ["00000000"] ] ],
  [ ["mac get dr" ], [ ["5"] ] ],
  [ ["mac get band" ], [ ["1"] ] ],
  [ ["mac get pwridx" ], [ ["1"] ] ],
  [ ["mac get adr" ], [ ["off"] ] ],
  [ ["mac get retx" ], [ ["7"] ] ],
  [ ["mac get rxdelay1" ], [ ["1000"] ] ],
  [ ["mac get rxdelay2" ], [ ["2000"] ] ],
  [ ["mac get ar" ], [ ["off"] ] ],
  [ ["mac get rx2 868" ], [ ["0 869525000"] ] ],
  [ ["mac get dcycleps" ], [ ["1"] ] ],
  [ ["mac get mrgn" ], [ ["255"] ] ],
  [ ["mac get gwnb" ], [ ["0"] ] ],
  [ ["mac get status" ], [ ["00000000"] ] ],
  [ ["mac get sync" ], [ ["34"] ] ],
  [ ["mac get upctr" ], [ ["0"] ] ],
  [ ["mac get dnctr" ], [ ["0"] ] ],
  [ ["mac get ch freq 0" ], [ ["868100000"] ] ],
  [ ["mac get ch dcycle 0" ], [ ["863000000"] ] ],
  [ ["mac get ch drrange 0" ], [ ["863000000"] ] ],
  [ ["mac get ch status 2" ], [ ["863000000"] ] ],
  [ ["radio set bt none" ], [ ["ok"] ] ],
  [ ["radio set mod lora" ], [ ["ok"] ] ],
  [ ["radio set freq 868300000" ], [ ["ok"] ] ],
  [ ["radio set pwr 14" ], [ ["ok"] ] ],
  [ ["radio set sf sf7" ], [ ["ok"] ] ],
  [ ["radio set afcbw 125" ], [ ["ok"] ] ],
  [ ["radio set rxbw 250" ], [ ["ok"] ] ],
  [ ["radio set bitrate 5000" ], [ ["ok"] ] ],
  [ ["radio set fdev 5000" ], [ ["ok"] ] ],
  [ ["radio set prlen 8" ], [ ["ok"] ] ],
  [ ["radio set crc on" ], [ ["ok"] ] ],
  [ ["radio set iqi on" ], [ ["ok"] ] ],
  [ ["radio set cr 4/5" ], [ ["ok"] ] ],
  [ ["radio set wdt 0" ], [ ["ok"] ] ],
  [ ["radio set sync 12" ], [ ["ok"] ] ],
  [ ["radio set bw 500" ], [ ["ok"] ] ],
  [ ["radio tx 6231" ], [ ["ok"] ] ],
  [ ["radio cw off" ], [ ["ok"] ] ],
  [ ["radio tx 68656c6c6f"], [ ["ok"] ] ]
/*  [ ["radio get " ], [ ["ok"] ] ]  [ ["radio rx " ], [ ["ok"] ] ],
    [ ["radio rx " ], [ ["ok"] ] ],*/
  ];

  initialiseModuleSerialCom();

for (var i in cmdAndRespSet) {
  
  at.registerLine(cmdAndRespSet[i][0], function() {
    var localDuration;
    console.log("trame détectée");
    if (modeRandom === false) {
      localDuration = globalDuration;
    } else {
      localDuration = Math.trunc(1000*Math.random());
    }
    setTimeout(function() {
      console.log("envoie de la réponse");
      //at.write(cmdAndRespSet[i][1][0]+"\r\n");
      
      for (var resp in cmdAndRespSet[i][1]) {
         at.write(cmdAndRespSet[i][1][resp]+"\r\n");
      }
      
    },localDuration);
  });

}
console.log("end of synchronous job");