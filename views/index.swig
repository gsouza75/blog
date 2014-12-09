{% extends 'layout.swig' %}

{% block content %}
  <div id="content" role="main" class="container">
    {% for post in posts %}
    <article class="post">
      <h2 class="title">{{ post.title }}</h2>
      <div class="metadata">
        <time pubdate>{{ post.date.toISOString() }}</time>
        <address class="author">by <a rel="author" href="#">{{ post.author }}</a></address>
      </div>
      <p class="body">{{ post.body }}</p>
    </article>
    {% endfor %}
    <form id="add-post-form" action="/" method="post" role="form">
      <div class="form-group">
        <label for="title">Title</label>
        <input class="form-control" name="title" id="title" placeholder="Enter title" required>
      </div>
      <div class="form-group">
        <label for="body">Body</label>
        <textarea class="form-control" id="body" name="body" rows="8" placeholder="Enter body" required></textarea>
      </div>
      <button class="btn btn-primary" type="submit">post</button>
    </form>
  </div>
{% endblock %}