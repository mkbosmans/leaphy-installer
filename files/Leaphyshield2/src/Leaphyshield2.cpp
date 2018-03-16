// Leaphyshield2.cpp
// suitable for Fundumoto Shield
// Copyright Science4Kids 2017
// version 1.0.0    1 February 2017

#include "Leaphyshield2.h"

float getDistance()
{
    float duration, distance;
    int tries = 0;
    
    pinMode(US_TRIG,OUTPUT);
    digitalWrite(US_TRIG,LOW);
    delayMicroseconds(2);
    digitalWrite(US_TRIG,HIGH);
    delayMicroseconds(10);
    digitalWrite(US_TRIG,LOW);
    do{
        duration = pulseIn(US_ECHO,HIGH,30000);
        distance = 0.034 * duration /2;
        if ( duration == 0 ) {
          delay(100);
          pinMode(US_ECHO, OUTPUT);
          digitalWrite(US_ECHO, LOW);
          delay(100);
          pinMode(US_ECHO, INPUT);  //echo pin reset
        }
      } while (duration == 0 && ++tries < 3);
  return(distance);
}

int getLineFollower(int fpSide)
{
 	if (fpSide == LEFT){
        return (digitalRead(LINE_LEFT));
        } else  if (fpSide == RIGHT){
        return (digitalRead(LINE_RIGHT));
        }
}

void setTone(int fpTone, int fpBeat)
{
	tone(TONE_PIN, fpTone, fpBeat);
}

void setMotor(int fpMotor, int fpSpeed)
{
	if (fpMotor == MOTOR_LEFT) // M1
    {
    	pinMode(M1_DIR,  OUTPUT);
    	pinMode(M1_PWM, OUTPUT);
    	if (fpSpeed > 0) {		// forward 
    		digitalWrite(M1_DIR,  TRUE); 		
	   	} else {				// reverse 
    		digitalWrite(M1_DIR,  FALSE);		
    	} 
		analogWrite(M1_PWM, abs(fpSpeed));
	} 
	if (fpMotor == MOTOR_RIGHT) // M2
	{
    	pinMode(M2_DIR,	OUTPUT); 
	pinMode(M2_PWM,	OUTPUT); 
    	if (fpSpeed > 0) {		// forward 
    		digitalWrite(M2_DIR,  TRUE); 		
	   	} else {				// reverse 
    		digitalWrite(M2_DIR,  FALSE); 		
    	}   
		analogWrite(M2_PWM, abs(fpSpeed));
	} 
}

void moveMotors(int fpDirection, int fpSpeed)
{
	switch (fpDirection)
	{
		case FORWARD:
		{
			setMotor(MOTOR_LEFT,  fpSpeed);
			setMotor(MOTOR_RIGHT, fpSpeed);
		}
		break;
		case BACKWARD:	
		{
			setMotor(MOTOR_LEFT,  -fpSpeed);
			setMotor(MOTOR_RIGHT, -fpSpeed);	
		}
		break;
		case LEFT:
		{
			setMotor(MOTOR_LEFT, -fpSpeed);
			setMotor(MOTOR_RIGHT, fpSpeed);
		}
		break;
		case RIGHT:
		{
			setMotor(MOTOR_LEFT,   fpSpeed);
			setMotor(MOTOR_RIGHT, -fpSpeed);
		}
		break;					
	} 
}

void setLed(int fpRed, int fpGreen, int fpBlue)
{
        analogWrite(LED1_RED, fpRed);
        analogWrite(LED1_GREEN, fpGreen);
        analogWrite(LED1_BLUE, fpBlue);
}

