(function () {
  'use strict';

  var PostModel = Backbone.Model.extend({
    defaults: function () {
      return {
        author: 'Gustavo Souza',
        date: (new Date()).getTime()
      };
    },

    idAttribute: '_id',

    urlRoot: '/posts'
  });

  var ModalDlgModel = Backbone.Model.extend({
    defaults: {
      cancelText: 'Cancel',
      okText: 'OK'
    }
  });

  // var PaginationModel

  var PostCollection = Backbone.Collection.extend({
    model: PostModel,

    url: '/posts',

    limit: 2,

    initialize: function () {
      this.offset = 0;
    },

    parse: function (res) {
      this.count = Number(res.count);
      return res.posts;
    },

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
      'shown.bs.modal': 'setupForm',
      'hidden.bs.modal': 'destroy'
    },

    initialize: function (options) {
      _(this).bindAll();
      this.contentModel = options.contentModel;
    },

    render: function () {
      var contentTmpl = _.template($(this.contentTmplSelector).html());
      var content = contentTmpl(this.contentModel.toJSON());
      
      this.$el
        .html(this.template(this.model.toJSON()))
        .find('.modal-body').append($(content))
        .end()
        .modal('show');

      return this;
    },

    setupForm: function () {
      this.$el.find('#post-form')
        .bootstrapValidator()
        .on('success.form.bv', this.handleSubmit);
    },

    destroy: function () {
      this.$el.data('modal', null);
      this.remove();
    }
  });

  var EditView = ModalDlgView.extend({
    contentTmplSelector: '#form-template',

    handleSubmit: function (e) {
      e.preventDefault();

      var attrs = {
        title: this.$el.find('#title').val(),
        body: this.$el.find('#body').val()
      };

      this.contentModel.save(attrs, { wait: true }).always(this.destroy);
    }
  });

  var DeleteView = ModalDlgView.extend({
    contentTmplSelector: '#delete-template',

    handleSubmit: function (e) {
      e.preventDefault();
      this.contentModel.destroy({ wait: true }).always(this.destroy);
    }
  });

  var AddView = ModalDlgView.extend({
    contentTmplSelector: '#form-template',

    handleSubmit: function (e) {
      e.preventDefault();

      postCollection.create({
        title: this.$el.find('#title').val(),
        body: this.$el.find('#body').val()
      }, {
        wait: true,
        success: this.destroy,
        error: this.destroy
      });
    }
  });

  var PaginationView = Backbone.View.extend({
    template: _.template($('#pagination-template').html()),

    attributes: {
      'id': 'pagination',
      'class': 'btn-group',
      'role': 'group'
    },

    initialize: function () {},

    render: function () {
      this.$el.html(this.template());
      return this;
    }
  });

  var Blog = Backbone.View.extend({
    el: $('body'),

    events: {
      'click #add-post': 'handleAdd'
    },

    initialize: function () {
      _(this).bindAll();

      this.posts = this.$('#posts');
      this.pagination = null;

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
      
      this.posts
        .hide()
        .fadeIn()
        .promise()
        .done(this.renderPagination);

      return this;
    },

    renderPagination: function () {
      if (!this.pagination) {
        this.pagination = new PaginationView();
      }

      if (this.collection.size() > this.collection.limit) {
        this.posts.after(this.pagination.render().el);
      }
    },

    handleAdd: function () {
      var dlgModel = new ModalDlgModel({
          title: 'Add new post',
          okText: 'Add'
      });

      var postModel = new PostModel({
        title: '',
        body: ''
      });

      var view = new AddView({
        model: dlgModel,
        contentModel: postModel
      });

      view.render();
    }
  });

  var postCollection = new PostCollection();
  new Blog({ collection: postCollection });

}).call(this);