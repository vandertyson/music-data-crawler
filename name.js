var xlsx = require("xlsx");
var ExcelCellData = require('./ExcelData')
var Song = require('./Song')
var json2xls = require('json2xls');
var fs = require('fs')

module.exports = function() {
    var data = [];

    var getXLSXData = function(sheetName) {
        var label = "./merge-data-"
        process.argv.forEach(function(val, index, array) {
            if (index == 2) {
                label = label + val + ".xlsx"
            }
        });
        var workbook = xlsx.readFile(label)
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

    var getDataByRowAndCol = function(dataset, row, col) {
        for (var cell of dataset) {
            if (cell.row == row && cell.column == col) {
                return cell.data
            }
        }
    }
    var isExisted = function(list, song) {
        for (var s of list) {
            if (s.name == song.name) {
                return true
            }
        }
        return false
    }

    var sheetName = "Sheet 1"
    var songList = []
    var songRows = []
    var userData = getXLSXData(sheetName)
    var allCells = userData[0]
    var allRows = userData[1]
    var allColumns = userData[2]
    var count = 0;
    allRows.forEach(r => {
            var songName = getDataByRowAndCol(allCells, r, allColumns[0])
            var songArtist = getDataByRowAndCol(allCells, r, allColumns[1])
            if (songName.indexOf("[") > 0) {
                var i1 = songName.indexOf("[")
                songName = songName.substring(0, i1).trim()
            }
            if (songName.indexOf(" (feat. ") > 0) {
                var splits = songName.split(" (feat. ")
                songName = splits[0]
                songArtist = songArtist + " ft. " + splits[1]
                songArtist = songArtist.slice(0, -1)
            }
            if (songName.indexOf(" (FEAT. ") > 0) {
                var splits = songName.split(" (FEAT. ")
                songName = splits[0]
                songArtist = songArtist + " ft. " + splits[1]
                songArtist = songArtist.slice(0, -1)
            }
            if (songName.indexOf("(") > 0) {
                var i2 = songName.indexOf("(")
                songName = songName.substring(0, i2).trim();
            }
            var songKeyword = songName
            if (songName.length < 15) {
                songKeyword += " " + songArtist
            }
            var song = new Song(songName, songArtist, songKeyword);
            count++
            song['index'] = count
                // songList.push(song)
            if (!isExisted(songList, song)) {
                songList.push(song)
            }
        })
        // var xls = json2xls(songList);
        // var filename = "good-name.xlsx"
        // fs.writeFileSync(filename, xls, 'binary');    
    return songList
}()