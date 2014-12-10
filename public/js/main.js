(function () {
  'use strict';

  var Post = Backbone.Model.extend({
    defaults: function () {
      return {
        author: 'Gustavo Souza',
        date: (new Date()).getTime()
      };
    },

    idAttribute: '_id'
  });

  var PostCollection = Backbone.Collection.extend({
    model: Post,

    url: '/posts',

    comparator: function (post) {
      return - Date.parse(post.get('date'));
    }
  });

  var PostView = Backbone.View.extend({
    tagName: 'article',

    template: _.template($('#post_template').html()),

    events: {
      'click .edit': 'handleEdit',
      'click .delete': 'handleDelete'
    },

    attributes: function () {
      return {
        'data-id': this.model.get('_id'),
        'class': 'post'
      };
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    handleEdit: function () {
      console.log('edit clicked');
    },

    handleDelete: function () {
      console.log('delete clicked');
    }

  });

  var Blog = Backbone.View.extend({
    el: $('#content'),

    events: {
      'submit #add-post-form': 'handleFormSubmit'
    },

    initialize: function() {
      this.posts = this.$('#posts');
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

    addPost: function (post) {
      var view = new PostView({ model: post });
      this.posts.append(view.render().el);
    },

    addAll: function () {
      this.collection.each(this.addPost, this);
    },

    render: function () {
      this.posts.empty();
      this.addAll();
      this.posts.hide().fadeIn();
      return this;
    },

    handleFormSubmit: function (e) {
      function done() {
        $form[0].reset();
        $btn.removeAttr('disabled');
      }

      e.preventDefault();

      var $form = $(e.currentTarget);
      var $btn = $form.find('.btn');

      $btn.attr('disabled', 'disabled');

      this.collection.create({
        title: $form.find('#title').val(),
        body: $form.find('#body').val()
      }, { wait: true, success: done, error: done });
    }
  });

  var postCollection = new PostCollection();
  new Blog({ collection: postCollection });

}).call(this);