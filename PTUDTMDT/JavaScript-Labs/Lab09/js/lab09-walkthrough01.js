
var msg = document.getElementById("msgArea");

// Step 2: Select textarea by ID
msg.value = "here is some text";

// Step 3-4: Change page title
document.getElementById("pageTitle").innerHTML = "Even newer title";

// Step 5-6: Access text content
msg.value = document.getElementById("first").innerText;

// Step 7: Read an attribute
msg.value = "My class is " + msg.getAttribute("class");

// Step 8: Select by tag name
var elem = document.getElementsByTagName("textarea");
elem[0].value = "selected by tag name";

// Step 9: Select all span elements
elem = document.getElementsByTagName("span");

for (var i = 0; i < elem.length; i++) {
    document.getElementById("msgArea").value += "\n" + elem[i].innerText;
}

// Step 10: Select by class name
document.getElementById("msgArea").value = "";

var counts = document.getElementsByClassName("count-number");

for (var i = 0; i < counts.length; i++) {
    document.getElementById("msgArea").value += "\n" + counts[i].innerText;
}

// Step 11: Select first matching element
var ps = document.querySelector("#first p");
document.getElementById("msgArea").value = ps.innerHTML;

// Step 12: Select all matching elements
ps = document.querySelectorAll("#first p");

for (var i = 0; i < ps.length; i++) {
    document.getElementById("msgArea").value += ps[i].innerHTML + "\n";
}

// Step 13: Change class attribute
document.getElementById("msgArea").setAttribute("class", "hidden");

// Step 14: Change background color
document.getElementById("features").style.backgroundColor = "green";
