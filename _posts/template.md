---
layout: post
title: Machine Learning
categories: 研究学术
tags: [Andrew Ng, 课程笔记, 机器学习, Machine Learning]

---

Machine learning is the field of study that gives computers the ability to learn without being explicitly programmed.

## 线性回归（Linear Regression）

回归函数（hypothesis）：
\begin{equation}
h_\theta(x) = \theta^Tx = \theta_0x_0 + \theta_1x_1 + \cdots  + \theta_nx_n
\end{equation}

> 常数项$x_0 = 1$。
> 线性回归模型适用于多项式回归（polynomial regression），例如当$ x_1 = x, x_2 = x^2, x_3 = x^3, \ldots $时。

代价函数（cost function）：
\begin{equation}
J(\theta) = \frac{1}{2m}\sum_{i=1}^{m}{\left(h\_{\theta}\left(x^{(i)}\right) - y^{(i)}\right)^2}
\label{eq:cost_function_linear_regression}
\end{equation}

> $m$为样本数量，$n$为特征数量。

###参数估计方法

\\[
\min_\theta J(\theta)
\\]

梯度下降法（gradient descent）：

Repeat {
\\[
\theta_j := \theta_j - \alpha\frac{\partial}{\partial\theta_j}J(\theta)~~~~~~(j = 0, 1, \ldots, n)
\\]
}

也就是：

Repeat {
\\[
\theta_j := \theta_j - \alpha\frac{1}{m}\sum_{i=1}^m\left(h\_\theta\left(x^{(i)}\right)-y^{(i)}\right)x_j^{(i)}~~~~~~(j = 0, 1, \ldots, n)
\\]
}

> 每轮循环的时候同时更新$\theta_j$（不能在同一轮循环中，先更新部分$\theta_j$，再利用已更新的$\theta_j$更新其它$\theta_j$）。

* 线性回归的代价函数$J(\theta)$不存在局部极值（local optima）。
* 将所有特征归一（feature scaling）到统一的尺度$-1\le x_i\le 1$有助于提高梯度下降法的速度（不要把$x_0$归一化）。
* 学习率$\alpha$太小收敛慢，太大可能错过极值点而不收敛。

归一化方法1：

\\[
\hat {x_i} = \frac{x_i - x\_{mean}}{x_{max}-x\_{min}}
\\]

归一化方法2：

\\[
\hat {x_i} = \frac{x_i - x\_{mean}}{x_{std}}
\\]


也可用正规方程求解（normal equation）参数：

\begin{equation}
\theta = \left(X^TX\right)^{-1}X^Ty
\end{equation}

> 这也是线性回归的最小二乘解。

处理$X^TX$不可逆的方法：   

* 冗余特征（redundant features）线性相关：……。
* 特征数目过多（e.g. $m \le n$）：删除特征、正则化（regularization）。


Matlab Code：
{% highlight matlab %}
pinv(X' * X) * X' * y
{% endhighlight %}

Gradient Descent | Normal Equation
---------------- | ---------------
需要$\alpha$ | 不需要$\alpha$
需要迭代 | 不需要迭代
当特征数$n$很大时（$10^6$）工作良好        | $n$很大时很慢

## Logistic 回归（Logistic Regression）

Logistic 回归用于解决二分类问题，而非回归问题。

回归模型：

\begin{equation}
h_\theta(x) = g\left(\theta^Tx\right)
\end{equation}

> 若$h\_\theta(x) \ge 0.5$，则$y = 1$；若$h\_\theta(x) < 0.5$，则$y = 0$。

其中：
\begin{equation}
g\left(z\right) = \frac{1}{1 + e^{-z}}
\end{equation}

> 上式也称为sigmoid function、logistic function。

代价函数：

\begin{equation}
J(\theta) = -\frac{1}{m}\sum_{i=1}^{m}\left(y^{(i)}\log h\_\theta\left(x^{(i)}\right)+\left(1-y^{(i)}\right)\log \left(1-h\_\theta\left(x^{(i)}\right)\right)\right)
\end{equation}

> 若套用线性回归的代价函数\eqref{eq:cost_function_linear_regression}，则$J(\theta)$非凸，不利于优化算法。该代价函数可从统计中最大似然估计（maximum likehood estimation）的角度推导。

### 参数估计方法

\\[
\min_\theta J(\theta)
\\]

梯度下降法（gradient descent）：

Repeat {
\\[
\theta_j := \theta_j - \alpha\frac{1}{m}\sum_{i=1}^m\left(h\_\theta\left(x^{(i)}\right)-y^{(i)}\right)x_j^{(i)}~~~~~~(j = 0, 1, \ldots, n)
\\]
}

> 这貌似线性回归的梯度下降法，但$h_\theta$的定义不同。

其它优化算法：

* Conjugate gradient
* BFGS
* L-BFGS

> 其它优化算法不需要手工选择学习率$\alpha$，通常也更快，但是更复杂。

### 处理多分类问题（One-vs-all）

* 针对每一类训练一个logistic 分类器$h_\theta^{(i)}(x)$，这是第$i$类与其它类别的二分类问题。
* 新输入$x$所属的类别满足$\max_ih_\theta^{(i)}(x)$（属于概率最大的那个类别）。


## 正则化（Regularization）

过拟合（overfitting）：出色的拟合训练集却不能合适的拟合新数据。

解决过拟合问题的方法：

* 减少特征数目：手工选择特征、利用模型选择。
* 正则化方法：保留所有特征，但是减小$\theta_j$，使特征对预测$y$贡献小。

### 正则化线性回归

代价函数：

\begin{equation}
J(\theta) = \frac{1}{2m}\left( \sum_{i=1}^m\left( h\_\theta\left(x^{(i)}\right) - y^{(i)} \right)^2 + \lambda\sum\_{j=1}^n\theta_j^2 \right)
\end{equation}

> 增大$\lambda$以减小过拟合；但是，$\lambda$过大（$10^{10}$）时，有$\theta_j\approx 0~~(j = 1,2,\ldots,n)$，则$h_\theta(x) = \theta_0$，这会导致欠拟合（underfitting）。

梯度下降法估计参数：

Repeat {
\\[
\begin{aligned}
\theta_0 &amp; := \theta_0 - \alpha\frac{1}{m}\sum_{i=1}^m\left( h\_\theta\left(x^{(i)}\right) - y^{(i)} \right)x_0^{(i)} \\\   
\theta_j &amp; := \theta_j - \alpha\left(\frac{1}{m}\sum\_{i=1}^m\left( h\_\theta\left(x^{(i)}\right) - y^{(i)} \right)x_j^{(i)} + \frac{\lambda}{m}\theta_j\right)~~~~~~(j = 1, 2, \ldots, n)
\end{aligned}
\\]
}

> 正则化只作用于$j\ge 1$的非常数项。
	
迭代过程可以化为如下形式：
\begin{equation}
\theta_j := \theta_j\left(1 - \alpha\frac{\lambda}{m} \right) - \alpha\frac{1}{m}\sum\_{i=1}^m\left( h\_\theta\left(x^{(i)}\right) - y^{(i)} \right)x_j^{(i)}~~~~~~(j = 1, 2, \ldots, n)
\end{equation}

通常$1 - \alpha\frac{\lambda}{m} < 1$，与非正则化的梯度下降法比较，$\theta_j$减小。

正规方程估计参数：

\begin{equation}
\theta = \left(X^TX + \lambda
\begin{vmatrix}
0  &amp;   &amp;        &amp; \\\
   &amp; 1 &amp;        &amp; \\\
   &amp;   &amp; \ddots &amp; \\\
   &amp;   &amp;        &amp; 1
\end{vmatrix}
\right)^{-1}X^Ty
\end{equation}

### 正则化Logistic 回归

代价函数：

\begin{equation}
J(\theta) = -\frac{1}{m}\sum_{i=1}^{m}\left(y^{(i)}\log h\_\theta\left(x^{(i)}\right)+\left(1-y^{(i)}\right)\log \left(1-h\_\theta\left(x^{(i)}\right)\right)\right) ＋ \frac{\lambda}{2m}\sum\_{j=1}^n\theta_j^2
\end{equation}

梯度下降法估计参数：

Repeat {
\\[
\begin{aligned}
\theta_0 &amp; := \theta_0 - \alpha\frac{1}{m}\sum_{i=1}^m\left( h\_\theta\left(x^{(i)}\right) - y^{(i)} \right)x_0^{(i)} \\\   
\theta_j &amp; := \theta_j - \alpha\left(\frac{1}{m}\sum\_{i=1}^m\left( h\_\theta\left(x^{(i)}\right) - y^{(i)} \right)x_j^{(i)} + \frac{\lambda}{m}\theta_j\right)~~~~~~(j = 1, 2, \ldots, n)
\end{aligned}
\\]
}

### 正则化Logistic 回归的实现

第一步：实现Logistic函数

{% highlight matlab %}
function g = sigmoid(z)
g = 1.0 ./ (1.0 + exp(-z));
end
{%  endhighlight %}

第二步：实现代价函数（包含梯度计算）

{% highlight matlab %}
function [J, grad] = costFunctionReg(theta, X, y, lambda)
m = length(y); % number of training examples
grad = zeros(size(theta));

sigmoid_y_predict = sigmoid(X * theta);
J = mean(-y .* log(sigmoid_y_predict) - (1 - y) .* log(1 - sigmoid_y_predict)) + ...
	(lambda / (2 * m)) * sum(theta(2:end) .^ 2);

delta_y = sigmoid_y_predict - y;
grad(1) = mean(delta_y .* X(:, 1));
grad(2:end) = (X(:, 2:end)' * delta_y + lambda * theta(2:end)) / m;
end
{%  endhighlight %}

第三步：估计参数

{% highlight matlab %}
initial_theta = zeros(size(X, 2), 1);
lambda = 1;
options = optimset('GradObj', 'on', 'MaxIter', 400);
[theta, J, exit_flag] = ...
	fminunc(@(t)(costFunctionReg(t, X, y, lambda)), initial_theta, options);
{%  endhighlight %}

## 神经网络（Neural Networks）

### 代价函数

\begin{equation}
\begin{aligned}
J(\Theta) = -\frac{1}{m} &amp; \sum_{i=1}^{m}\sum\_{k=1}^{K}\left(y_k^{(i)}\log \left(h\_\Theta\left(x^{(i)} \right) \right)\_k + \left(1 - y_k^{(i)}\right)\log\left(1 -  \left(h\_\Theta\left(x^{(i)} \right) \right)\_k \right) \right) \\\ 
+ \frac{\lambda}{2m} &amp;  \sum\_{l=1}^{L-1}\sum\_{i=1}^{s_l}\sum\_{j=1}^{s\_{l+1}}\left(\Theta\_{ji}^{(l)}\right)^2
\end{aligned}
\end{equation}

> $h_\Theta (x) \in \mathbb{R}^K$，$(h\_\Theta (x))_i$是第$i$个输出；$s_l$表示第$l$层神经元的个数（不含bias unit）；共$m$个样本，$K$个输出，$L$层。

### 参数估计方法

\\[
\min_\Theta J(\Theta)
\\]

BP算法（BackPropagation algorithm）

各层误差估计：
<!--
\begin{equation}
\left\\{
\begin{aligned}
\delta^{(L)} &amp;= a^{(L)} - y  \\\
\delta^{(i)} &amp;= \left(\Theta^{(i)} \right)^T\delta^{(i+1)} ~.*~ g'\left(z^{(i)}\right)~~~(i = 2, 4, \ldots, L-1)
\end{aligned}
\right.
\label{eq:error_bpxxx}
\end{equation}
-->

\begin{equation}
\delta^{(l)} = \left\\{
\begin{aligned}
&amp; a^{(l)} - y &amp; (l = L)~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\\
&amp; \left(\Theta^{(l)} \right)^T\delta^{(l+1)} ~.*~ g'\left(z^{(l)}\right) &amp; (l = L-1, L-2, \ldots, 2) 
\end{aligned}
\right. 
\label{eq:error_bp}
\end{equation}


> $g'\left(z^{(l)}\right) = a^{(l)} ~.*~ \left(1 - a^{(l)}\right)$；$z^{(l)} = \Theta^{(l)}a^{(l)}$；$\delta_j^{(l)}$表示第$l$层第$j$个节点的误差；对于bias节点$\delta_0^{(l)}=0$。

BP算法步骤：

训练集：$\left\\{\left(x^{(1)}, y^{(1)}\right),\ldots,\left(x^{(m)}, y^{(m)}\right)\right\\}$。

初始化：$\Delta _{ij}^{(l)} = 0$(对所有的$i,j,l$)。

For $i=1$ to $m$：

1. $a^{(1)} = x^{(i)}$；
2. 前向计算$a^{(l)}~~(l = 2, 3,\ldots, L)$；
3. 利用\eqref{eq:error_bp}反向计算误差；
4. $\Delta ^{(l)} := \Delta ^{(l)} + \delta^{(l+1)}\left(a^{(l)}\right)^T$（$a^{(l)}$向量也须补1）；
5. 计算$D_{ij}^{(l)} = \frac{\partial}{\partial \Theta\_{ij}^{(l)}}J(\Theta)$：

\\[
\begin{aligned}
D\_{ij}^{(l)} &amp; := \frac{1}{m}\Delta _{ij}^{(l)} + \frac{\lambda}{m}\Theta _{ij}^{(l)} &amp; (j \neq 0) \\\
D\_{ij}^{(l)} &amp; := \frac{1}{m}\Delta _{ij}^{(l)} &amp; (j = 0)
\end{aligned} 
\\]

算法技巧：矩阵展成（unroll）向量：

1. thetaVec = [Theta1(:); Theta2(:); Theta3(:)]；
2. 将向量化的待估参数作为costFunction的参数；
3. costFunction内部再将向量还原为矩阵计算梯度；
4. 梯度向量化输出DVec = [D1(:); D2(:); D3(:)]。

算法技巧：梯度检查（gradient checking）：

梯度检测方法也可推广到其它需要计算代价函数及其梯度的地方，比如logistic回归的代价函数。

{% highlight matlab %}
for i = 1 : n
   thetaPlus = theta;
   thetaPlus(i) = thetaPlus(i) + EPSILON;
   thetaMinus = theta;
   thetaMinus(i) = thetaMinus(i) – EPSILON;
   gradApprox(i) = (J(thetaPlus) – J(thetaMinus));
end
{% endhighlight %}

> theta 是$\Theta$的向量化，正常情况有gradApprox$\approx$DVec，通过比较gradApprox 与BP 算法所得DVec 的差距判断BP 算法的代价函数及其优化算法是否有subtle bugs。

{% highlight matlab %}
% If your backpropagation implementation is correct, then the relative difference will be small (less than 1e-9). 
diff = norm(gradApprox - DVec) / norm(gradApprox + DVec);
{% endhighlight %}

> 梯度检查应当在训练神经网络之前，可以通过构造一个新的较小规模的神经网络进行检验；若每次训练都检测梯度，速度很慢。


注意事项：

不可将$\Theta _{ij}^{(l)}$初始化为$0$，若初始化为$0$，每层的所有神经元都是一样的。随机数初始化$-\epsilon\leq\Theta _{ij}^{(l)}\leq\epsilon$，选择$\epsilon$的有效策略是根据每层神经元的数目取$\epsilon=\frac{\sqrt{6}}{\sqrt{L\_{in} + L\_{out}}}~(L\_{in} = s_l,L\_{out}=s\_{l+1})$，例如：

{% highlight matlab %}
Theta1 =  rand(10, 11) * (2 * INIT_EPSILON) - INIT_EPSILON;
Theta2 =  rand(1, 11) * (2 * INIT_EPSILON) - INIT_EPSILON;
{% endhighlight %}

## 问题

1. 特征归一化对正规方程估计线性回归参数有何影响？
2. 为何减少特征可以避免过拟合？
3. Any logical function over binary-valued (0 or 1) inputs $x_1$ and $x_2$ can be (approximately) represented using some neural network.
4. A two layer (one input layer, one output layer; no hidden layer) neural network can NOT represent the XOR function.



## 參考資料

<!--[Andrew	 Ng 的机器学习课程](https://class.coursera.org/ml-004/class/index) -->
[CS229 Machine Learning Course Materials](http://cs229.stanford.edu/materials.html)
