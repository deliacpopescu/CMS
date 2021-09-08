
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
          <button class="options-edit" onClick="editEntry(this)">
              <i class="fas fa-edit"></i>
          </button>
          <button class="options-delete" onClick="deleteEntry(this)">
              <i class="fas fa-times-circle"></i>
          </button>
      </td>
  </tr>`;
};

CMS.prototype.viewEmployees = function (filters, filter_description) {

    let that = this;

    const renderResults = function (doc) {
        if (!doc) {
            return;
        }

        let rowData = doc.data();
        rowData.id = doc.id;
        let tableRow = that.tableRow(rowData);

        let table = document.getElementById("table");
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
    
    Promise.resolve(promise).then(function() {
        that.renderer();
    });
}

// When the user clicks on the button, open the modal
CMS.prototype.showModal = function () {
    let modal = document.getElementById("addEntryModal");
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

CMS.prototype.renderer = function() {
    this.router.navigate(document.location.pathname);
  };

