/**
 * novoItemMovimentacao.js
 * Lógica do formulário de cadastro/edição de Item de Movimentação
 * (novoItemMovimentacao.html)
 * Depende de api.js já estar carregado.
 *
 * O "movimento" (id do cabeçalho) vem do ?movimentoId= na URL, não é digitado.
 * Sem ?extintor= na URL  -> modo cadastro (POST)
 * Com ?extintor=EXT001   -> modo edição (a chave do item é movimento + extintor)
 */

const parametrosUrl = new URLSearchParams(window.location.search);
const movimentoId = parametrosUrl.get('movimentoId');
const extintorParaEditar = parametrosUrl.get('extintor');

if (!movimentoId) {
  alert('Nenhuma movimentação selecionada.');
  window.location.href = 'movimentacoes.html';
}

document.getElementById('link-voltar').href = `movimentacaoItens.html?movimentoId=${movimentoId}`;

const form = document.getElementById('form-item-movimentacao');
const selectExtintor = document.getElementById('extintor');
const selectDestino = document.getElementById('destino');
const inputTipo = document.getElementById('tipo');
const inputTipoRetorno = document.getElementById('tipo-retorno');
const inputCargaVencimento = document.getElementById('carga-vencimento');
const inputCargaProxInspecao = document.getElementById('carga-prox-inspecao');
const inputNumeroSubstituto = document.getElementById('numero-substituto');
const checkboxConferido = document.getElementById('conferido');
const btnCancelar = document.getElementById('btn-cancelar');
const btnSalvar = document.querySelector('.btn-primary');

const popularSelectExtintores = async () => {
  const extintores = await apiGet('extintores');
  const opcoes = extintores.map((ext) => `<option value="${ext.numero}">${ext.numero}</option>`).join('');
  selectExtintor.innerHTML = `<option value="" disabled selected>Selecione o extintor</option>${opcoes}`;
};

const popularSelectDestino = async () => {
  const localizacoes = await apiGet('localizacoes');
  const opcoes = localizacoes.map((loc) => `<option value="${loc.id}">${loc.descricao}</option>`).join('');
  selectDestino.innerHTML = `<option value="" disabled selected>Selecione a localização de destino</option>${opcoes}`;
};

const carregarParaEdicao = async (extintor) => {
  try {
    const item = await apiGet(`movimentacoes/${movimentoId}/itens/${extintor}`);

    selectExtintor.value = item.extintor;
    selectExtintor.disabled = true; // não faz sentido trocar o extintor de um item existente
    selectDestino.value = item.destino;
    inputTipo.value = item.tipo;
    inputTipoRetorno.value = item.tipoRetorno ?? '';
    inputCargaVencimento.value = item.cargaVencimento;
    inputCargaProxInspecao.value = item.cargaProxInspecao;
    inputNumeroSubstituto.value = item.numeroSubstituto ?? '';
    checkboxConferido.checked = !!item.conferido;

    document.querySelector('h1').textContent = 'Editar Item de Movimentação';
    btnSalvar.textContent = 'Salvar Alterações';
  } catch (erro) {
    mostrarErro('Não foi possível carregar este item.');
    window.location.href = `movimentacaoItens.html?movimentoId=${movimentoId}`;
  }
};

const coletarDados = () => ({
  movimento: parseInt(movimentoId, 10),
  extintor: selectExtintor.value,
  destino: parseInt(selectDestino.value, 10),
  tipo: inputTipo.value.trim(),
  conferido: checkboxConferido.checked,
  tipoRetorno: inputTipoRetorno.value.trim() || null,
  cargaVencimento: inputCargaVencimento.value,
  cargaProxInspecao: inputCargaProxInspecao.value,
  numeroSubstituto: inputNumeroSubstituto.value.trim() || null
});

const salvarItem = async (evento) => {
  evento.preventDefault();

  const dados = coletarDados();
  btnSalvar.disabled = true;

  try {
    if (extintorParaEditar) {
      await apiPut(`movimentacoes/${movimentoId}/itens`, extintorParaEditar, dados);
    } else {
      await apiPost(`movimentacoes/${movimentoId}/itens`, dados);
    }
    window.location.href = `movimentacaoItens.html?movimentoId=${movimentoId}`;
  } catch (erro) {
    mostrarErro('Erro ao salvar o item. Verifique os dados.');
    btnSalvar.disabled = false;
  }
};

form.addEventListener('submit', salvarItem);

btnCancelar.addEventListener('click', () => {
  window.location.href = `movimentacaoItens.html?movimentoId=${movimentoId}`;
});

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([popularSelectExtintores(), popularSelectDestino()]);

  if (extintorParaEditar) {
    await carregarParaEdicao(extintorParaEditar);
  }
});