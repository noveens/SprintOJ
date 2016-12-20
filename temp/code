#include <stdio.h>

int power(int x, unsigned int y, int p)
{
    int res = 1;      // Initialize result
 
    x = x % p;  // Update x if it is more than or 
                // equal to p
 
    while (y > 0)
    {
        // If y is odd, multiply x with result
        if (y & 1)
            res = (res*x) % p;
 
        // y must be even now
        y = y>>1; // y = y/2
        x = (x*x) % p;  
    }
    return res;
}
 
// Driver program to test above functions
int main()
{
  int x,y,p;
  scanf("%d%d",&x,&y);
  p = 1000000007;
  printf("%u\n", power(x, y, p));
  return 0;
}
