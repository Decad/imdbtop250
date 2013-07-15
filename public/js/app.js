$(function(){
    'use strict';

    var app = app || {};


    var Router = Backbone.Router.extend({
        routes: {
            '*filter': 'setFilter'
        },
        setFilter: function(param){
            app.filter = param || 'all';
            app.appView.collection.trigger('filter')
            $('.filter').removeClass('active')
            $('.filter[href=#' + param + ']').addClass('active')
        }
    })

    app.Movie = Backbone.Model.extend({
        defaults: {
            title: '',
            url: '',
            completed: false,
            desc: ''
        },
        toggle: function () {
            this.save({
                completed: !this.get('completed')
            });
        }
    })

    app.MovieList = Backbone.Collection.extend({
        model: app.Movie,
        url: 'movies'
    })

    app.AppView = Backbone.View.extend({
        el: '#movies',
        events: {
            'click .filter': 'filter'
        },
        initialize: function(){
            this.collection = new app.MovieList()
            this.collection.bind('change', this.render, this);
            this.collection.bind('reset', this.render, this);
            this.collection.bind('filter', this.filter, this);
            this.collection.fetch({ reset: true })
        },
        render: function() {
            var self = this,
                watch = 0;
            $(this.el).html('')
            _(this.collection.models).each(function(movie){
                var iv = new app.MovieView({
                    model: movie
                })
                if(movie.attributes.completed)
                    watch++
                $(self.el).append(iv.render().el)
            })
            $('#watched-count span').html(watch)
        },
        filter: function(){
            _(this.collection.models).each(function(movie){
                movie.trigger('visable')
            })
        }
    })

    app.MovieView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#movie-template').html()),
        events: {
            'click .complete': 'toggle',
            'click a': 'show'
        },
        initialize: function(){
            this.model.bind('visable', this.visable, this)
        },
        render: function(){
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).append(renderedContent);
            return this
        },
        toggle: function() {
            this.model.toggle()
        },
        show: function() {
            $(this.el).find('article').slideToggle()
            return false
        },
        isHidden: function(){
            var complete = this.model.attributes.completed
            return (
                !complete && app.filter === 'watched' ||
                complete && app.filter === 'unwatched'
            )
        },
        visable: function(){
            this.$el.toggleClass('hide', this.isHidden())
        }
    })



    app.appView = new app.AppView();
    app.Router = new Router();
    Backbone.history.start();
})