/**
 * novoExtintor.js
 * Lógica do formulário de cadastro/edição de Extintor (novoExtintor.html)
 * Depende de api.js já estar carregado.
 *
 * ATUALIZADO: tipo e localizacao são relacionamentos — ao editar, vêm como
 * objetos aninhados ({ id, descricao, ... }); ao salvar, enviamos de volta
 * como objeto { id } pro back conseguir montar a relação.
 * situacao usa código de uma letra ("A"/"I"/"M").
 *
 * Sem ?numero= na URL -> modo cadastro (POST)
 * Com ?numero=EXT001  -> modo edição (GET pra preencher + PUT ao salvar)
 */

/**
 * novoExtintor.js
 * Lógica do formulário de cadastro/edição de Extintor (novoExtintor.html)
 */

const form = document.getElementById('form-novo-extintor');
const inputCodigo = document.getElementById('codigo');
const selectTipo = document.getElementById('tipo');
const inputCapacidade = document.getElementById('capacidade');
const selectLocalizacao = document.getElementById('localizacao');
const inputDataValidade = document.getElementById('dataValidade');
const inputDataProxInspecao = document.getElementById('dataProxInspecao');
const selectStatus = document.getElementById('status');
const inputCentroCusto = document.getElementById('centroCusto');
const btnSalvar = document.querySelector('.btn-primary');

const parametrosUrl = new URLSearchParams(window.location.search);
const numeroParaEditar = parametrosUrl.get('numero');

const popularSelectTipo = async () => {
  const categorias = await apiGet('categorias');
  const opcoes = categorias.map((cat) => `<option value="${cat.id}">${cat.descricao}</option>`).join('');
  selectTipo.innerHTML = `<option value="" disabled selected>Selecione o tipo</option>${opcoes}`;
};

const popularSelectLocalizacao = async () => {
  const localizacoes = await apiGet('localizacoes');
  const opcoes = localizacoes.map((loc) => `<option value="${loc.id}">${loc.descricao}</option>`).join('');
  selectLocalizacao.innerHTML = `<option value="" disabled selected>Selecione a localização</option>${opcoes}`;
};

const carregarParaEdicao = async (numero) => {
  try {
    const extintor = await apiGet(`extintores/${numero}`);

    inputCodigo.value = extintor.numero;
    inputCodigo.readOnly = true;
    selectTipo.value = extintor.tipo?.id ?? '';
    inputCapacidade.value = extintor.cargaTotal;
    selectLocalizacao.value = extintor.localizacao?.id ?? '';
    inputDataValidade.value = extintor.cargaVencimento;
    inputDataProxInspecao.value = extintor.dataProxInspecao;
    selectStatus.value = extintor.situacao;
    inputCentroCusto.value = extintor.centroCusto;

    document.querySelector('h1').textContent = 'Editar Extintor';
    document.querySelector('.page-title p').textContent = 'Atualize os dados do extintor';
    btnSalvar.textContent = 'Salvar Alterações';
  } catch (erro) {
    mostrarErro('Não foi possível carregar os dados deste extintor.');
    window.location.href = 'extintores.html';
  }
};

const coletarDadosDoFormulario = () => {
  // Limpa o input de capacidade
  const capacidadeLimpa = inputCapacidade.value
    .toString()
    .replace(',', '.')
    .replace(/[^0-9.]/g, '');

  const cargaTotalNum = parseFloat(capacidadeLimpa);

  const idTipo = parseInt(selectTipo.value, 10);
  const idLocalizacao = parseInt(selectLocalizacao.value, 10);

  return {
    numero: inputCodigo.value.trim(),
    tipoId: isNaN(idTipo) ? null : idTipo,
    cargaTotal: isNaN(cargaTotalNum) ? 0 : cargaTotalNum,
    localizacaoId: isNaN(idLocalizacao) ? null : idLocalizacao,
    cargaVencimento: inputDataValidade.value,
    dataProxInspecao: inputDataProxInspecao.value,
    situacao: selectStatus.value,
    centroCusto: inputCentroCusto.value.trim()
  };
};

const salvarExtintor = async (evento) => {
  evento.preventDefault();

  const dados = coletarDadosDoFormulario();

  // Validação preventiva antes de enviar para o backend
  if (!dados.tipoId || !dados.localizacaoId) {
  alert('Por favor, selecione um Tipo e uma Localização válidos.');
  return;
}

  btnSalvar.disabled = true;

  try {
    if (numeroParaEditar) {
      await apiPut('extintores', numeroParaEditar, dados);
    } else {
      await apiPost('extintores', dados);
    }
    window.location.href = 'extintores.html';
  } catch (erro) {
    mostrarErro(
      numeroParaEditar
        ? 'Erro ao salvar as alterações. Verifique os dados e tente novamente.'
        : 'Erro ao cadastrar o extintor. Verifique se o código já não está em uso.'
    );
    btnSalvar.disabled = false;
  }
};

form.addEventListener('submit', salvarExtintor);

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([popularSelectTipo(), popularSelectLocalizacao()]);

  if (numeroParaEditar) {
    await carregarParaEdicao(numeroParaEditar);
  }
});