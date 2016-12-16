#include<stdio.h>
int main(void)
{
	printf("100\n");
	int i,j;
	for(i=0;i<100;i++)
	{
		int x,y,z;
		x=rand()%10 + 1;
		y=rand()%x + 1;
		z=rand()%x + 1;
		printf("%d %d %d\n", x, y, z);
		for(j=0;j<x;j++)
		{
			int c=rand()%10 + 1;
			printf("%d ", c);
		}
		printf("\n");
		for(j=0;j<x;j++)
		{
			int c=rand()%10 + 1;
			printf("%d ", c);
		}
		printf("\n");
	}
}
