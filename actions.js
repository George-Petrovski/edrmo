function myCreateFunction() {
    var table = document.getElementById("tb1");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = "NEW CELL1";
    cell2.innerHTML = "NEW CELL2";
    console.log("add row button clicked");
  }