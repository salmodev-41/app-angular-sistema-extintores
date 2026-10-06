import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Movimentacao } from '../../shared/models';

@Component({
  selector: 'app-movimentacao-form',
  templateUrl: './movimentacao-form.component.html'
})
export class MovimentacaoFormComponent implements OnInit {
  saving = false;
  editId = '';
  movimentacao = { empresaCodigo: '', empresaDestinoCodigo: '', tipo: '', data: '' };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.editId = params.get('id') ?? '';
      if (this.editId) void this.load();
      else this.movimentacao = { empresaCodigo: '', empresaDestinoCodigo: '', tipo: '', data: '' };
    });
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      const payload = {
        empresaCodigo: this.movimentacao.empresaCodigo.trim(),
        empresaDestinoCodigo: this.movimentacao.empresaDestinoCodigo.trim(),
        tipo: this.movimentacao.tipo,
        data: this.movimentacao.data
      };
      if (this.editId) await this.api.put('movimentacoes', this.editId, payload);
      else await this.api.post('movimentacoes', payload);
      await this.router.navigate(['/movimentacoes']);
    } catch (error: unknown) {
      console.error('[save movimentacao]', error);
      window.alert(`Erro ao ${this.editId ? 'salvar as alterações' : 'cadastrar'} movimentação. Verifique os dados e tente novamente.`);
    } finally {
      this.saving = false;
    }
  }

  cancel(): void {
    void this.router.navigate(['/movimentacoes']);
  }

  private async load(): Promise<void> {
    try {
      const movement = await this.api.get<Movimentacao>(`movimentacoes/${this.editId}`);
      this.movimentacao = {
        empresaCodigo: movement.empresa?.codigo ?? '',
        empresaDestinoCodigo: movement.empresaDestino?.codigo ?? '',
        tipo: movement.tipo,
        data: movement.data
      };
    } catch (error: unknown) {
      console.error('[load movimentacao]', error);
      window.alert('Não foi possível carregar os dados desta movimentação.');
      void this.router.navigate(['/movimentacoes']);
    }
  }
}
