var app = app || {};

(function($){
    'use strict';

    app.AppView = Backbone.View.extend({
        el: '#movies',
        initialize: function(){
            this.collection = new app.MovieList()
            this.collection.bind("change", this.render, this);
            this.collection.bind("reset", this.render, this);
            this.collection.fetch({ reset: true})
        },
        render: function() {
            var self = this
            _(this.collection.models).each(function(item){
                var iv = new app.MovieView({
                    model: item
                })
                $(self.el).append(iv.render().el)
            })
        }
    })

})($)