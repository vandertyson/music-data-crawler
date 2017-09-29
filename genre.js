const { Builder, By, until, ActionSequence, Java } = require('selenium-webdriver');
var songList = require('./data')
var json2xls = require('json2xls');
var fs = require('fs')


var getGenreOfSongs = function(songs, index, callback) {
    var key = songs[index].name
    if (key.length < 15) {
        key += "+" + songs[index].artist
    }
    var searchParam = "?q=" + key + "&type=all"
    driver.get('https://www.discogs.com/search/' + searchParam)
    driver.wait(until.elementLocated(By.id("search_results"))).then(
        div1 => {
            div1.findElement(By.className("card")).then(
                div2 => {
                    div2.findElement(By.tagName("a")).then(
                        div3 => {
                            div3.click()
                            driver.wait(until.elementLocated(By.className("profile"))).then(
                                div4 => {
                                    div4.findElement(By.xpath("//div[@itemprop='genre']")).then(
                                            div5 => {
                                                div5.findElement(By.tagName("a")).then(
                                                    div6 => {
                                                        div6.getText().then(
                                                            text => {
                                                                console.log(text)
                                                                songs[index].genre = text;
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
                                        // ).catch(err => {
                                        //     index++
                                        //     if (index < songs.length) {
                                        //         getGenreOfSongs(songs, index, callback)
                                        //     } else {
                                        //         callback(songs)
                                        //     }
                                        // })
                                }
                            )
                        }
                    )
                }
            )
        }
    )


}


driver = new Builder()
    .forBrowser('chrome')
    .build();

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