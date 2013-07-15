var app = app || {};

(function() {
    app.MovieView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#movie-template').html()),
        events: {
            "click .toggle": "toggle"
        },
        render: function(){
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).append(renderedContent);
            return this
        },
        toggle: function() {
            this.model.toggle()
        }
    })
})()