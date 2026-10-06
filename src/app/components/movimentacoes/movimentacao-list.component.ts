import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { formatDate } from '../../shared/formatters';
import { Movimentacao } from '../../shared/models';

@Component({
  selector: 'app-movimentacao-list',
  templateUrl: './movimentacao-list.component.html'
})
export class MovimentacaoListComponent implements OnInit {
  movimentacoes: Movimentacao[] = [];
  searchTerm = '';
  readonly formatDate = formatDate;

  constructor(private readonly api: ApiService, private readonly router: Router) {}

  ngOnInit(): void {
    void this.load();
  }

  get visibleMovimentacoes(): Movimentacao[] {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    return this.movimentacoes.filter((movement) =>
      `${movement.empresa?.descricao ?? ''} ${movement.empresaDestino?.descricao ?? ''} ${movement.tipo}`
        .toLocaleLowerCase()
        .includes(term)
    );
  }

  edit(id: number): void {
    void this.router.navigate(['/movimentacoes/nova'], { queryParams: { id } });
  }

  showItems(id: number): void {
    void this.router.navigate(['/movimentacoes/itens'], { queryParams: { movimentoId: id } });
  }

  async delete(id: number): Promise<void> {
    if (!window.confirm(`Deseja realmente excluir a movimentação de id ${id}? Isso também removerá os itens vinculados a ela.`)) return;
    try {
      await this.api.delete('movimentacoes', id);
      await this.load();
    } catch (error: unknown) {
      console.error('[delete movimentacoes]', error);
      window.alert('Erro ao excluir a movimentação.');
    }
  }

  private async load(): Promise<void> {
    try {
      this.movimentacoes = await this.api.get<Movimentacao[]>('movimentacoes');
    } catch (error: unknown) {
      console.error('[load movimentacoes]', error);
      window.alert('Não foi possível carregar as movimentações. Verifique se o back-end está rodando.');
    }
  }
}
