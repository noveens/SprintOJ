#!/bin/bash
#echo "into .cpp"
a="./testcases/"
b=$a$1
c=$b"/"
#./testcases/1/
n=3
#for ((i=1; i<=$n; i++))
#do
echo $2
d=$c"in_"
e=$d$2
f=$c"out_"
g=$f$2
h="temp"$2
if ([ $3 == ".cpp" ] || [ $3 == ".c" ]); then
	if [ $3 == ".cpp" ]; then
	g++ ./temp/code.cpp -std=c++11 -o $2
	fi

	if [ $3 == ".c" ]; then
	gcc ./temp/code.c -o $2
	fi

	./$2 < $e > $h
	echo $2
	diff $h $g | wc -l 
	rm $2 $h
fi

if [ $3 == ".py" ]; then
	python ./temp/code.py < $e > $h
	echo $2
	diff $h $g | wc -l
	rm $2 $h
fi

