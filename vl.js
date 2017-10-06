const {
    Builder,
    By,
    until,
    ActionSequence,
    Java,
    Key,
    Capabilities,
    Chrome
} = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome')
var songList = require('./name')
var json2xls = require('json2xls');
var fs = require('fs')
var driver;
var chokidar = require('chokidar');
var index = 0;
var errorDownload = []

var loadTime = 5000
var downloadFilepath = "D:/csn"; //luu bai hat vao duong dan nay
var chromeCapabilities = Capabilities.chrome();
var preference = {
    "profile.default_content_settings.popups": 0,
    "download.default_directory": downloadFilepath
}
var chromeOptions = new chrome.Options()
chromeOptions.setUserPreferences(preference)
chromeCapabilities.set('chromeOptions', chromeOptions);
// driver = new Builder().withCapabilities(chromeCapabilities).build();
// // driver = new Builder().forBrowser("chrome").build()    
// driver.manage().timeouts().setScriptTimeout(2000)
// driver.manage().timeouts().pageLoadTimeout(20000)

var watcher = chokidar.watch('D:/csn', {
    persistent: true
});

watcher.on('change', function (path) {
    if (path.indexOf(".crdownload") > 0) return
    if (songList[index]) {
        songList[index].audio = path
    }
    console.log(songList[index])
    lamtiep()
})

var lamtiep = function () {
    console.log((index + 1) + "/" + songList.length)
    index++
    if (index < songList.length) {
        driver.quit().then(
            t => {
                getJuiceOfSongs()
            }
        )
    } else {
        driver.quit()
        //ket qua
        var xls = json2xls(songList);
        var label = "test"
        process.argv.forEach(function (val, index, array) {
            if (index == 2) {
                label = val
            }
        });
        var filename = label + "-audio.xlsx"
        fs.writeFileSync(filename, xls, 'binary');
        //loi
        console.log(errorDownload)
        var err = json2xls(errorDownload);
        var errFile = label + "-error.json"
        fs.writeFileSync('errFile.json', errorDownload, 'utf8')
        process.exit(1)
    }
}

var timCaiHrefNgheNhac = function (song) {
    return new Promise((r, j) => {
        driver.get("http://search.chiasenhac.vn/search.php?s=" + song.keyword + "&cat=music")
            .then(
                s => {                    
                    
                }
            )
            .catch(
                f => {
                    if (f.name == "TimeoutError") {
                        timHref(song, function (href) {
                            r(href)
                        })
                    }
                }
            )
    })
}

var timHref = function (song, callback) {
   return driver.findElement(By.className("tbtable"))
        .findElements(By.tagName("tr"))
        .then(
            d2 => {
                d2[1].findElements(By.tagName("td")).then(
                    d3 => {
                        d3[1].findElement(By.className("tenbh"))
                            .findElements(By.tagName("p"))
                            .then(
                                d4 => {
                                    d4[0].findElement(By.tagName("a"))
                                        .getText()
                                        .then(
                                            d5 => {
                                                song.name = d5
                                            }
                                        )
                                    d4[1].getText()
                                        .then(
                                            d6 => {
                                                song.artist = d6
                                            }
                                        )
                                    d4[0].findElement(By.tagName("a"))
                                        .getAttribute("href")
                                        .then(
                                            d7 => {
                                                callback(d7)
                                            }
                                        )
                                }

                            )
                    }
                )
            }
        )
        .catch(
            e => console.log(e)            
        )
}

var timCaiHrefDownNhac = function () {
    return new Promise((r, j) => {
        driver.findElement(By.className("pl_center"))
            .findElement(By.className("pl-c1"))
            .findElement(By.tagName("div"))
            .findElements(By.tagName("a"))
            .then(
                d9 => {
                    d9[2].getAttribute("href")
                        .then(
                            d10 => {
                                r(d10)
                            }
                        )
                }
            )
            .catch(
                e => {
                    console.log("229")
                    console.log(e)
                }
            )
    })
}

var getJuiceOfSongs = function () {
    driver = new Builder().withCapabilities(chromeCapabilities).build();
    driver.manage().timeouts().pageLoadTimeout(5000)
    timCaiHrefNgheNhac(songList[index]).then(
            r => console.log(r)
        )
        .catch(
            e => {}
        )

}

getJuiceOfSongs()


// driver.wait(until.elementLocated(By.className("tbtable")), 10000).then(
//         d1 => {
//             d1.findElements(By.tagName("tr")).then(
//                 d2 => {
//                     d2[1].findElements(By.tagName("td")).then(
//                         d3 => {
//                             d3[1].findElement(By.className("tenbh"))
//                                 .findElements(By.tagName("p"))
//                                 .then(
//                                     d4 => {
//                                         d4[0].findElement(By.tagName("a"))
//                                             .getText()
//                                             .then(
//                                                 d5 => {
//                                                     songList[index].name = d5
//                                                 }
//                                             )
//                                         d4[1].getText()
//                                             .then(
//                                                 d6 => {
//                                                     songList[index].artist = d6
//                                                 }
//                                             )
//                                         d4[0].findElement(By.tagName("a"))
//                                             .getAttribute("href")
//                                             .then(
//                                                 d7 => {
//                                                     driver.get(d7)

//                                                 }
//                                             )
//                                     }

//                                 )
//                         }
//                     )
//                 }
//             )
//         }
//     )
//     .catch(
//         e1 => {
//             console.log("error")
//             errorDownload.push(index)
//             lamtiep();
//         }
//     )


// driver.wait(until.elementLocated(By.className("pl_center")), 10000)
// .then(
//     d8 => {
//         driver.wait(until.elementLocated(By.className("pl-c1")), 10000)
//             .findElement(By.tagName("div"))
//             .findElements(By.tagName("a"))
//             .then(
//                 d9 => {
//                     d9[2].getAttribute("href")
//                         .then(
//                             d10 => {
//                                 driver.get(d10)
//                                 driver.wait(until.elementLocated(By.className("pl_center")), 10000)
//                                     .then(
//                                         d10 => {
//                                             driver.wait(until.elementLocated(By.className("pl-cr")), 10000)
//                                                 .findElement(By.className("tip-cp4"))
//                                                 .findElement(By.className("tip-text"))
//                                                 .findElement(By.tagName("div"))
//                                                 // .findElement(By.className("genmed"))
//                                                 // .getText()
//                                                 // .then(t => console.log(t))
//                                                 .findElements(By.tagName("b"))
//                                                 // .findElement(By.tagName("a"))
//                                                 .then(
//                                                     d11 => {
//                                                         d11[1].findElement(By.tagName("a"))
//                                                             .then(
//                                                                 d12 => {
//                                                                     d12.click()
//                                                                 }
//                                                             )
//                                                     }
//                                                 )
//                                         }
//                                     )
//                             }
//                         )
//                 }
//             )
//     }
// )