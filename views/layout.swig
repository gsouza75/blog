<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>{% block title %}My Blog Editor{% endblock %}</title>

  {% block css %}
  <link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet">
  <link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/css/bootstrap-theme.min.css" rel="stylesheet">
  <link href="//cdnjs.cloudflare.com/ajax/libs/jquery.bootstrapvalidator/0.5.3/css/bootstrapValidator.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
  {% endblock %}
</head>
<body>
  <div class="container-fluid">
    <header id="header" class="row clearfix page-header">
      <h1 id="blog-name" class="col-sm-12">My Blog Editor</h1>
    </header>

    {% block content %}Default content{% endblock %}
  </div>
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery.bootstrapvalidator/0.5.3/js/bootstrapValidator.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
