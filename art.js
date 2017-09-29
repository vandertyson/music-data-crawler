const { Builder, By, until, ActionSequence, Java } = require('selenium-webdriver');
var songList = require('./data')
var json2xls = require('json2xls');
var fs = require('fs')
var driver

driver = new Builder()
    .forBrowser('chrome')
    .build();

var getImageOfSongs = function(songs, index, callback) {
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
                            driver.wait(until.elementLocated(By.className("image_gallery"))).then(
                                div4 => {
                                    div4.findElement(By.tagName("a")).then(
                                        div5 => {
                                            div5.getAttribute("href").then(
                                                href => {
                                                    driver.get(href)
                                                    driver.wait(until.elementLocated(By.id("view_images"))).then(
                                                        div6 => {
                                                            div6.findElement(By.tagName("img")).then(
                                                                div7 => {
                                                                    div7.getAttribute("src").then(
                                                                        src => {
                                                                            console.log(src)
                                                                            songs[index].image = src;
                                                                            index++
                                                                            if (index < songs.length) {
                                                                                getImageOfSongs(songs, index, callback)
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
                                            )
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            )
        }
    )


}


getImageOfSongs(songList, 0, function(list) {
    var xls = json2xls(list);
    process.argv.forEach(function(val, index, array) {
        if (index == 2) {
            label = val
        }
    });
    var filename = label + "-art.xls"
    fs.writeFileSync(filename, xls, 'binary');
})