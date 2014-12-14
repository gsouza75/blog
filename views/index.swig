{% extends 'layout.swig' %}

{% block content %}
  <div id="content" class="row clearfix">
    <nav id="nav" class="col-sm-4" role="navigation">
      <button id="add-post" class="btn btn-primary">Add New Post</button>
    </nav>
    <div id="posts" class="col-sm-8" role="main"></div>
  </div>

  <script type="text/template" id="modal-template">
    <div class="modal-dialog">
      <div class="modal-content">
        <form id="post-form" action="/posts" method="post" role="form"
          data-bv-message="This value is not valid"
          data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
          data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
          data-bv-feedbackicons-validating="glyphicon glyphicon-refresh"
          data-bv-submitbuttons='button[type="submit"]'>
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title"><%= title %></h4>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal"><%= cancelText %></button>
            <button type="submit" class="btn btn-primary ok"><%= okText %></button>
          </div>
        </form>
      </div>
    </div>
  </script>

  <script type="text/template" id="delete-template">
    <p>Are you sure you want to delete <em><%= title %></em>?</p>
  </script>

  <script type="text/template" id="form-template">
    <div class="form-group">
      <label for="title">Title</label>
      <input class="form-control" name="title" id="title" placeholder="Enter title text..." value="<%= title %>" required
        data-bv-notempty-message="The title is required and cannot be empty">
    </div>
    <div class="form-group">
      <label for="body">Body</label>
      <textarea class="form-control" id="body" name="body" rows="8" placeholder="Enter body text..." required
        data-bv-notempty-message="The body is required and cannot be empty"><%= body %></textarea>
    </div>
  </script>

  <script type="text/template" id="post-template">
    <h2 class="title"><%= title %></h2>
    <div class="metadata">
      <time class="time" pubdate="<%= date %>"><%= new Date(Date.parse(date)).toUTCString() %></time>
      <address class="author">by <a rel="author" href="#"><%= author %></a></address>
    </div>
    <p class="body"><%= body %></p>
    <a class="action edit glyphicon glyphicon-pencil" href="#" title="Edit"></a>
    <a class="action delete glyphicon glyphicon-trash" href="#" title="Delete"></a>
  </script>

  <script type="text/template" id="nav-item-template">
    <a class="nav-link" href="/Blog/api/<%= _id %>"><%= new Date(Date.parse(date)).toUTCString() %></a>
  </script>
{% endblock %}