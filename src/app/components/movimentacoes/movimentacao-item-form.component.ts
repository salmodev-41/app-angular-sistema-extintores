import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Extintor, ItemMovimentacao, Localizacao } from '../../shared/models';

@Component({
  selector: 'app-movimentacao-item-form',
  templateUrl: './movimentacao-item-form.component.html'
})
export class MovimentacaoItemFormComponent implements OnInit {
  saving = false;
  movimentoId = '';
  itemId = '';
  extintores: Extintor[] = [];
  localizacoes: Localizacao[] = [];
  item = {
    extintorNumero: '',
    destinoId: '',
    tipoMovimentoItem: '',
    conferido: false,
    tipoRetorno: '',
    cargaVencimento: '',
    dataProxInspecao: '',
    numeroSubstituto: ''
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.movimentoId = params.get('movimentoId') ?? '';
      this.itemId = params.get('itemId') ?? '';
      if (!this.movimentoId) {
        window.alert('Nenhuma movimentação selecionada.');
        void this.router.navigate(['/movimentacoes']);
        return;
      }
      void this.load();
    });
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      const payload = {
        movimentoId: Number.parseInt(this.movimentoId, 10),
        extintorNumero: this.item.extintorNumero,
        destinoId: Number.parseInt(this.item.destinoId, 10),
        tipoMovimentoItem: this.item.tipoMovimentoItem.trim(),
        conferido: this.item.conferido,
        tipoRetorno: this.item.tipoRetorno || null,
        cargaVencimento: this.item.cargaVencimento,
        dataProxInspecao: this.item.dataProxInspecao,
        numeroSubstituto: this.item.numeroSubstituto.trim()
      };
      if (this.itemId) await this.api.put('movimento-itens', this.itemId, payload);
      else await this.api.post('movimento-itens', payload);
      await this.router.navigate(['/movimentacoes/itens'], {
        queryParams: { movimentoId: this.movimentoId }
      });
    } catch (error: unknown) {
      console.error('[save movimento item]', error);
      window.alert(`Erro ao ${this.itemId ? 'salvar as alterações' : 'cadastrar'} item. Verifique os dados e tente novamente.`);
    } finally {
      this.saving = false;
    }
  }

  cancel(): void {
    void this.router.navigate(['/movimentacoes/itens'], {
      queryParams: { movimentoId: this.movimentoId }
    });
  }

  private async load(): Promise<void> {
    this.item = {
      extintorNumero: '',
      destinoId: '',
      tipoMovimentoItem: '',
      conferido: false,
      tipoRetorno: '',
      cargaVencimento: '',
      dataProxInspecao: '',
      numeroSubstituto: ''
    };
    try {
      const [extinguishers, locations] = await Promise.all([
        this.api.get<Extintor[]>('extintores'),
        this.api.get<Localizacao[]>('localizacoes')
      ]);
      this.extintores = extinguishers;
      this.localizacoes = locations;
      if (this.itemId) {
        const item = await this.api.get<ItemMovimentacao>(`movimento-itens/${this.itemId}`);
        this.item = {
          extintorNumero: item.extintor?.numero ?? '',
          destinoId: String(item.destino?.id ?? ''),
          tipoMovimentoItem: item.tipoMovimentoItem ?? '',
          conferido: Boolean(item.conferido),
          tipoRetorno: item.tipoRetorno ?? '',
          cargaVencimento: item.cargaVencimento ?? '',
          dataProxInspecao: item.dataProxInspecao ?? '',
          numeroSubstituto: item.numeroSubstituto ?? ''
        };
      }
    } catch (error: unknown) {
      console.error('[load movimento item]', error);
      window.alert('Não foi possível carregar este item.');
      this.cancel();
    }
  }
}
