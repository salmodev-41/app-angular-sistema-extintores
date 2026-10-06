import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { formatDate } from '../../shared/formatters';
import { ItemMovimentacao } from '../../shared/models';

@Component({
  selector: 'app-movimentacao-itens-list',
  templateUrl: './movimentacao-itens-list.component.html'
})
export class MovimentacaoItensListComponent implements OnInit {
  itens: ItemMovimentacao[] = [];
  movimentoId = '';
  readonly formatDate = formatDate;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.movimentoId = params.get('movimentoId') ?? '';
      if (!this.movimentoId) {
        window.alert('Nenhuma movimentação selecionada.');
        void this.router.navigate(['/movimentacoes']);
        return;
      }
      void this.load();
    });
  }

  edit(id: number): void {
    void this.router.navigate(['/movimentacoes/itens/novo'], {
      queryParams: { movimentoId: this.movimentoId, itemId: id }
    });
  }

  async delete(id: number): Promise<void> {
    if (!window.confirm('Deseja realmente excluir este item da movimentação?')) return;
    try {
      await this.api.delete('movimento-itens', id);
      await this.load();
    } catch (error: unknown) {
      console.error('[delete item]', error);
      window.alert('Erro ao excluir o item.');
    }
  }

  private async load(): Promise<void> {
    try {
      const items = await this.api.get<ItemMovimentacao[]>('movimento-itens');
      this.itens = items.filter((item) => String(item.movimento?.id) === this.movimentoId);
    } catch (error: unknown) {
      console.error('[load movimento itens]', error);
      window.alert('Não foi possível carregar os itens desta movimentação.');
    }
  }
}
