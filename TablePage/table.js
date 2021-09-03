let table = document.getElementById("table");

var table = [
    {nume: "John", prenume: "Smith", email:"jsmith@gmail.com", sex:"M", dataNasterii:"13 Iunie 1995"},
    {name: "The newbie", score: 50},
];

localStorage.setItem("highscores", JSON.stringify(highScores));

var retrievedScores = JSON.parse(localStorage.getItem("highscores"));

for (var i = 0; i < retrievedScores.length; i++) {
    hst.innerHTML += "<tr><td>" + retrievedScores[i].name + "</td><td>" + retrievedScores[i].score + "</td></tr>";
}