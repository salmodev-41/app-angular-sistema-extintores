/**
 * movimentacaoItens.js
 * Lógica da tela de listagem de Itens de uma Movimentação
 * (movimentacaoItens.html)
 *
 * Endpoint real do backend:
 *
 * GET    /movimento-itens
 * GET    /movimento-itens/{id}
 * POST   /movimento-itens
 * PUT    /movimento-itens/{id}
 * DELETE /movimento-itens/{id}
 */

const parametrosUrl = new URLSearchParams(window.location.search);
const movimentoId = parametrosUrl.get('movimentoId');

if (!movimentoId) {
  alert('Nenhuma movimentação selecionada.');
  window.location.href = 'movimentacoes.html';
}

const tbody = document.querySelector('.data-table tbody');
const linkNovoItem = document.getElementById('link-novo-item');

linkNovoItem.href = `novoItemMovimentacao.html?movimentoId=${movimentoId}`;

let todosItens = [];

const formatarData = (dataIso) => {
  if (!dataIso) return '-';

  const [ano, mes, dia] = dataIso.split('-');

  return `${dia}/${mes}/${ano}`;
};

const renderizarItens = (itens) => {

  if (itens.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center;">
          Nenhum item cadastrado nesta movimentação.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = itens.map((item) => `
    <tr data-item-id="${item.id}">

      <td>${item.extintor?.numero ?? '-'}</td>

      <td>${item.destino?.descricao ?? '-'}</td>

      <td>${item.tipoMovimentoItem ?? '-'}</td>

      <td>${item.conferido ? 'Sim' : 'Não'}</td>

      <td>${item.tipoRetorno ?? '-'}</td>

      <td>${formatarData(item.cargaVencimento)}</td>

      <td>${formatarData(item.dataProxInspecao)}</td>

      <td>${item.numeroSubstituto || '-'}</td>

      <td>
        <div class="actions">

          <button
            class="action-btn edit"
            title="Editar">
            <i class="ph ph-pencil"></i>
          </button>

          <button
            class="action-btn delete"
            title="Excluir">
            <i class="ph ph-trash"></i>
          </button>

        </div>
      </td>

    </tr>
  `).join('');
};

const carregarItens = async () => {

  try {

    // Busca todos os itens existentes
    const itens = await apiGet('movimento-itens');

    // Mantém somente os itens desta movimentação
    todosItens = itens.filter(
      (item) => String(item.movimento?.id) === String(movimentoId)
    );

    renderizarItens(todosItens);

  } catch (erro) {

    console.error(erro);

    mostrarErro(
      'Não foi possível carregar os itens desta movimentação.'
    );
  }
};

const excluirItem = async (itemId) => {
  const confirmar = confirm(
    'Deseja realmente excluir este item da movimentação?'
  );

  if (!confirmar) return;

  try {
    await apiDelete('movimento-itens', itemId);

    await carregarItens();

  } catch (erro) {
    console.error(erro);

    mostrarErro('Erro ao excluir o item.');
  }
};

tbody.addEventListener('click', (evento) => {

  const botao = evento.target.closest('.action-btn');

  if (!botao) return;

  const linha = botao.closest('tr');

  const itemId = linha.dataset.itemId;

  if (botao.classList.contains('edit')) {

    window.location.href =
      `novoItemMovimentacao.html?movimentoId=${movimentoId}&itemId=${itemId}`;
  }

  if (botao.classList.contains('delete')) {

    excluirItem(itemId);
  }

});

document.addEventListener(
  'DOMContentLoaded',
  carregarItens
);