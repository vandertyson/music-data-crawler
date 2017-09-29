var xlsx = require("xlsx");
var ExcelCellData = require('./ExcelData')
var Song = require('./Song')

module.exports = function() {
    var data = [];

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

    var getDataByRowAndCol = function(dataset, row, col) {
        for (var cell of dataset) {
            if (cell.row == row && cell.column == col) {
                return cell.data
            }
        }
    }

    var sheetName = "test"
    process.argv.forEach(function(val, index, array) {
        if (index == 2) {
            sheetName = val
        }
    });
    var songList = []
    var songRows = []
    var userData = getXLSXData(sheetName)
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
    return songList
}()