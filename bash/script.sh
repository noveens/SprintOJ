#!/bin/bash
g++ ./temp/code.cpp -std=c++11 -o $2
a="./testcases/"
b=$a$1
c=$b"/"
n=3
#for ((i=1; i<=$n; i++))
#do
	d=$c"in_"
	e=$d$2
	f=$c"out_"
	g=$f$2
	h="temp"$2
	./$2 < $e > $h
	echo $2
	diff $h $g | wc -l 
#done
rm $2 $h