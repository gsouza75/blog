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
      return - post.get('date');
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
    el: $('#posts'),

    initialize: function() {
      // this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'sync', this.render);
      // this.listenTo(this.collection, 'all', this.render);

      this.collection.fetch();
    },

    addPost: function (post) {
      var view = new PostView({ model: post });
      this.$el.append(view.render().el);
    },

    addAll: function () {
      this.collection.each(this.addPost, this);
    },

    render: function () {
      this.addAll();
      this.$el.hide().fadeIn();
    }
  });

  var postCollection = new PostCollection();
  new Blog({ collection: postCollection });

}).call(this);