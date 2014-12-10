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

  var ModalDlgModel = Backbone.Model.extend({
    defaults: {
      cancelText: 'Cancel',
      okText: 'OK'
    }
  });

  var PostCollection = Backbone.Collection.extend({
    model: Post,

    url: '/posts',

    comparator: function (post) {
      return -Date.parse(post.get('date'));
    }
  });

  var PostView = Backbone.View.extend({
    tagName: 'article',

    template: _.template($('#post-template').html()),

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

    initialize: function () {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    remove: function () {},

    handleEdit: function () {
      var dlgModel = new ModalDlgModel({
          title: 'Edit post',
          okText: 'Update'
      });

      var view = new EditView({
        model: dlgModel,
        contentModel: this.model
      });

      view.render();
    },

    handleDelete: function () {
      var dlgModel = new ModalDlgModel({
        title: 'Confirm Delete',
        okText: 'Delete'
      });

      var view = new DeleteView({
        model: dlgModel,
        contentModel: this.model
      });

      view.render();
    }

  });

  var ModalDlgView = Backbone.View.extend({
    className: 'modal fade',

    template: _.template($('#modal-template').html()),

    events: {
      'hidden.bs.modal': 'destroy',
      'click .ok': 'handleOkBtn'
    },

    initialize: function (options) {
      _(this).bindAll();
      this.contentModel = options.contentModel;
    },

    render: function () {
      var contentTmpl = _.template($(this.contentSelector).html());
      var content = contentTmpl(this.contentModel.toJSON());
      
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.find('.modal-body').append($(content));

      this.$el.modal('show');

      return this;
    },

    destroy: function () {
      this.$el.data('modal', null);
      this.remove();
    }
  });

  var EditView = ModalDlgView.extend({
    contentSelector: '#form-template',

    handleOkBtn: function () {
      var attrs = {
        title: this.$el.find('#title').val(),
        body: this.$el.find('#body').val()
      };

      this.contentModel.save(attrs, { wait: true }).always(this.destroy);
    }
  });

  var DeleteView = ModalDlgView.extend({
    contentSelector: '#delete-template',

    handleOkBtn: function () {
      this.contentModel.destroy({ wait: true }).always(this.destroy);
    }
  });

  var Blog = Backbone.View.extend({
    el: $('#content'),

    events: {
      'submit #add-post-form': 'handleFormSubmit'
    },

    initialize: function () {
      this.posts = this.$('#posts');
      this.listenTo(this.collection, 'sync remove', this.render);
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