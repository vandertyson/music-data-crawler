const { Builder, By, until, ActionSequence, Java, WebElement } = require('selenium-webdriver');
var json2xls = require('json2xls');
var fs = require('fs')
var Song = require('./Song')


var getSongs = function(driver, chart, callback) {
    var result = [];
    driver.get("http://www.livepopbars2.com/lpb1024.php?ref=lpb1")
    var select = driver.findElement(By.name("Region"));
    driver.executeScript("var select = arguments[0]; for(var i = 0; i < select.options.length; i++){ if(select.options[i].text == arguments[1]){ select.options[i].selected = true; } }", select, chart);
    driver.findElement(By.tagName("input")).then(
        div1 => {
            div1.click()
            driver.wait(until.elementLocated(By.className("ActiveTable"))).then(
                div2 => {
                    div2.findElements(By.tagName("tr")).then(
                        rows => {
                            rows.forEach(row => {
                                var song = new Song()
                                if (rows.indexOf(row) == 0)
                                    return
                                row.findElements(By.tagName("td")).then(
                                    cols => {
                                        cols[1].getText().then(
                                            t1 => {
                                                song.artist = t1
                                                cols[2].getText().then(
                                                    t1 => {
                                                        console.log(result.length + "/" + (rows.length - 1))
                                                        song.name = t1
                                                        result.push(song)
                                                        if (result.length == rows.length - 1) {
                                                            callback(result)
                                                        }
                                                    }
                                                )
                                            }
                                        )
                                    }
                                )
                            })
                        }
                    )
                }
            )
        }
    )
}



var driver1 = new Builder()
    .forBrowser('chrome')
    .build();


getSongs(driver1, "UK", function(list) {
    console.log("UK" + list.length)
    var xls = json2xls(list);
    var filename = "top-UK.xlsx"
    fs.writeFileSync(filename, xls, 'binary');
})

var driver2 = new Builder()
    .forBrowser('chrome')
    .build();

getSongs(driver2, "US", function(list) {
    console.log("US" + list.length)
    var xls = json2xls(list);
    var filename = "top-US.xlsx"
    fs.writeFileSync(filename, xls, 'binary');
})