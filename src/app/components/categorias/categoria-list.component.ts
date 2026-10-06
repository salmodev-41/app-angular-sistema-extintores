import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Categoria } from '../../shared/models';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html'
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  searchTerm = '';

  constructor(private readonly api: ApiService, private readonly router: Router) {}

  ngOnInit(): void {
    void this.load();
  }

  get visibleCategorias(): Categoria[] {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    return this.categorias.filter((category) =>
      `${category.descricao} ${category.unidade}`.toLocaleLowerCase().includes(term)
    );
  }

  edit(id: number): void {
    void this.router.navigate(['/categorias/nova'], { queryParams: { id } });
  }

  async delete(id: number): Promise<void> {
    if (!window.confirm(`Deseja realmente excluir a categoria de id ${id}?`)) return;
    try {
      await this.api.delete('categorias', id);
      await this.load();
    } catch (error: unknown) {
      console.error('[delete categorias]', error);
      window.alert('Erro ao excluir a categoria. Verifique se ela não está em uso por algum extintor.');
    }
  }

  private async load(): Promise<void> {
    try {
      this.categorias = await this.api.get<Categoria[]>('categorias');
    } catch (error: unknown) {
      console.error('[load categorias]', error);
      window.alert('Não foi possível carregar as categorias. Verifique se o back-end está rodando.');
    }
  }
}
