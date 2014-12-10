<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>{% block title %}Good Stuff{% endblock %}</title>

  {% block css %}
  <link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet">
  <link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/css/bootstrap-theme.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
  {% endblock %}
</head>
<body>
  <header id="header">
    <h1 id="blog-name" class="container">My Blog</h1>
  </header>
  {% block content %}Default content{% endblock %}
  <script type="text/template" id="post_template">
    <h2 class="title"><%= title %></h2>
    <div class="metadata">
      <time pubdate><%= date %></time>
      <address class="author">by <a rel="author" href="#"><%= author %></a></address>
    </div>
    <p class="body"><%= body %></p>
    <span class="action delete glyphicon glyphicon-trash" title="Delete"></span>
    <span class="action edit glyphicon glyphicon-pencil" title="Edit"></span>
  </script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
