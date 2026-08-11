/**
 * movimentacaoItens.js
 * Lógica da tela de listagem de Itens de uma Movimentação (movimentacaoItens.html)
 * Depende de api.js já estar carregado.
 *
 * Campos da entidade Extintores_Movimento_Itens (dicionário de dados):
 * movimento, extintor, destino, tipo, conferido, tipoRetorno,
 * cargaVencimento, cargaProxInspecao, numeroSubstituto
 *
 * OBS: assumi o endpoint /movimentacoes/{movimentoId}/itens pro back-end.
 * Confirme com o Controller do Kotlin e ajuste aqui se o caminho real for outro.
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
let mapaLocalizacoes = {};

const formatarData = (dataIso) => {
  if (!dataIso) return '-';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
};

const carregarMapaLocalizacoes = async () => {
  const localizacoes = await apiGet('localizacoes');
  mapaLocalizacoes = Object.fromEntries(localizacoes.map((l) => [l.id, l.descricao]));
};

const renderizarItens = (itens) => {
  if (itens.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="9" style="text-align: center;">Nenhum item cadastrado nesta movimentação.</td></tr>
    `;
    return;
  }

  tbody.innerHTML = itens.map((item) => `
    <tr data-extintor="${item.extintor}">
      <td>${item.extintor}</td>
      <td>${mapaLocalizacoes[item.destino] ?? item.destino}</td>
      <td>${item.tipo}</td>
      <td>${item.conferido ? 'Sim' : 'Não'}</td>
      <td>${item.tipoRetorno ?? '-'}</td>
      <td>${formatarData(item.cargaVencimento)}</td>
      <td>${formatarData(item.cargaProxInspecao)}</td>
      <td>${item.numeroSubstituto ?? '-'}</td>
      <td>
        <div class="actions">
          <button class="action-btn edit" title="Editar"><i class="ph ph-pencil"></i></button>
          <button class="action-btn delete" title="Excluir"><i class="ph ph-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
};

const carregarItens = async () => {
  try {
    await carregarMapaLocalizacoes();
    todosItens = await apiGet(`movimentacoes/${movimentoId}/itens`);
    renderizarItens(todosItens);
  } catch (erro) {
    mostrarErro('Não foi possível carregar os itens desta movimentação.');
  }
};

const excluirItem = async (extintor) => {
  const confirmar = confirm(`Remover o extintor ${extintor} desta movimentação?`);
  if (!confirmar) return;

  try {
    await apiDelete(`movimentacoes/${movimentoId}/itens`, extintor);
    await carregarItens();
  } catch (erro) {
    mostrarErro('Erro ao excluir o item.');
  }
};

tbody.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.action-btn');
  if (!botao) return;

  const linha = botao.closest('tr');
  const extintor = linha.dataset.extintor;

  if (botao.classList.contains('edit')) {
    window.location.href = `novoItemMovimentacao.html?movimentoId=${movimentoId}&extintor=${extintor}`;
  }

  if (botao.classList.contains('delete')) {
    excluirItem(extintor);
  }
});

document.addEventListener('DOMContentLoaded', carregarItens);