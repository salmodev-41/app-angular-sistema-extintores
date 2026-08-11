/**
 * extintores.js
 * Lógica da tela de listagem de Extintores (extintores.html)
 * Depende de api.js já estar carregado.
 *
 * ATUALIZADO: o back-end devolve `tipo` e `localizacao` como OBJETOS
 * aninhados (não ids soltos), então não precisamos mais buscar
 * Categorias/Localizações à parte pra montar um mapa id -> nome.
 *
 * Estrutura real de um Extintor (conforme JSON do back):
 * {
 *   numero, cargaTotal, cargaVencimento, centroCusto,
 *   situacao: "A" | "I" | ...,
 *   tipo: { id, descricao, unidade, periodoInspecao, periodoValidade },
 *   localizacao: { id, empresa: { codigo, descricao }, descricao, centroCusto, tipo }
 * }
 */

// Ajuste/complete esse mapa se existirem outros códigos de situação no back
const SITUACAO_LABELS = {
  A: 'Ativo',
  I: 'Inativo',
  R: 'Recarga',
  S: 'Substituido'
};

const tbodyExtintores = document.querySelector('.data-table tbody');
const inputBuscaExtintores = document.querySelector('.search-container input');

let todosExtintores = [];

const formatarData = (dataIso) => {
  if (!dataIso) return '-';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
};

const renderizarExtintores = (extintores) => {
  if (extintores.length === 0) {
    tbodyExtintores.innerHTML = `
      <tr><td colspan="7" style="text-align: center;">Nenhum extintor encontrado.</td></tr>
    `;
    return;
  }

  tbodyExtintores.innerHTML = extintores.map((ext) => `
    <tr data-numero="${ext.numero}">
      <td>${ext.numero}</td>
      <td>${ext.tipo?.descricao ?? 'Desconhecido'}</td>
      <td>${ext.cargaTotal}</td>
      <td>${ext.localizacao?.descricao ?? 'Desconhecida'}</td>
      <td>${ext.centroCusto ?? '-'}</td>
      <td>${formatarData(ext.cargaVencimento)}</td>
      <td>${formatarData(ext.dataProxInspecao)}</td>
      <td><span class="badge">${SITUACAO_LABELS[ext.situacao] ?? ext.situacao}</span></td>
      <td>
        <div class="actions">
          <button class="btn-icon edit" title="Editar"><i class="ph ph-pencil-simple"></i></button>
          <button class="btn-icon delete" title="Excluir"><i class="ph ph-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
};

const carregarExtintores = async () => {
  try {
    todosExtintores = await apiGet('extintores');
    renderizarExtintores(todosExtintores);
  } catch (erro) {
    mostrarErro('Não foi possível carregar os extintores. Verifique se o back-end está rodando.');
  }
};

const filtrarExtintores = (termo) => {
  const termoBusca = termo.toLowerCase().trim();

  if (termoBusca === '') {
    renderizarExtintores(todosExtintores);
    return;
  }

  const filtrados = todosExtintores.filter((ext) => {
    const nomeTipo = (ext.tipo?.descricao || '').toLowerCase();
    const nomeLocalizacao = (ext.localizacao?.descricao || '').toLowerCase();

    return (
      ext.numero.toLowerCase().includes(termoBusca) ||
      nomeTipo.includes(termoBusca) ||
      nomeLocalizacao.includes(termoBusca)
    );
  });

  renderizarExtintores(filtrados);
};

const excluirExtintor = async (numero) => {
  const confirmar = confirm(`Deseja realmente excluir o extintor ${numero}?`);
  if (!confirmar) return;

  try {
    await apiDelete('extintores', numero);
    await carregarExtintores();
  } catch (erro) {
    mostrarErro('Não foi possível excluir este extintor: ele já está vinculado a uma ou mais movimentações. Remova os itens de movimentação relacionados antes de excluir.');
  }
};

tbodyExtintores.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.btn-icon');
  if (!botao) return;

  const linha = botao.closest('tr');
  const numero = linha.dataset.numero;

  if (botao.classList.contains('edit')) {
    window.location.href = `novoExtintor.html?numero=${numero}`;
  }

  if (botao.classList.contains('delete')) {
    excluirExtintor(numero);
  }
});

inputBuscaExtintores.addEventListener('input', (evento) => {
  filtrarExtintores(evento.target.value);
});

document.addEventListener('DOMContentLoaded', carregarExtintores);