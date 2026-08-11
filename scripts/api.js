/**
 * api.js
 * Funções genéricas para comunicação com o back-end (Spring Boot / Kotlin)
 * Sistema de Gestão de Extintores
 *
 * ATUALIZADO: agora inclui o Bearer Token (guardado no login) em toda
 * requisição, e redireciona pro login se o back responder 401.
 */

const API_BASE = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiGet = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      headers: { ...getAuthHeaders() }
    });

    if (response.status === 401) {
      window.location.href = 'login.html';
      return;
    }
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados em /${endpoint} (status ${response.status})`);
    }
    return await response.json();
  } catch (erro) {
    console.error('[apiGet]', erro);
    throw erro;
  }
};

const apiPost = async (endpoint, dados) => {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(dados)
    });

    if (response.status === 401) {
      window.location.href = 'login.html';
      return;
    }
    if (!response.ok) {
      throw new Error(`Erro ao cadastrar em /${endpoint} (status ${response.status})`);
    }
    return await response.json();
  } catch (erro) {
    console.error('[apiPost]', erro);
    throw erro;
  }
};

const apiPut = async (endpoint, id, dados) => {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(dados)
    });

    if (response.status === 401) {
      window.location.href = 'login.html';
      return;
    }
    if (!response.ok) {
      throw new Error(`Erro ao atualizar /${endpoint}/${id} (status ${response.status})`);
    }
    return await response.json();
  } catch (erro) {
    console.error('[apiPut]', erro);
    throw erro;
  }
};

const apiDelete = async (endpoint, id) => {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });

    if (response.status === 401) {
      window.location.href = 'login.html';
      return;
    }
    if (!response.ok) {
      throw new Error(`Erro ao excluir /${endpoint}/${id} (status ${response.status})`);
    }
    return true;
  } catch (erro) {
    console.error('[apiDelete]', erro);
    throw erro;
  }
};

const mostrarErro = (mensagem) => {
  alert(mensagem);
};