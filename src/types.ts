export type Kind='income'|'expense';
export type Status='paid'|'pending';
export type Entry={id:string;month:string;name:string;amount:number;kind:Kind;status:Status;category:string;dueDate?:string;paidDate?:string;note?:string;group?:string;createdAt:string};
export type Goal={price:number;tradeIn:number;extraDown:number;rate:number;months:number;fuelMonthly:number;otherMonthly:number;reserve:number;name:string};
export type AppData={version:1;entries:Entry[];closedMonths:string[];openingBalances:Record<string,number>;goal:Goal;installedSample:boolean};
export const INITIAL_GOAL:Goal={name:'Minha próxima moto',price:33000,tradeIn:16000,extraDown:0,rate:2,months:48,fuelMonthly:220,otherMonthly:180,reserve:300};
export const emptyData=():AppData=>({version:1,entries:[],closedMonths:[],openingBalances:{},goal:{...INITIAL_GOAL},installedSample:false});
