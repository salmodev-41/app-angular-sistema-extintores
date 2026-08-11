/**
 * novaCategoria.js
 * Lógica do formulário de cadastro/edição de Categoria (novaCategoria.html)
 * Depende de api.js já estar carregado.
 *
 * Sem ?id= na URL  -> modo cadastro (POST)
 * Com ?id=123 na URL -> modo edição (GET pra preencher + PUT ao salvar)
 */

const form = document.getElementById('form-nova-categoria');
const inputDescricao = document.getElementById('descricao');
const inputUnidade = document.getElementById('unidade');
const inputPeriodoInspecao = document.getElementById('periodo-inspecao');
const inputPeriodoValidade = document.getElementById('periodo-validade');
const btnCancelar = document.querySelector('.btn-secondary');
const btnSalvar = document.querySelector('.btn-primary');

const parametrosUrl = new URLSearchParams(window.location.search);
const idParaEditar = parametrosUrl.get('id');

const carregarParaEdicao = async (id) => {
  try {
    const categoria = await apiGet(`categorias/${id}`);

    inputDescricao.value = categoria.descricao;
    inputUnidade.value = categoria.unidade;
    inputPeriodoInspecao.value = categoria.periodoInspecao;
    inputPeriodoValidade.value = categoria.periodoValidade;

    document.querySelector('h1').textContent = 'Editar Categoria';
    document.querySelector('.subtitle').textContent = 'Atualize os dados da categoria';
    btnSalvar.textContent = 'Salvar Alterações';
  } catch (erro) {
    mostrarErro('Não foi possível carregar os dados desta categoria.');
    window.location.href = 'categorias.html';
  }
};

const coletarDadosDoFormulario = () => ({
  descricao: inputDescricao.value.trim(),
  unidade: inputUnidade.value.trim(),
  periodoInspecao: parseInt(inputPeriodoInspecao.value, 10),
  periodoValidade: parseInt(inputPeriodoValidade.value, 10)
});

const salvarCategoria = async (evento) => {
  evento.preventDefault();

  const dados = coletarDadosDoFormulario();
  btnSalvar.disabled = true;

  try {
    if (idParaEditar) {
      await apiPut('categorias', idParaEditar, dados);
    } else {
      await apiPost('categorias', dados);
    }
    window.location.href = 'categorias.html';
  } catch (erro) {
    mostrarErro(
      idParaEditar
        ? 'Erro ao salvar as alterações. Verifique os dados e tente novamente.'
        : 'Erro ao cadastrar a categoria. Verifique os dados.'
    );
    btnSalvar.disabled = false;
  }
};

form.addEventListener('submit', salvarCategoria);

btnCancelar.addEventListener('click', () => {
  window.location.href = 'categorias.html';
});

document.addEventListener('DOMContentLoaded', () => {
  if (idParaEditar) {
    carregarParaEdicao(idParaEditar);
  }
});