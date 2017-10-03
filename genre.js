const { Builder, By, until, ActionSequence, Java, setChromeOptions } = require('selenium-webdriver');
// const { chromeDriver } = require('selenium-webdriver/chrome');
// var songList = require('./data')
var songList = require('./name')
var json2xls = require('json2xls');
var fs = require('fs')


var getGenreOfSongs = function(songs, index, callback) {
    var key = songs[index].keyword
    var searchParam = "?q=" + key + "&type=all"
    driver.get('https://www.discogs.com/search/' + searchParam)
    driver.wait(until.elementLocated(By.id("search_results")), 5000).then(
        div1 => {
            div1.findElement(By.className("card")).then(
                div2 => {
                    div2.findElement(By.tagName("a")).then(
                        div3 => {
                            div3.click()
                            driver.wait(until.elementLocated(By.className("profile")), 10000).then(
                                div4 => {
                                    div4.findElement(By.xpath("//div[@itemprop='genre']")).then(
                                        div5 => {
                                            div5.findElement(By.tagName("a")).then(
                                                div6 => {
                                                    div6.getText().then(
                                                        text => {
                                                            songs[index].genre = text;
                                                            console.log(index + "/" + songs.length)
                                                            index++
                                                            if (index < songs.length) {
                                                                getGenreOfSongs(songs, index, callback)
                                                            } else {
                                                                callback(songs)
                                                            }
                                                        }
                                                    )
                                                }
                                            )
                                        }
                                    )
                                }
                            ).catch(e => {
                                index++
                                if (index < songs.length) {
                                    getGenreOfSongs(songs, index, callback)
                                } else {
                                    callback(songs)
                                }
                            })
                        }
                    )
                }
            )
        }
    ).catch(e => {
        index++
        if (index < songs.length) {
            getGenreOfSongs(songs, index, callback)
        } else {
            callback(songs)
        }
    })
}

// const options = new chromeDriver.Options();
// options.addArguments(
//     'headless',
//     'disable-gpu');

driver = new Builder()
    .forBrowser('chrome')
    // .setChromeOptions(options)
    .build()


getGenreOfSongs(songList, 0, function(list) {
    var xls = json2xls(list);
    var label = "test"
    process.argv.forEach(function(val, index, array) {
        if (index == 2) {
            label = val
        }
    });
    var filename = label + "-genre.xlsx"
    fs.writeFileSync(filename, xls, 'binary');
})

var logToFile = function(song) {
    var obj = {
        table: []
    };
    obj.table.push(song);
    var json = JSON.stringify(obj);
    fs.readFile('juice.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.table.push(song); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('juice.json', json, 'utf8', callback); // write it back 
        }
    });
}