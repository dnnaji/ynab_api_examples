// Google App Script
// Credit https://gist.github.com/superstrong/b8d7413724ce311d11e672ad5d2c57c7
function getBudgetTransactions() {
  var options = {};
  options.headers = {
    Authorization:
      "Basic " + Utilities.base64Encode("USERNAME" + ":" + "PASSWORD")
  };

  var response = UrlFetchApp.fetch("https://API URl", options);

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet = ss.getSheetByName("Budget Transactions"); // specific sheet name; alternatively use ss.getActiveSheet()

  var dataSet = JSON.parse(response.getContentText()); //

  var rows = [],
    data;

  for (i = 0; i < dataSet.length; i++) {
    data = dataSet[i];
    rows.push([
      data.account,
      data.date,
      data.payee,
      data.category,
      data.memo,
      data.amount
    ]); //your JSON entities here
  }

  // [row to start on], [column to start on], [number of rows], [number of entities]
  dataRange = sheet.getRange(2, 1, rows.length, rows[0].length);
  dataRange.setValues(rows);
}
