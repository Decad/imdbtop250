var app = app || {};

(function(){
    app.MovieList = Backbone.Collection.extend({
        model: app.Movie,
        //localStorage: new Backbone.LocalStorage('top250-movies')
        url: 'films.json'
    })

    app.Movies = new app.MovieList();
})()