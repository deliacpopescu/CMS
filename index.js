window.onload = function () {
  let maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16);
  maxDate = date2str(maxDate, "yyyy-MM-dd");
  document.getElementById("birthDate").setAttribute("max", maxDate);

  drawTable();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  let modal = document.getElementById("addEntryModal");
  if (event.target == modal) {
    closeModal();
  }
};

function tableRow(rowData) {
  return `
<tr id="employee-${rowData.id}">
    <td> 
        <img src="${rowData.img}"/>
    </td>
    <td>${rowData.lastName}</td>
    <td>${rowData.name}</td>
    <td>${rowData.email}</td>
    <td>${rowData.gender}</td>
    <td>${new Date(rowData.birthDate).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}</td>
    <td> 
        <button class="options-edit" onClick="editEntry(this)">
            <i class="fas fa-edit"></i>
        </button>
        <button class="options-delete" onClick="deleteEntry(this)">
            <i class="fas fa-times-circle"></i>
        </button>
    </td>
</tr>`;
}

function drawTable() {
  // default data just not to show an empty table at new run
  let tableData = [
    {
      id: 0,
      img: "./images/pic1.png",
      lastName: "John",
      name: "Smith",
      email: "jsmith@gmail.com",
      gender: "F",
      birthDate: "2020-01-01",
    },
  ];

  // These two lines are just not to start with an empty table when localStorage is empty.
  // Happens when you 1st start the app or when you clear app data
  tableData = localStorage.getItem("tableData") || JSON.stringify(tableData);
  tableData = JSON.parse(tableData);

  tableContent(tableData);
}

function tableContent(tableData) {
  let tableBody = "";
  for (var i = 0; i < tableData.length; i++) {
    tableBody += tableRow(tableData[i]);
  }

  let table = document.getElementById("table");
  table.getElementsByTagName("tbody")[0].innerHTML = tableBody;
}

function showMyImage(fileInput) {
  var imageFile = fileInput.files[0];
  var img = document.getElementById("imagePlaceholder");
  var imageType = /image.*/;
  if (imageFile.type.match(imageType)) {
    img.file = imageFile;

    var reader = new FileReader();
    reader.onload = (function (img) {
      return function (e) {
        img.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(imageFile);
  }
}

function saveEntry() {
  let tableData = localStorage.getItem("tableData") || "[]";
  tableData = JSON.parse(tableData);

  let modal = document.getElementById("addEntryModal");
  const id =
    parseInt(modal.querySelector(".modal-content").id) ||
    Math.max(...tableData.map((o) => o.id), 0) + 1;
  const rowData = {
    id: id,
    img: modal.querySelector("#imagePlaceholder").src,
    lastName: modal.querySelector("#lastName").value,
    name: modal.querySelector("#name").value,
    email: modal.querySelector("#email").value,
    gender: modal.querySelector("#gender").value,
    birthDate: modal.querySelector("#birthDate").value,
  };
  const tableBody = tableRow(rowData);
  const table = document.getElementById("table");

  if (modal.querySelector(".modal-content").hasAttribute("id")) {
    entryIndex = tableData.findIndex((obj) => obj.id == id);
    tableData[entryIndex] = rowData;
    let rowElem = table.querySelector(`#employee-${id}`);
    rowElem.querySelector("img").src = rowData.img;
    rowElem.querySelectorAll("td")[1].innerText = rowData.lastName;
    rowElem.querySelectorAll("td")[2].innerText = rowData.name;
    rowElem.querySelectorAll("td")[3].innerText = rowData.email;
    rowElem.querySelectorAll("td")[4].innerText = rowData.gender;
    rowElem.querySelectorAll("td")[5].innerText = rowData.birthDate;
  } else {
    table.getElementsByTagName("tbody")[0].innerHTML += tableBody;
    tableData.push(rowData);
  }

  localStorage.setItem("tableData", JSON.stringify(tableData));
  closeModal();
}

// When the user clicks on the button, open the modal
function showModal() {
  let modal = document.getElementById("addEntryModal");
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
  let modal = document.getElementById("addEntryModal");
  modal.querySelector(".modal-content").removeAttribute("id");
  modal.style.display = "none";
}

function editEntry(btnElem) {
  let rowElem = btnElem.parentNode.parentNode;
  const rowData = {
    id: parseInt(rowElem.id.replace("employee-", "")),
    img: rowElem.querySelector("img").src,
    lastName: rowElem.querySelectorAll("td")[1].innerText,
    name: rowElem.querySelectorAll("td")[2].innerText,
    email: rowElem.querySelectorAll("td")[3].innerText,
    gender: rowElem.querySelectorAll("td")[4].innerText,
    birthDate: rowElem.querySelectorAll("td")[5].innerText,
  };

  let modal = document.getElementById("addEntryModal");
  modal.querySelector(".modal-content").id = rowData.id;
  modal.querySelector("#imagePlaceholder").src = rowData.img;
  modal.querySelector("#lastName").value = rowData.lastName;
  modal.querySelector("#name").value = rowData.name;
  modal.querySelector("#email").value = rowData.email;
  modal.querySelector("#gender").value = rowData.gender;
  let birthDate = new Date(rowData.birthDate);
  birthDate.setMinutes(birthDate.getMinutes() - birthDate.getTimezoneOffset());
  modal.querySelector("#birthDate").value = bir.toISOString().substring(0, 10);

  showModal();
}

function deleteEntry(btnElem) {
  let rowElem = btnElem.parentNode.parentNode;
  const entryId = parseInt(rowElem.id.replace("employee-", ""));

  let tableData = localStorage.getItem("tableData") || "[]";
  tableData = JSON.parse(tableData);
  const entryIndex = tableData.findIndex((obj) => obj.id == entryId);
  tableData.splice(entryIndex, 1);
  localStorage.setItem("tableData", JSON.stringify(tableData));

  const table = document.querySelector("#table > tbody");
  table.removeChild(rowElem);
}

function date2str(date, format) {
  var z = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };
  format = format.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
    return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2);
  });

  return format.replace(/(y+)/g, function (v) {
    return date.getFullYear().toString().slice(-v.length);
  });
}

function sortBy(headerElem) {
  let sortKey = headerElem.id;
  let sortType = headerElem.getAttribute("sort-type");

  let tableData = localStorage.getItem("tableData") || "[]";
  tableData = JSON.parse(tableData);

  switch (sortKey) {
    case "thead-lastName":
      switch (sortType) {
        case "asc":
          tableData.sort((a, b) => (a.lastName > b.lastName ? -1 : 1));
          sortType = "desc";
          break;
        case "desc":
          sortType = "none";
          break;
        default:
          tableData.sort((a, b) => (a.lastName > b.lastName ? 1 : -1));
          sortType = "asc";
          break;
      }
      break;
    case "thead-name":
      switch (sortType) {
        case "asc":
          tableData.sort((a, b) => (a.name > b.name ? -1 : 1));
          sortType = "desc";
          break;
        case "desc":
          sortType = "none";
          break;
        default:
          tableData.sort((a, b) => (a.name > b.name ? 1 : -1));
          sortType = "asc";
          break;
      }
      break;
    case "thead-email":
      switch (sortType) {
        case "asc":
          tableData.sort((a, b) => (a.email > b.email ? -1 : 1));
          sortType = "desc";
          break;
        case "desc":
          sortType = "none";
          break;
        default:
          tableData.sort((a, b) => (a.email > b.email ? 1 : -1));
          sortType = "asc";
          break;
      }
      break;
    case "thead-gender":
      switch (sortType) {
        case "asc":
          tableData.sort((a, b) => (a.gender > b.gender ? -1 : 1));
          sortType = "desc";
          break;
        case "desc":
          sortType = "none";
          break;
        default:
          tableData.sort((a, b) => (a.gender > b.gender ? 1 : -1));
          sortType = "asc";
          break;
      }
      break;
    case "thead-birthDate":
      switch (sortType) {
        case "asc":
          tableData.sort((a, b) =>
            new Date(a.birthDate) > new Date(b.birthDate) ? -1 : 1
          );
          sortType = "desc";
          break;
        case "desc":
          sortType = "none";
          break;
        default:
          tableData.sort((a, b) =>
            new Date(a.birthDate) > new Date(b.birthDate) ? 1 : -1
          );
          sortType = "asc";
          break;
      }
      break;
  }

  for (let child of headerElem.parentElement.children) {
    child.setAttribute("sort-type", "none");
  }
  headerElem.setAttribute("sort-type", sortType);
  tableContent(tableData);
}

function searchFor(searchBtn) {
  let searchCriteria = searchBtn.previousElementSibling.value;

  let tableData = localStorage.getItem("tableData") || "[]";
  tableData = JSON.parse(tableData);

  tableData = tableData.filter(
    (elem) =>
      elem.name.includes(searchCriteria) ||
      elem.lastName.includes(searchCriteria) ||
      elem.email.includes(searchCriteria) ||
      elem.gender.includes(searchCriteria) ||
      new Date(elem.birthDate)
        .toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .includes(searchCriteria)
  );

  tableContent(tableData);
}
