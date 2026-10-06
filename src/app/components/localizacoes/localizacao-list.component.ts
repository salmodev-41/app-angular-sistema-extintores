import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Localizacao } from '../../shared/models';

@Component({
  selector: 'app-localizacao-list',
  templateUrl: './localizacao-list.component.html'
})
export class LocalizacaoListComponent implements OnInit {
  localizacoes: Localizacao[] = [];
  searchTerm = '';

  constructor(private readonly api: ApiService, private readonly router: Router) {}

  ngOnInit(): void {
    void this.load();
  }

  get visibleLocalizacoes(): Localizacao[] {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    return this.localizacoes.filter((location) =>
      `${location.empresa?.descricao ?? ''} ${location.descricao} ${location.tipo} ${location.id}`
        .toLocaleLowerCase()
        .includes(term)
    );
  }

  edit(id: number): void {
    void this.router.navigate(['/localizacoes/nova'], { queryParams: { id } });
  }

  async delete(id: number): Promise<void> {
    if (!window.confirm(`Deseja realmente excluir a localização de id ${id}?`)) return;
    try {
      await this.api.delete('localizacoes', id);
      await this.load();
    } catch (error: unknown) {
      console.error('[delete localizacoes]', error);
      window.alert('Erro ao excluir a localização. Verifique se ela não está em uso por algum extintor.');
    }
  }

  private async load(): Promise<void> {
    try {
      this.localizacoes = await this.api.get<Localizacao[]>('localizacoes');
    } catch (error: unknown) {
      console.error('[load localizacoes]', error);
      window.alert('Não foi possível carregar as localizações. Verifique se o back-end está rodando.');
    }
  }
}
