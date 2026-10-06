import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CategoriaListComponent } from './components/categorias/categoria-list.component';
import { CategoriaFormComponent } from './components/categorias/categoria-form.component';
import { LocalizacaoListComponent } from './components/localizacoes/localizacao-list.component';
import { LocalizacaoFormComponent } from './components/localizacoes/localizacao-form.component';
import { ExtintorListComponent } from './components/extintores/extintor-list.component';
import { ExtintorFormComponent } from './components/extintores/extintor-form.component';
import { MovimentacaoListComponent } from './components/movimentacoes/movimentacao-list.component';
import { MovimentacaoFormComponent } from './components/movimentacoes/movimentacao-form.component';
import { MovimentacaoItensListComponent } from './components/movimentacoes/movimentacao-itens-list.component';
import { MovimentacaoItemFormComponent } from './components/movimentacoes/movimentacao-item-form.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login.html', redirectTo: 'login', pathMatch: 'full' },
  { path: 'categorias', component: CategoriaListComponent },
  { path: 'categorias/nova', component: CategoriaFormComponent },
  { path: 'localizacoes', component: LocalizacaoListComponent },
  { path: 'localizacoes/nova', component: LocalizacaoFormComponent },
  { path: 'extintores', component: ExtintorListComponent },
  { path: 'extintores/novo', component: ExtintorFormComponent },
  { path: 'movimentacoes', component: MovimentacaoListComponent },
  { path: 'movimentacoes/nova', component: MovimentacaoFormComponent },
  { path: 'movimentacoes/itens', component: MovimentacaoItensListComponent },
  { path: 'movimentacoes/itens/novo', component: MovimentacaoItemFormComponent },
  { path: 'index.html', redirectTo: 'home', pathMatch: 'full' },
  { path: 'categorias.html', redirectTo: 'categorias', pathMatch: 'full' },
  { path: 'novaCategoria.html', redirectTo: 'categorias/nova', pathMatch: 'full' },
  { path: 'localizacoes.html', redirectTo: 'localizacoes', pathMatch: 'full' },
  { path: 'novaLocalizacao.html', redirectTo: 'localizacoes/nova', pathMatch: 'full' },
  { path: 'extintores.html', redirectTo: 'extintores', pathMatch: 'full' },
  { path: 'novoExtintor.html', redirectTo: 'extintores/novo', pathMatch: 'full' },
  { path: 'movimentacoes.html', redirectTo: 'movimentacoes', pathMatch: 'full' },
  { path: 'novaMovimentacao.html', redirectTo: 'movimentacoes/nova', pathMatch: 'full' },
  { path: 'movimentacaoItens.html', redirectTo: 'movimentacoes/itens', pathMatch: 'full' },
  { path: 'novoItemMovimentacao.html', redirectTo: 'movimentacoes/itens/novo', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
