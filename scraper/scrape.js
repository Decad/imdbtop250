var fs = require('fs'),
    movies = JSON.parse(fs.readFileSync('../movies.json')),
    cp = require('child_process'),
    running = 0,
    completed = 0,
    alreadyCompleted = 0;

for(j = 0; j < 40; j++){
    spawnScraper()
}


function spawnScraper(){
    var i = running++
    if(running > movies.length){
        return
    }
    if(movies[i].desc){
        alreadyCompleted++
        spawnScraper()
        return
    }
    console.log('Spawning scraper for ', i)
    var ps = cp.spawn('phantomjs', ['scrap.js', movies[i].url])
    ps.stdout.setEncoding('utf8')
    ps.stdout.on('data', function(data){
        movies[i].desc = data.replace(/\n/g, '').trim()
        console.log("i: ",i , "data: ", data)
    })
    ps.on('exit', function(){
        completed++
        console.log('Completed:' + completed)
        if(completed < movies.length - alreadyCompleted){
            spawnScraper()
        } else {
            fs.writeFile('../movies.json', JSON.stringify(movies), function(err){
                console.log('Saved')
            })
        }
    })
}