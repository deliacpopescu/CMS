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
    .then(function () {
      return firebase.auth().signInAnonymously();
    })
    .then(function () {
      that.initTemplates();
      that.initRouter();
    }).catch(function (err) {
      console.log(err);
    });
}

/**
 * Initializes the router for the FriendlyEats app.
 */
CMS.prototype.initRouter = function () {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      '/': function () {
        that.viewEmployees();
      }
    })
    .resolve();

  firebase
    .firestore()
    .collection('employees')
    .limit(1)
    .onSnapshot(function (snapshot) {
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
