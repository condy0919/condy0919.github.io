<a name="#disqus"></a>
<div id="disqus_thread"></div>
<script type="text/javascript" src="https://disqus.com/forums/condy0919/embed.js"></s
cript>
<noscript>
    <a href="https://disqus.com/forums/condy0919/?url=ref">View the discussion thread
.</a>
</noscript>
<a href="https://disqus.com" class="dsq-brlink">blog comments powered by <span class=
"logo-disqus">Disqus</span></a>

<script type="text/javascript">
//<![CDATA[
(function() {
    var links = document.getElementsByTagName('a');
    var query = '?';
    for(var i = 0; i < links.length; i++) {
    if(links[i].href.indexOf('#disqus_thread') >= 0) {
        query += 'url' + i + '=' + encodeURIComponent(links[i].href) + '&';
    }
    }
    document.write('<script charset="utf-8" type="text/javascript" src="https://disqu
s.com/forums/condy0919/get_num_replies.js' + query + '"></' + 'script>');
})();
//]]>
</script>

{% if site.duoshuo %}
	{% if page.thread %}
	<div class="ds-thread" data-thread-key="{{ page.thread }}" data-url="{{ site.url }}{{ page.url }}" data-title="{{ page.title }}" />
	{% else %}
	<div class="ds-thread" />
	{% endif %}	
	<script type="text/javascript">
	var duoshuoQuery = {short_name:"{{ site.duoshuo }}"};
	(function() {
		var ds = document.createElement('script');
		ds.type = 'text/javascript';ds.async = true;
		ds.src = 'https://static.duoshuo.com/embed.js';
		ds.charset = 'UTF-8';
		(document.getElementsByTagName('head')[0] 
		|| document.getElementsByTagName('body')[0]).appendChild(ds);
	})();
	</script>
{% endif %}
