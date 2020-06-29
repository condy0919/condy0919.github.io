---
layout: post
title: "enumerate subset"
categories: trick
tags: [trick]
---

* content
{:toc}

生成集合的所有子集
==================

## 基于2进制的方法
一开始2B的我直接想到是模拟2进制加法，一点一点加上去。这种方法在数据小的情况下速度是优良的，但稍大一点可能就吃不消了。而且在这个模拟的进程中，剪枝有一些限制，不能剪得彻底。

当需要有规律的2进制生成时，一个广为人知的code就是Gray code。它是以前用来发现数据错误的，其具有2个相邻子集只相差1个元素的性质。其实只要具有这种性质，都可以称之为Gray code。例如有2位2进制数，最具有美感的Gray code的生成方式为：

`G(x) = x ^ (x >> 1)`， 其中^为异或操作，>>是右移操作，它来源于对n维正方体的顶点用Gray code进制编码。以4位2进制数为例。

> 0000 0001 0011 0010 0110 0111 0101 0100 1100 1101 1111 1110 1010 1011 1001 1000

```cpp
for (int i = 0; i < (1 << 4); ++i)
    g = i ^ (i >> 1);
```

不过还一种方法，它按照选中的个数增加的方式来生成2进制数。称为banker's sequence。
这里先坑着，面包会有的。。。

这里再来一个比较风骚的写法。假设共有10个物品，枚举则可以这样写。

```cpp
int S = (1 << 10) - 1;
for (int i = S; i; i = (i - 1) & S)
    // do sth...
```

就这样是看不出来优点的，如果你已经把某些不可能的情况可剪枝掉了，即0b1110011111是全部的情况。只要将上面的S改变一下就行了。

## 基于数组的方法
向量的方式，比2进制的方法速度慢，只是它可以所针对的长度远高于2进制数的表示范围。
一般的构造方式都是这样：

```cpp
void subset(int a[], int cur, int n)
{
    if (cur == n) {
        // do sth...
        return;
    }

    a[cur] = 0;
    subset(a, cur + 1, n);

    a[cur] = 1;
    subset(a, cur + 1, n);
}
```

或许你看到了这个尾递归，想把它给优化掉，不过一般现在的C/C++编译器都支持尾递归优化了(-O2)。

上面这种方法是间接的通过一个数组来决定是否选择了元素。

还有一种比较特殊的情况，就是你要枚举的对象具有先后顺序、可比较的性质。故可以采用基于字典序来生成。例如你要枚举0 1 2这3个数的选中情况，直接对它们进行选取，不必应用中间数组。

主要思想就是：在当前的状态下选择1个比前1个元素刚刚大的元素，选择它，然后就遇到了相同的问题了，则显然递归。

以数字的来举例。

```cpp
void subset(int a[], int cur, int limit)
{
    // todo sth. print `array a', etc...

    int s = cur > 0 ? a[cur - 1] + 1: 0;
    for (int i = s; i < limit; ++i) {
        a[cur] = i;
        subset(a, cur + 1, limit)
    }
}
```

程序显得相当的简洁。:)

并且这个算法产生的序列是lexicographic，如果在每一个subset操作前都打印一下数组a，则显示的内容具有 'empty 0 01 012 02 1 12 2' 的形式。

看到了这个序列中相同长度的串从左到右都是递增的（这不是废话嘛？从subset中就可以看出来了）。如果从整个序列中拿出来，就可以更加明显地显示出它的特点。

以2位的为例：'01 02 12'，这就好比是1个{A, B, C}3个数的集合先出现了前2位，再出现了前后2位，最后产生后2位。如果把完整的2进制形式写出来，显得更加明显了。

'110' '101' '011'，这就是一步一步把1向右推进嘛。即此刻我们正在enumerate。并且enumerate的2进制形式中1的个数都是一样的。其实啊，这就是banker's sequence.只要将subset稍候改写一下，即可生成这些2进制序列。

```cpp
int length = 4;// the size of set

void output(int a[], int limit)
{
    int order[length];

    memset(order, 0, sizeof(order));
    for (int i = 0; i < limit; ++i)
        order[a[i]] = 1;
    for (int i = 0; i < length; ++i)
        cout << order[i];
    cout << endl;
}

void subset(int a[], int cur, int limit)
{
    if (cur == limit) {
        output(a, limit);
        return;
    }

    int start = cur > 0 ? a[cur - 1] + 1 : 0;
    for (int i = start; i < length; ++i) {
        a[cur] = i;
        subset(a, cur + 1, limit);
    }
}

int main()
{
    int a[length];
    for (int i = 0; i <= length; ++i)
        subset(a, 0, i);

    return 0;
}
```

The End.

## 总结
其实banker sequence与lexicographic sequence都是用了一个思想，把要enumerate的对象的位置给找到了，只不过banker sequence多了一步转换的过程。

## 参考
http://www.applied-math.org/subset.pdf
