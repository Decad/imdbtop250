var app = app || {};

(function(){
    app.Movie = Backbone.Model.extend({
        defaults: {
            title: '',
            url: '',
            completed: false
        },
        toggle: function () {
            this.save({
                completed: !this.get('completed')
            });
        }
    })
})();