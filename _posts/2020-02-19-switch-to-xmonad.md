---
layout: post
title: 从 awesome 切换至 xmonad
categories: linux
tags: note
usemermaid: false
usemathjax: false
---

* content
{:toc}

# awesomewm is awesome

[awesome] 有着非常漂亮的界面，且它自身实现了非常多的功能，列表摘自 `awesomewm` 官网:

- Very stable, fast and small codebase and footprint.
- First window manager using the asynchronous XCB library instead of the old,
  synchronous Xlib, which makes awesome less subject to latency compared to
  other window managers.
- Documented source code and API.
- No mouse needed: everything can be performed with the keyboard.
- Real multihead support (XRandR) with per screen desktops (tags).
- Implements many Freedesktop standards: EWMH, XDG Base Directory, XEmbed,
  Desktop Notification, System Tray.
- Does not distinguish between layers: there is no floating or tiled layer.
- Uses tags instead of workspaces: allow to place clients on several tags, and
  display several tags at the same time.
- A lot of Lua extensions to add features: dynamic tagging, widget feeding,
  tabs, layouts, ...
- D-Bus support.

其中相比于其他 WM 来说，算是优势的有：

1. 自己实现了 Notification Daemon
2. 自带 System trayer

再配合 [awesome-copycats] 配置，美观又实用。

# 为什么不继续使用下去了呢？

~~闲的😭~~

当然，还有其他原因：

1. 个人喜欢使用 `Terminus` 字体，但是 `pango` [更新](https://github.com/lcpz/awesome-copycats/issues/269)破坏了这个
2. `awesomewm` 在提供开箱即用的便利同时也变相增加了自定义的难度，如修改默认键位
   成适合自己的、去除花哨(如鼠标 hover 显示日历)的功能
3. 作为一个 `awesomewm` 快 6 年的用户，想看看其他 `wm` 是怎样的

# xmonad

优点[摘自宋教授博客](https://maskray.me/blog/2011-11-30-xmonad-config):

> Xmonad 用 Haskell 配置，因为这一点注定了当配置复杂到一定程度后，会远远胜过那些
> 自定义配置语言的 wm。

> 得到 monad transformer 精髓的 layout transformer 使得复合 layout 变得非常容易，
> 可以轻易定制出在其他 wm 中不可能实现的 layout。

缺点:

> 依赖的模块较多，升级 ghc 或被 xmonad/xmonad-contrib 依赖的包后需要按照拓扑序更
> 新整个被 xmonad 依赖的树. 如果平时不大升级的就不用在意这一点。

> 没有 systray 等其他 desktop environment 集成的组件，这方面 tiling window
> manager 世界中的 Awesome 可谓是佼佼者，

> 其他 wm 都需要手动配置很多组件，Xmonad 也不例外。

## 有无 systray 的影响

当前我所使用的软件中，仅有 `fcitx`、`zeal` 会留在 `systray` 上。

`fcitx` 的状态可以通过直接输入文字来获得，而且配置 `fcitx` 只需要直接运行
`fcitx-configtool`。

`zeal` 主要用来离线查看文档。不管它是否已经启动、都可以直接 lanuch `zeal` 弹出窗
口搜索。并且在 `Emacs` 中配合
[zeal-at-point](https://github.com/jinzhu/zeal-at-point) 可以获得更好的体验。

实际上也可以使用[polybar][polybar]，它自带一个`systray`。

## xmonad 配置

这里选择了 5 个比较常用的 layout。

#### BinarySpacePartition 混合 Tabbed

```haskell
bspLayout = avoidStruts
  $ renamed [CutWordsLeft 1]
  $ noFrillsDeco shrinkText topBarTheme
  $ windowNavigation
  $ renamed [Replace "BSP"]
  $ addTabs shrinkText tabTheme
  $ subLayout [] Simplest
  $ BSP.emptyBSP
```

修改[自](https://github.com/randomthought/xmonad-config)，去除了窗体之间的空白、
主题颜色重新配置。

```
,-----.-----.           ,-----.-----.           ,--.--.-----.
|     |     |           | t3  |     |           |t4|t3|     |
| t2  | t1  |   ---->   |-----| t1  |   ---->   |--'--| t1  |
|     |     |           | t2  |     |           | t2  |     |
`-----'-----'           `-----'-----'           `-----'-----'

                  BinarySpacePartition layout
```

初始 2 个 `terminal` 占满了整个屏幕。然后每打开一个新的 `terminal` 都会把最后的
那个 `terminal` 所占的空间一分为二，然后将新的 `terminal` 放入。

同时，又因为有了 [windowNavigation] 这个 [layoutModifier]，使得窗体焦点可以通过对应的命令移动。

```haskell
-- Directional navigation of windows
("M-h", sendMessage $ Go L)
("M-l", sendMessage $ Go R)
("M-j", sendMessage $ Go D)
("M-k", sendMessage $ Go U)

-- Swap adjacent windows
("M-S-h", sendMessage $ Swap L)
("M-S-l", sendMessage $ Swap R)
("M-S-j", sendMessage $ Swap D)
("M-S-k", sendMessage $ Swap U)
```

这里我使用 `hjkl` 的 `vim` 风格来进行移动、交换窗体。

接着，混合 `layout` 的优势就来了。

```
,--.--.-----.           ,-----.-----.           ,-----.-----.
|t4|t3|     |           | t34 |     |           |     |     |
|--'--| t1  |   ---->   |-----| t1  |   ---->   |t234 | t1  |
| t2  |     |           | t2  |     |           |     |     |
`-----'-----'           `-----'-----'           `-----'-----'

            BinarySpacePartition + Tabbed layout
```

通过 `pullGroup` 操作将邻近的 2 个 `terminal` 合并。在外面看来，`t34` 是一个整体，
而内部其实是一个 `tabbed` 布局。

当然，对应的 `pullGroup` 操作还是采用 `vim` 式的移动风格。

```haskell
("M-C-h", sendMessage $ pullGroup L)
("M-C-l", sendMessage $ pullGroup R)
("M-C-k", sendMessage $ pullGroup U)
("M-C-j", sendMessage $ pullGroup D)
("M-C-m", withFocused (sendMessage . MergeAll))
("M-C-u", withFocused (sendMessage . UnMerge))
```

由于它混合了两种 layout, 比较常用，因此把它作为默认的 layout 选项。

#### Tabbed

```haskell
tabbedLayout = avoidStruts
  $ renamed [Replace "Tabbed"]
  $ noBorders (tabbed shrinkText tabTheme)
```

作为一个独立的布局，它没有上下左右的概念。因此在 `tabbedLayout` 下切换到下一个窗
体直接采用如下方式。

```haskell
("M-<Tab>", windows W.focusDown)
("M-S-<Tab>", windows W.focusUp)
```

作为最通用的一种方式，它对所有布局都生效。

#### SimplestFloat

```haskell
floatLayout = avoidStruts
  $ renamed [Replace "Float"]
  $ windowNavigation
  $ simplestFloat
```

防止某些工具在平铺布局下表现不好而存在，例如 `GIMP`。

#### TwoPane

```haskell
twoPaneLayout = avoidStruts
  $ renamed [Replace "Two"]
  $ windowNavigation
  $ TwoPane delta ratio
  where
    delta = 3/100
    ratio = 1/2
```

作为一个特殊的将屏幕纵向一分为二的 `layout`，左侧的窗体为 `master`，会一直显示。
而在右侧的则为 `slave`。它保证当焦点在 `slave` 区时，打开的程序仅会在 `slave` 区
域覆盖旧的窗体显示。

#### Full

```haskell
noBorders Full
```

有时候总得全屏看点电影吧？

## xmonad 的一些特色应用

- [scratchpad], 开个 `ydcv` 一直放着
- [windowBringer], 虽然是底下的 `rofi` 来模拟 `dmenu` 来实现的的。`rofi` 单独使
  用也有类似效果，这里只是给了它一个名份。对应的功能有两个，可以跨 `workspace`
  1. 跳转到对应的窗体(此功能单独拿 `rofi` 就可以实现)
  2. 将对应的窗体扔到当前 `workspace` 来
- [prompt], 我主要开启了 `manPrompt` 和 `passPrompt`。`manPrompt` 顾名思义就是拿
  来看 `manpage` 的。而 `passPrompt` 与 [passwordstore] 的集成使得可以比较便捷的
  输入密码了。

# 配置

完整配置见 [my-xmonad].


[awesome]: https://awesomewm.org
[awesome-copycats]: https://github.com/lcpz/awesome-copycats
[xmonad]: https://xmonad.org/
[xmonad-contrib]: https://hackage.haskell.org/package/xmonad-contrib-0.16/docs/XMonad-Doc-Extending.html
[windowNavigation]: https://hackage.haskell.org/package/xmonad-contrib-0.16/docs/XMonad-Layout-WindowNavigation.html
[layoutModifier]: https://hackage.haskell.org/package/xmonad-contrib-0.16/docs/XMonad-Layout-LayoutModifier.html
[sublayout]: https://hackage.haskell.org/package/xmonad-contrib-0.16/docs/XMonad-Layout-SubLayouts.html
[windowBringer]: https://hackage.haskell.org/package/xmonad-contrib-0.16/docs/XMonad-Actions-WindowBringer.html
[scratchpad]: https://hackage.haskell.org/package/xmonad-contrib-0.16/docs/XMonad-Util-Scratchpad.html
[prompt]: https://hackage.haskell.org/package/xmonad-contrib-0.16/docs/XMonad-Prompt.html
[polybar]: https://github.com/polybar/polybar
[passwordstore]: https://www.passwordstore.org
[my-xmonad]: https://github.com/condy0919/my-xmonad
