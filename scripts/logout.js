const linkSair = document.querySelector('.sidebar-footer a');

linkSair.addEventListener('click', () => {
  localStorage.removeItem('token');
});