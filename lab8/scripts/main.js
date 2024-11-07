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
if(!localStorage.getItem('Contagem')) {
    localStorage.getItem('Contagem', 0);
}
function incrementarContagem() {
    let Contagem = localStorage.getItem('Contagem');
    Contagem++;
    document.querySelector('label').textContent = Contagem;
    localStorage.setItem('Contagem', Contagem);
}
document.querySelector('label').textContent = localStorage.getItem('Contagem');

function mudarCorFundoRand() {
const corRandom = '#' + Math.floor(Math.random()*16777215).toString(16);
document.body.style.backgroundColor = corRandom;
}

document.querySelectorAll("button[data-color]").forEach((button) => {
    button.addEventListener("click", function() {
        const cor = button.dataset.color;
        document.body.style.backgroundColor = cor;
    });
});

function mudaCorDoInput() {
const corIng = document.getElementById("corIng").value;
document.body.style.backgroundColor = corIng;
}
document.querySelector('select').onchange = function() {
document.querySelector('body').style.backgroundColor =
this.value;
}

document.querySelector('form').onsubmit = (e) => {
    e.preventDefault();    
    let nome = document.querySelector('#nome').value;
    let idade = document.querySelector('#idade').value;
    document.querySelector('#frase').textContent = `Olá, o ${nome} tem ${idade}!`;
};

let counter = 0;
const span = document.querySelector("span");
function count() {
span.innerHTML = ++counter;
}
setInterval(count, 1000);