export interface Categoria {
  id: number;
  descricao: string;
  unidade: string;
  periodoInspecao: number;
  periodoValidade: number;
}

export interface Localizacao {
  id: number;
  empresa?: { codigo?: string; descricao?: string };
  descricao: string;
  centroCusto: string;
  tipo: string;
}

export interface Extintor {
  numero: string;
  cargaTotal: number;
  cargaVencimento: string;
  dataProxInspecao: string;
  centroCusto: string;
  situacao: string;
  tipo?: Categoria;
  localizacao?: Localizacao;
}

export interface Movimentacao {
  id: number;
  empresa?: { codigo?: string; descricao?: string };
  empresaDestino?: { codigo?: string; descricao?: string };
  data: string;
  tipo: string;
}

export interface ItemMovimentacao {
  id: number;
  movimento?: { id?: number };
  extintor?: { numero?: string };
  destino?: { id?: number; descricao?: string };
  tipoMovimentoItem?: string;
  conferido: boolean;
  tipoRetorno?: string;
  cargaVencimento?: string;
  dataProxInspecao?: string;
  numeroSubstituto?: string;
}
