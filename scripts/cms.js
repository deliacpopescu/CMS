"use strict";
function CMS() {
  // eslint-disable-line no-redeclare
  this.filters = {
    name: "",
    lastName: "",
    email: "",
    gender: "",
    birthDate: "",
    sort: "lastName"
  };

  var that = this;

  firebase
    .firestore()
    .enablePersistence()
    .then(function() {
      return firebase.auth().signInAnonymously();
    })
    .then(function() {
      that.initRouter();
    })
    .catch(function(err) {
      console.log(err);
    });
}

/**
 * Initializes the router
 */
CMS.prototype.initRouter = function() {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      "/": function() {
        that.viewEmployees();
      }
    })
    .resolve();
};

window.onload = function() {
  let maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16);
  maxDate = date2str(maxDate, "yyyy-MM-dd");
  document.getElementById("birthDate").setAttribute("max", maxDate);
  document.getElementById("minBirthDate").setAttribute("max", maxDate);
  document.getElementById("maxBirthDate").setAttribute("max", maxDate);

  window.app = new CMS();

  // drawTable();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
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
    s: date.getSeconds()
  };
  format = format.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
    return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2);
  });

  return format.replace(/(y+)/g, function(v) {
    return date
      .getFullYear()
      .toString()
      .slice(-v.length);
  });
}

CMS.prototype.defaultImage = function() {
  return "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUEyMTI4RUYwODdGMTFFNzk2MjdDOEFFODg4OUI1NTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUEyMTI4RjAwODdGMTFFNzk2MjdDOEFFODg4OUI1NTQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQTIxMjhFRDA4N0YxMUU3OTYyN0M4QUU4ODg5QjU1NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQTIxMjhFRTA4N0YxMUU3OTYyN0M4QUU4ODg5QjU1NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAYEBAQFBAYFBQYJBgUGCQsI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";
};
