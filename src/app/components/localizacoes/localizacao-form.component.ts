import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Localizacao } from '../../shared/models';

@Component({
  selector: 'app-localizacao-form',
  templateUrl: './localizacao-form.component.html'
})
export class LocalizacaoFormComponent implements OnInit {
  saving = false;
  editId = '';
  localizacao = { empresaCodigo: '', descricao: '', centroCusto: '', tipo: '' };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.editId = params.get('id') ?? '';
      if (this.editId) void this.load();
      else this.localizacao = { empresaCodigo: '', descricao: '', centroCusto: '', tipo: '' };
    });
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      const payload = {
        empresaCodigo: this.localizacao.empresaCodigo.trim(),
        descricao: this.localizacao.descricao.trim(),
        centroCusto: this.localizacao.centroCusto.trim(),
        tipo: this.localizacao.tipo
      };
      if (this.editId) await this.api.put('localizacoes', this.editId, payload);
      else await this.api.post('localizacoes', payload);
      await this.router.navigate(['/localizacoes']);
    } catch (error: unknown) {
      console.error('[save localizacao]', error);
      window.alert(`Erro ao ${this.editId ? 'salvar as alterações' : 'cadastrar'} localização. Verifique os dados e tente novamente.`);
    } finally {
      this.saving = false;
    }
  }

  cancel(): void {
    void this.router.navigate(['/localizacoes']);
  }

  private async load(): Promise<void> {
    try {
      const location = await this.api.get<Localizacao>(`localizacoes/${this.editId}`);
      this.localizacao = {
        empresaCodigo: location.empresa?.codigo ?? '',
        descricao: location.descricao,
        centroCusto: location.centroCusto,
        tipo: location.tipo
      };
    } catch (error: unknown) {
      console.error('[load localizacao]', error);
      window.alert('Não foi possível carregar os dados desta localização.');
      void this.router.navigate(['/localizacoes']);
    }
  }
}
