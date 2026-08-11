/**
 * login.js
 * Lógica da tela de Login (login.html)
 * Depende de api.js já estar carregado.
 *
 * Assume que POST /auth/login espera { usuario, senha } e devolve { token }.
 * Ajuste os nomes dos campos abaixo se o back usar nomes diferentes.
 */

const form = document.getElementById('form-login');
const inputUsuario = document.getElementById('usuario');
const inputSenha = document.getElementById('senha');
const btnEntrar = document.querySelector('.btn-entrar');

const fazerLogin = async (evento) => {
  evento.preventDefault();

  const credenciais = {
  email: inputUsuario.value.trim(),
  senha: inputSenha.value
};

  btnEntrar.disabled = true;

  try {
    const resposta = await apiPost('auth/login', credenciais);
    localStorage.setItem('token', resposta.token);
    window.location.href = 'index.html';
  } catch (erro) {
    mostrarErro('Usuário ou senha inválidos.');
    btnEntrar.disabled = false;
  }
};

form.addEventListener('submit', fazerLogin);