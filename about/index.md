---
title: 关于
layout: page
comments: no
---

{{ site.about }}

----

### 联系方式：

{% if site.qq %}
ＱＱ：[{{ site.qq }}](tencent://message/?uin={{ site.qq }})
{% endif %}
{% if site.twitter %}
Twitter: [{{ site.twitter }}](https://twitter.com/{{ site.twitter }})
{% endif %}
网站：[{{ site.name }}]({{ site.url }})

邮箱：[{{ site.email }}](mailto:{{ site.email }})

GitHub : [https://github.com/{{ site.github }}](http://github.com/{{ site.github }})

----
