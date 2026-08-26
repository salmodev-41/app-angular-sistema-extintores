/**
 * movimentacoes.js
 * Lógica da tela de listagem de Movimentações — CABEÇALHO (movimentacoes.html)
 * Depende de api.js já estar carregado.
 *
 * Campos da entidade Extintores_movimento (dicionário de dados):
 * id, empresa, data, tipo, empresaDestino
 */

const tbodyMovimentacoes = document.querySelector('.data-table tbody');
const inputBuscaMovimentacoes = document.querySelector('.search-container input');

let todasMovimentacoes = [];

const formatarData = (dataIso) => {
  if (!dataIso) return '-';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
};

const renderizarMovimentacoes = (movimentacoes) => {
  if (movimentacoes.length === 0) {
    tbodyMovimentacoes.innerHTML = `
      <tr><td colspan="6" style="text-align: center;">Nenhuma movimentação encontrada.</td></tr>
    `;
    return;
  }

  tbodyMovimentacoes.innerHTML = movimentacoes.map((mov) => `
    <tr data-id="${mov.id}">
      <td>${mov.empresa?.codigo ?? 'Desconhecida'}</td>
      <td>${mov.empresaDestino?.codigo ?? 'Desconhecida'}</td>
      <td>${formatarData(mov.data)}</td>
      <td>${mov.tipo}</td>
      <td>
        <div class="actions">
          <button class="action-btn edit" title="Editar"><i class="ph ph-pencil"></i></button>
          <button class="action-btn delete" title="Excluir"><i class="ph ph-trash"></i></button>
          <button class="action-btn itens" title="Ver Itens"><i class="ph ph-list-bullets"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
};

const carregarMovimentacoes = async () => {
  try {
    todasMovimentacoes = await apiGet('movimentacoes');
    renderizarMovimentacoes(todasMovimentacoes);
  } catch (erro) {
    mostrarErro('Não foi possível carregar as movimentações. Verifique se o back-end está rodando.');
  }
};

const filtrarMovimentacoes = (termo) => {
  const termoBusca = termo.toLowerCase().trim();

  if (termoBusca === '') {
    renderizarMovimentacoes(todasMovimentacoes);
    return;
  }

  const filtradas = todasMovimentacoes.filter((mov) =>
    (mov.empresa?.descricao || '').toLowerCase().includes(termoBusca) ||
    mov.tipo.toLowerCase().includes(termoBusca)
  );

  renderizarMovimentacoes(filtradas);
};

const excluirMovimentacao = async (id) => {
  const confirmar = confirm(`Deseja realmente excluir a movimentação de id ${id}? Isso também removerá os itens vinculados a ela.`);
  if (!confirmar) return;

  try {
    await apiDelete('movimentacoes', id);
    await carregarMovimentacoes();
  } catch (erro) {
    mostrarErro('Erro ao excluir a movimentação.');
  }
};

tbodyMovimentacoes.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.action-btn');
  if (!botao) return;

  const linha = botao.closest('tr');
  const id = linha.dataset.id;

  if (botao.classList.contains('edit')) {
    window.location.href = `novaMovimentacao.html?id=${id}`;
  }

  if (botao.classList.contains('delete')) {
    excluirMovimentacao(id);
  }

  if (botao.classList.contains('itens')) {
    // Tela de Itens ainda não existe no seu Figma — veremos isso no próximo passo
    window.location.href = `movimentacaoItens.html?movimentoId=${id}`;
  }
});

inputBuscaMovimentacoes.addEventListener('input', (evento) => {
  filtrarMovimentacoes(evento.target.value);
});

document.addEventListener('DOMContentLoaded', carregarMovimentacoes);