// Leaphyshield2.js
// suitable for Fundumoto Shield
// Copyright Science4Kids 2017
// version 1.0.0    1 February 2017
(function(ext) {
	var idDict = [];
	var genNextID = function(realId, args){
		var nextID = (args[0] << 4) | args[1];
		idDict[nextID] = realId;
		return nextID;
	}
    // pin assignment for Fundumoto L298P motor shield with built in buzzer
    const M1_PWM = 10;
    const M1_DIR = 12;
    const M2_PWM = 11;
    const M2_DIR = 13;
    const TONE_PIN = 4;
    const LED1_RED = 6;
    const LED1_GREEN = 5;
    const LED1_BLUE = 3;
    const LINE_LEFT = 16;
    const LINE_RIGHT = 17;
    const US_ECHO = 8;
    const US_TRIG = 7;
    // end pin assignment
    var device = null;
    var _rxBuf = [];
    var ports = {
        Port1: 1,
        Port2: 2,
        Port3: 3,
        Port4: 4,
        Port5: 5,
        Port6: 6,
        Port7: 7,
        Port8: 8,
        	M1:9,
		M2:10
    };
    var sensors = {
        "Left" : 3,
        "Right" : 4
    };
//	var slots = {
//		Slot1:1,
//		Slot2:2
//	};
	var tones ={"B0":31,"C1":33,"D1":37,"E1":41,"F1":44,"G1":49,"A1":55,"B1":62,
			"C2":65,"D2":73,"E2":82,"F2":87,"G2":98,"A2":110,"B2":123,
			"C3":131,"D3":147,"E3":165,"F3":175,"G3":196,"A3":220,"B3":247,
			"C4":262,"D4":294,"E4":330,"F4":349,"G4":392,"A4":440,"B4":494,
			"C5":523,"D5":587,"E5":659,"F5":698,"G5":784,"A5":880,"B5":988,
			"C6":1047,"D6":1175,"E6":1319,"F6":1397,"G6":1568,"A6":1760,"B6":1976,
			"C7":2093,"D7":2349,"E7":2637,"F7":2794,"G7":3136,"A7":3520,"B7":3951,
                	"C8":4186,"D8":4699};
      var beats ={"Half":500,"Quarter":250,"Eighth":125,"Whole":1000,"Double":2000,"Zero":0};
	var values = {};
//	var indexs = [];
//	var startTimer = 0;
//	var versionIndex = 0xFA;
      ext.resetAll = function(){};
	ext.runArduino = function(){};	
	var SEND_DELAY = 0;
	function RESET_DICT(dict, key){
		dict[key] = false;
	}
	var runBotDict = {};
	ext.runBot = function(direction,speed) {
		var leftSpeed = 0;
		var rightSpeed = 0;
            // if speed is negative then oppose direction
            if ((direction=="run forward") && (speed < 0)){
                direction = "run backward";
                speed = -speed;
            }
            if ((direction=="run backward") && (speed < 0)){
                direction = "run forward";
                speed = -speed;
            }
            if ((direction=="turn left") && (speed < 0)){
                direction = "turn right";
                speed = -speed;
            }
            if ((direction=="turn right") && (speed < 0)){
                direction = "turn left";
                speed = -speed;
            }
            // stop the motors prior to changing them
            runPackage(32,M1_PWM,leftSpeed);
            runPackage(32,M2_PWM,rightSpeed);
		var key = (leftSpeed << 16) | rightSpeed;
		if(runBotDict[key])return;
		runBotDict[key] = true;
		setTimeout(RESET_DICT, SEND_DELAY, runBotDict, key);
		if(direction=="run forward"){
			leftSpeed = speed;
			rightSpeed = speed;
                	runPackage(30,M1_DIR,1);
                  runPackage(30,M2_DIR,1);	    
		}else if(direction=="run backward"){
			leftSpeed = speed;
			rightSpeed = speed;
                	runPackage(30,M1_DIR,0);
                  runPackage(30,M2_DIR,0);	    
		}else if(direction=="turn left"){
			leftSpeed = 0;       //with one motor stopped
			rightSpeed = speed;
                	runPackage(30,M1_DIR,0);
                  runPackage(30,M2_DIR,1);	    
		}else if(direction=="turn right"){
			leftSpeed = speed;
			rightSpeed = 0;      // with one motor stopped
                	runPackage(30,M1_DIR,1);
                  runPackage(30,M2_DIR,0);	    
		}
            runPackage(32,M1_PWM,leftSpeed);
            runPackage(32,M2_PWM,rightSpeed);
    };    
      var runMotorDict = {};
	ext.runMotor = function(port,speed) {
		if(typeof port=="string"){
			port = ports[port];
		}
		var key = (port << 16) | speed;
		if(runMotorDict[key])return;
		runMotorDict[key] = true;
		setTimeout(RESET_DICT, SEND_DELAY, runMotorDict, key);
		if(port == 9) {
               runPackage(32,M1_PWM,0);        // stop M1 prior to change
    	         if (speed > 0) {
	        	runPackage(30,M1_DIR,1);
        	   } else {
        	        runPackage(30,M1_DIR,0);
                    speed = -speed;
                    }
                 runPackage(32,M1_PWM,speed);
    	      } else {
                runPackage(32,M2_PWM,0);        // stop M2 prior to change
                if (speed > 0) {
                  runPackage(30,M2_DIR,1);	    
		  } else {
                  runPackage(30,M2_DIR,0);
                  speed = -speed;	    
        		}
                runPackage(32,M2_PWM,speed);
    	     }
      };
    var runBuzzerDict = {};
	ext.runBuzzer = function(tone,beat){
		if(typeof tone == "string"){
			tone = tones[tone];
		}
            if(typeof beat == "string"){
                  beat = beats[beat];
            }
		var key = tone;
		if(runBuzzerDict[key])return;
		runBuzzerDict[key] = true;
		setTimeout(RESET_DICT, SEND_DELAY, runBuzzerDict, key);
		runPackage(34,TONE_PIN,short2array(tone),short2array(beat));
	};
	var runLedDict = {};
	ext.runLed = function(red,green,blue){
            runPackage(32,LED1_RED,red);
            runPackage(32,LED1_GREEN,green);
            runPackage(32,LED1_BLUE,blue);
	};
	var distPrev=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var dist=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var dist_output =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	ext.getUltrasonic = function(nextID,port){
//	ext.getUltrasonic = function(nextID){
		var deviceId = 36;    //Arduino mode
		values[nextID] = function(v,extId){
			if(v<1){
				v = 0;
			}
		/*	distPrev[extId] = dist[extId];
			dist[extId] = v;
			if(Math.abs(dist[extId]-distPrev[extId])<400&&dist[extId]<400){
				dist_output[extId]-=(dist_output[extId]-dist[extId])*0.4;
			}else{
				dist[extId] = distPrev[extId];
			}*/
			return v;//dist_output[extId];
		}
		if(typeof port=="string"){
			port = ports[port];
		}
		nextID = genNextID(nextID, [port]);
		getPackage(nextID,deviceId,US_TRIG,US_ECHO);
	};
	ext.getLinefollower = function(nextID,sensor) {
		var deviceId = 30;
            var side = 0;
            if(typeof sensor=="string"){
                sensor = sensors[sensor];
            }
            if(sensor == 3){
                side = LINE_LEFT;
            } else {
                side = LINE_RIGHT;
            }
    		nextID = genNextID(nextID,[side]);
		getPackage(nextID,deviceId,side);
    };
/***************************************************************************/
	function runPackage(){
		var bytes = [0xff, 0x55, 0, 0, 2];
		for(var i=0;i<arguments.length;i++){
			if(arguments[i].constructor == "[class Array]"){
				bytes = bytes.concat(arguments[i]);
			}else{
				bytes.push(arguments[i]);
			}
		}
		bytes[2] = bytes.length-3;
		device.send(bytes);
	}

	var getPackDict = [];
	function getPackage(){
		var nextID = arguments[0];
		if(getPackDict[nextID])return;
		getPackDict[nextID] = true;
		setTimeout(RESET_DICT, SEND_DELAY, getPackDict, nextID);
		
		var bytes = [0xff, 0x55];
		bytes.push(arguments.length+1);
		bytes.push(nextID);
		bytes.push(1);
		for(var i=1;i<arguments.length;i++){
			bytes.push(arguments[i]);
		}
		device.send(bytes);
	}

    var inputArray = [];
	var _isParseStart = false;
	var _isParseStartIndex = 0;
    function processData(bytes) {
		var len = bytes.length;
		if(_rxBuf.length>30){
			_rxBuf = [];
		}
		for(var index=0;index<bytes.length;index++){
			var c = bytes[index];
			_rxBuf.push(c);
			if(_rxBuf.length>=2){
				if(_rxBuf[_rxBuf.length-1]==0x55 && _rxBuf[_rxBuf.length-2]==0xff){
					_isParseStart = true;
					_isParseStartIndex = _rxBuf.length-2;
				}
				if(_rxBuf[_rxBuf.length-1]==0xa && _rxBuf[_rxBuf.length-2]==0xd&&_isParseStart){
					_isParseStart = false;
					
					var position = _isParseStartIndex+2;
					var extId = _rxBuf[position];
					position++;
					var type = _rxBuf[position];
					position++;
					//1 byte 2 float 3 short 4 len+string 5 double
					var value;
					switch(type){
						case 1:{
							value = _rxBuf[position];
							position++;
						}
							break;
						case 2:{
							value = readFloat(_rxBuf,position);
							position+=4;
							if(value<-255||value>1023){
								value = 0;
							}
						}
							break;
						case 3:{
							value = readShort(_rxBuf,position);
							position+=2;
						}
							break;
						case 4:{
							var l = _rxBuf[position];
							position++;
							value = readString(_rxBuf,position,l);
						}
							break;
						case 5:{
							value = readDouble(_rxBuf,position);
							position+=4;
						}
							break;
					}
					if(type<=5){
						extId = idDict[extId];
						if(values[extId]!=undefined){
							responseValue(extId,values[extId](value,extId));
						}else{
							responseValue(extId,value);
						}
						values[extId] = null;
					}
					_rxBuf = [];
				}
			} 
		}
    }
	function readFloat(arr,position){
		var f= [arr[position],arr[position+1],arr[position+2],arr[position+3]];
		return parseFloat(f);
	}
	function readShort(arr,position){
		var s= [arr[position],arr[position+1]];
		return parseShort(s);
	}
	function readDouble(arr,position){
		return readFloat(arr,position);
	}
	function readString(arr,position,len){
		var value = "";
		for(var ii=0;ii<len;ii++){
			value += String.fromCharCode(_rxBuf[ii+position]);
		}
		return value;
	}
    function appendBuffer( buffer1, buffer2 ) {
        return buffer1.concat( buffer2 );
    }

    // Extension API interactions
    var potentialDevices = [];
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);

        if (!device) {
            tryNextDevice();
        }
    }

    function tryNextDevice() {
        // If potentialDevices is empty, device will be undefined.
        // That will get us back here next time a device is connected.
        device = potentialDevices.shift();
        if (device) {
            device.open({ stopBits: 0, bitRate: 115200, ctsFlowControl: 0 }, deviceOpened);
        }
    }

    var watchdog = null;
    function deviceOpened(dev) {
        if (!dev) {
            // Opening the port failed.
            tryNextDevice();
            return;
        }
        device.set_receive_handler('Leaphyshield2',processData);
    };

    ext._deviceRemoved = function(dev) {
        if(device != dev) return;
        device = null;
    };

    ext._shutdown = function() {
        if(device) device.close();
        device = null;
    };

    ext._getStatus = function() {
        if(!device) return {status: 1, msg: 'Leaphy disconnected'};
        if(watchdog) return {status: 1, msg: 'Probing for Leaphy'};
        return {status: 2, msg: 'Leaphy connected'};
    }

    var descriptor = {};
	ScratchExtensions.register('Leaphyshield2', descriptor, ext, {type: 'serial'});
})({});
