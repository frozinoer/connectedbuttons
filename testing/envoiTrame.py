#!/usr/bin/env python
# Marten Vijn BSD-license http://svn.martenvijn.nl/svn/LICENSE
#
# http://www.microchip.com/DevelopmentTools/ProductDetails.aspx?PartNO=dm164138
# http://thethingsnetwork.org/wiki/AddressSpace
#
# install pyserial and paho mqtt
# apt-get install mosquitto-clients pip python-serial
# pip install paho-mqtt 
# debug try:: 
# mosquitto_sub -v -t "nodes/<yourdevicehere>#" -h croft.thethings.girovito.nl

import time
import serial
import os
import re
#import paho.mqtt.publish as publish

writeconfig=1

# your devaddr here
devaddr="0000000"
device="nodes/"+devaddr

def picpu():
  msg="aa"
  return msg

def send(data):
	p = serial.Serial("/dev/ttyUSB0" , 57600 )
	p.write(data+"\x0d\x0a")
	data.rstrip()
	print(data)
	time.sleep(2)
	rdata=p.readline()
	rdata=rdata[:-1]
	print rdata
# debug
#	publish.single(device, rdata, hostname="croft.thethings.girovito.nl", protocol="publish.MQTTv311")

send("sys reset")
time.sleep(1)

if writeconfig is 1:
  time.sleep(1)
  send("mac set appeui 6D725A02F383A69B")
  send("mac set appkey D2851A6CAA6739B35A42048FE2886AB2")
  send("mac save")
  time.sleep(60)

send("mac join otaa")
time.sleep(20)
send("mac join otaa")
time.sleep(20)

while True:
  ## maybe add cputmp here on a pi
  msg=picpu()
#  msg="aa"	
  send("mac tx uncnf 1 "+msg)
  time.sleep(60)