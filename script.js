function gerarTorcida(container, quantidade) {
  for (let i = 0; i < quantidade; i++) {
    const img = document.createElement('img');
    img.src = i % 2 === 0 ? 'torcedor2.png' : 'New Piskel.png';
    img.className = 'fan';
    container.appendChild(img);
  }
}

gerarTorcida(document.querySelector('.fans.top'), 30);
gerarTorcida(document.querySelector('.fans.bottom'), 30);
gerarTorcida(document.querySelector('.fans.left'), 20);
gerarTorcida(document.querySelector('.fans.right'), 20);
