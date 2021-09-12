"use strict";

CMS.prototype.tableRow = function(rowData) {
  return `
  <tr id="employee-${rowData.id}">
      <td> 
          <img src="${rowData.img}"/>
      </td>
      <td>${rowData.lastName}</td>
      <td>${rowData.name}</td>
      <td>${rowData.email}</td>
      <td>${rowData.gender}</td>
      <td>${rowData.birthDate.toDate().toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })}</td>
      <td> 
          <button class="options-edit" onClick="app.showAddModal(this)">
              <i class="fas fa-edit"></i>
          </button>
          <button class="options-delete" onClick="app.deleteEmployee(this)">
              <i class="fas fa-times-circle"></i>
          </button>
      </td>
  </tr>`;
};

CMS.prototype.viewEmployees = function(filters, filter_description) {
  let that = this;

  let table = document.getElementById("table");
  table.getElementsByTagName("tbody")[0].innerHTML = "";

  const renderResults = function(doc) {
    if (!doc) {
      return;
    }

    let rowData = doc.data();
    rowData.id = doc.id;
    let tableRow = that.tableRow(rowData);
    table.getElementsByTagName("tbody")[0].innerHTML += tableRow;
  };

  that.getAllEmployees(renderResults);
};

CMS.prototype.addEmployee = function(modalElem) {
  let that = this;

  const rowData = {
    img: modalElem.querySelector("#imagePlaceholder").src,
    lastName: modalElem.querySelector("#lastName").value,
    name: modalElem.querySelector("#name").value,
    email: modalElem.querySelector("#email").value,
    gender: modalElem.querySelector("#gender").value,
    birthDate: new Date(modalElem.querySelector("#birthDate").value)
  };
  var promise = that.addNewEmployee(rowData);

  Promise.resolve(promise).then(function() {
    that.rerender();
  });
};

CMS.prototype.editEmployee = function(modalElem) {
  let that = this;

  const id = modalElem.querySelector(".modal-content").id;
  const rowData = {
    img: modalElem.querySelector("#imagePlaceholder").src,
    lastName: modalElem.querySelector("#lastName").value,
    name: modalElem.querySelector("#name").value,
    email: modalElem.querySelector("#email").value,
    gender: modalElem.querySelector("#gender").value,
    birthDate: new Date(modalElem.querySelector("#birthDate").value)
  };

  var promise = that.editExistingEmployee(id, rowData);

  Promise.resolve(promise).then(function() {
    that.rerender();
  });
};

CMS.prototype.deleteEmployee = function(btnElem) {
  let that = this;

  let rowElem = btnElem.parentNode.parentNode;
  const id = rowElem.id.replace("employee-", "");

  var promise = that.deleteExistingEmployee(id);

  Promise.resolve(promise).then(function() {
    that.rerender();
  });
};

CMS.prototype.searchFor = function(searchBtn) {
  let searchCriteria = searchBtn.previousElementSibling.value;

  let that = this;

  let table = document.getElementById("table");
  table.getElementsByTagName("tbody")[0].innerHTML = "";

  const renderResults = function(doc) {
    if (!doc) {
      return;
    }
    if (
      !(
        doc.data().name.includes(searchCriteria) ||
        doc.data().lastName.includes(searchCriteria) ||
        doc.data().email.includes(searchCriteria) ||
        doc.data().gender.includes(searchCriteria) ||
        new Date(doc.data().birthDate)
          .toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })
          .includes(searchCriteria)
      )
    ) {
      return;
    }

    let rowData = doc.data();
    rowData.id = doc.id;
    let tableRow = that.tableRow(rowData);
    table.getElementsByTagName("tbody")[0].innerHTML += tableRow;
  };

  that.getAllEmployees(renderResults);
};

// TODO WiP to add the filters dropdown in the UI and update filterField and filterValue
CMS.prototype.filterBy = async function(filterElem) {
  let that = this;

  const filterField = filterElem.parentElement.parentElement.parentElement.id.replace(
    "thead-",
    ""
  );
  let filterValue;
  if (filterField === "birthDate") {
    filterValue = {
      minDate: new Date(
        filterElem.parentElement.querySelector("#minBirthDate").value
      ),
      maxDate: new Date(
        filterElem.parentElement.querySelector("#maxBirthDate").value
      )
    };
  } else {
    filterValue = filterElem.value;
  }

  let table = document.getElementById("table");
  table.getElementsByTagName("tbody")[0].innerHTML = "";

  const renderResults = function(doc) {
    if (!doc) {
      return;
    }

    let rowData = doc.data();
    rowData.id = doc.id;
    let tableRow = that.tableRow(rowData);
    table.getElementsByTagName("tbody")[0].innerHTML += tableRow;
  };

  const byLastName = that.getFilteredEmployees(
    filterField,
    filterValue,
    renderResults
  );
  const modal = filterElem.parentElement.parentElement;

  modal.style.display = "none";
  filterElem.value = "";
};

CMS.prototype.sortBy = function(sortBtn) {
  let headerElem = sortBtn.parentElement;
  let sortKey = headerElem.id;
  let sortType = headerElem.getAttribute("sort-type");

  let that = this;

  let table = document.getElementById("table");
  table.getElementsByTagName("tbody")[0].innerHTML = "";

  const renderResults = function(doc) {
    if (!doc) {
      return;
    }

    let rowData = doc.data();
    rowData.id = doc.id;
    let tableRow = that.tableRow(rowData);
    table.getElementsByTagName("tbody")[0].innerHTML += tableRow;
  };

  switch (sortKey) {
    case "thead-lastName":
      switch (sortType) {
        case "asc":
          sortType = "desc";
          that.getSortedEmployees("lastName", sortType, renderResults);
          break;
        case "desc":
        case "none":
          sortType = "asc";
          that.getSortedEmployees("lastName", sortType, renderResults);
          break;
      }
      break;
    case "thead-name":
      switch (sortType) {
        case "asc":
          sortType = "desc";
          that.getSortedEmployees("name", sortType, renderResults);
          break;
        case "desc":
        case "none":
          sortType = "asc";
          that.getSortedEmployees("name", sortType, renderResults);
          break;
      }
      break;
    case "thead-email":
      switch (sortType) {
        case "asc":
          sortType = "desc";
          that.getSortedEmployees("email", sortType, renderResults);
          break;
        case "desc":
        case "none":
          sortType = "asc";
          that.getSortedEmployees("email", sortType, renderResults);
          break;
      }
      break;
    case "thead-gender":
      switch (sortType) {
        case "asc":
          sortType = "desc";
          that.getSortedEmployees("gender", sortType, renderResults);
          break;
        case "desc":
        case "none":
          sortType = "asc";
          that.getSortedEmployees("gender", sortType, renderResults);
          break;
      }
      break;
    case "thead-birthDate":
      switch (sortType) {
        case "asc":
          sortType = "desc";
          that.getSortedEmployees("birthDate", sortType, renderResults);
          break;
        case "desc":
        case "none":
          sortType = "asc";
          that.getSortedEmployees("birthDate", sortType, renderResults);
          break;
      }
      break;
  }

  for (let child of headerElem.parentElement.children) {
    child.setAttribute("sort-type", "none");
    if (child.children.length !== 0) {
      child.children[0].setAttribute("class", "fas fa-sort-amount-down-alt");
    }
  }
  headerElem.setAttribute("sort-type", sortType);
  if (sortType == "asc") {
    sortBtn.setAttribute("class", `fas fa-sort-amount-down-alt active`);
  } else if (sortType == "desc") {
    sortBtn.setAttribute("class", `fas fa-sort-amount-up-alt active`);
  }
};

CMS.prototype.showAddModal = function(btnElem) {
  let that = this;
  let modal = document.getElementById("addEntryModal");
  let form = modal.querySelector("#form");
  if (btnElem) {
    form.addEventListener("submit", function() {
      that.editEmployee(modal);
    });
    let rowElem = btnElem.parentNode.parentNode;
    const rowData = {
      id: rowElem.id.replace("employee-", ""),
      img: rowElem.querySelector("img").src,
      lastName: rowElem.querySelectorAll("td")[1].innerText,
      name: rowElem.querySelectorAll("td")[2].innerText,
      email: rowElem.querySelectorAll("td")[3].innerText,
      gender: rowElem.querySelectorAll("td")[4].innerText,
      birthDate: rowElem.querySelectorAll("td")[5].innerText
    };

    modal.querySelector(".modal-content").id = rowData.id;
    modal.querySelector("#imagePlaceholder").src = rowData.img;
    modal.querySelector("#lastName").value = rowData.lastName;
    modal.querySelector("#name").value = rowData.name;
    modal.querySelector("#email").value = rowData.email;
    modal.querySelector("#gender").value = rowData.gender;
    rowData.birthDate = rowData.birthDate
      .replace("ianuarie", "January")
      .replace("februarie", "February")
      .replace("martie", "March")
      .replace("aprilie", "April")
      .replace("mai", "May")
      .replace("iunie", "June")
      .replace("iulie", "July")
      .replace("august", "August")
      .replace("septembrie", "September")
      .replace("octombrie", "October")
      .replace("noiembrie", "November")
      .replace("decembrie", "December");
    let birthDate = new Date(rowData.birthDate);
    birthDate.setMinutes(
      birthDate.getMinutes() - birthDate.getTimezoneOffset()
    );
    modal.querySelector("#birthDate").value = birthDate
      .toISOString()
      .substring(0, 10);
  } else {
    modal.querySelector("#imagePlaceholder").src = that.defaultImage();
    form.addEventListener("submit", function() {
      that.addEmployee(modal);
    });
  }

  modal.style.display = "block";
};

CMS.prototype.showFilterModal = function(filterBtn) {
  let that = this;
  const filterField = filterBtn.parentElement.id.replace("thead-", "");
  const modal = filterBtn.parentElement.querySelector("#filterModal");

  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
CMS.prototype.closeModal = function() {
  const modal = document.getElementById("addEntryModal");
  modal.querySelector(".modal-content").removeAttribute("id");
  modal.style.display = "none";
};

CMS.prototype.closeFilterModal = function() {
  const modals = document.querySelectorAll("#filterModal");
  modals.forEach(modal => modal.style.display = "none");
};

CMS.prototype.showMyImage = function(fileInput) {
  var imageFile = fileInput.files[0];
  var img = document.getElementById("imagePlaceholder");
  var imageType = /image.*/;
  if (imageFile.type.match(imageType)) {
    img.file = imageFile;

    var reader = new FileReader();
    reader.onload = (function(img) {
      return function(e) {
        img.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(imageFile);
  }
};

CMS.prototype.rerender = function() {
  this.router.navigate(document.location.pathname + "?" + new Date().getTime());
};
