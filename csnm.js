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

var watcher = chokidar.watch('D:/csnm', {
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

var loadTime = 10000
var downloadFilepath = "D:/csnm"; //luu bai hat vao duong dan nay

var chromeCapabilities = Capabilities.chrome();
var preference = {
    "profile.default_content_settings.popups": 0,
    "download.default_directory": downloadFilepath
}
var mobileSetting = {
    "deviceName": "iPhone 6 Plus"
}
var chromeOptions = new chrome.Options()
chromeOptions.setUserPreferences(preference)
chromeOptions.setMobileEmulation(mobileSetting)
chromeCapabilities.set('chromeOptions', chromeOptions);
driver = new Builder().withCapabilities(chromeCapabilities).build();
driver.manage().timeouts().pageLoadTimeout(loadTime)

var lamtiep = function () {
    console.log((index + 1) + "/" + songList.length)
    index++
    if (index < songList.length) {
        // driver.quit().then(
        //     t => {
        getJuiceOfSongs()
        // }
        // )
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

var getImageUrl = function (text) {
    var id = text.indexOf('"');
    return text.substring(id + 1, text.length - 3)
}

var getJuiceOfSongs = function () {
    driver.get("http://search.chiasenhac.vn/search.php?s=" + songList[index].keyword + "&cat=music")
        .then(
            t => {
                driver.wait(until.elementLocated(By.className("song-video-box")), 10000)
                    .findElement(By.tagName("a"))
                    .then(
                        d1 => {
                            d1.findElement(By.className("info"))
                                .findElement(By.className("text-info"))
                                .findElement(By.className("item-title"))
                                .findElement(By.tagName("span"))
                                .getAttribute("innerHTML")
                                .then(
                                    a => {
                                        songList[index].name = a
                                        console.log(songList[index].name)
                                    }
                                )
                            d1.findElement(By.className("info"))
                                .findElement(By.className("text-info"))
                                .findElement(By.className("artist"))
                                .getAttribute("innerHTML")
                                .then(
                                    b => {
                                        songList[index].artist = b
                                        console.log(songList[index].artist)
                                    }
                                )
                            d1.getAttribute("href").then(
                                t => {
                                    driver.get(t).then(
                                        f => {
                                            // driver.wait(until.elementLocated(By.id("thumb")))
                                            driver.findElement(By.id("thumb"))
                                                .getAttribute("style")
                                                .then(
                                                    img => {
                                                        console.log(getImageUrl(img))
                                                        songList[index].artist = getImageUrl(img)
                                                    }
                                                )
                                            driver.findElement(By.id("tab-download"))
                                                .findElement(By.tagName("div"))
                                                .findElement(By.tagName("div"))
                                                .findElement(By.className("div2"))
                                                .findElement(By.tagName("a"))
                                                .getAttribute("href")
                                                .then(
                                                    link => {
                                                        console.log(link)
                                                    }
                                                )
                                        }
                                    ).catch(
                                        timeout => {                                            
                                            driver.findElement(By.id("thumb"))
                                                .getAttribute("style")
                                                .then(
                                                    img => {                                                        
                                                        songList[index].image = getImageUrl(img)
                                                    }
                                                )
                                            driver.findElement(By.id("tab-download"))
                                                .findElement(By.tagName("div"))
                                                .findElement(By.tagName("div"))
                                                .findElement(By.className("div2"))
                                                .findElement(By.tagName("a"))
                                                .getAttribute("href")
                                                .then(
                                                    link => {                                                        
                                                        driver.get(link)
                                                    }
                                                )
                                        }
                                    )
                                }
                            )
                        }
                    )
                    .catch(
                        e1 => {
                            console.log("error")
                            console.log(e1)
                            errorDownload.push(index)
                            lamtiep();
                        }
                    )
            }
        )
        .catch(
            r => {
                console.log("loi")
                errorDownload.push(index)
                lamtiep();
            }
        )


}
getJuiceOfSongs()