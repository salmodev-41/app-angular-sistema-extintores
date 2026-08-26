/**
 * novaMovimentacao.js
 * Lógica do formulário de cadastro/edição do CABEÇALHO de Movimentação
 * (novaMovimentacao.html)
 * Depende de api.js já estar carregado.
 *
 * Campos da entidade Extintores_movimento (dicionário de dados):
 * id, empresa, data, tipo, empresaDestino
 *
 * Sem ?id= na URL  -> modo cadastro (POST)
 * Com ?id=123 na URL -> modo edição (GET pra preencher + PUT ao salvar)
 */

const form = document.getElementById('form-movimentacao');
const inputEmpresa = document.getElementById('empresa');
const inputEmpresaDestino = document.getElementById('empresa-destino');
const selectTipo = document.getElementById('tipo');
const inputData = document.getElementById('data');
const btnCancelar = document.querySelector('.btn-cancelar');
const btnSalvar = document.querySelector('.btn-cadastrar');

const parametrosUrl = new URLSearchParams(window.location.search);
const idParaEditar = parametrosUrl.get('id');

const carregarParaEdicao = async (id) => {
  try {
    const movimentacao = await apiGet(`movimentacoes/${id}`);

    inputEmpresa.value = movimentacao.empresa?.codigo ?? '';
    inputEmpresaDestino.value = movimentacao.empresaDestino?.codigo ?? '';
    selectTipo.value = movimentacao.tipo;
    inputData.value = movimentacao.data; // já vem em aaaa-mm-dd

    document.querySelector('h1').textContent = 'Editar Movimentação';
    document.querySelector('.content-header p').textContent = 'Atualize os dados da movimentação';
    btnSalvar.textContent = 'Salvar Alterações';
  } catch (erro) {
    mostrarErro('Não foi possível carregar os dados desta movimentação.');
    window.location.href = 'movimentacoes.html';
  }
};

const coletarDadosDoFormulario = () => ({
  empresaCodigo: inputEmpresa.value.trim(),
  empresaDestinoCodigo: inputEmpresaDestino.value.trim(),
  tipo: selectTipo.value,
  data: inputData.value
});

const salvarMovimentacao = async (evento) => {
  evento.preventDefault();

  const dados = coletarDadosDoFormulario();
  btnSalvar.disabled = true;

  try {
    if (idParaEditar) {
      await apiPut('movimentacoes', idParaEditar, dados);
    } else {
      await apiPost('movimentacoes', dados);
    }
    window.location.href = 'movimentacoes.html';
  } catch (erro) {
    mostrarErro(
      idParaEditar
        ? 'Erro ao salvar as alterações. Verifique os dados e tente novamente.'
        : 'Erro ao cadastrar a movimentação. Verifique os dados.'
    );
    btnSalvar.disabled = false;
  }
};

form.addEventListener('submit', salvarMovimentacao);

btnCancelar.addEventListener('click', () => {
  window.location.href = 'movimentacoes.html';
});

document.addEventListener('DOMContentLoaded', () => {
  if (idParaEditar) {
    carregarParaEdicao(idParaEditar);
  }
});