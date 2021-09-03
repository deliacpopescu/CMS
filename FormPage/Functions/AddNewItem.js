
function addRow() {
  const table = document.getElementById("table");
  let rowCount = table.rows.length; //total rows
  let rowCountBody = table.tBodies[0].rows.length; //body rows
  let tr = table.insertRow(rowCount);

  let cell1 = tr.insertCell(0);
  let cell2 = tr.insertCell(1);
  let cell3 = tr.insertCell(2);
  let cell4 = tr.insertCell(3);
  let cell5 = tr.insertCell(4);
  let cell6 = tr.insertCell(5);
  let cell7 = tr.insertCell(6);

  cell1.innerHTML = "poza";
  cell2.innerHTML = "nume";
  cell3.innerHTML = "prenume";
  cell4.innerHTML = "email";
  cell5.innerHTML = "sex";
  cell6.innerHTML = "data";
  cell7.innerHTML = "optiuni";

  alert("linii in total " + rowCount);
  alert("linii in body " + rowCountBody);
}
