#!/bin/bash

rm /var/run/pigpio.pid --force
pigpiod
/etc/init.d/lamp start

#test4