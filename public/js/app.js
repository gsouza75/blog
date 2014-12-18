(function () {
  'use strict';

  var PostModel = Backbone.Model.extend({
    defaults: {
      title: '',
      text: ''
    },

    urlRoot: '/Blog/api'
  });

  var ModalDlgModel = Backbone.Model.extend({
    defaults: {
      cancelText: 'Cancel',
      okText: 'OK'
    }
  });

  var NavListModel = Backbone.Model.extend({
    defaults: {
      activeIndex: -1
    }
  });

  var PostCollection = Backbone.Collection.extend({
    model: PostModel,

    url: '/Blog/api',

    comparator: function (post) {
      return -Date.parse(post.get('timestamp'));
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
        'data-id': this.model.get('id'),
        'class': 'post'
      };
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    handleEdit: function (e) {
      e.preventDefault();

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

    handleDelete: function (e) {
      e.preventDefault();

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

  var NavListView = Backbone.View.extend({
    tagName: 'ul',

    events: {
      'click .nav-link': 'handleItemClick'
    },

    attributes: function () {
      return {
        'data-id': this.model.get('id'),
        'class': 'nav-content nav nav-pills nav-stacked'
      };
    },

    initialize: function () {
      this.listenTo(this.model, 'change:activeIndex', this.update);
    },

    handleItemClick: function (e) {
      e.preventDefault();
      var index = $(e.currentTarget).closest('li').index();
      this.model.set({ activeIndex: index });
    },

    update: function () {
        this.$el
          .find('li')
          .removeClass('active')
          .eq(this.model.get('activeIndex'))
          .addClass('active');
    },

    render: function () {
      var self = this;
      
      this.collection.each(function (model) {
        var view = new NavItemView({ model: model });
        self.$el.append(view.render().el);
      });
      
      this.update();
      return this;
    }
  });

  var NavItemView = Backbone.View.extend({
    tagName: 'li',

    template: _.template($('#nav-item-template').html()),

    render: function () {
      this.$el.append(this.template(this.model.toJSON()));
      return this;
    }
  });

  var NavView = Backbone.View.extend({
    events: {
      'click #add-post': 'handleAddBtn'
    },

    render: function () {
      var listView = new NavListView({
        model: this.model,
        collection: this.collection
      });

      this.$el
        .hide()
        .find('.nav-content').remove()
        .end()
        .prepend(listView.render().el)
        .fadeIn();
    },

    handleAddBtn: function () {
      var dlgModel = new ModalDlgModel({
          title: 'Add new post',
          okText: 'Add'
      });

      var postModel = new PostModel();

      var addView = new AddView({
        model: dlgModel,
        collection: this.collection,
        contentModel: postModel
      });

      addView.render();
    }
  });

  var EmptyView = Backbone.View.extend({
    tagName: 'em',

    className: 'empty-msg',

    render: function () {
      this.$el.text('This blog is empty.');
      return this;
    }
  });

  var MainView = Backbone.View.extend({
    render: function () {
      var view = this.model ?
        new PostView({ model: this.model }) :
        new EmptyView();

      this.$el
        .hide()
        .empty()
        .append(view.render().el)
        .fadeIn();

      return this;
    },

    update: function (fetch) {
      if (this.model) {
        this.stopListening();
        this.listenTo(this.model, 'sync', this.render);
        if (fetch) {
          this.model.fetch();
        }
      } else {
        this.render();
      }
    }
  });

  var ModalDlgView = Backbone.View.extend({
    className: 'modal fade',

    template: _.template($('#modal-template').html()),

    events: {
      'shown.bs.modal': 'onLoaded',
      'hidden.bs.modal': 'onUnloaded'
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

    onLoaded: function () {
      this.$('#post-form')
        .bootstrapValidator()
        .on('success.form.bv', this.handleSubmit)
        .find('input').eq(0).focus();
    },

    onUnloaded: function () {
      this.$el.data('bs.modal', null);
      this.remove();
    },

    destroy: function () {
      this.$el.modal('hide');
    },

    handleError: function (res) {
      this.displayError(res.responseJSON.message);
    },

    displayError: function (message) {
      this.$('#post-form').data('bootstrapValidator')
        .updateStatus('text', 'INVALID', 'callback')
        .updateStatus('title', 'INVALID', 'callback')
        .updateMessage('text', 'callback', message);
    }
  });

  var AddView = ModalDlgView.extend({
    contentTmplSelector: '#form-template',

    handleSubmit: function (e) {
      e.preventDefault();

      this.collection.create({
        title: this.$('#title').val(),
        text: this.$('#text').val()
      }, {
        wait: true,
        success: this.destroy,
        error: this.handleError
      });
    },

    handleError: function (model, res) {
      this.displayError(res.responseJSON.message);
    }
  });

  var EditView = ModalDlgView.extend({
    contentTmplSelector: '#form-template',

    handleSubmit: function (e) {
      e.preventDefault();

      var attrs = {
        title: this.$('#title').val(),
        text: this.$('#text').val()
      };

      this.contentModel
        .save(attrs, { wait: true, type: 'post' })
        .done(this.destroy)
        .fail(this.handleError);
    },
  });

  var DeleteView = ModalDlgView.extend({
    contentTmplSelector: '#delete-template',

    handleSubmit: function (e) {
      e.preventDefault();

      this.contentModel
        .destroy({ wait: true })
        .done(this.destroy)
        .fail(this.handleError);
    },

    displayError: function (message) {
      this.$('.form-group')
        .addClass('has-error')
        .find('.help-block')
        .text(message)
        .closest('form')
        .find('.btn-primary')
        .removeAttr('disabled');
    }
  });

  var Blog = Backbone.View.extend({
    el: $('#content'),

    initialize: function () {
      this.added = false;

      this.collection = new PostCollection();
      this.navListModel = new NavListModel();

      this.navView = new NavView({
        el: this.$('#nav'),
        model: this.navListModel,
        collection: this.collection
      });

      this.mainView = new MainView({ el: this.$('#main') });

      this.listenTo(this.collection, 'reset remove', this.render);
      this.listenTo(this.collection, 'add', this.addPost);
      this.listenTo(this.navListModel, 'change:activeIndex', this.showMain);

      this.collection.fetch({ add: false, reset: true });
    },

    showMain: function () {
      var view = this.mainView;
      var index = this.navListModel.get('activeIndex');
      var post = this.collection.at(index);
      
      view.model = post;
      view.update(!this.added);

      this.added = false;
    },

    addPost: function () {
      this.added = true;
      this.render();
    },

    render: function () {
      this.navView.render();
      this.navListModel
        .set({ activeIndex: 0 }, { silent: true })
        .trigger('change:activeIndex');

      return this;
    },
  });

  // Start the app.
  new Blog();

}).call(this);