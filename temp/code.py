#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

typedef long long int LL;

#define din(n) scanf("%d",&n)
#define dout(n) printf("%d\n",n)
#define llin(n) scanf("%lld",&n)
#define llout(n) printf("%lld\n",n)
#define strin(n) scanf(" %s",n)
#define strout(n) printf("%s\n",n)

int mod=1000000007;

long long po(long long x, long long y)
{
	long long pro=1;
	while(y>0)
	{
		if(mod==1)
			return(0);
		else if(y&1 != 0)
			pro=((pro%mod)*(x%mod))%mod;
		x=(x*x)%mod;
		y=y>>1;
	}
	return pro;
}

int main(void)
{
	long long a,b;
	llin(a);
	llin(b);
	long long ans = po(a,b);
	llout(ans);
	return(0);
}