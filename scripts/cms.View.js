
'use strict';

CMS.prototype.initTemplates = function () {
    this.templates = {};

    var that = this;
    document.querySelectorAll('.template').forEach(function (el) {
        that.templates[el.getAttribute('id')] = el;
    });
};

CMS.prototype.tableRow = function (rowData) {
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
          <button class="options-edit" onClick="app.showModal(this)">
              <i class="fas fa-edit"></i>
          </button>
          <button class="options-delete" onClick="app.deleteEmployee(this)">
              <i class="fas fa-times-circle"></i>
          </button>
      </td>
  </tr>`;
};

CMS.prototype.viewEmployees = function (filters, filter_description) {
    let that = this;

    let table = document.getElementById("table");
    table.getElementsByTagName("tbody")[0].innerHTML = '';

    const renderResults = function (doc) {
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

CMS.prototype.addEmployee = function (modalElem) {
    let that = this;

    const rowData = {
        img: modalElem.querySelector("#imagePlaceholder").src,
        lastName: modalElem.querySelector("#lastName").value,
        name: modalElem.querySelector("#name").value,
        email: modalElem.querySelector("#email").value,
        gender: modalElem.querySelector("#gender").value,
        birthDate: modalElem.querySelector("#birthDate").value,
    }
    var promise = that.addNewEmployee(rowData);

    Promise.resolve(promise).then(function () {
        that.rerender();
    });
}

CMS.prototype.editEmployee = function (modalElem) {
    let that = this;

    const id = modalElem.querySelector(".modal-content").id;
    const rowData = {
        img: modalElem.querySelector("#imagePlaceholder").src,
        lastName: modalElem.querySelector("#lastName").value,
        name: modalElem.querySelector("#name").value,
        email: modalElem.querySelector("#email").value,
        gender: modalElem.querySelector("#gender").value,
        birthDate: modalElem.querySelector("#birthDate").value,
    }
    
    var promise = that.editExistingEmployee(id, rowData);

    Promise.resolve(promise).then(function () {
        that.rerender();
    });
}


CMS.prototype.deleteEmployee = function (btnElem) {
    let that = this;
    
    let rowElem = btnElem.parentNode.parentNode;
    const id = rowElem.id.replace("employee-", "");
  
    var promise = that.deleteExistingEmployee(id);

    Promise.resolve(promise).then(function () {
        that.rerender();
    });
  }

CMS.prototype.showModal = function (btnElem) {
    let that = this;
    let modal = document.getElementById("addEntryModal");
    let form = modal.querySelector("#form");
    if (btnElem) {
        form.addEventListener("submit", function(){that.editEmployee(modal)});
        let rowElem = btnElem.parentNode.parentNode;
        const rowData = {
            id: rowElem.id.replace("employee-", ""),
            img: rowElem.querySelector("img").src,
            lastName: rowElem.querySelectorAll("td")[1].innerText,
            name: rowElem.querySelectorAll("td")[2].innerText,
            email: rowElem.querySelectorAll("td")[3].innerText,
            gender: rowElem.querySelectorAll("td")[4].innerText,
            birthDate: rowElem.querySelectorAll("td")[5].innerText,
        };

        modal.querySelector(".modal-content").id = rowData.id;
        modal.querySelector("#imagePlaceholder").src = rowData.img;
        modal.querySelector("#lastName").value = rowData.lastName;
        modal.querySelector("#name").value = rowData.name;
        modal.querySelector("#email").value = rowData.email;
        modal.querySelector("#gender").value = rowData.gender;
        let birthDate = new Date(rowData.birthDate);
        birthDate.setMinutes(birthDate.getMinutes() - birthDate.getTimezoneOffset());
        modal.querySelector("#birthDate").value = birthDate.toISOString().substring(0, 10);
    } else {
        form.addEventListener("submit", function(){that.addEmployee(modal)});
    }

    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
CMS.prototype.closeModal = function () {
    let modal = document.getElementById("addEntryModal");
    modal.querySelector(".modal-content").removeAttribute("id");
    modal.style.display = "none";
}

CMS.prototype.showMyImage = function (fileInput) {
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

CMS.prototype.rerender = function() {
  this.router.navigate(document.location.pathname + '?' + new Date().getTime());
};

