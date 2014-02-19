$(function(){
    'use strict';

    var app = app || {};


    var Router = Backbone.Router.extend({
        routes: {
            '*filter': 'filterRouter'
        },
        filterRouter: function(param) {
            app.filter = param || 'all';
            app.setFilter()
        }
    })

    app.setFilter = function(){
        app.appView.collection.trigger('filter')
        $('.filter').removeClass('active')
        $('.filter[href=#' + app.filter + ']').addClass('active')
    }

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
        el: '#top250app',
        events: {
            'click .random': 'random',
            'keyup .search': 'search'
        },
        initialize: function(){
            this.collection = new app.MovieList()
            this.collection.bind('change', this.render, this);
            this.collection.bind('reset', this.render, this);
            this.collection.bind('filter', this.filter, this);
            this.collection.bind('random', this.random, this);
            this.collection.fetch({ reset: true })
        },
        render: function() {
            var self = this,
                watch = 0;
            $('#movies').html('')
            _(this.collection.models).each(function(movie){
                var iv = new app.MovieView({
                    model: movie
                })
                if(movie.attributes.completed)
                    watch++
                $('#movies').append(iv.render().el)
            })
            $('#watched-count span').html(watch)
            app.setFilter()
            this.search()
        },
        filter: function(){
            _(this.collection.models).each(function(movie){
                movie.trigger('visable')
            })
        },
        random: function(){
            var unwatched = _.filter(this.collection.models, function(m){ return !m.attributes.completed })
            _(this.collection.models).each(function(movie){
                movie.trigger('hide')
            })

            unwatched[Math.floor(Math.random() * unwatched.length)].trigger('show')
        },
        search: function(){
            var self = this,
                str = $('.search').val();

            _(this.collection.models).each(function(obj){
                var complete = obj.attributes.completed
                if(str.length === 0) {
                    obj.trigger('show')
                } else if(complete && app.filter === 'watched' || !complete && app.filter === 'unwatched' || app.filter === 'all'){
                    if(obj.attributes.title.toLowerCase().indexOf(str.toLowerCase()) === -1) {
                        obj.trigger('hide')
                    } else {
                        obj.trigger('show')
                    }
                }
            })
        }
    })

    app.MovieView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#movie-template').html()),
        events: {
            'click .complete': 'toggle',
            'click a': 'showDesc'
        },
        initialize: function(){
            this.model.bind('visable', this.visable, this)
            this.model.bind('hide', this.hide, this)
            this.model.bind('show', this.show, this)
        },
        render: function(){
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).append(renderedContent);
            return this
        },
        toggle: function() {
            this.model.toggle()
        },
        showDesc: function() {
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
        },
        hide: function(){
            this.$el.addClass('hide')
        },
        show: function(){
            this.$el.removeClass('hide')
        }
    })


    window.app = app
    app.appView = new app.AppView();
    app.Router = new Router();
    Backbone.history.start();
})