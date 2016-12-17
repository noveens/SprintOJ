#include<stdio.h>

int cmp(void *a, void *b)
{
	return *(int *)a - *(int *)b;
}

int main(void)
{
	int n;
	scanf("%d", &n);
	int arr[n],i,cum[n];
	for(i=0;i<n;i++)
		scanf("%d", &arr[i]);
	qsort(arr,n,sizeof(int),cmp);
	for(i=n-1;i>=0;i--)
	{
		if(i==n-1)
			cum[i]=arr[i];
		else
		{
			cum[i]=cum[i+1]+arr[i];
		}
	}
	for(i=0;i<n;i++)
		printf("%d ", cum[i]);
	printf("\n");
	return(0);
}
