import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  saving = false;
  loginForm = { usuario: '', senha: '' };

  constructor(private readonly api: ApiService, private readonly router: Router) {}

  async login(): Promise<void> {
    this.saving = true;
    try {
      const response = await this.api.login({
        email: this.loginForm.usuario.trim(),
        senha: this.loginForm.senha
      });
      localStorage.setItem('token', response.token);
      await this.router.navigate(['/home']);
    } catch (error: unknown) {
      console.error('[login]', error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          window.alert('Não foi possível conectar à API em http://localhost:8080. Confira se o back-end está rodando e se o navegador permite a conexão.');
        } else if (error.status === 401) {
          window.alert('A API rejeitou o login (HTTP 401). Verifique o e-mail e a senha cadastrados no back-end.');
        } else if (error.status === 404) {
          window.alert('A API respondeu, mas não encontrou o endpoint /auth/login (HTTP 404). Confira a rota configurada no back-end.');
        } else {
          window.alert(`A API retornou um erro ao tentar entrar (HTTP ${error.status}). Confira os logs do back-end.`);
        }
      } else {
        window.alert('Ocorreu um erro inesperado ao tentar entrar. Confira o console do navegador para mais detalhes.');
      }
    } finally {
      this.saving = false;
    }
  }
}
