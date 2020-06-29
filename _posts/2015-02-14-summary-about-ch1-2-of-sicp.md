---
layout: post
title: SICP 第1、2章总结
categories: note
tags: summary
usemathjax: true
---

* content
{:toc}

## 求解$\sqrt{x}$
这是一个非常简单的问题，可能会用二分法来解决它

```cpp
double mysqrt(double x) {
    double lo = 0, hi = x;
    while (fabs(hi - lo) > eps) {
        double mid = (lo + hi) / 2;
        if (mid * mid < x)
            lo = mid;
        else
            hi = mid;
    }
    return lo;
}
```

不过它的迭代次数有点多。

或者选择了牛顿法

```cpp
double mysqrt(double x) {
    double guess = x;
    while (fabs(guess * guess - x) > eps)
        guess = (guess + x / guess) / 2;
    return guess;
}
```

再或者，选择了求$f(x) = \frac{y}{x}$的[不动点](http://en.wikipedia.org/wiki/Fixed_point_%28mathematics%29)。

```cpp
std::function<double(double)> average_damp(std::function<double(double)> f) {
    return [f](double x) { return (x + f(x)) / 2.0; };
}

double fixed_point(std::function<double(double)> f) {
    double x = 1, nx;
    while (nx = f(x), fabs(nx - x) > eps)
        x = nx;
    return x;
}

double mysqrt(double x) {
    return fixed_point(average_damp([](double x) { return 2.0 / x; }));
}
```

如果想要求$\sqrt[n]{x}$的话，应用fixed point需要将原函数f(x)求至少$\log_{2}{n}$次average\_damp，或许采用了抽象的方式来写,

```cpp
template<typename T, typename U, typename V>
auto compose(std::function<V(U)> f, std::function<U(T)> g) {
    return std::function<V(T)>([=](T&& x) { return f(g(std::forward<T>(x))); });
}

template<typename T>
auto repeat(int n, std::function<T(T)> f) {
    if (n == 1)
        return f;
    return compose(f, repeat(n - 1, f));
}

double sqrtn(int n, double x) {
    using Type = std::function<double(double)>;
    int t = log2(n) + eps;

    auto fn = repeat(t, static_cast<std::function<Type(Type)>>(average_damp));
    return fixed_point(fn([=](double a) { return x / pow(a, n - 1); }));
}
```

又或者是更直接的应用.

```cpp
double sqrtn(int n, double x) {
    int t = log2(n) + eps;
    std::function<double(double)> fn =
        [=](double a) { return x / pow(a, n - 1); };

    while (t-- > 0)
        fn = [=](double x) { return average_damp(fn)(x); };
    return fixed_point(fn);
}
```

--------------------------------------------------------------------------

## 初等数论的一些东西

### GCD的复杂度
可以使用[Lamé's Theorem](http://en.wikipedia.org/wiki/Euclidean_algorithm#Worst-case)

也可以粗看出来。

如果$b<\frac{a}{2}$, 则显然是$\log$级的;
否则，记$c=a\%b$, 则有$gcd(a,b)=gcd(b,c)=gcd(c,b\%c), c<\frac{a}{2}$, 则显然成立，只不过是多乘了一个常数而已。

### 素数测试
$a^p \equiv a \pmod{p}$ 这就是[费马小定理](http://en.wikipedia.org/wiki/Fermat%27s_little_theorem)啦！可以使用它来检测素数。不过可能会失败，因此有了它的一个变形.

$a^{p-1} \equiv 1 \pmod{p}$, 使用这个等式的检测素数方法就是[Miller Rabin](http://en.wikipedia.org/wiki/Miller-Rabin_primality_test)素数测试啦！

```scheme
(define (expmod base exp m)
  (cond ((= exp 0) 1)
        ((even? exp) (remainder (square (expmod base (/ exp 2) m)) m))
        (else (remainder (* base (expmod base (- exp 1) m)) m))))

(define (miller-rabin a p)
  (define (expmod base n)
    (cond ((= n 0) 1)
          ((= n 2) (if (and (= (remainder (* base base) p) 1)
                            (not (= base 1))
                            (not (= base (- p 1))))
                       0
                       (remainder (* base base) p)))
          ((even? n) (remainder (square (expmod base (/ n 2))) p))
          (else (* base (expmod base (- n 1))))))
  (= (expmod a (- p 1)) 1 ))

(define (miller-rabin-test p times)
  (define (miller-rabin-prime?)
    (miller-rabin (+ 1 (random (- p 1))) p))
  (cond ((= times 0) #t)
        ((miller-rabin-prime?) (miller-rabin-test p (- times 1)))
        (else #f)))
```

--------------------------------------------------------------------------

## Scheme的一些东西
一个简单的符号演算

其实只是高中数学...

$$ \frac{\partial C}{\partial x}=0 $$

$$ \frac{\partial x}{\partial x}=1 $$

$$ \frac{\partial u^n}{\partial x}=nu^{n-1}\frac{\partial u}{\partial x} $$

$$ \frac{\partial f(x)g(x)}{\partial x}=f(x)\frac{\partial g(x)}{\partial x} + g(x)\frac{\partial f(x)}{\partial x} $$

主要是判断等式是哪种类型。其可以是和式、乘式、幂的形式...
一个变量就是一个symbol, 和式的话是一个'(+ a b)的形式，乘式类同，幂采用'(\*\* a b)这种表示方法。

```scheme
(define (variable? x) (symbol? x))

(define (same-variable? x y)
  (and (variable? x) (variable? y) (eq? x y)))

(define (=number? x val) (and (number? x) (= x val)))

(define (sum? x)
  (and (pair? x) (eq? (car x) '+)))

(define (make-sum x y)
  (cond ((=number? x 0) y)
        ((=number? y 0) x)
        ((and (number? x) (number? y)) (+ x y))
        ((and (sum? x) (sum? y)) (list '+ (append (cdr x) (cdr y))))
        ((sum? x) (append x (list y)))
        ((sum? y) (append y (list x)))
        (else (list '+ x y))))

(define (addend s) (cadr s))
(define (augend s)
  (cond ((= (length s) 3) (caddr s))
        (else (remove (addend s) s))))

(define (product? x)
  (and (pair? x) (eq? (car x) '*)))

(define (make-product x y)
  (cond ((or (=number? x 0) (=number? y 0)) 0)
        ((and (number? x) (number? y)) (* x y))
        ((=number? x 1) y)
        ((=number? y 1) x)
        ((and (product? x) (product? y)) (list '* (cdr x) (cdr y)))
        ((product? x) (append x (list y)))
        ((product? y) (append y (list x)))
        (else (list '* x y))))

(define (multiplier p) (cadr p))
(define (multiplicand p)
  (cond ((= (length p) 3) (caddr p))
         (else (remove (multiplier p) p))))

(define (make-exponentiation x n)
  (cond ((=number? n 0) 1)
        ((=number? n 1) x)
        (else (list '** x n))))

(define (exponent e) (caddr e))
(define (base e) (cadr e))
(define (exponentiation? e) (and (pair? e) (eq? (car e) '**)))

(define (deriv exp var)
  (cond ((number? exp) 0)
        ((variable? exp) (if (same-variable? exp var) 1 0))
        ((exponentiation? exp) (make-product (make-product (exponent exp)
                                                           (make-exponentiation (base exp)
                                                                                (make-sum (exponent exp)
                                                                                          -1)))
                                             (deriv (base exp) var)))
        ((sum? exp) (make-sum (deriv (addend exp) var)
                              (deriv (augend exp) var)))
        ((product? exp) (make-sum (make-product (multiplier exp)
                                                (deriv (multiplicand exp) var))
                                  (make-product (multiplicand exp)
                                                (deriv (multiplier exp) var))))
        (else (error "unknown expression type -- DERIV" exp))))

;;; test
(deriv '(+ x 3) 'x)
(deriv '(* x y) 'x)
(deriv '(* (* x y) (+ x 3 y)) 'x)
(deriv '(** x 0) 'x)
(deriv '(* x y (+ x 3 y)) 'x)
```

当然还有 church numbers. Amazing, 特别是 predecessor 的[推导](http://en.wikipedia.org/wiki/Church_encoding#Derivation_of_predecessor_function)，特别有味道。
