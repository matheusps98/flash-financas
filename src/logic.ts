import type { AppData,Entry,Goal } from './types';
export const monthOf=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
export const localDay=(d=new Date())=>`${monthOf(d)}-${String(d.getDate()).padStart(2,'0')}`;
export const monthShift=(m:string,n:number)=>{const [y,mo]=m.split('-').map(Number);const d=new Date(y,mo-1+n,1);return monthOf(d);};
export const monthLabel=(m:string)=>new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(new Date(`${m}-15T12:00:00`));
export const money=(v:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number.isFinite(v)?v:0);
export const parseMoney=(s:string)=>{const trimmed=s.trim().replace(/\s|R\$/g,'');const normalized=trimmed.includes(',')?trimmed.replace(/\./g,'').replace(',','.'):/^\d{1,3}(\.\d{3})+$/.test(trimmed)?trimmed.replace(/\./g,''):trimmed;const v=trimmed?Number(normalized):NaN;return Number.isFinite(v)?v:NaN;};
export const closed=(d:AppData,m:string,today=monthOf())=>m<today||d.closedMonths.includes(m);
export const entriesFor=(d:AppData,m:string)=>d.entries.filter(e=>e.month===m);
export function monthTotals(entries:Entry[]){const paidIncome=entries.filter(e=>e.kind==='income'&&e.status==='paid').reduce((n,e)=>n+e.amount,0);const paidExpense=entries.filter(e=>e.kind==='expense'&&e.status==='paid').reduce((n,e)=>n+e.amount,0);const pendingIncome=entries.filter(e=>e.kind==='income'&&e.status==='pending').reduce((n,e)=>n+e.amount,0);const pendingExpense=entries.filter(e=>e.kind==='expense'&&e.status==='pending').reduce((n,e)=>n+e.amount,0);return {paidIncome,paidExpense,pendingIncome,pendingExpense,netPaid:paidIncome-paidExpense,committed:paidIncome-paidExpense-pendingExpense,optimistic:paidIncome+pendingIncome-paidExpense-pendingExpense};}
export function installment(amount:number,ratePct:number,months:number){if(amount<=0)return 0;if(months<=0)return NaN;const r=ratePct/100;return r===0?amount/months:amount*r/(1-Math.pow(1+r,-months));}
export const financed=(g:Goal)=>Math.max(0,g.price-g.tradeIn-g.extraDown);
export const bikeMonthly=(g:Goal)=>installment(financed(g),g.rate,g.months)+g.fuelMonthly+g.otherMonthly;
export const safeId=()=>globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function futureProjection(d:AppData,start:string,months=12){let cash=d.openingBalances[start]??0;const out:{month:string;opening:number;received:number;toPay:number;expected:number;withBike:number}[]=[];for(let i=0;i<months;i++){const month=monthShift(start,i);const e=entriesFor(d,month);const x=monthTotals(e);const opening=cash;cash+=x.paidIncome-x.paidExpense-x.pendingExpense;out.push({month,opening,received:x.paidIncome,toPay:x.paidExpense+x.pendingExpense,expected:cash,withBike:cash-bikeMonthly(d.goal)-d.goal.reserve});}return out;}

export type EntryKindFilter='all'|'income'|'expense';
export type EntryStatusFilter='all'|'paid'|'pending';
const searchKey=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
export function filterEntries(entries:Entry[],query:string,kind:EntryKindFilter='all',status:EntryStatusFilter='all'){
  const needle=searchKey(query.trim());
  return entries.filter(e=>(kind==='all'||e.kind===kind)&&(status==='all'||e.status===status)&&(!needle||searchKey([e.name,e.category,e.note??''].join(' ')).includes(needle)));
}
export function dueBills(entries:Entry[],today=localDay(),windowDays=7){
  const cutoff=new Date(`${today}T12:00:00`);
  cutoff.setDate(cutoff.getDate()+windowDays);
  const until=localDay(cutoff);
  const bills=entries.filter(e=>e.kind==='expense'&&e.status==='pending'&&e.dueDate&&e.dueDate<=until).sort((a,b)=>(a.dueDate??'').localeCompare(b.dueDate??''));
  const overdue=bills.filter(e=>(e.dueDate??'')<today);
  const upcoming=bills.filter(e=>(e.dueDate??'')>=today);
  return {overdue,upcoming,overdueAmount:overdue.reduce((n,e)=>n+e.amount,0),upcomingAmount:upcoming.reduce((n,e)=>n+e.amount,0)};
}
