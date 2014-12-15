(function () {
  'use strict';

  var PostModel = Backbone.Model.extend({
    defaults: function () {
      return {
        title: '',
        text: ''
      };
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

  var MainModel = Backbone.Model.extend({
    defaults: {
      post: null
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
        'data-id': this.model.get('_id'),
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
        'data-id': this.model.get('_id'),
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

      this.update();
    },

    update: function () {
      if (this.model.get('activeIndex') === 0) {
        // Trigger change manually since we still want
        // to display the first post.
        this.collection.trigger('change');
      } else {
        // Otherwise set activeIndex, which will
        // trigger the change event.
        this.model.set({ activeIndex: 0 });
      }
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
    initialize: function () {
      // this.post = this.model.get('post');
      this.listenTo(this.model, 'change:post', this.update);

      // if (this.model.get('post')) {
      //   this.listenTo(this.model.get('post'), 'sync', this.render);
      //   this.post.fetch();
      // }

      // if (this.model) {
      //   this.listenToOnce(this.model, 'sync', this.render);
      //   this.model.fetch();
      // } else {
      //   this.render();
      // }
    },

    update: function () {
      var post = this.model.get('post');

      if (post) {
        this.listenTo(post, 'sync', this.render);
        post.fetch();
      } else {
        this.render();
      }
    },

    removeEvents: function () {
      var post = this.model.get('post');

      if (post) {
        this.stopListening(post);
      }
    },

    render: function () {
      var post = this.model.get('post');
      var view = post ?
        new PostView({ model: post }) :
        new EmptyView();

      this.$el
        .hide()
        .empty()
        .append(view.render().el)
        .fadeIn();

      return this;
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
      this.$el.find('#post-form')
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

    displayError: function (model, res) {
      var err = res.responseJSON;

      // TODO: Doesn't the plugin's API have an interface for this?
      this.$('form .form-group')
        .addClass('has-error')
        .removeClass('has-success')
        .find('.form-control-feedback')
          .addClass('glyphicon-remove')
          .removeClass('glyphicon-ok')
          .end()
        .filter(':last-child')
        .find('small').text(err.message).show();
    }
  });

  var AddView = ModalDlgView.extend({
    contentTmplSelector: '#form-template',

    handleSubmit: function (e) {
      e.preventDefault();

      this.collection.create({
        title: this.$el.find('#title').val(),
        text: this.$el.find('#text').val()
      }, {
        wait: true,
        success: this.destroy,
        error: this.displayError
      });
    }
  });

  var EditView = ModalDlgView.extend({
    contentTmplSelector: '#form-template',

    handleSubmit: function (e) {
      e.preventDefault();

      var attrs = {
        title: this.$el.find('#title').val(),
        text: this.$el.find('#text').val()
      };

      this.contentModel
        .save(attrs, { wait: true, type: 'post' })
        .done(this.destroy)
        .fail(this.displayError);
    },
  });

  var DeleteView = ModalDlgView.extend({
    contentTmplSelector: '#delete-template',

    handleSubmit: function (e) {
      e.preventDefault();

      this.contentModel
        .destroy({ wait: true })
        .done(this.destroy)
        .fail(this.displayError);
    }
  });

  var Blog = Backbone.View.extend({
    el: $('#content'),

    initialize: function () {
      this.$nav = this.$('#nav');
      this.$main = this.$('#main');

      this.navListModel = new NavListModel();
      this.mainModel = new MainModel();

      this.navView = new NavView({
        el: this.$nav,
        model: this.navListModel,
        collection: this.collection
      });

      this.mainView = new MainView({
        model: this.mainModel,
        el: this.$main
      });

      this.listenTo(this.collection, 'reset add remove', this.render);
      this.listenTo(this.collection, 'change', this.showMain);
      this.listenTo(this.navListModel, 'change:activeIndex', this.showMain);

      this.collection.fetch({ add: false, reset: true });
    },

    showNav: function () {
      this.navView.render();
    },

    showMain: function () {
      var post = this.collection.at(this.navListModel.get('activeIndex'));
      this.mainView.removeEvents();
      this.mainModel.set({ post: post });
      // new MainView({ model: post, el: this.$main });
    },

    render: function () {
      this.showNav();
      return this;
    },
  });

  var postCollection = new PostCollection();
  new Blog({ collection: postCollection });

}).call(this);