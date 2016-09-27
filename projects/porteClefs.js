/**
 * Logiciel écrit par Arnaud-François Fausse (c) 2016.
 * 
 * Ce logiciel est un produit dérivé du framework Espruino A-F. Fausse (c) 2016
 * A la mise sous tension (mise en place de la pile), le logiciel vérifie si le porte clef dispose des clefs LoRa permettant de communiquer. Il est initialement dans l'état "usine".
 * Si le porte-clefs ne sont pas présentes, alors le logiciel tente un enregistrement OTAA. En cas de succès, la led verte clignote pendant 5 secondes. Le porte-clef passe dans l'état "enregistré".
 * En cas d'échec, la led rouge clignote 5 secondes et le porte-clefs se met en état sommeil. Il se réveillera par la pression d'un des boutons. Dans ce cas, il vérifiera de nouveau si les clefs sont présentes et sinon, tentera de nouveau un OTAA. Le porte-clef reste dans l'état "usine".
 * Dans le cas du succès de l'enregistrement OTAA, en entrée de l'état "enregistré", le porte-clefs envoie un message de test de bonne communication avec le back-end. Si la communication fonctionne bien, alors le message "OK" est renvoyé en downlink (c'est le back-end qui crée le message et l'envoie pour retour). Le back-end doit renvoyer la réponse en moins de 500 ms. Si le OK arrive bien, le porte-clefs passe dans l'état "communicationPossible". Il se met en sommeil.
 * Si le "OK" n'arrive pas alors le porte-clefs se met en sommeil et se réveillera à la prochaine pression sur un bouton. Il reste dans l'état "enregistré". La led rouge clignote rapidement 10 fois à l'échec de réception du "OK".
 * 
 * Une fois le porte-clef passé dans l'état "communicationPossible", se met en sommeil et attend la prochaine pression d'un bouton.
 * A la pression d'un bouton, le porte-clefs se réveille : d'abord le microcontroleur hote (Espruino), puis le module radio RN2883, réveillé à son tour par l'Espruino. Pour réveiller le module radio, l'hote envoie une break.
 * 
 * Le porte-clefs surveille la tension de la batterie à chaque pression de bouton. En cas de pile faible, il déclenche un bip et un clignotement très rapide de la led rouge.

Codes d'erreur
  0 : Succès de la commande
 -1 : Tentative d'envoi de message dans un état différent de COM_POSSIBLE
 -2 : 
 */

/*********************************************************************************************
 * Imports 
 */
var at = require("AT").connect(Serial2);

/*********************************************************************************************
 * Déclarations et fonctions liées aux BOUTONS, aux LEDs et au BUZZER

 * Configuration matérielle
 * Le module radio RN2483 est connecté sur serial2
 * La led rouge est connectée sur B1
 * La led verte est connectée sur B15
 * le bouton 1 est connecté sur B14
 * le bouton 2 est connecté sur B13
 * le bouton 3 est connecté sur B3
 * le bouton 4 est connecté sur B4
 * le buzzer est connecté sur B5
 */
var LED_ROUGE = B1;
LED_ROUGE.mode("output");
var LED_VERTE = B15;
LED_VERTE.mode("output");
var LED_ON  = false;
var LED_OFF = true;

var BUZZER   = B5;
BUZZER.mode("output");
var BUZZER_ON  = false;
var BUZZER_OFF = true;

// ATTENTION si ces définitions changent, il faut aussi changer les fonctions qui suivent. Il y a des déclarations en "dur". 
var BOUTON_1  = B14;
pinMode(BOUTON_1, 'input_pulldown');
var BOUTON_2  = B13;
pinMode(BOUTON_2, 'input_pulldown');
var BOUTON_3  = B3;
pinMode(BOUTON_3, 'input_pulldown');
var BOUTON_4  = B4;
pinMode(BOUTON_4, 'input_pulldown');

/* BOUTON_1 Button action detection */
var toggleFilterB14 = false;
var pressB14 = false;
setWatch(function() {
  if (pressB14) return;
  pressB14=true;
  setTimeout(function(){pressB14=false;},100);
  toggleFilterB14 = !toggleFilterB14;
  if (toggleFilterB14 === true) {
    qMsgObj.enqueue("radio tx "+convertToHex("hello")+"\r\n");
  }
}, B14, { repeat: true, edge: "both" });

/* BOUTON_2 Button action detection */
var toggleFilterB13 = false;
var pressB13 = false;
setWatch(function() {
  if (pressB13) return;
  pressB13=true;
  setTimeout(function(){pressB13=false;},100);
  toggleFilterB13 = !toggleFilterB13;
  if (toggleFilterB13 === true) {
   qMsgObj.enqueue(convertToHex("radio tx b_2\r\n"));
  }
}, B13, { repeat: true, edge: "both" });

/* BOUTON_3 Button action detection */
var toggleFilterB3 = false;
var pressB3 = false;
setWatch(function() {
  if (pressB3) return;
  pressB3=true;
  setTimeout(function(){pressB3=false;},100);
  toggleFilterB3 = !toggleFilterB3;
  if (toggleFilterB3 === true) {
   qMsgObj.enqueue(convertToHex("radio tx b_3\r\n"));
  }
}, B3, { repeat: true, edge: "both" });

/* BOUTON_4 Button action detection */
var toggleFilterB4 = false;
var pressB4 = false;
setWatch(function() {
  if (pressB4) return;
  pressB4=true;
  setTimeout(function(){pressB4=false;},100);
  toggleFilterB4 = !toggleFilterB4;
  if (toggleFilterB4 === true) {
   qMsgObj.enqueue(convertToHex("radio tx b_4\r\n"));
  }
}, B4, { repeat: true, edge: "both" });

/**
 * Fonction qui donne le nom du bouton à partir de l'objet technique pinMode
 */
function getButtonName(button) {
    var buttonName;
    var port = button.getInfo().port;
    var num =  button.getInfo().num;
    var pin = button.getInfo().port+button.getInfo().num;
    logEvent(debug, pin);
    if (pin === "B14") { buttonName = "BOUTON_1";}
    if (pin === "B13") { buttonName = "BOUTON_2";}
    if (pin === "B3" ) { buttonName = "BOUTON_3";}
    if (pin === "B4" ) { buttonName = "BOUTON_4";}
    logEvent(debug, "buttonName : " + buttonName);
    return buttonName;
}

/**
 * Allume une LED 
 */
function turnOnLed(color) {
    digitalWrite(color, LED_ON);
    logEvent(debug, "Led turned on : " + color.getInfo().port + color.getInfo().num );
}

/**
 * Eteint une LED 
 */
function turnOffLed(color) {
    digitalWrite(color, LED_OFF);
    logEvent(debug, "Led turned off : " + color.getInfo().port + color.getInfo().num );
}

/**
 * Fait clignoter la LED de couleur "color" avec une période de "period" ms et pendant une durée de "duration" ms. Le nombre de clignotements est la durée divisée par la période divisée par 2
 */
function flashLed(color, period, duration) {
    var flasher = setInterval(function(c) {
                   var ledStatus = digitalRead(c);
                   ledStatus = !ledStatus;
                   digitalWrite(c, ledStatus);
                  }, period, color);
    setTimeout(function() {
      clearInterval(flasher);
      turnOffLed(color);
    }, duration);
}

/**
 * Cette fonction necessite l'initialisation des entrées sorties utilisées
 * Inverse l'état d'une LED.
 */
function toggle(ledToToggle) {
 ledStatus = digitalRead(ledStatus);
 ledStatus = !ledStatus;
 digitalWrite(ledToToggle, ledStatus);
}

/**
 * Allume le BUZZER 
 */
function turnOnBuzzer() {
    digitalWrite(BUZZER, BUZZER_ON);
    logEvent(debug, "Buzzer turned on");
}

/**
 * Eteint le BUZZER 
 */
function turnOffBuzzer(color) {
    digitalWrite(BUZZER, BUZZER_OFF);
    logEvent(debug, "Buzzer turned off");
}

/**
 * 
 */
function emitBip(duration) {
    turnOnBuzzer();
    setTimeout(function() {
      turnOffBuzzer();
    }, duration);
}

/*********************************************************************************************
 * Déclaration et Fonctions de communication pour le logger sur la ligne Serie Serial1
 * La ligne Serial1 est utilisée pour envoyer les messages de trace à un observateur externe et ainsi aider à debugger.
 */

var fatal   = { "level" : 0, "label" : "fatal" };
var erreur  = { "level" : 1, "label" : "erreur" };
var info    = { "level" : 2, "label" : "info" };
var debug   = { "level" : 3, "label" : "debug" };

var LOGGING_LEVEL; // Parmi : debug, info, erreur, fatal

var LOGGER = Serial1;
var LOGGER_BAUDRATE = 57600;
var LOGGER_PINS = { rx : B7, tx : B6 };
var LOGGER_OPTIONS = {
    "rx": LOGGER_PINS.rx,
    "tx": LOGGER_PINS.tx,
    "bytesize": 8,
    "parity": 'none',
    "stopbits": 1,
    "flow": 'none'
};

/**
 * L'initialisation du logger règle les conditions de transmission de l'UART Serial1 et de plus force le REPL sur Serial1. Ainsi il est possible aussi d'inspecter ce qui se passe au niveau des variables, voire de modifier le code. En cas de branchement de l'USB, la console REPL repasse sur l'USB.
 */
function initLogger() {
    console.log("Initialise le logger");
    LOGGER.setup(LOGGER_BAUDRATE, LOGGER_OPTIONS);
    //LOGGER.setConsole(force);
}

/**
 * Le logger enregistre tout évenement dont la gravité est supérieure ou égale au seuil défini par LOGGING_LEVEL
 * 
 */
function logEvent(logLevel, event) {
    if (logLevel.level <= LOGGING_LEVEL.level) {
        LOGGER.println(logLevel.label + " " + getTime()  + " " + event );
    }
}

/*********************************************************************************************
 * Déclaration et Fonctions de communication LoRa avec le module Microchip RN2483
 */

/** 
 * La ligne série Serial2 communique avec le module LoRa
 */
var SERIAL = Serial2;
var SERIAL_BAUDRATE = 57600;
var SERIAL_PINS = { rx : A3, tx : A2 };
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
    logEvent(debug, "Entrée dans initialiseModuleSerialCom");
    SERIAL.setup(SERIAL_BAUDRATE, SERIAL_OPTIONS);
}


/*****
 * Fonction de conversion en hexa d'une string
 */
function convertToHex(str) {
    logEvent(debug,"Entrée dans convertToHex");
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}

/******

Queue.js

A function to represent a queue

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

Adapted by Arnaud-François Fausse to add autodequeue function

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(worker) {

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;
  var pauseStatus = false;
  var workerReady = true;
  var theWorker = worker;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  };

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length === 0);
  };

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item) {
    logEvent(debug, "Entrée dans enqueue. Item : " + item);
    queue.push(item);
    this.autodequeue();
  };

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length === 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  };

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  };
  
  /**
   * 
   */
  this.autodequeue = function() {
    logEvent(debug, "Entrée dans autodequeue");
    var item = this.peek();
    if (item !== undefined) {
      if (moduleBusy === false) {
        theWorker(item);
      } else {
        // queueObj.emit('data');
      }
    }
  };
}

/**
 * Indicateur qui montre si le module radio est en cours de traitement d'une commande AT
 * true : le module est en cours de traitement, on ne peut rien lui envoyer
 * false : le module est libre, une nouvelle commande peut lui etre envoyée
 */
var moduleBusy;

/**
 * Créer la queue qui  va recevoir les messages envoyés par les bouton. A chaque pression de bouton, un message est placé dans le queue. Ce message est le nom du bouton. Par exemple : "BOUTON_1"
*/
var qMsg = new Queue(LoRaSendAndReceive);
var qMsgObj = new Object(qMsg);
qMsgObj.on('ready', function dequeue() {
  qMsg.autodequeue();
});

/** 
 * Cette fonction envoie une commande AT au module radio. Elle est appelée à partir du controleur de queue (fonction "dequeue"). On assure ainsi que les commandes sont bien sérialisées.
 */
function LoRaSendAndReceive(commandeAT) {
  
  logEvent(debug,"Entrée dans LoRaSendAndReceive");
  moduleBusy = true;
  logEvent(info, "Cmd AT : " + commandeAT);
  
  /* L'executeur du worker */
  at.cmd(commandeAT, 3000, function cb(d) {
    
    // Analyse de la réponse
   
    if (d===undefined) { // we timed out!
      logEvent(debug, "commandeAT en timeout : " + commandeAT);
      flashLed(LED_ROUGE, 50, 300);
    }
    
    if (d === "ok") {
      logEvent(debug,"Réponse module : ok");
      flashLed(LED_VERTE, 50, 300);
      qMsg.dequeue();
    }
    
    if (d !== "ok" && d !== undefined) {
       logEvent(debug, "Réponse du rn2483 : " + d);
    }
    
    moduleBusy = false;
    qMsgObj.emit('ready');
  });

}

/**
 * Cette fonction envoie le "message" et retourne le résultat de l'envoi et la charge utile de la réponse si l'envoi demandait une réponse en "downlink".
 */

/* Paramètres LoRa permettant de réaliser le join OTAA
 * - advaddr n'est pas déclarée car mise à jour par le réseau lors de l'OTAA
 * - DEV_EUI n'est pas initialisé car on utilise celui de Microchip (mis en usine)
 * - 
 *
 */
var DEV_EUI     = "0004A30B001A55ED";
var APP_EUI     = "FEDCBA9876543210";
var NTWS_KEY    = "1029384756AFBECD5647382910DACFEB";
var APP_KEY     = "00112233445566778899AABBCCDDEEFF";

/* Commandes utilisées dans les échanges avec le module. */
var RN2483_SYSFACTRST_CDM = "sys factoryRESET\r\n";
var RN2483_RST_CMD = "sys reset\r\n";
var RN2483_LORAMODE_CMD = "radio set mod lora\r\n";
var RN2483_SETFREQ_CMD = "radio set freq 863000000\r\n";
var RN2483_SETPWR_CMD = "radio set pwr 14\r\n";
var RN2483_SETSFT_CDM = "radio set sf sf7\r\n";
var RN2483_SETCRC_CMD = "radio set crc on\r\n";
var RN2483_SETCR_CMD = "radio set cr 4/5\r\n";
var RN2483_SETWDT_CMD = "radio set wdt 0\r\n";
var RN2483_SETSYNC_CMD = "radio set sync 12\r\n";
var RN2483_SETBW_CMD = "radio set bw 500\r\n";
var RN2483_SETPAUSE_CMD = "mac pause\r\n";

var RN2483_MACRSTBAND_CMD = "mac reset 868\r\n";
var RN2483_MACSETAPPEUI_CMD = "mac set appeui "+APP_EUI+"\r\n";
var RN2483_MACSETNWKSKEY_CMD = "mac set nwkskey "+NTWS_KEY+"\r\n";
var RN2483_SLEEP_CMD = "sys sleep\r\n";
var RN2483_SENDUNCONF_CMD = "mac tx uncnf 1 ";
var RN2483_MACSETADR_CMD = "mac set adr off\r\n";
var RN2483_MACSETPWIDX_CMD = "mac set pwridx 1\r\n";
var RN2483_JOINABP_CMD = "mac join abp\r\n";

var RN2483_GETVER_CMD = "sys get ver\r\n";
var RN2483_GETVDD_CMD = "sys get vdd\r\n";
var RN2483_GETHWEUI_CMD = "sys get hweui\r\n";
var RN2483_GETDR_CMD = "mac get dr\r\n";
var RN2483_GETCH_CMD = "mac get ch\r\n";
var RN2483_GETBAND_CMD = "mac get band\r\n";
var RN2483_GETRXD1F_CMD = "mac get rxdelay1\r\n";
var RN2483_GETRXD2_CMD = "mac get rxdelay2\r\n";
var RN2483_GETSTATUS_CMD = "mac get status\r\n";

var RN2483_SAVECONF_CMD = "\r\n";

/**
 * Cette fonction met le module en état de basse consommation électrique.
 */
function sleepRn2483() {
    logEvent(debug,"Entrée dans sleepRn2483");
    /* Met le module en état de sommeil */
    LoRaSendAndReceive(moduleSleepCmd);
}

/**
 * Cette fonction réveille le module et le met en état "pret à recevoir des commandes".
 * Le break met la ligne tx de la sortie série à 0 prendant le temps correspondant à l'émission de 2 octets en vitesse normale. Ainsi, si le baudrate est de 57600, le temps d'émission de 20 bits est de 20/57600 secondes, soit 20000/57600 ms (moins d'1 ms). Dans ce cas on met la durée du break à 1ms. A la fin du break la ligne série doit être reconfigurée (digitalWrite détruit la configuration de la ligne série).
 Suite au break, on remet la ligne série en fonctionnement et on peu déclarer le module pret à communiquer.
 * 
 */
function wakeUpRn2483() {
    logEvent(debug,"Entrée dans wakeUpRn2483");
  
    /* Met la ligne à 0 */
    digitalWrite(SERIAL_PINS.tx, 0);
  
    setTimeout(function() {
      /* Reconfigure la ligne série (ça fait aussi fait remonter la ligne tx à 1) */
      initialiseModuleSerialCom();
      /* Indique que le module est pret à communiquer */
      moduleBusy = false;
      /* Démarre le dépilage de la queue (concernant les messages qui y ont été placés quand le module (non initialisé) était donc busy */
      qMsgObj.emit('ready');
      
    }, 1);
}

/**
 * Initialise le module RN2483 pour le rendre pret à recevoir des commande d'envoi et de réception LoRa. A la sortie de cette routine, le module est dans l'état configuré et non busy. La ligne série associée est également initialisée. L'indicateur "moduleLoRaConfigured" indique si le module est bien configuré.
 */
var moduleLoRaConfigured;

function initRn2483() {
  
    logEvent(debug,"Entrée dans iniRn2483");
  
    /* Réveille et reset le module puis autorise la conversation avec lui*/
    wakeUpRn2483();
  
    qMsgObj.enqueue(RN2483_RST_CMD);
    /* Spécifie la bande des 868 MHz */
 
  
    qMsgObj.enqueue(RN2483_SYSFACTRST_CDM);
    qMsgObj.enqueue(RN2483_RST_CMD);
    qMsgObj.enqueue(RN2483_LORAMODE_CMD);
    qMsgObj.enqueue(RN2483_SETFREQ_CMD);
    qMsgObj.enqueue(RN2483_SETPWR_CMD);
    qMsgObj.enqueue(RN2483_SETSFT_CDM);
    qMsgObj.enqueue(RN2483_SETCRC_CMD);
    qMsgObj.enqueue(RN2483_SETCR_CMD);
    qMsgObj.enqueue(RN2483_SETWDT_CMD);
    qMsgObj.enqueue(RN2483_SETSYNC_CMD);
    qMsgObj.enqueue(RN2483_SETBW_CMD);
    qMsgObj.enqueue(RN2483_SETPAUSE_CMD);
    
    qMsgObj.enqueue(RN2483_MACRSTBAND_CMD);
    /* Déclare la clef réseau permettant de faire l'OTAA */
    qMsgObj.enqueue(RN2483_MACSETNWKSKEY_CMD);
    /* Sauve la configuration */ 

    /* Déclare la clef réseau permettant de faire l'OTAA */

    /* Sauve la configuration */
  
  
    /* Fait le join sur le réseau */
  
    /* Indique que le module est configuré */
    moduleLoRaConfigured = true;

}

/**
 * 
 */
function testCommunicationWithBackEnd() {
    /* Envoie le message de test */
	var alphanumTestMessage = "abcdefghijklmnopqrstuvwxyz01234567890";
	var binaryTestMessage = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];
}

/**
 * 
 */
function checkBattery() {
    
}

/*********************************************************************************************
 * Fonctions utiles au corps principal de l'application
 */

/**
 * Fait un regoupement des messages si les pressions sont réalisées dans un lap de temps de moins de 5 secondes; Il existe une première queue ou les pressboutons sont placés. 
 * Si la queue comporte moins de 10 pressboutons, alors on met le pressbouton dans la queue et on fait cligner la led verte une fois. Sinon, on jette le pressbouton et on fait clignoter la led rouge 1 fois. L'évennement est perdu.
 */

/* Pour une future version */


/*********************************************************************************************
 *********************************************************************************************
 * Corps principal de l'application
 * 
 */
var deviceState = "USINE";

function onInit() {
  
    moduleBusy = true;
  
    moduleLoRaConfigured = false;
    
    LOGGING_LEVEL=debug;
    initLogger();
    
    turnOffBuzzer();
    turnOffLed(LED_ROUGE);
    turnOffLed(LED_VERTE);
    
    initRn2483();
  
    logEvent(debug, "Synchronous job ended");
}
