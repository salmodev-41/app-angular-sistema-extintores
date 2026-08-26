/**
 * categorias.js
 * Lógica da tela de listagem de Categorias (categorias.html)
 * Depende de api.js já estar carregado.
 *
 * Campos da entidade Extintores_Categorias (dicionário de dados):
 * id, descricao, unidade, periodoInspecao, periodoValidade
 */

const tbodyCategorias = document.querySelector('.data-table tbody');
const inputBuscaCategorias = document.querySelector('.search-container input');

let todasCategorias = [];

const renderizarCategorias = (categorias) => {
  if (categorias.length === 0) {
    tbodyCategorias.innerHTML = `
      <tr><td colspan="6" style="text-align: center;">Nenhuma categoria encontrada.</td></tr>
    `;
    return;
  }

  tbodyCategorias.innerHTML = categorias.map((cat) => `
    <tr data-id="${cat.id}">
      <td>${cat.descricao}</td>
      <td>${cat.unidade}</td>
      <td>${cat.periodoInspecao}</td>
      <td>${cat.periodoValidade}</td>
      <td>
        <div class="actions">
          <button class="action-btn edit" title="Editar"><i class="ph ph-pencil"></i></button>
          <button class="action-btn delete" title="Excluir"><i class="ph ph-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
};

const carregarCategorias = async () => {
  try {
    todasCategorias = await apiGet('categorias');
    renderizarCategorias(todasCategorias);
  } catch (erro) {
    mostrarErro('Não foi possível carregar as categorias. Verifique se o back-end está rodando.');
  }
};

const filtrarCategorias = (termo) => {
  const termoBusca = termo.toLowerCase().trim();

  if (termoBusca === '') {
    renderizarCategorias(todasCategorias);
    return;
  }

  const filtradas = todasCategorias.filter((cat) =>
    cat.descricao.toLowerCase().includes(termoBusca) ||
    cat.unidade.toLowerCase().includes(termoBusca)
  );

  renderizarCategorias(filtradas);
};

const excluirCategoria = async (id) => {
  const confirmar = confirm(`Deseja realmente excluir a categoria de id ${id}?`);
  if (!confirmar) return;

  try {
    await apiDelete('categorias', id);
    await carregarCategorias();
  } catch (erro) {
    mostrarErro('Erro ao excluir a categoria. Verifique se ela não está em uso por algum extintor.');
  }
};

tbodyCategorias.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.action-btn');
  if (!botao) return;

  const linha = botao.closest('tr');
  const id = linha.dataset.id;

  if (botao.classList.contains('edit')) {
    window.location.href = `novaCategoria.html?id=${id}`;
  }

  if (botao.classList.contains('delete')) {
    excluirCategoria(id);
  }
});

inputBuscaCategorias.addEventListener('input', (evento) => {
  filtrarCategorias(evento.target.value);
});

document.addEventListener('DOMContentLoaded', carregarCategorias);