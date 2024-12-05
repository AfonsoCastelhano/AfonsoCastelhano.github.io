if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

const listaDeProdutos = [];
const botaoCompraTudo = document.getElementById("compra-tudo");

async function carregarProdutos() {
    try {
        const response = await fetch('https://deisishop.pythonanywhere.com/products/');
        if (!response.ok) {
            throw new Error('Erro ao buscar os produtos da API');
        }

        const produtos = await response.json();
        produtos.forEach(produto => {
            listaDeProdutos.push({
                id: produto.id,
                title: produto.title,
                price: produto.price,
                description: produto.description,
                category: produto.category,
                image: produto.image,
                rating: produto.rating,
                rate: produto.rating.rate,
                count: produto.rating.count
            });
        });

        criarProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

document.getElementById('filtro-categoria').addEventListener('change', (event) => {
    const categoriaSelecionada = event.target.value;
    filtrarProdutos(categoriaSelecionada);
});

document.getElementById('menos-info').addEventListener('change', (event) => {
    const semInfo = event.target.value;
    criarProdutos(listaDeProdutos, semInfo);
});

function filtrarProdutos(categoria) {
    const produtosFiltrados = categoria === 'todos' 
        ? listaDeProdutos 
        : listaDeProdutos.filter(produto => produto.category === categoria);

    criarProdutos(produtosFiltrados);
}

function criarProdutos(produtosParaMostrar = listaDeProdutos) {
    const produtosSection = document.getElementById('produtos');
    produtosSection.innerHTML = '';

    produtosParaMostrar.forEach(produto => {
        const produtoContainer = document.createElement('div');
        produtoContainer.className = 'produto';

        const titulo = document.createElement('h3');
        titulo.textContent = produto.title;

        const imagem = document.createElement('img');
        imagem.src = produto.image;
        imagem.alt = produto.title;
        const descricao = document.createElement('p');
        descricao.textContent = produto.description;

        const rating = document.createElement('p');
        rating.textContent = `${produto.rating.rate}`;

        const preco = document.createElement('p');
        preco.textContent = `Preço: € ${produto.price.toFixed(2)}`;

        const botaoAdicionar = document.createElement('button');
        botaoAdicionar.textContent = '+ Adicionar ao cesto';

        botaoAdicionar.addEventListener('click', () => {
            adicionarAoCesto(produto);
            console.log(`Produto adicionado: ${produto.title}`);
        });

        botaoCompraTudo.addEventListener('click', () => {
            for(let i = 0; i < produtosParaMostrar.length; i++){
                const produtoTudo = produtosParaMostrar[i];
            adicionarAoCesto(produtoTudo);
            console.log(`Produto adicionado: ${produtoTudo.title}`);
            }
        });

        produtoContainer.appendChild(titulo);
        produtoContainer.appendChild(imagem);
        produtoContainer.appendChild(descricao);
        produtoContainer.appendChild(preco);
        produtoContainer.appendChild(rating);
        produtoContainer.appendChild(botaoAdicionar);

        produtosSection.appendChild(produtoContainer);
    });
}

document.getElementById('ordenar-rating').addEventListener('change', (event) => {
    const ordemSelecionada = event.target.value;
    ordenarProdutos(ordemSelecionada);
});


function ordenarProdutos(ordem) {
    let produtosOrdenados = [...listaDeProdutos];

    if (ordem === 'crescente') {
        produtosOrdenados.sort((a, b) => a.count - b.count);
    } else if (ordem === 'decrescente') {
        produtosOrdenados.sort((a, b) => b.count - a.count);
    }

    criarProdutos(produtosOrdenados);
}

function adicionarAoCesto(produto) {
    let cesto = JSON.parse(localStorage.getItem('cesto')) ?? [];
    localStorage.setItem('cesto', JSON.stringify([...cesto, produto]));
    atualizarCesto();
}

function removerDoCesto(index) {
    let cesto = JSON.parse(localStorage.getItem('cesto')) ?? [];
    cesto = cesto.filter((_, i) => i !== index);
    localStorage.setItem('cesto', JSON.stringify(cesto));
    atualizarCesto();
}

function atualizarCesto() {
    const cestoContainer = document.getElementById('produtos-selecionados');
    cestoContainer.innerHTML = '';

    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    
    mostrarItensDoCesto(cesto, cestoContainer);
    calcularTotal();
}

function mostrarItensDoCesto(cesto, container) {
    cesto.forEach((produto, index) => {
        const produtoContainer = criarElementoDoCesto(produto, index);
        container.appendChild(produtoContainer);
    });
}

function criarElementoDoCesto(produto, index) {
    const produtoContainer = document.createElement('div');
    produtoContainer.className = 'produto-cesto';

    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;

    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;
    imagem.width = 100;

    const preco = document.createElement('p');
    preco.textContent = `Preço: € ${produto.price.toFixed(2)}`;

    const botao = document.createElement('button');
    botao.textContent = 'Remover';
    botao.addEventListener('click', function () {
        const cestoUpdate = JSON.parse(localStorage.getItem('cesto')) || [];
        cestoUpdate.splice(index, 1);
        localStorage.setItem('cesto', JSON.stringify(cestoUpdate));
        atualizarCesto();
    });

    produtoContainer.appendChild(titulo);
    produtoContainer.appendChild(imagem);
    produtoContainer.appendChild(preco);
    produtoContainer.appendChild(botao);

    return produtoContainer;
}

function calcularTotal() {
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    let total = cesto.reduce((soma, produto) => soma + produto.price, 0);

    if (document.querySelector('input[name="deisi"]:checked')) {
        total *= 0.95;
    }

    const codigoDesconto = document.getElementById('codigo').value;
    if (codigoDesconto === 'black-friday') {
        total *= 0.95;
    }

    const totalContainer = document.getElementById('total');
    totalContainer.textContent = `Preço Total: € ${total.toFixed(2)}`;

    return total;
}

document.querySelector('button').addEventListener('click', async function () {
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    if (cesto.length === 0) {
        alert('Erro: Não foram selecionados produtos');
        return;
    }
    const moradaCompra = document.getElementById('morada').value
    const total = calcularTotal();
    const referenciaPagamento = '201124-0004'; 

    const dadosCompra = {
        totalCost: total.toFixed(2),
        reference: referenciaPagamento,
        example: 'Excelente escolha! A DEISI Shop agradece a sua preferência!',
        adress: moradaCompra,
        error: ''
    };

    try {
        const response = await fetch('https://deisishop.pythonanywhere.com/buy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCompra)
        });

        const resultado = await response.json();
        if (resultado.error) {
            alert(`Erro: ${resultado.error}`);
        } else {
            alert(resultado.example);
        }
    } catch (error) {
        console.error('Erro ao processar a compra:', error);
        alert('Erro ao processar a compra');
    }
});

document.getElementById('pesquisa').addEventListener('input', (event) => {
    const termoPesquisa = event.target.value.toLowerCase();
    pesquisarProdutos(termoPesquisa);
});

function pesquisarProdutos(termo) {
    const produtosFiltrados = listaDeProdutos.filter(produto => 
        produto.title.toLowerCase().includes(termo) && produto.descricao.toLowerCase().includes(termo)
    );

    criarProdutos(produtosFiltrados);
}

carregarProdutos();