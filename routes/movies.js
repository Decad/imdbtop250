var fs = require('fs'),
    movies = JSON.parse(fs.readFileSync('movies.json')),
    dirty = false;

var routes = {
    index: function(req, res){
        res.write(JSON.stringify(movies))
        res.end()
    },
    update: function(req, res){
        var id = req.body.id
        for (var i = movies.length - 1; i >= 0; i--) {
            if(movies[i].id == id){
                movies[i].completed = req.body.completed
                dirty = true;
                break;
            }
        }
        res.end()
    }
}

setInterval(function(){
    if(dirty){
        fs.writeFile('movies.json', JSON.stringify(movies), function(err){
            if(err){
                console.log("Error saving state:" + err)
            } else {
                dirty = false
                console.log("State Saved!")
            }
        })
    }
}, 1000)

module.exports = routes