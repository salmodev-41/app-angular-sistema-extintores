/**
 * novaLocalizacao.js
 * Lógica do formulário de cadastro/edição de Localização (novaLocalizacao.html)
 * Depende de api.js já estar carregado.
 *
 * ATUALIZADO: o id agora é gerado automaticamente pelo banco
 * (@GeneratedValue IDENTITY na entidade). O campo "Código" só aparece
 * (travado) durante a edição — no cadastro, ele fica oculto e não é
 * enviado no corpo da requisição.
 */

const form = document.getElementById('form-nova-localizacao');
const grupoCodigo = document.getElementById('grupo-codigo');
const inputCodigo = document.getElementById('codigo');
const inputEmpresa = document.getElementById('empresa'); // representa o CÓDIGO da empresa
const inputDescricao = document.getElementById('descricao');
const inputCentroCusto = document.getElementById('centro-custo');
const inputTipo = document.getElementById('tipo');
const btnCancelar = document.querySelector('.btn-secondary');
const btnSalvar = document.querySelector('.btn-primary');

const parametrosUrl = new URLSearchParams(window.location.search);
const idParaEditar = parametrosUrl.get('id');

const carregarParaEdicao = async (id) => {
  try {
    const localizacao = await apiGet(`localizacoes/${id}`);

    grupoCodigo.style.display = 'block'; // só mostra o Código quando está editando
    inputCodigo.value = localizacao.id;
    inputEmpresa.value = localizacao.empresa?.codigo ?? '';
    inputDescricao.value = localizacao.descricao;
    inputCentroCusto.value = localizacao.centroCusto;
    inputTipo.value = localizacao.tipo;

    document.querySelector('h1').textContent = 'Editar Localização';
    document.querySelector('.subtitle').textContent = 'Atualize os dados da localização';
    btnSalvar.textContent = 'Salvar Alterações';
  } catch (erro) {
    mostrarErro('Não foi possível carregar os dados desta localização.');
    window.location.href = 'localizacoes.html';
  }
};

const coletarDadosDoFormulario = () => ({
  empresaCodigo: inputEmpresa.value.trim(),
  descricao: inputDescricao.value.trim(),
  centroCusto: inputCentroCusto.value.trim(),
  tipo: inputTipo.value.trim()
  // sem "id" — o banco gera sozinho no cadastro;
  // na edição, o id vai na URL (apiPut já cuida disso), não no corpo
});

const salvarLocalizacao = async (evento) => {
  evento.preventDefault();

  const dados = coletarDadosDoFormulario();
  btnSalvar.disabled = true;

  try {
    if (idParaEditar) {
      await apiPut('localizacoes', idParaEditar, dados);
    } else {
      await apiPost('localizacoes', dados);
    }
    window.location.href = 'localizacoes.html';
  } catch (erro) {
    mostrarErro(
      idParaEditar
        ? 'Erro ao salvar as alterações. Verifique os dados e tente novamente.'
        : 'Erro ao cadastrar a localização. Verifique os dados.'
    );
    btnSalvar.disabled = false;
  }
};

form.addEventListener('submit', salvarLocalizacao);

btnCancelar.addEventListener('click', () => {
  window.location.href = 'localizacoes.html';
});

document.addEventListener('DOMContentLoaded', () => {
  if (idParaEditar) {
    carregarParaEdicao(idParaEditar);
  }
});