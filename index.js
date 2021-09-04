window.onload = function () {
    tableData();
};


function tableRow(rowData) {
    return `<tr>
    <td> 
        <img src="${rowData.img}"/>
    </td>
    <td>${rowData.lastName}</td>
    <td>${rowData.name}</td>
    <td>${rowData.email}</td>
    <td>${rowData.gender}</td>
    <td>${rowData.birthDate}</td>
    <td> 
        <button class="options">
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

function addEntry() {
    const rowData = {
        img: document.getElementById("imagePlaceholder").src,
        lastName: document.getElementById("lastName").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        gender: document.getElementById("gender").value,
        birthDate: document.getElementById("birthDate").value
    }
    const tableBody = tableRow(rowData);

    const table = document.getElementById("table");
    table.getElementsByTagName("tbody")[0].innerHTML += tableBody;

    let tableData = localStorage.getItem("tableData") || '[]';
    tableData = JSON.parse(tableData);
    tableData.push(rowData);
    localStorage.setItem("tableData", JSON.stringify(tableData));
}
