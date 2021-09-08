'use strict';

/**
 * Initializes the FriendlyEats app.
 */
function CMS() { // eslint-disable-line no-redeclare
  this.filters = {
    name: '',
    lastName: '',
    email: '',
    gender: '',
    birthDate: '',
    sort: 'lastName'
  };

  var that = this;

  firebase.firestore().enablePersistence()
    .then(function() {
      return firebase.auth().signInAnonymously();
    })
    .then(function() {
      that.initTemplates();
      that.initRouter();
    }).catch(function(err) {
      console.log(err);
    });
}

/**
 * Initializes the router for the FriendlyEats app.
 */
CMS.prototype.initRouter = function() {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      '/': function() {
        that.viewEmployees();
      }
    })
    .resolve();

  firebase
    .firestore()
    .collection('employees')
    .limit(1)
    .onSnapshot(function(snapshot) {
      if (snapshot.empty) {
        that.router.navigate('/setup');
      }
    });
};


window.onload = function () {
  let maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16);
  maxDate = date2str(maxDate, "yyyy-MM-dd");
  document.getElementById("birthDate").setAttribute("max", maxDate);

  window.app = new CMS();

  // drawTable();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  let modal = document.getElementById("addEntryModal");
  if (event.target == modal) {
    closeModal();
  }
};


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
