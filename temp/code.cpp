#include<stdio.h>
main()
{
    int i,n,a,d;
    char s[100001];
    scanf("%d %s",&n,s);
    a=0;
    for(i=0;i<n;i++)
    {
        if(s[i]=='A')
            a++;
    }
    d=n-a;
    if(a>d)
        printf("Anton\n");
    else if(a<d)
        printf("Danik\n");
    else
        printf("Friendship\n");
}
