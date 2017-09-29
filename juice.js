const { Builder, By, until, ActionSequence, Java } = require('selenium-webdriver');
var xlsx = require("xlsx");
var ExcelCellData = require('./ExcelData')
var Song = require('./Song')



var getXLSXData = function(sheetName) {
    var workbook = xlsx.readFile("./IP2-Music project plan.xlsx")
    var sheet = workbook.Sheets[sheetName]
    return getCellData(sheet);
}

var getCellData = function(worksheet) {
    let controller = this;
    var firstDigit;
    var index;
    var userData = []
    var rows = []
    var columns = []
    for (var z in worksheet) {
        if (z[0] === '!') continue;
        var cell = new ExcelCellData();
        firstDigit = z.match(/\d/);
        index = z.indexOf(firstDigit)
        cell.row = z.substring(index);
        cell.column = z.substring(0, index);
        cell.data = worksheet[z].v;
        userData.push(cell);

        if (rows.indexOf(cell.row) < 0) {
            rows.push(cell.row)
        }
        if (columns.indexOf(cell.column) < 0) {
            columns.push(cell.column)
        }
    }
    var result = [
        userData, rows, columns
    ]
    return result
}

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

var getDataByRowAndCol = function(dataset, row, col) {
    for (var cell of dataset) {
        if (cell.row == row && cell.column == col) {
            return cell.data
        }
    }
}

var songList = []
var songRows = []
var userData = getXLSXData("test")
var allCells = userData[0]
var allRows = userData[1]
var allColumns = userData[2]
allRows.forEach(r => {
    var songName = getDataByRowAndCol(allCells, r, allColumns[0])
    var songArtist = getDataByRowAndCol(allCells, r, allColumns[1])
    var songKeyword = songName + " " + songArtist
    var song = new Song(songName, songArtist, songKeyword);
    if (songList.indexOf(song) < 0) {
        songList.push(song)
    }
})

getJuiceOfSongs(songList, 0, function(list) {
    console.log(list)
})












// driver.quit();