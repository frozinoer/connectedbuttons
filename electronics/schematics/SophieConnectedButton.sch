EESchema Schematic File Version 2
LIBS:RN2483-I_RM095
LIBS:power
LIBS:device
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
EELAYER 25 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L RN2483-I/RM095 MODULE?
U 1 1 57F21329
P 3200 3050
F 0 "MODULE?" H 2600 4350 50  0000 L CNN
F 1 "RN2483-I/RM095" H 2600 1650 50  0000 L CNN
F 2 "MICROCHIP_RN2483-I/RM095" H 3200 3050 50  0001 L CNN
F 3 "Microchip" H 3200 3050 50  0001 L CNN
F 4 "13.85 USD" H 3200 3050 50  0001 L CNN "Price"
F 5 "Bad" H 3200 3050 50  0001 L CNN "Availability"
F 6 "Sub-GHz Dual Band Long Range Transceiver LoRa Module" H 3200 3050 50  0001 L CNN "Description"
F 7 "RN2483-I/RM095" H 3200 3050 50  0001 L CNN "MP"
F 8 "None" H 3200 3050 50  0001 L CNN "Package"
	1    3200 3050
	1    0    0    -1  
$EndComp
$Comp
L EspruinoPicoV1.4 EspruinoPico?
U 1 1 57F22B8D
P 8400 2850
F 0 "EspruinoPico?" H 7000 2900 60  0000 C CNN
F 1 "EspruinoPicoV1.4" V 7000 2350 60  0000 C CNN
F 2 "" H 7000 2350 60  0001 C CNN
F 3 "" H 7000 2350 60  0001 C CNN
	1    8400 2850
	1    0    0    -1  
$EndComp
$Comp
L LED LED2
U 1 1 57F22D22
P 5200 2850
F 0 "LED2" H 5200 2950 50  0000 C CNN
F 1 "VERT" H 5200 2750 50  0000 C CNN
F 2 "" H 5200 2850 50  0000 C CNN
F 3 "" H 5200 2850 50  0000 C CNN
	1    5200 2850
	1    0    0    -1  
$EndComp
$Comp
L LED LED1
U 1 1 57F22DA1
P 8850 3200
F 0 "LED1" H 8850 3300 50  0000 C CNN
F 1 "ROUGE" H 8850 3100 50  0000 C CNN
F 2 "" H 8850 3200 50  0000 C CNN
F 3 "" H 8850 3200 50  0000 C CNN
	1    8850 3200
	-1   0    0    -1  
$EndComp
$Comp
L R R2
U 1 1 57F22E18
P 8300 3200
F 0 "R2" V 8380 3200 50  0000 C CNN
F 1 "330" V 8300 3200 50  0000 C CNN
F 2 "" V 8230 3200 50  0000 C CNN
F 3 "" H 8300 3200 50  0000 C CNN
	1    8300 3200
	0    -1   -1   0   
$EndComp
$Comp
L R R1
U 1 1 57F22EB6
P 5750 2850
F 0 "R1" V 5830 2850 50  0000 C CNN
F 1 "330" V 5750 2850 50  0000 C CNN
F 2 "" V 5680 2850 50  0000 C CNN
F 3 "" H 5750 2850 50  0000 C CNN
	1    5750 2850
	0    -1   -1   0   
$EndComp
$Comp
L GND #PWR?
U 1 1 57F2372D
P 7850 4150
F 0 "#PWR?" H 7850 3900 50  0001 C CNN
F 1 "GND" H 7850 4000 50  0000 C CNN
F 2 "" H 7850 4150 50  0000 C CNN
F 3 "" H 7850 4150 50  0000 C CNN
	1    7850 4150
	1    0    0    -1  
$EndComp
$Comp
L GND #PWR?
U 1 1 57F2374D
P 4000 4400
F 0 "#PWR?" H 4000 4150 50  0001 C CNN
F 1 "GND" H 4000 4250 50  0000 C CNN
F 2 "" H 4000 4400 50  0000 C CNN
F 3 "" H 4000 4400 50  0000 C CNN
	1    4000 4400
	1    0    0    -1  
$EndComp
Wire Wire Line
	4000 4250 4000 4400
Wire Wire Line
	7850 3950 7850 4150
$Comp
L SW_PUSH SW3
U 1 1 57F242DE
P 5650 3800
F 0 "SW3" H 5800 3910 50  0000 C CNN
F 1 "BT3" H 5650 3720 50  0000 C CNN
F 2 "" H 5650 3800 50  0000 C CNN
F 3 "" H 5650 3800 50  0000 C CNN
	1    5650 3800
	1    0    0    -1  
$EndComp
$Comp
L SW_PUSH SW1
U 1 1 57F2434D
P 5650 3500
F 0 "SW1" H 5800 3610 50  0000 C CNN
F 1 "BT1" H 5650 3420 50  0000 C CNN
F 2 "" H 5650 3500 50  0000 C CNN
F 3 "" H 5650 3500 50  0000 C CNN
	1    5650 3500
	1    0    0    -1  
$EndComp
$Comp
L SW_PUSH SW2
U 1 1 57F243D6
P 5650 3250
F 0 "SW2" H 5800 3360 50  0000 C CNN
F 1 "BT2" H 5650 3170 50  0000 C CNN
F 2 "" H 5650 3250 50  0000 C CNN
F 3 "" H 5650 3250 50  0000 C CNN
	1    5650 3250
	1    0    0    -1  
$EndComp
$Comp
L SW_PUSH SW4
U 1 1 57F24463
P 8350 3500
F 0 "SW4" H 8500 3610 50  0000 C CNN
F 1 "BT4" H 8350 3420 50  0000 C CNN
F 2 "" H 8350 3500 50  0000 C CNN
F 3 "" H 8350 3500 50  0000 C CNN
	1    8350 3500
	1    0    0    -1  
$EndComp
$Comp
L CP C?
U 1 1 57F246E2
P 4400 2100
F 0 "C?" H 4425 2200 50  0000 L CNN
F 1 "CP" H 4425 2000 50  0000 L CNN
F 2 "" H 4438 1950 50  0000 C CNN
F 3 "" H 4400 2100 50  0000 C CNN
	1    4400 2100
	1    0    0    -1  
$EndComp
Wire Wire Line
	7850 3200 8150 3200
Wire Wire Line
	8450 3200 8650 3200
Wire Wire Line
	7850 3350 8050 3350
Wire Wire Line
	8050 3350 8050 3500
Wire Wire Line
	9300 2450 9300 3950
Wire Wire Line
	9300 3200 9050 3200
Wire Wire Line
	9300 3950 7850 3950
Wire Wire Line
	5950 3500 6050 3500
Wire Wire Line
	6050 3650 6200 3650
Wire Wire Line
	5950 3800 6200 3800
Wire Wire Line
	6050 3500 6050 3650
Wire Wire Line
	5950 3250 6150 3250
Wire Wire Line
	6150 3250 6150 3500
Wire Wire Line
	6150 3500 6200 3500
Wire Wire Line
	5900 2850 6000 2850
Wire Wire Line
	6000 2850 6000 3200
Wire Wire Line
	6000 3200 6200 3200
Wire Wire Line
	5400 2850 5600 2850
$Comp
L +3.3V #PWR?
U 1 1 57F25042
P 5350 3250
F 0 "#PWR?" H 5350 3100 50  0001 C CNN
F 1 "+3.3V" H 5350 3390 50  0000 C CNN
F 2 "" H 5350 3250 50  0000 C CNN
F 3 "" H 5350 3250 50  0000 C CNN
	1    5350 3250
	1    0    0    -1  
$EndComp
Wire Wire Line
	5350 3250 5350 3800
$Comp
L +3.3V #PWR?
U 1 1 57F250C6
P 8850 3650
F 0 "#PWR?" H 8850 3500 50  0001 C CNN
F 1 "+3.3V" H 8850 3790 50  0000 C CNN
F 2 "" H 8850 3650 50  0000 C CNN
F 3 "" H 8850 3650 50  0000 C CNN
	1    8850 3650
	1    0    0    -1  
$EndComp
Wire Wire Line
	8650 3500 8650 3650
Wire Wire Line
	8650 3650 8850 3650
Wire Wire Line
	4000 1950 4400 1950
Wire Wire Line
	4400 1850 4400 2000
Wire Wire Line
	4400 1850 4000 1850
$Comp
L GND #PWR?
U 1 1 57F2596A
P 4400 2250
F 0 "#PWR?" H 4400 2000 50  0001 C CNN
F 1 "GND" H 4400 2100 50  0000 C CNN
F 2 "" H 4400 2250 50  0000 C CNN
F 3 "" H 4400 2250 50  0000 C CNN
	1    4400 2250
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X03 P?
U 1 1 57F25994
P 8900 2800
F 0 "P?" H 8900 3000 50  0000 C CNN
F 1 "LOG Serial 1" V 9000 2800 50  0000 C CNN
F 2 "" H 8900 2800 50  0000 C CNN
F 3 "" H 8900 2800 50  0000 C CNN
	1    8900 2800
	1    0    0    -1  
$EndComp
Wire Wire Line
	7850 3050 8700 3050
Wire Wire Line
	8700 3050 8700 2900
Wire Wire Line
	7850 2900 8450 2900
Wire Wire Line
	8450 2900 8450 2800
Wire Wire Line
	8450 2800 8700 2800
Wire Wire Line
	8700 2700 8700 2450
Wire Wire Line
	8700 2450 9300 2450
Connection ~ 9300 3200
$Comp
L GND #PWR?
U 1 1 57F25E5C
P 4900 3000
F 0 "#PWR?" H 4900 2750 50  0001 C CNN
F 1 "GND" H 4900 2850 50  0000 C CNN
F 2 "" H 4900 3000 50  0000 C CNN
F 3 "" H 4900 3000 50  0000 C CNN
	1    4900 3000
	1    0    0    -1  
$EndComp
Wire Wire Line
	6200 3350 6100 3350
Wire Wire Line
	6100 3350 6100 1500
Wire Wire Line
	6100 1500 2400 1500
Wire Wire Line
	2400 1500 2400 2050
Wire Wire Line
	6650 2250 6650 1950
Wire Wire Line
	6650 1950 4900 1950
Wire Wire Line
	4900 1950 4900 2550
Wire Wire Line
	4900 2550 4000 2550
Wire Wire Line
	2400 2550 2300 2550
Wire Wire Line
	2300 2550 2300 1400
Wire Wire Line
	2300 1400 6800 1400
Wire Wire Line
	6800 1400 6800 2250
$Comp
L CONN_01X02 P?
U 1 1 57F26026
P 1850 2200
F 0 "P?" H 1850 2350 50  0000 C CNN
F 1 "Antenne" V 1950 2200 50  0000 C CNN
F 2 "" H 1850 2200 50  0000 C CNN
F 3 "" H 1850 2200 50  0000 C CNN
	1    1850 2200
	-1   0    0    -1  
$EndComp
Wire Wire Line
	2050 2150 2400 2150
Wire Wire Line
	2050 2250 2400 2250
Wire Wire Line
	5000 2850 4900 2850
Wire Wire Line
	4900 2850 4900 3000
$EndSCHEMATC
