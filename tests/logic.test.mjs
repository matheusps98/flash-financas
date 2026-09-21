import test from 'node:test';import assert from 'node:assert/strict';
import * as lib from '../.test-dist/logic.js';
const {monthShift,closed,installment,monthTotals,financed,bikeMonthly,filterEntries,dueBills}=lib;
test('meses cruzam dezembro sem trocar ano incorretamente',()=>assert.equal(monthShift('2026-12',1),'2027-01'));
test('passado congelado, mês atual aberto, fechamento manual definitivo',()=>{const d={closedMonths:['2026-10']};assert.equal(closed(d,'2026-08','2026-09'),true);assert.equal(closed(d,'2026-09','2026-09'),false);assert.equal(closed(d,'2026-10','2026-09'),true);});
test('pendências de entrada não contam como dinheiro recebido',()=>{const row=(kind,status,amount)=>({kind,status,amount});const v=monthTotals([row('income','paid',3100),row('income','pending',500),row('expense','paid',960),row('expense','pending',2140)]);assert.equal(v.netPaid,2140);assert.equal(v.committed,0);assert.equal(v.pendingIncome,500);});
test('financiamento sem juros e com juros; zero de saldo a financiar',()=>{assert.equal(installment(1200,0,12),100);assert.ok(installment(17000,2,48)>500);assert.equal(installment(0,2,48),0);});
test('moto considera parcela mais custos mensais',()=>{const g={price:33000,tradeIn:16000,extraDown:0,rate:0,months:10,fuelMonthly:200,otherMonthly:150};assert.equal(financed(g),17000);assert.equal(bikeMonthly(g),2050);});

test('busca ignora acentos e filtra categoria, tipo e situação',()=>{
  const entries=[{name:'Pós-graduação',category:'Estudos',note:'mensalidade',kind:'expense',status:'pending',amount:300},{name:'Salário',category:'Renda',note:'',kind:'income',status:'paid',amount:3000}];
  assert.equal(filterEntries(entries,'pos','expense','pending').length,1);
  assert.equal(filterEntries(entries,'Renda','income','paid')[0].name,'Salário');
  assert.equal(filterEntries(entries,'','all','paid').length,1);
  assert.equal(filterEntries(entries,'não existe').length,0);
});
test('avisos incluem apenas despesas pendentes vencidas ou nos próximos 7 dias',()=>{
  const row=(dueDate,status='pending',kind='expense',amount=10)=>({dueDate,status,kind,amount});
  const result=dueBills([row('2026-09-19'),row('2026-09-20'),row('2026-09-27'),row('2026-09-28'),row('2026-09-18','paid'),row('2026-09-18','pending','income')],'2026-09-20');
  assert.equal(result.overdue.length,1);
  assert.equal(result.upcoming.length,2);
  assert.equal(result.overdueAmount,10);
  assert.equal(result.upcomingAmount,20);
});
