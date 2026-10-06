import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { formatDate, statusLabel } from '../../shared/formatters';
import { Extintor } from '../../shared/models';

@Component({
  selector: 'app-extintor-list',
  templateUrl: './extintor-list.component.html'
})
export class ExtintorListComponent implements OnInit {
  extintores: Extintor[] = [];
  searchTerm = '';
  readonly formatDate = formatDate;
  readonly statusLabel = statusLabel;

  constructor(private readonly api: ApiService, private readonly router: Router) {}

  ngOnInit(): void {
    void this.load();
  }

  get visibleExtintores(): Extintor[] {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    return this.extintores.filter((extinguisher) =>
      `${extinguisher.numero} ${extinguisher.tipo?.descricao ?? ''} ${extinguisher.localizacao?.descricao ?? ''}`
        .toLocaleLowerCase()
        .includes(term)
    );
  }

  edit(numero: string): void {
    void this.router.navigate(['/extintores/novo'], { queryParams: { numero } });
  }

  async delete(numero: string): Promise<void> {
    if (!window.confirm(`Deseja realmente excluir o extintor ${numero}?`)) return;
    try {
      await this.api.delete('extintores', numero);
      await this.load();
    } catch (error: unknown) {
      console.error('[delete extintores]', error);
      window.alert('Não foi possível excluir este extintor: ele já está vinculado a uma ou mais movimentações. Remova os itens de movimentação relacionados antes de excluir.');
    }
  }

  private async load(): Promise<void> {
    try {
      this.extintores = await this.api.get<Extintor[]>('extintores');
    } catch (error: unknown) {
      console.error('[load extintores]', error);
      window.alert('Não foi possível carregar os extintores. Verifique se o back-end está rodando.');
    }
  }
}
