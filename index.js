window.onload = function () {
    tableData();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    let modal = document.getElementById("addEntryModal");
    if (event.target == modal) {
        closeModal();
    }
}


function tableRow(rowData) {
    return `<tr id="employee-${rowData.id}">
    <td> 
        <img src="${rowData.img}"/>
    </td>
    <td>${rowData.lastName}</td>
    <td>${rowData.name}</td>
    <td>${rowData.email}</td>
    <td>${rowData.gender}</td>
    <td>${rowData.birthDate}</td>
    <td> 
        <button class="options" onClick="editEntry(this)">
            <img src="/images/edit.png"/>
        </button>
        <button>
            <img src="/images/delete.png"/>
        </button>
    </td>
</tr>`;
}


function tableData() {
    let table = document.getElementById("table");

    let tableData = [
        {
            id: 0,
            img: "./../images/pic1.png",
            lastName: "John",
            name: "Smith",
            email: "jsmith@gmail.com",
            gender: "F",
            birthDate: "13 Iunie 1995",
        },
    ];

    // These two lines are just not to start with an empty table when localStorage is empty.
    // Happens when you 1st start the app or when you clear app data
    tableData = localStorage.getItem("tableData") || JSON.stringify(tableData);
    tableData = JSON.parse(tableData);

    let tableBody = "";
    for (var i = 0; i < tableData.length; i++) {
        tableBody += tableRow(tableData[i]);
    }

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
    let tableData = localStorage.getItem("tableData") || '[]';
    tableData = JSON.parse(tableData);

    let modal = document.getElementById("addEntryModal");
    const id = modal.querySelector(".modal-content").id || Math.max(...tableData.map(o => o.id), 0) + 1;
    const rowData = {
        id: id,
        img: modal.querySelector("#imagePlaceholder").src,
        lastName: modal.querySelector("#lastName").value,
        name: modal.querySelector("#name").value,
        email: modal.querySelector("#email").value,
        gender: modal.querySelector("#gender").value,
        birthDate: modal.querySelector("#birthDate").value
    }
    const tableBody = tableRow(rowData);
    const table = document.getElementById("table");

    if (modal.querySelector(".modal-content").hasAttribute("id")) {
        entryIndex = tableData.findIndex((obj => obj.id == id));
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
        birthDate: rowElem.querySelectorAll("td")[5].innerText
    }

    let modal = document.getElementById("addEntryModal");
    modal.querySelector(".modal-content").id = rowData.id;
    modal.querySelector("#imagePlaceholder").src = rowData.img;
    modal.querySelector("#lastName").value = rowData.lastName;
    modal.querySelector("#name").value = rowData.name;
    modal.querySelector("#email").value = rowData.email;
    modal.querySelector("#gender").value = rowData.gender;
    modal.querySelector("#birthDate").value = rowData.birthDate;

    showModal();
}