#include<stdio.h>
int main(){
	int i,a=0;int d=0,p,n;
	scanf("%d",&n);
	char s[n];
	scanf("%s",s);
	p=strlen(s);
	for(i=0;i<p;i++){
		if(s[i]=='A')a++;
		else d++;
	}
	if(a>d)printf("Anton\n");
	else if(d>a)printf("Danik\n");
	else printf("Friendship\n");
	return 0;
}
