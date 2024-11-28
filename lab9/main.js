if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

const listaDeProdutos = [];

function carregarProdutos(produtos) {
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
}

function criarProdutos() {
    const produtosSection = document.getElementById('produtos');
    produtosSection.innerHTML = '';

    listaDeProdutos.forEach(produto => {
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
    const totalContainer = document.getElementById('total');
    cestoContainer.innerHTML = '';

    let total = 0;
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];

    cesto.forEach((produto, index) => {
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

        total += produto.price;

        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.addEventListener('click', () => {
            removerDoCesto(index);
            console.log(`Produto removido: ${produto.title}`);
        });

        produtoContainer.appendChild(titulo);
        produtoContainer.appendChild(imagem);
        produtoContainer.appendChild(preco);
        produtoContainer.appendChild(botaoRemover);

        cestoContainer.appendChild(produtoContainer);
    });

    totalContainer.textContent = `Preço Total: € ${total.toFixed(2)}`;
}

carregarProdutos(produtos);
criarProdutos();