#include<stdio.h>

int heap[100005];

int heapify(int n)
{
	int i;
	for(i=n/2;i>=1;i--)
	{
		heapify_(i, n);
	}
	return(0);
}

int heapify_(int s, int n)
{
	int max=s;
	if(2*s<=n && heap[2*s]>heap[max])
		max=2*s;
	if((2*s)+1<=n && heap[(2*s)+1]>heap[max])
		max=(2*s)+1;
	if(max!=s)
	{
		int temp=heap[s];
		heap[s]=heap[max];
		heap[max]=temp;
		heapify_(max, n);
	}
	return(0);
}

int main(void)
{
	int n,i;
	printf("how many elements in the heap?\n");
	scanf("%d", &n);
	printf("enter the elements:\n");
	for(i=1;i<=n;i++)
	{
		scanf("%d", &heap[i]);
		//if(i>=3)
		//	heapify_(i/2, n);
	}
	heapify(n);
	printf("max heap is:\n");
	for(i=1;i<=n;i++)
		printf("%d ", heap[i]);
	printf("\n");
	int x,m;
	printf("HOW MANY TIMES DO YOU WANT TO INSERT?\n");
	scanf("%d", &m);
	while(m--)
	{
		scanf("%d", &x);
		heap[n+1]=x;
		n++;
		if(n>=3)
			heapify_(n/2, n);
		heapify(n);
		printf("max heap is:\n");
		for(i=1;i<=n;i++)
			printf("%d ", heap[i]);
		printf("\n");
	}
	printf("heapsort:\n");
	int l=n;
	for(i=1;i<=l;i++)
	{
		printf("%d ", heap[1]);
		heap[1]=heap[n];
		n--;
		heapify_(1, n);
	}
	printf("\n");
	return(0);
}
