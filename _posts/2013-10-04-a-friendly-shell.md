---
layout: post
title: a friendly shell
categories: translation
tags: [shell, repl]
---

Fish – 交互友好型的Shell
========================

## 原地址
[这篇文章](http://lwn.net/Articles/136232/)有点历史了2005年的产物。fish的起始点。

--------------------------

## 介绍
在过去的十年中，很大精力都花在了使计算机更加的用户友好性上面了。而于此同时，图形用户友好性取得巨大发展，但在非图形程序(例如Shell)上就显得缓慢了。这真是不幸，因为仍然有许多的事情，通过Shell做可以更加方便。那些命令(commands)， 管道(pipelines)，环境变量(environment variables)多少有点复杂，但我相信现代的Shell更难使用，无论是对新手或老手。我写了一个新的Shell–Fish，或者可以叫做交互友好型 Shell(friendly interactive shell)，其主要是为了解决我在其他Shell中遇到的一些问题。

fish的特点有代码高量，高级的tab补全，更具发现性的帮助(discoverable help) ，修正的Shell语法以及其他。在这篇文章中，我将描述其中的一些特点以及解释为什么我认为它们是有帮助的。

--------------------------

## 语法高量
初学者喜欢语法高量，因为漂亮的颜色使得它们更会舒服。于此同时，语法高量也可以使得人更容易分析命令，找到错误。fish有着一个高级的错误检测器，其用红色来高量错误。错误被标志为命令拼写错误，选项拼写错误，读取不存在文件，括号、引号失配，还有众多的常见错误。fish会将匹配的引号、括号高量。
![语法高量](../../../assets/images/fish-syntax-highlight.png)

--------------------------

## 强大的历史系统
现代的Shell在一个命令文件中保存历史命令。你可以通过使用上、下方向键来查看以前的命令。 fish通过整合历史搜索功能来延伸了这个概念。搜索历史，只需键入搜索字符串，按上箭头。通过使 用上、下箭头，你可以搜索更新或更旧的匹配。Fish还会自动移除重复的命令、高量匹配的子串。这 些特性使得搜索和重用以前的命令更加的快速。

--------------------------

## 高级的tab补全
tab补全对新手、老手都是一个节省时间的特点。fish的tab补全引擎是强大而易使用的。

* fish有着大量的特定命令tab补全，包含对于manpage的、主机名的补全(例如在使用ssh时)。 bash和zsh都支持命令特定补全，但都不默认启用。
* 补全配备了一些说明。例如，当补全命令或man page时，那些说明描述了这是什么信息。当补全变 量时，就显示出了它的值。当补全1个文件时，这就变成了对文件类型的描述。zsh在这方面有不足。
* 补全还可以在有通配符'*','?'的情况下补全，当然也可以在花括号中，例如这样： 'input{a,b,c}.txt'. zsh也可以被配置成扩展通配符。但它仅仅是用一个匹配的实例来替代， 因而对于匹配多个文件就成为不可能了。
* fish试图通过截断长的补全来实现在一个页面上显示所有补全，但如果失败，一个内置的翻页器将 被启用，其支持上下滚动，向上翻页/向下翻页和空格键。如果用户按下任何其他键，该翻页器将 退出，随之而然的，相应的字符会被插入到命令缓冲区中。 

![补全](../../../assets/images/fish-tab-completion.jpg)

--------------------------

## 默认设置
zsh提供了特定命令补全，1个历史文件，通配符的扩展还有其他的高级功能。但没有1个是默认开启的 。事实上，1个用户首次使用zsh都会认为这是对Bourne shell的1个提升。bash在这点上做得更好， 但像特定命令补全这种功能是默认关闭的，而且默认的历史设置也不是非常有用。

很有可能一些我的对于bash,zsh的抱怨又要“配置“了{此处应该是反语。原文：It is quite possible that a few of my complaints against bash and zsh could be configured away}，这绝不是有意黑它们，尽管我狂热地用Shell 10几年了，我依旧在从那些记 录不完全的文档中找到新的功能、特点，这些被默认关闭着的或者实现无意义。

fish的设计哲学就是让事情工作得正确，更少的配置而功能不减少。因而fish仅有少量的配置。

--------------------------

## 上下文敏感，用户友好性的帮助页
尽管man page给了你一个得当的信息，让你知道了如何使用这些特定的命令，但这些文档对于Shell 和内置的命令来说是及其难用的。bash的man page几乎是传说般难用。fish尝试着以1种易于使用 的形式来提供上下文敏感的文档。

要访问fish的help页面，可以使用'help'命令。简单地写下'help'然后敲击回车，这将启动用户 最喜欢的浏览器来查看本地的手册。手册中有很多的主题可以被help特定查询， 例如'help syntax','help editor'之类的。这将打开特定主题的文档。为了使得帮助页面更加 方便地查询，每次fish的开启都会打印一条信息，描述它是如何访问的。 找到一个特定的主题也是非 常方便的，因为章节的名字可以被补全。

在fish中，内置的命令支持-h和–help选项，这将打印出1个详细的解释来描述命令是怎样工作的。 唯一的例外是那些用于开始新命令区块的命令，例如'for','if','while', 'function'… 为了得到这些命令的帮助信息，请直接在Shell下输入命令。

错误报告往往是一个经常被忽视的帮助。当语法错误，fish尝试着给出一份详细的报告，以之来说明 什么出错了，如果可能的话，也会打印出一份帮助信息。

--------------------------

## 桌面集成
因为很多用户都是在图形桌面下使用虚拟终端来操纵Shell，Shell应该集成到桌面中去。fish使用 X的剪切板来复制，粘贴，所以你可以使用Control-Y粘贴前剪切板中的内容到fish下，当然 Control-K使得此行的剩余部份移入至剪切板。

--------------------------

## 打开文件
用一个图形文件和管理器来打开一个文件或图像是很简单的。你简单地双击它，然后它被默认的程序 找开。在Shell中，这更加因难。你需要知道哪个程序可以用来处理给定类型的文件，当然必须要知道 如何启动它。从命令行中打开一个HTML文件不是一个简单的任务 ，因为大部分的游览器所期望的是一 个URL,以及可能完整的绝对路径，而非一个文件。 fish有一个功能，一个叫做open的程序使用 类型(mime-type)数据库，一个.desktop 文件被Gnome,KDE所使用，用来确定此文件的默认打开 程序，以及用.desktop中所指定的高量方式来打开。

--------------------------

## 一个更好的Shell语法
然而Shell自70年代以来已经取得一些功能，现代POSIX Shell语法例如bash,zsh都是与古老的 Bourne Shell {它已经30岁了}相类似的。当时，语法上有大量的问题，我觉得应该改变一下了。 很不幸，这将导致fish的语法与其它的Shell不兼容。虽然旧脚本转化成新脚本也不是很难。

--------------------------

## 块{Blocks}
在Shell编程中有很多情况下你要指定一系列的多个命令。这包括条件块，循环块以及函数定义。在 一般的Shell，对于不同块的结束仅有少量的逻辑。条件块用翻转的命令来终结，例如： 'if true; echo yes; fi'，但循环块用done来终结，例如： 'while true; do each hello; done'，个别的条件块(case)用';;'来终结。函数用'}'来 终结。任意的保留字像'then','do'之类的也将在代码中大量出现。fish使用单个、统一的形式来 作为块的终结：'end'命令。对于在POSIX shell和fish中的块语法，请看下表。

POSIX command                        | fish command
-------------------------------------| -------------------------------------
if true; then echo hello; fi         |   if true; echo hello; end
for i in a b c; do echo $i; done     |   for i in a b c; echo $i; end
case $you in *) echo hi;; esac;;     |   switch $you; case '*'; echo hi; end
hi() { echo hello; }                 |   function hi; echo hello; end

--------------------------

## 引用
原始的Bourne Shell是一个宏语言，当它不理解相关的语法时，其在一行命令中做了变量的替换、 标记以及其它的一些操作，这就导致不期望的负作用。考虑下面的命令块：

    smurf=blue; smurf=evil; echo Smurfs are $smurf

在Bourne Shell中，这将输出'Smurfs are blue'.像M4和Bourne这样的宏语言是不直观的， 但一旦你理解了它们是如何运作之后，它们至少是稍微有点逻辑的，可以被预知。bash用了bison 语法来实现，但是仍旧选择模仿一些古老的Bourne shell的一些怪癖。

上面的例子将输出'Smurfs are evil'。换句话说，对于空格的处理上，变量的值仍旧是标记的，这就意味着你不能够写下'rm $file'。

因为包含空格的变量file，rm将尝试着删除错误的多个文件(因为file中含有空格，仅做了替换，因而变成了删除多个文件)。
为了解决这个，它的用户确保 每一处使用变量都要被引号包含，例如这样'rm "$file"'。这正是shell脚本中bug的源头之一 ，因为这是一个简单的默认的结果都会变得糟糕，很少达到期望。

综上，使bash变成一个像这样的非宏语言{non-macro language}，其的结果也会变得不可预知，学习起来非常因难。

fish不是一个宏语言也不自称是宏语言。带有空格的变量仍旧是一个整体标记{token}. 由于此， 就没有必要用双引号了来说明“这整体是与单引号括起来是不一样的。”所以，单、双引号都意味着同一样东西，并且引号可以被嵌套。{最后的引号应该是双引号，不然的话，单引号处于最外层是不会展开变量的}

--------------------------

## 变量的赋值
变量的赋值在Bourne shell下是空白字符敏感的。'foo=bar'是一个赋值，但 'foo = bar'就 不是。这真是一个坏的想法。fish在修复这个问题的时候也做了一些不期望的事情。它浏览了一下 csh的语法，使用了命令set来对一个变量赋值。做这件事的原因是在fish中任何东西都是一个命令 (everything is a command)。循环，条件以及每一种其它类型的高级语言构造都被实现作为内 置的命令，都遵循着同一个语法规则。 这使得这语言可以更简单的学习、理解，当然也更容易实现。

将变量smurf赋值为blue，可以使用下面的命令：

    set smurf blue

默认的，变量局部存在于当前块，在当前块脱离范围后此变量就会消失。为了使一个变量全局化， 你需要使用-g开关。

--------------------------

## 两种创建函数的方式，不过都是坏的
bash, zsh和其它一般的shell允许你用两种不同的方式来创建存储函数。作为aliases或作为 functions.

Aliases使用命令'alias ll="ls -l"'来定义。Aliases只是在命令行中进行简单地字符串替换 。由于这个原因，aliases有如下的限制：

* 在alias中你只能针对最后一个命令重定向输入输出。
* 你仅能对最后一个命令指定参数。
* aliases定义是单个字符串，这意味复杂的函数几乎是不可能创建的。

由于上述这些限制，bash使用了第二种方式来指定函数，使用了这样的语法：

    ll () { ls $*; }

这解决了aliases的问题，但我认为这语法太糟糕。它看起来像C的代码，但每一个期望它可以像C一 样工作的人发现这是不可能的。你不能够在括号中指定参数，这些代码只是在这个地方看起来像C的代 码。花括号中是一系列伪命令，在上述例子中跳过分号会导致语法错误。最奇怪的是除去'ls'和'('之 间的空白也会导致语法错误。显然，这不是一个 经过仔细考虑加上去的语法。fish为定义函数只使用 一种语法，这种定义以仅仅是一种常见的一般命令：

    function ll; $argv; end

这种写法比上面的例子要罗嗦一点，但它用一种方式解决了上面两种语法上，并且与fish的其他语法统一。

--------------------------

## 不能确定语法是否正确
因为在一般的shell中变量如同命令一样的使用，检查脚本语法是不可能的。

例如，这小小的bash/zsh代码片断可能抑或不可能是合法的，这取决于你的运气：

    if true; then if [$RANDOM -lt 1024]; then END=fi; else END=true; fi; $END

bash,zsh尝试着确定在当前缓冲区中命令是否结束，但是可能就会存在这种情况，命令失败了。

fish不允许变量作为命令来解决这种情况。你可以用一种更加清晰的方法 (use eval command or functions)来处理变量作为命令的情况。

--------------------------

## 次要的问题
字符串'$foo',"$foo"和`$foo`看起来很类似，然而这三个是完全不一样的东西。fish使得 '$foo'和"$foo"是同一个事物来解决上述的问题，但同时也使得对于子shell(sub-shell) 的语 法要使用圆括号了 {()}。

大量的UNIX标准命令，像printf,echo,kill和test在bash/zsh中都是内置的命令。就我认为而 言，做这件事只有一个好处：一个小的表现提升了{原文：a minimal performance increase.} 但是因此引入的缺点却有很多：

* 这些内置命令中存在的bugs威胁着整个shell。
* 命令改变它们的行为只能取决于你所使用的shell。
* 其它shell的用户不会从你写的命令中受益。
* 它打破了UNIX doing only one thing but doing it well的哲学
* 内存使用率增加。

对于这些原因，fish尽可能少地实现内置命令。包含块命令例如'for','end'，fish实现了24个 内置的命令，而bash的内置命令在60到70之间。

--------------------------

## 总结
在一般shell语法中没有大的问题使得shell无法运作。30年间，shell对于计算机用户来说，已经 成为一个有利的工具。但是即使是很好的设计，强大的程序仍然需要更新来移除一些旧错误。对于初 学者来说，如上介绍的fish的改变使得shell语言更容易理解、记忆，一旦学过，对于有经验的用户 来说，仅可能引入少量的bugs。一般的计算机语言已经在过去的30年间进化、取代多次了，为什么 shell语言不变一下呢？

--------------------------

## 将来的计划
fish的代码基础被优美地构建。它也被很好的记录并且尽可能保持小。但是，因为代码是新的而没 有经过测试，它比其它的shell包含更多的bugs。它一定需要一个审计员来确保安全性、稳定性以及 更复杂的测试组。我还想要加入的功能还有很多，但它们都不需要完全的重写。

在语法方面还有一个重要的部分没有实现，就是IO对于块和函数的重定向。在当前这个情况下，在管 道中使用函数以及重定向函数的输出都是可行的，但函数不能够输出二进制数据，而且输入重定向是 不被支持的。对于代码块的输入/输出重宝向也是不可能的。

将来的版本将允许如下的代码：

    for i in (find . -name "*.c"); echo $i; grep "mbstowcs" $i; end | less {目前在2.0.0-2中已经实现}

为了在less中查看多个命令的输出，可以使用：

    cat foo.txt | while test -z quit read type switch $type case quit set quit 1 … end end

来从一个文件中读取多行。我现在实现这些特点希望在近期放出一个带有这些新功能的版本。

fish当前的特定命令补全大约有60多个。依然有许多额外的命令需要特定补全。我希望可以使用 Doclifter来自动地从手册页(manual pages)转换到tab补全说明。

另一个需要注意的就是文档了。当一个工程已经有很多文档了，fish将从shell scripting tutorials、UNIX哲学以及多种其它形式的文档中受益。

在语法的确定性和fish的错误报告上面仍旧需要更多的工作。fish已经做了一些基本的语法检查， 但是在将来版本中能够在运行前检测到更多的语法错误。

我还计划实现一些次要的功能：


* undo/redo的支持。
* 交互性的目录历史，可以使用Alt-up,Alt-down来插入上一个目录到当前的命令缓冲区中。
* 多行编辑。
* 鼠标的支持，可以在窗口上点击来移动光标，也可以通过点击来选择一个补全。
* 用一种含蓄的颜色来显示建议补全。
* 存储上一个命令的输出。计算器通常使用变量ans来指代上一个计算的结果。如果$ans是上一个 命令的输出，那该有多好啊。{这是在模仿Mathematica吗？}

如果你认为fish听起来有趣，请过来一起纺织它吧。你可以从[这里](http://roo.no-ip.org/fish/)上下载。fish基于Gnu General Public(GPL)协议释放了，它的i386 rpm和i386 deb包可以获取。

现在一般的发行版源里都有fish。