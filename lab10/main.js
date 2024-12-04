if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

const listaDeProdutos = [];

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
                rating: produto.rating
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

        const preco = document.createElement('p');
        preco.textContent = `Preço: € ${produto.price.toFixed(2)}`;

        const botaoAdicionar = document.createElement('button');
        botaoAdicionar.textContent = '+ Adicionar ao cesto';

        botaoAdicionar.addEventListener('click', () => {
            adicionarAoCesto(produto);
            console.log(`Produto adicionado: ${produto.title}`);
        });

        produtoContainer.appendChild(titulo);
        produtoContainer.appendChild(imagem);
        produtoContainer.appendChild(descricao);
        produtoContainer.appendChild(preco);
        produtoContainer.appendChild(botaoAdicionar);

        produtosSection.appendChild(produtoContainer);
    });
}

document.getElementById('ordenar-preco').addEventListener('change', (event) => {
    const ordemSelecionada = event.target.value;
    ordenarProdutos(ordemSelecionada);
});

function ordenarProdutos(ordem) {
    let produtosOrdenados = [...listaDeProdutos];

    if (ordem === 'crescente') {
        produtosOrdenados.sort((a, b) => a.price - b.price);
    } else if (ordem === 'decrescente') {
        produtosOrdenados.sort((a, b) => b.price - a.price);
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

function listarProdutosSelecionados() {
    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    console.log('Produtos selecionados:', produtosSelecionados);
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
    const total = cesto.reduce((soma, produto) => soma + produto.price, 0);

    const totalContainer = document.getElementById('total');
    totalContainer.textContent = `Preço Total: € ${total.toFixed(2)}`;

    return total;
}
carregarProdutos();