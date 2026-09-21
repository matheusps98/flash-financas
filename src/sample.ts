import type { Entry } from './types';
import {safeId} from './logic';
// Rascunho derivado da aba SETEMBRO 2026, complementado apenas pelo que o usuário confirmou em conversa.
// Gastos do Excel NÃO são marcados como pagos: confirmar cada um evita saldo fictício.
export function septemberDraft():Entry[]{const month='2026-09';const now=new Date().toISOString();const add=(name:string,amount:number,kind:Entry['kind'],status:Entry['status'],category:string,note=''):Entry=>({id:safeId(),month,name,amount,kind,status,category,note,createdAt:now});return [
 add('Salário',3100,'income','paid','Salário','Única entrada confirmada em setembro.'),
 add('Internet móvel',58,'expense','pending','Contas','Conferir se já foi paga.'),
 add('Internet fixa',100,'expense','pending','Contas','Conferir se já foi paga.'),
 add('Rastreador da moto',70,'expense','pending','Moto','Conferir se já foi pago.'),
 add('Cartão de crédito',1133,'expense','pending','Cartão','Fatura referente a setembro, com pagamento em outubro: confirme o mês da SAÍDA real. Não lance cada compra novamente como despesa de caixa.'),
 add('Z Flip 6 (cartão da sogra)',284,'expense','pending','Parcelamentos','Pagamento separado da fatura principal.'),
 add('Pós-graduação',300,'expense','pending','Estudos','Conferir pagamento.'),
 add('Gasolina da Crosser (estimativa)',195,'expense','pending','Moto','Estimativa, substituir pelo valor real.'),
 add('Repasse à esposa',710,'expense','paid','Família','Informado como já pago; verifique se não faz parte da fatura do cartão.'),
 add('Adiantamento à esposa (outubro)',250,'expense','paid','Família','Pago antecipadamente em setembro; não somar novamente em outubro.'),
 add('Venda de celular (tio)',150,'income','pending','Vendas','Não recebido: não entra no saldo real.'),
 add('Venda de celular (Natanael)',500,'income','pending','Vendas','Recebimento NÃO confirmado; verifique antes de marcar como recebido.')
 ];}
