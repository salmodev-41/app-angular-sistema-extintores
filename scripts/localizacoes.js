/**
 * localizacoes.js
 * Lógica da tela de listagem de Localizações (localizacoes.html)
 * Depende de api.js já estar carregado.
 *
 * ATUALIZADO: `empresa` vem como objeto aninhado { codigo, descricao },
 * não como texto solto.
 *
 * Estrutura real de uma Localização:
 * { id, empresa: { codigo, descricao }, descricao, centroCusto, tipo }
 */

const tbodyLocalizacoes = document.querySelector('.data-table tbody');
const inputBuscaLocalizacoes = document.querySelector('.search-container input');

let todasLocalizacoes = [];

const renderizarLocalizacoes = (localizacoes) => {
  if (localizacoes.length === 0) {
    tbodyLocalizacoes.innerHTML = `
      <tr><td colspan="6" style="text-align: center;">Nenhuma localização encontrada.</td></tr>
    `;
    return;
  }

  tbodyLocalizacoes.innerHTML = localizacoes.map((loc) => `
    <tr data-id="${loc.id}">
      <td>${loc.id}</td>
      <td>${loc.empresa?.descricao ?? 'Desconhecida'}</td>
      <td>${loc.descricao}</td>
      <td>${loc.centroCusto}</td>
      <td>${loc.tipo}</td>
      <td>
        <div class="actions">
          <button class="action-btn edit" title="Editar"><i class="ph ph-pencil"></i></button>
          <button class="action-btn delete" title="Excluir"><i class="ph ph-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
};

const carregarLocalizacoes = async () => {
  try {
    todasLocalizacoes = await apiGet('localizacoes');
    renderizarLocalizacoes(todasLocalizacoes);
  } catch (erro) {
    mostrarErro('Não foi possível carregar as localizações. Verifique se o back-end está rodando.');
  }
};

const filtrarLocalizacoes = (termo) => {
  const termoBusca = termo.toLowerCase().trim();

  if (termoBusca === '') {
    renderizarLocalizacoes(todasLocalizacoes);
    return;
  }

  const filtradas = todasLocalizacoes.filter((loc) =>
    (loc.empresa?.descricao || '').toLowerCase().includes(termoBusca) ||
    loc.descricao.toLowerCase().includes(termoBusca) ||
    loc.tipo.toLowerCase().includes(termoBusca) ||
    String(loc.id).includes(termoBusca)
  );

  renderizarLocalizacoes(filtradas);
};

const excluirLocalizacao = async (id) => {
  const confirmar = confirm(`Deseja realmente excluir a localização de id ${id}?`);
  if (!confirmar) return;

  try {
    await apiDelete('localizacoes', id);
    await carregarLocalizacoes();
  } catch (erro) {
    mostrarErro('Erro ao excluir a localização. Verifique se ela não está em uso por algum extintor.');
  }
};

tbodyLocalizacoes.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.action-btn');
  if (!botao) return;

  const linha = botao.closest('tr');
  const id = linha.dataset.id;

  if (botao.classList.contains('edit')) {
    window.location.href = `novaLocalizacao.html?id=${id}`;
  }

  if (botao.classList.contains('delete')) {
    excluirLocalizacao(id);
  }
});

inputBuscaLocalizacoes.addEventListener('input', (evento) => {
  filtrarLocalizacoes(evento.target.value);
});

document.addEventListener('DOMContentLoaded', carregarLocalizacoes);