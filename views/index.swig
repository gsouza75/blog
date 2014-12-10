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
  </div>

  <script type="text/template" id="modal-template">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 class="modal-title"><%= title %></h4>
        </div>
        <div class="modal-body"></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal"><%= cancelText %></button>
          <button type="button" class="btn btn-primary ok"><%= okText %></button>
        </div>
      </div>
    </div>
  </script>

  <script type="text/template" id="delete-template">
    <p>Are you sure you want to delete <em><%= title %></em>?</p>
  </script>

  <script type="text/template" id="form-template">
    <form id="post-form" action="/posts" method="post" role="form">
      <div class="form-group">
        <label for="title">Title</label>
        <input class="form-control" name="title" id="title" placeholder="Enter title" value="<%= title %>" required>
      </div>
      <div class="form-group">
        <label for="body">Body</label>
        <textarea class="form-control" id="body" name="body" rows="8" placeholder="Enter body" required><%= body %></textarea>
      </div>
    </form>
  </script>

  <script type="text/template" id="post-template">
    <h2 class="title"><%= title %></h2>
    <div class="metadata">
      <time pubdate><%= date %></time>
      <address class="author">by <a rel="author" href="#"><%= author %></a></address>
    </div>
    <p class="body"><%= body %></p>
    <span class="action delete glyphicon glyphicon-trash" title="Delete"></span>
    <span class="action edit glyphicon glyphicon-pencil" title="Edit"></span>
  </script>
{% endblock %}