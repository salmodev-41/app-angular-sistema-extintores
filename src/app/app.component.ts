import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  isLogin = false;
  private pageStyle?: HTMLLinkElement;

  constructor(
    private readonly router: Router,
    private readonly api: ApiService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.updatePageMode();
    this.updatePageStyles();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageMode();
        this.updatePageStyles();
      });
  }

  logout(): void {
    this.api.logout();
    void this.router.navigate(['/login']);
  }

  private updatePageMode(): void {
    this.isLogin = this.router.url.startsWith('/login');
  }

  private updatePageStyles(): void {
    this.pageStyle?.remove();
    const path = this.router.url.split('?')[0];
    const styles: Record<string, string> = {
      '/home': 'index.css',
      '/login': 'login.css',
      '/categorias': 'categorias.css',
      '/categorias/nova': 'novaCategoria.css',
      '/localizacoes': 'localizacoes.css',
      '/localizacoes/nova': 'novaLocalizacao.css',
      '/extintores': 'extintores.css',
      '/extintores/novo': 'novoExtintor.css',
      '/movimentacoes': 'movimentacoes.css',
      '/movimentacoes/nova': 'novaMovimentacao.css',
      '/movimentacoes/itens': 'movimentacoes.css',
      '/movimentacoes/itens/novo': 'novoExtintor.css'
    };
    const style = styles[path];
    if (!style) return;
    this.pageStyle = this.document.createElement('link');
    this.pageStyle.rel = 'stylesheet';
    this.pageStyle.href = `styles/${style}`;
    this.pageStyle.id = 'current-page-styles';
    this.document.head.appendChild(this.pageStyle);
  }
}
