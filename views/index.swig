{% extends 'layout.swig' %}

{% block content %}
  <div id="content" role="main" class="container">
    <div id="posts">
      {% for post in posts %}
      <article class="post" data-id="{{ post._id.toString() }}">
        <h2 class="title">{{ post.title }}</h2>
        <div class="metadata">
          <time pubdate>{{ post.date.toISOString() }}</time>
          <address class="author">by <a rel="author" href="#">{{ post.author }}</a></address>
        </div>
        <p class="body">{{ post.body }}</p>
        <span class="action delete glyphicon glyphicon-trash" title="Delete"></span>
        <span class="action edit glyphicon glyphicon-pencil" title="Edit"></span>
      </article>
      {% endfor %}
    </div>
    <form id="add-post-form" action="/posts" method="post" role="form">
      <h3>Add a new blog post</h3>
      <div class="form-group">
        <label for="title">Title</label>
        <input class="form-control" name="title" id="title" placeholder="Enter title" required>
      </div>
      <div class="form-group">
        <label for="body">Body</label>
        <textarea class="form-control" id="body" name="body" rows="8" placeholder="Enter body" required></textarea>
      </div>
      <button class="btn btn-primary" type="submit">Add</button>
    </form>
  </div>
{% endblock %}