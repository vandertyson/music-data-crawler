const { Builder, By, until, ActionSequence, Java } = require('selenium-webdriver');
var songList = require('./data')
var json2xls = require('json2xls');
var fs = require('fs')
var driver;

var getJuiceOfSongs = function(list, index, callback) {
    driver = new Builder()
        .forBrowser('chrome')
        .build();
    driver.get('https://www.mp3juices.cc/')
    driver.findElement(By.id('query')).sendKeys(list[index].keyword);
    driver.findElement(By.id('button')).click();
    driver.wait(until.elementLocated(By.id('results')), 10 * 1000).then(
        go => {
            go.findElement(By.id('result_1')).then(ele => {
                ele.findElement(By.className('options')).then(
                    opt => {
                        opt.findElement(By.className("download")).then(
                            btn => {
                                btn.click()
                                driver.wait(until.elementLocated(By.id("download_1")), 10000).then(
                                    div1 => {
                                        div1.findElement(By.className("options")).then(
                                            div2 => {
                                                driver.wait(until.elementLocated(By.className("url")), 10000).then(
                                                    atag => {
                                                        driver.wait(until.elementLocated(By.className("progress")), 10000)
                                                            .then(d => {
                                                                driver.wait(until.elementTextContains(d, "The file is ready")).then(
                                                                    z => {
                                                                        atag.getAttribute("href").then(
                                                                            link => {
                                                                                console.log(link)
                                                                                list[index].audio = link;
                                                                                driver.quit()
                                                                                index++;
                                                                                if (index < list.length) {
                                                                                    getJuiceOfSongs(list, index, callback)
                                                                                } else {
                                                                                    if (callback) {
                                                                                        callback(list)
                                                                                    }
                                                                                }
                                                                            }
                                                                        )
                                                                    }
                                                                )
                                                            })
                                                    })
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    })
            })
        }
    )
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