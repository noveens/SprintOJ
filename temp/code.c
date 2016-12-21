#include<stdio.h>
int main(){
	int n;scanf("%d",&n);
	if(n==0){printf("1");}
	else if((n-1)%4==0){printf("8");}
	else if((n-2)%4==0){printf("4");}
	else if((n-3)%4==0){printf("2");}
	else if((n-4)%4==0){printf("6");}
	return 0;
}
