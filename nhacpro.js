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

var downloadTime = 15000; //doi 15s download cho moi bai hat
var downloadFilepath = "D:/songs"; //luu bai hat vao duong dan nay
var chromeCapabilities = Capabilities.chrome();
var preference = {
    "profile.default_content_settings.popups": 0,
    "download.default_directory": downloadFilepath
}
var chromeOptions = new chrome.Options()
chromeOptions.setUserPreferences(preference)
chromeCapabilities.set('chromeOptions', chromeOptions);
var stopLoad = function() {
    // driver.findElement(By.tagName("body")).sendKeys(Key.ESCAPE);
    driver.executeScript("window.stop()")
        // driver.executeScript("var t = window.stop();")
        // driver.findElement(By.tagName("body")).sendKeys(Keys.ARROW_DOWN);
        // var action = new ActionSequence(driver)

}

var getJuiceOfSongs = function(list, index, callback) {
    // driver = new Builder().withCapabilities(chromeCapabilities).build();
    driver = new Builder().forBrowser("chrome").build()
    driver.get("http://search.chiasenhac.vn/search.php?s=" + list[index].keyword + "&cat=music")
    setTimeout(function() {
        stopLoad();
    }, 1000)
    driver.wait(until.elementLocated(By.className("tbtable")), 10000).then(
        d1 => {
            d1.findElements(By.tagName("tr")).then(
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
                                                    console.log(d5)
                                                    list[index].name = d5
                                                }
                                            )
                                        d4[1].getText()
                                            .then(
                                                d6 => {
                                                    console.log(d6)
                                                    list[index].artist = d6
                                                }
                                            )
                                        d4[0].findElement(By.tagName("a"))
                                            .getAttribute("href")
                                            .then(
                                                d7 => {
                                                    driver.get(d7)
                                                    setTimeout(function() {
                                                        stopLoad();
                                                    }, 1000)
                                                    driver.wait(until.elementLocated(By.className("pl_center")), 10000)
                                                        .then(
                                                            d8 => {
                                                                driver.wait(until.elementLocated(By.className("pl-c1")), 10000)
                                                                    .findElement(By.tagName("div"))
                                                                    .findElements(By.tagName("a"))
                                                                    .then(
                                                                        d9 => {
                                                                            d9[2].getAttribute("href")
                                                                                .then(
                                                                                    d10 => {
                                                                                        driver.get(d10)
                                                                                        setTimeout(function() {
                                                                                            console.log("dm")
                                                                                            stopLoad();
                                                                                        }, 1000)
                                                                                        driver.wait(until.elementLocated(By.className("pl_center")), 10000)
                                                                                            .then(
                                                                                                d10 => {
                                                                                                    driver.wait(until.elementLocated(By.className("pl-cr")), 10000)
                                                                                                        .findElement(By.className("tip-cp4"))
                                                                                                        .findElement(By.className("tip-text"))
                                                                                                        .findElement(By.tagName("div"))
                                                                                                        // .findElement(By.className("genmed"))
                                                                                                        // .getText()
                                                                                                        // .then(t => console.log(t))
                                                                                                        .findElements(By.tagName("b"))
                                                                                                        // .findElement(By.tagName("a"))
                                                                                                        .then(
                                                                                                            d11 => {
                                                                                                                d11[1].findElement(By.tagName("a"))
                                                                                                                    .then(
                                                                                                                        d12 => { d12.click() }
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
            )
        }
    ).catch(
        e1 => {
            console.log(e1)
            driver.quit()
        }
    )

    // driver.wait(until.elementLocated(By.id('results')), 10 * 1000).then(
    //     go => {
    //         go.findElement(By.id('result_1')).then(ele => {
    //                 ele.findElement(By.className("name")).then(
    //                     name => {
    //                         name.getText().then(
    //                             textName => {
    //                                 console.log(textName)
    //                                 list[index].audio = downloadFilepath + "/" + textName.trim() + ".mp3"
    //                             }
    //                         )
    //                     }
    //                 )
    //                 ele.findElement(By.className('options')).then(
    //                     opt => {
    //                         opt.findElement(By.className("download")).then(
    //                             btn => {
    //                                 btn.click()
    //                                 driver.wait(until.elementLocated(By.id("download_1")), 10000).then(
    //                                         div1 => {
    //                                             div1.findElement(By.className("options")).then(
    //                                                 div2 => {
    //                                                     driver.wait(until.elementLocated(By.className("url")), 10000).then(
    //                                                         atag => {
    //                                                             driver.wait(until.elementLocated(By.className("progress")), 10000)
    //                                                                 .then(d => {
    //                                                                     driver.wait(until.elementTextContains(d, "The file is ready"), 10000)
    //                                                                         .then(
    //                                                                             z => {
    //                                                                                 atag.click().then(
    //                                                                                     gg => {
    //                                                                                         driver.get("chrome://downloads/");
    //                                                                                         // driver.wait(until.elementLocated(By.id("show")), downloadTime).then(
    //                                                                                         //     mm => {
    //                                                                                         //         console.log(index + "/" + list.length)
    //                                                                                         //         driver.quit()
    //                                                                                         //         index++;
    //                                                                                         //         if (index < list.length) {
    //                                                                                         //             getJuiceOfSongs(list, index, callback)
    //                                                                                         //         } else {
    //                                                                                         //             if (callback) {
    //                                                                                         //                 callback(list)
    //                                                                                         //             }
    //                                                                                         //         }
    //                                                                                         //     }
    //                                                                                         // ).catch(
    //                                                                                         //     err => {
    //                                                                                         //         console.log(index + "/" + list.length)
    //                                                                                         //         driver.quit()
    //                                                                                         //         index++;
    //                                                                                         //         if (index < list.length) {
    //                                                                                         //             getJuiceOfSongs(list, index, callback)
    //                                                                                         //         } else {
    //                                                                                         //             if (callback) {
    //                                                                                         //                 callback(list)
    //                                                                                         //             }
    //                                                                                         //         }
    //                                                                                         //     }

    //                                                                                         // )
    //                                                                                         driver.wait(until.elementLocated(By.tagName("downloads-manager"))).then(
    //                                                                                             d1 => {
    //                                                                                                 console.log("ok1")
    //                                                                                                 console.log(d1.shadowRoot)
    //                                                                                                     // driver.wait(until.elementLocated(By.id("content")))
    //                                                                                                     // d1.findElement(By.tagName("downloads-item"))
    //                                                                                                     .then(
    //                                                                                                         d2 => {
    //                                                                                                             console.log("ok2")
    //                                                                                                         }
    //                                                                                                     ).catch(
    //                                                                                                         e2 => {
    //                                                                                                             console.log("fail2")
    //                                                                                                         }
    //                                                                                                     )
    //                                                                                             }
    //                                                                                         ).catch(
    //                                                                                             e1 => {
    //                                                                                                 console.log("fail1")
    //                                                                                             }
    //                                                                                         )
    //                                                                                     }
    //                                                                                 )
    //                                                                             }
    //                                                                         )
    //                                                                 })
    //                                                                 .catch(
    //                                                                     e => {
    //                                                                         driver.quit()
    //                                                                         index++;
    //                                                                         if (index < list.length) {
    //                                                                             getJuiceOfSongs(list, index, callback)
    //                                                                         } else {
    //                                                                             if (callback) {
    //                                                                                 callback(list)
    //                                                                             }
    //                                                                         }
    //                                                                     }
    //                                                                 )
    //                                                         })
    //                                                 }
    //                                             )
    //                                         }
    //                                     )
    //                                     .catch(
    //                                         e => {
    //                                             driver.quit()
    //                                             index++;
    //                                             if (index < list.length) {
    //                                                 getJuiceOfSongs(list, index, callback)
    //                                             } else {
    //                                                 if (callback) {
    //                                                     callback(list)
    //                                                 }
    //                                             }
    //                                         }
    //                                     )
    //                             }
    //                         )
    //                     })
    //             })
    //             .catch(
    //                 e => {
    //                     driver.quit()
    //                     index++;
    //                     if (index < list.length) {
    //                         getJuiceOfSongs(list, index, callback)
    //                     } else {
    //                         if (callback) {
    //                             callback(list)
    //                         }
    //                     }
    //                 }
    //             )
    //     }
    // )
}

getJuiceOfSongs(songList, 0, function(list) {
    var xls = json2xls(list);
    var label = "test"
    process.argv.forEach(function(val, index, array) {
        if (index == 2) {
            label = val
        }
    });
    var filename = label + "-audio.xlsx"
    fs.writeFileSync(filename, xls, 'binary');
})