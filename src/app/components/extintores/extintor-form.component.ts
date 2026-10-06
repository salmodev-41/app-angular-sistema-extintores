import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Categoria, Extintor, Localizacao } from '../../shared/models';

@Component({
  selector: 'app-extintor-form',
  templateUrl: './extintor-form.component.html'
})
export class ExtintorFormComponent implements OnInit {
  saving = false;
  editNumero = '';
  categorias: Categoria[] = [];
  localizacoes: Localizacao[] = [];
  extintor = {
    numero: '',
    tipoId: '',
    cargaTotal: '',
    localizacaoId: '',
    cargaVencimento: '',
    dataProxInspecao: '',
    situacao: 'A',
    centroCusto: ''
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.editNumero = params.get('numero') ?? '';
      void this.load();
    });
  }

  async save(): Promise<void> {
    if (!this.extintor.tipoId || !this.extintor.localizacaoId) {
      window.alert('Por favor, selecione um Tipo e uma Localização válidos.');
      return;
    }
    this.saving = true;
    try {
      const cargaTotal = Number.parseFloat(this.extintor.cargaTotal.replace(',', '.').replace(/[^0-9.]/g, ''));
      const payload = {
        numero: this.extintor.numero.trim(),
        tipoId: Number.parseInt(this.extintor.tipoId, 10),
        cargaTotal: Number.isNaN(cargaTotal) ? 0 : cargaTotal,
        localizacaoId: Number.parseInt(this.extintor.localizacaoId, 10),
        cargaVencimento: this.extintor.cargaVencimento,
        dataProxInspecao: this.extintor.dataProxInspecao,
        situacao: this.extintor.situacao,
        centroCusto: this.extintor.centroCusto.trim()
      };
      if (this.editNumero) await this.api.put('extintores', this.editNumero, payload);
      else await this.api.post('extintores', payload);
      await this.router.navigate(['/extintores']);
    } catch (error: unknown) {
      console.error('[save extintor]', error);
      window.alert(`Erro ao ${this.editNumero ? 'salvar as alterações' : 'cadastrar'} extintor. Verifique os dados e tente novamente.`);
    } finally {
      this.saving = false;
    }
  }

  cancel(): void {
    void this.router.navigate(['/extintores']);
  }

  private async load(): Promise<void> {
    this.extintor = {
      numero: '',
      tipoId: '',
      cargaTotal: '',
      localizacaoId: '',
      cargaVencimento: '',
      dataProxInspecao: '',
      situacao: 'A',
      centroCusto: ''
    };
    try {
      const [categories, locations] = await Promise.all([
        this.api.get<Categoria[]>('categorias'),
        this.api.get<Localizacao[]>('localizacoes')
      ]);
      this.categorias = categories;
      this.localizacoes = locations;
      if (this.editNumero) {
        const extinguisher = await this.api.get<Extintor>(`extintores/${this.editNumero}`);
        this.extintor = {
          numero: extinguisher.numero,
          tipoId: String(extinguisher.tipo?.id ?? ''),
          cargaTotal: String(extinguisher.cargaTotal),
          localizacaoId: String(extinguisher.localizacao?.id ?? ''),
          cargaVencimento: extinguisher.cargaVencimento,
          dataProxInspecao: extinguisher.dataProxInspecao,
          situacao: extinguisher.situacao,
          centroCusto: extinguisher.centroCusto
        };
      }
    } catch (error: unknown) {
      console.error('[load extintor]', error);
      window.alert('Não foi possível carregar os dados deste extintor.');
      void this.router.navigate(['/extintores']);
    }
  }
}
