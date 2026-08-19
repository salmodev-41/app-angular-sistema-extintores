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
const itemIdParaEditar = parametrosUrl.get('itemId');
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

const carregarParaEdicao = async (itemId) => {
  try {
    const item = await apiGet(`movimento-itens/${itemId}`);

    selectExtintor.value = item.extintor?.numero ?? '';
    selectExtintor.disabled = true;

    selectDestino.value = item.destino?.id ?? '';

    inputTipo.value = item.tipoMovimentoItem ?? '';

    inputTipoRetorno.value = item.tipoRetorno ?? '';

    inputCargaVencimento.value = item.cargaVencimento ?? '';

    inputCargaProxInspecao.value = item.dataProxInspecao ?? '';

    inputNumeroSubstituto.value = item.numeroSubstituto ?? '';

    checkboxConferido.checked = !!item.conferido;

    document.querySelector('h1').textContent =
      'Editar Item de Movimentação';

    btnSalvar.textContent = 'Salvar Alterações';

  } catch (erro) {
    console.error(erro);

    mostrarErro('Não foi possível carregar este item.');

    window.location.href =
      `movimentacaoItens.html?movimentoId=${movimentoId}`;
  }
};

const coletarDados = () => ({
  movimentoId: parseInt(movimentoId, 10),
  extintorNumero: selectExtintor.value,
  destinoId: parseInt(selectDestino.value, 10),
  tipoMovimentoItem: inputTipo.value.trim(),
  conferido: checkboxConferido.checked,
  tipoRetorno: inputTipoRetorno.value.trim() || null,
  cargaVencimento: inputCargaVencimento.value,
  dataProxInspecao: inputCargaProxInspecao.value,
  numeroSubstituto: inputNumeroSubstituto.value.trim() || ''
});

const salvarItem = async (evento) => {
  evento.preventDefault();

  const dados = coletarDados();

  btnSalvar.disabled = true;

  try {

    if (itemIdParaEditar) {

      await apiPut(
        'movimento-itens',
        itemIdParaEditar,
        dados
      );

    } else {

      await apiPost(
        'movimento-itens',
        dados
      );
    }

    window.location.href =
      `movimentacaoItens.html?movimentoId=${movimentoId}`;

  } catch (erro) {

    console.error(erro);

    mostrarErro(
      itemIdParaEditar
        ? 'Erro ao atualizar o item.'
        : 'Erro ao cadastrar o item.'
    );

    btnSalvar.disabled = false;
  }
};

form.addEventListener('submit', salvarItem);

btnCancelar.addEventListener('click', () => {
  window.location.href = `movimentacaoItens.html?movimentoId=${movimentoId}`;
});

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([popularSelectExtintores(), popularSelectDestino()]);

  if (itemIdParaEditar) {
    await carregarParaEdicao(itemIdParaEditar);
  }
});