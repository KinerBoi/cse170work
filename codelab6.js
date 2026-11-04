
document.getElementById("trick1").addEventListener("click", function() {
    document.getElementById("magicText").innerHTML =
        "Arcanum Radiatum, Luminas Delusionem!";
});

document.getElementById("trick2").addEventListener("click", function() {
    document.getElementById("colorText").style.color = "red";
});

document.getElementById("trick3").addEventListener("click", function() {
    document.getElementById("imageText").innerHTML =
        '<img src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" alt="Magic Trick">';
});
