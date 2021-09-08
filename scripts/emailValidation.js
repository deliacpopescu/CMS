function regexValidation(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function validateEmail() {
  let emailVal = document.getElementById("email").value;
  
  if (regexValidation(emailVal)) {
    document.getElementById("email").style.borderColor = "green";
  } else {
    document.getElementById("email").value = "";
    document.getElementById("email").style.borderColor = "red";
    alert("Introduceti o adresa de email valida");
  }
}

