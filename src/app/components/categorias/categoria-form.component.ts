import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Categoria } from '../../shared/models';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html'
})
export class CategoriaFormComponent implements OnInit {
  saving = false;
  editId = '';
  categoria = { descricao: '', unidade: '', periodoInspecao: '', periodoValidade: '' };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.editId = params.get('id') ?? '';
      if (this.editId) void this.load();
      else this.categoria = { descricao: '', unidade: '', periodoInspecao: '', periodoValidade: '' };
    });
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      const payload = {
        descricao: this.categoria.descricao.trim(),
        unidade: this.categoria.unidade.trim(),
        periodoInspecao: Number.parseInt(this.categoria.periodoInspecao, 10),
        periodoValidade: Number.parseInt(this.categoria.periodoValidade, 10)
      };
      if (this.editId) await this.api.put('categorias', this.editId, payload);
      else await this.api.post('categorias', payload);
      await this.router.navigate(['/categorias']);
    } catch (error: unknown) {
      console.error('[save categoria]', error);
      window.alert(`Erro ao ${this.editId ? 'salvar as alterações' : 'cadastrar'} categoria. Verifique os dados e tente novamente.`);
    } finally {
      this.saving = false;
    }
  }

  cancel(): void {
    void this.router.navigate(['/categorias']);
  }

  private async load(): Promise<void> {
    try {
      const category = await this.api.get<Categoria>(`categorias/${this.editId}`);
      this.categoria = {
        descricao: category.descricao,
        unidade: category.unidade,
        periodoInspecao: String(category.periodoInspecao),
        periodoValidade: String(category.periodoValidade)
      };
    } catch (error: unknown) {
      console.error('[load categoria]', error);
      window.alert('Não foi possível carregar os dados desta categoria.');
      void this.router.navigate(['/categorias']);
    }
  }
}
