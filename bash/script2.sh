#!/bin/bash

if [$2 -eq ""]
then
	a="./view/questions/"$1
	aa="./testcases/"$1
	mkdir $aa
	mkdir $a
	cp "./view/questions/power/alert.png" "./view/questions/power/greenTick.jpg" "./view/questions/power/na.png" "./view/questions/power/redCross.png" $a

	n=3

	for ((i=1; i<=$n; i++))
	do
		g="./testcases/"$1
		b=$g"/in_"
		c=$b$i
		d=$g"/out_"
		e=$d$i

		touch $c $e
	done

else
	a="./view/contests/"$2
	aa="./testcases/"$2
	mkdir $aa
	mkdir $a
	cp "./view/questions/power/alert.png" "./view/questions/power/greenTick.jpg" "./view/questions/power/na.png" "./view/questions/power/redCross.png" $a

	n=3

	for ((i=1; i<=$n; i++))
	do
		g="./testcases/"$2
		b=$g"/in_"
		c=$b$i
		d=$g"/out_"
		e=$d$i

		touch $c $e
	done
fi