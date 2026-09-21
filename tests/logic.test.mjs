import test from 'node:test';import assert from 'node:assert/strict';
import * as lib from '../.test-dist/logic.js';
const {monthShift,closed,installment,monthTotals,financed,bikeMonthly}=lib;
test('meses cruzam dezembro sem trocar ano incorretamente',()=>assert.equal(monthShift('2026-12',1),'2027-01'));
test('passado congelado, mês atual aberto, fechamento manual definitivo',()=>{const d={closedMonths:['2026-10']};assert.equal(closed(d,'2026-08','2026-09'),true);assert.equal(closed(d,'2026-09','2026-09'),false);assert.equal(closed(d,'2026-10','2026-09'),true);});
test('pendências de entrada não contam como dinheiro recebido',()=>{const row=(kind,status,amount)=>({kind,status,amount});const v=monthTotals([row('income','paid',3100),row('income','pending',500),row('expense','paid',960),row('expense','pending',2140)]);assert.equal(v.netPaid,2140);assert.equal(v.committed,0);assert.equal(v.pendingIncome,500);});
test('financiamento sem juros e com juros; zero de saldo a financiar',()=>{assert.equal(installment(1200,0,12),100);assert.ok(installment(17000,2,48)>500);assert.equal(installment(0,2,48),0);});
test('moto considera parcela mais custos mensais',()=>{const g={price:33000,tradeIn:16000,extraDown:0,rate:0,months:10,fuelMonthly:200,otherMonthly:150};assert.equal(financed(g),17000);assert.equal(bikeMonthly(g),2050);});
