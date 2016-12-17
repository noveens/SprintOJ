#include<stdio.h>
#include<stdlib.h>

typedef struct node
{
	int val;
	struct node *left;
	struct node *right;
}node;

node *root=NULL;

int in[10004];

int insert(node *start, int n)
{
	if(root==NULL)
	{
		node *temp=(node *)malloc(sizeof(node));
		temp->val=n;
		temp->left=NULL;
		temp->right=NULL;
		root=temp;
	}
	else
	{
		if(n >= start->val)
		{
			if(start->right == NULL)
			{
				// insert node here
				node *temp=(node *)malloc(sizeof(node));
				temp->val=n;
				temp->left=NULL;
				temp->right=NULL;
				start->right=temp;
			}
			else
				insert(start->right, n);
		}
		else
		{
			if(start->left == NULL)
			{
				//insert node here
				node *temp=(node *)malloc(sizeof(node));
				temp->val=n;
				temp->left=NULL;
				temp->right=NULL;
				start->left=temp;
			}
			else
				insert(start->left, n);
		}
	}
	return(0);
}

int find(int n, node *start)
{
	if(start==NULL)
	{
		return(0);
	}

	if(n > start->val)
	{
		find(n, start->right);
	}
	else if(n < start->val)
	{
		find(n, start->left);
	}
	else
	{
		int i,sum=0;
		for(i=0;i<n;i++)
		{
			if(in[i]>=n)
				sum+=in[i];
		}
		return sum;
	}
}

int s=0;

int infix(node *start)
{
	if(start==NULL)
		return(0);
	infix(start->left);
	in[s]=start->val;
	s++;
	infix(start->right);
	return(0);
}

int main(void)
{
	int n,i,temp,j;
	scanf("%d", &n);
	for(i=0;i<n;i++)
	{
		scanf("%d", &temp);
		insert(root,temp);
	}
	for(i=0;i<n;i++)
		printf("%d ", in[i]);
	for(i=0;i<n;i++)
	{
		//int ans;
		//ans=find(in[i], root);
		//printf("%d\n", ans);
		int ans;
		for(j=i;j<n;j++)
			ans+=in[i];
		printf("%d\n", ans);
	}

	return(0);
}
