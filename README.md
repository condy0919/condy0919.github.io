# LessOrMore


致谢
====================================
+ 感谢[Less官网](http://lesscss.cn/)的样式，本Jekyll框架的样式都是基于Less官网的样式直接拷贝过来的。只是重构了JS，并且加入了Jekyll语法而已。
+ 感谢[Github](https://github.com/)提供的代码维护和发布平台
+ 感谢[Jekyll](https://jekyllrb.com/)团队做出如此优秀的产品
+ 感谢[Solar](https://github.com/mattvh/solar-theme-jekyll)的原作者[Matt Harzewski](http://www.webmaster-source.com/)，在`2014.11`-`2016.09`的两年间，我的博客选用了此样式模版


使用
====================================

下载
------------------------------------

使用git从[LessOrMore](https://github.com/luoyan35714/LessOrMore.git)主页下载项目

``` bash
git clone https://github.com/luoyan35714/LessOrMore.git
```

配置
------------------------------------

`LessOrMore`项目需要配置的只有一个文件`_config.yml`，打开之后按照如下进行配置。

> 特别注意`baseurl`的配置。如果是`***.github.io`项目，不修改为空''的话，会导致JS,CSS等静态资源无法找到的错误

``` bash
name: 博客名称
email: 邮箱地址
author: 作者名
url: 个人网站
# baseurl修改为项目名，如果项目是'***.github.io'，则设置为空''
baseurl: "/LessOrMore"
resume_site: 个人简历网站
github: github地址
github_username: github用户名称
# 请到百度统计官网[https://tongji.baidu.com/](https://tongji.baidu.com/)申请自己的网站ID并在此处替换，否则将无法正常统计访问量
baidu_analysis: 94be4b0f9fc5d94cc0d0415ea6761ae9
# 请到revolvermaps [http://www.revolvermaps.com/?target=setupgl](http://www.revolvermaps.com/?target=setupgl)申请自己的网站ID并在此处替换，否则将无法正常统计访问量
revolvermaps: 5ytn1ssq6za
```

关于统计
------------------------------------

本项目支持三种统计，分别是

+ [百度统计](https://tongji.baidu.com)

百度统计是后台统计，并没有再页面有任何展示，但是可以通过登录百度统计官网查看更详细的访问记录分析。
当Fork本项目之后需要去百度统计官网申请自己的baidu统计ID替换 `_config.yml` 文件中的 `baidu_analysis`。

+ [revolvermaps地图统计](http://www.revolvermaps.com/)

revolvermaps地图统计是展示在左侧当行栏的地图展示，具体展示形式可以去官网定制。
当Fork本项目之后需要去revolvermaps地图官网申请自己的统计ID， 替换`_config.yml` 文件中的 `revolvermaps`。

+ [不蒜子统计](http://busuanzi.ibruce.info/)

不蒜子统计是出现在页面右上角的`本站总访问量n次`统计，本统计会自动识别客户所对应的域名，根据不同域名统计，所以并不需要Fork本项目者做任何修改。
更多不蒜子的展示方式可以去官网查看。


如何写文章
------------------------------------

在`LessOrMore/_posts`目录下新建一个文件，可以创建文件夹并在文件夹中添加文件，方便维护。在新建文件中粘贴如下信息，并修改以下的`titile`,`date`,`categories`,`tag`的相关信息，添加`* content {:toc}`为目录相关信息，在进行正文书写前需要在目录和正文之间输入至少2行空行。然后按照正常的Markdown语法书写正文。

``` bash
---
layout: post
#标题配置
title:  标题
#时间配置
date:   2016-08-27 01:08:00 +0800
#大类配置
categories: document
#小类配置
tag: 教程
---

* content
{:toc}


我是正文。我是正文。我是正文。我是正文。我是正文。我是正文。
```

前端依赖
------------------------------------

当前使用以下固定版本，文件保存在仓库中，页面运行时直接从本站加载：

| 依赖      | 版本  | 本地文件                                                            | 官方发布来源                                                                  |
|-----------|-------|---------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Bootstrap | 5.3.8 | `styles/css/bootstrap.min.css`、`styles/js/bootstrap.bundle.min.js` | [Bootstrap 下载](https://getbootstrap.com/docs/5.3/getting-started/download/) |
| jQuery    | 4.0.0 | `styles/js/jquery.min.js`                                           | [jQuery 下载](https://releases.jquery.com/jquery/)                            |

Bootstrap 的 bundle 包含下拉菜单定位所需的 Popper。`styles/css/index.css` 只保存博客主题的定制样式，在 Bootstrap 样式之后加载；以后更新 Bootstrap 时不要用框架 CSS 覆盖这个文件。

Bootstrap 的 CSS 和 JavaScript 同目录下还保留对应版本的 `.map` 文件，供浏览器开发工具还原源码；更新依赖时应一起更新，以免调试时出现 source map 的 404 请求。

主题已迁移到 Bootstrap 5 的 `data-bs-*` 属性和 JavaScript API，目录通过顶栏按钮打开 Offcanvas 抽屉，标题链接使用现有的 Font Awesome 图标。不要再使用 Bootstrap 3 的 `data-toggle`、`affix` 或 Glyphicons 写法。jQuery 仅在页面头部加载一次，供主题脚本使用。

正文采用居中单栏，目录不占固定栏宽；抽屉在桌面和手机上均可使用，点击条目后会关闭并跳转到相应标题。`styles/css/index.css` 控制基本排版：文字区最大 780px，代码、图表最大 920px；桌面正文 17px、手机 16px，行高 1.85。手机减小卡片和代码内边距。文章页使用紧凑页头，日期、分类与标签放在标题下，首页保留品牌横幅。

阅读增强
------------------------------------

`styles/js/reading.js` 和 `styles/css/reading.css` 为文章添加代码工具栏及宽内容滚动提示。代码块显示语言、复制按钮和自动换行开关，默认保留空格与换行，适用于 ASCII 图和缩进敏感代码。复制失败会提示手动选择；按钮与提示不进入复制内容。表格和块公式仅在实际溢出时显示横向滚动提示，可通过 Tab 聚焦后使用方向键滚动。正文链接带细下划线，章节链接在标题悬停、键盘聚焦及触屏上可见。

文章设置 `usemermaid: true` 时，加载固定的 Mermaid 10.2.0 和 `styles/js/diagram-viewer.js`。每张图有编号链接和“放大查看”按钮；查看器支持放大、缩小、100%、适应窗口、拖动平移、滚轮及双指缩放。键盘可用方向键移动、`+` / `-` 缩放、`0` 恢复原始大小、`Home` 适应窗口、`Esc` 关闭。关闭后恢复原来的阅读位置；正文中的滚轮仍用于滚动页面。样式位于 `styles/css/diagram-viewer.css`。单张图渲染失败时保留源文本，其余图继续渲染。

需要给图添加说明或固定链接时，可在 Mermaid 代码块结束标记的下一行紧接 Kramdown 属性，不留空行：

````markdown
```mermaid
graph LR
    A[请求] --> B[应答]
```
{: #handshake data-caption="建链流程"}
````

这张图会显示“图 N：建链流程”，并保留 `#handshake` 链接。没有指定 ID 时自动生成 `#diagram-1`、`#diagram-2` 等编号锚点。

文章设置 `usemathjax: true` 时，从 cdnjs 加载固定的 MathJax 2.7.9，保留现有 v2 公式语法与菜单。Mermaid 和 MathJax 依赖按文章开关加载；升级时应同时验证旧文章，而不是直接改成浮动的 `latest` 地址。

本地验证
------------------------------------

用下面的 `jekyll server` 预览，检查首页、分类、标签、友链和文章页；桌面与手机宽度下应能操作导航和目录，且整页没有横向溢出。重点检查：

- `ubsocket 方面的工作`：9 张图能显示；放大、平移、双指缩放和 Esc 关闭正常；关闭后仍在原阅读位置；图编号链接可定位。
- `从 awesome 切换至 xmonad`：ASCII 图默认对齐；长代码只在块内横滚；切换自动换行后可以恢复；复制得到原始代码。
- `SICP 第1、2章总结`、`机器学习`：旧公式能渲染，长公式和宽表在手机上局部滚动；公式菜单及放大仍可用。
- 目录跳转、当前位置高亮、键盘焦点及打印预览正常，浏览器控制台没有主题脚本异常。


执行
------------------------------------

``` bash
jekyll server
```

效果
------------------------------------
打开浏览器并输入URL`http://localhost:4000/`,回车。


为什么重复造轮子
====================================

很明显，我在重复造轮子。在13年接触到GIT，14年末接触到Jekyll，然后搭建了自己的博客，当时是选用了[JekyllThemes](http://jekyllthemes.org/)上的[Solar](https://github.com/mattvh/solar-theme-jekyll)主题，一直到现在。不过中间一直感觉页面风格还是偏暗，阅读不方便。并且有一些小的细节做的不是很好。在页面的跨平台浏览上有一些瑕疵。并且不区分一级标题和二级标题，导致没有重点强调。诸如此类，用了2年，用的越多，越发吃力，中间就一直在寻找新的能够让我一眼认定的主题。

虽然设计好看的主题很多。但是真正适合拿来做博客的却不多。中间一直没有找到合适的主题。直到有一天看到Less官网的主题之后，豁然觉得这就是我的博客想要的样子。简单而又不平凡。所以就决定了要把博客迁移到这个主题，然后拿了两天晚上来把这个主题做出来。

重复造了轮子，但是这个是迄今为止自己觉得最适合我的博客的轮子，所以是值得的！

关于作者
====================================

热爱开源，热爱折腾的Java程序猿。更多个人信息和联系方式可以参照[我的简介](http://www.hifreud.com/Resume.io/)。

写在最后
====================================

如果你也像我一样在寻觅一个简洁的博客主题。不妨试下LessOrMore。

之前此处是有打赏功能的，不过最近在整理自己，发现打赏功能偏离了我写这个Jekyll主题的初衷，所以删除了打赏功能。

非常感谢之前打赏过的朋友们！！
