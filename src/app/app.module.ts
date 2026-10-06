import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CategoriaListComponent,
    CategoriaFormComponent,
    LocalizacaoListComponent,
    LocalizacaoFormComponent,
    ExtintorListComponent,
    ExtintorFormComponent,
    MovimentacaoListComponent,
    MovimentacaoFormComponent,
    MovimentacaoItensListComponent,
    MovimentacaoItemFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
