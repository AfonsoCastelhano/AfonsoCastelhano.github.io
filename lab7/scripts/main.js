document.addEventListener("DOMContentLoaded", function() {
    const texto = document.getElementById("texto");

    texto.addEventListener("mouseover", function() {
        texto.innerText = "1- Obrigado por passares!";
    });

    texto.addEventListener("mouseout", function() {
        texto.innerText = "1- Passa por aqui!";
    });

    const inputRand = document.getElementById("escritaRand");
    inputRand.addEventListener("keydown", function() {
    mudarCorFundoRand();
    });
});

let contagem = 0;
function incrementarContagem() {
contagem++;
document.getElementById("Contagem").textContent = contagem;
}
function mudarCorFundoRand() {
const corRandom = '#' + Math.floor(Math.random()*16777215).toString(16);
document.body.style.backgroundColor = corRandom;
}

function mudaCorVermelho() {
    document.body.style.backgroundColor = 'red';
}
function mudaCorAzul() {
    document.body.style.backgroundColor = 'blue';
}
function mudaCorVerde() {
    document.body.style.backgroundColor = 'green';
}

function mudaCorDoInput() {
const corIng = document.getElementById("corIng").value;
document.body.style.backgroundColor = corIng;
}