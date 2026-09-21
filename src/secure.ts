import type {AppData} from './types';
const META='flash.financas.v1.meta';
const VAULT='flash.financas.v1.vault';
const enc=new TextEncoder();const dec=new TextDecoder();
const to64=(a:Uint8Array)=>btoa(Array.from(a,b=>String.fromCharCode(b)).join(''));
const from64=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const random=(n:number)=>crypto.getRandomValues(new Uint8Array(n));
async function derive(password:string,salt:Uint8Array){const material=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:new Uint8Array(salt),iterations:250000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function seal(data:AppData,password:string,salt:Uint8Array){const iv=random(12);const key=await derive(password,salt);const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(data)));return JSON.stringify({v:1,salt:to64(salt),iv:to64(iv),cipher:to64(new Uint8Array(cipher))});}
async function unseal(raw:string,password:string):Promise<AppData>{const x=JSON.parse(raw);if(x.v!==1)throw Error('Versão do backup incompatível.');const key=await derive(password,from64(x.salt));const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:from64(x.iv)},key,from64(x.cipher));const d=JSON.parse(dec.decode(plain)) as AppData;if(d.version!==1||!Array.isArray(d.entries)||!Array.isArray(d.closedMonths))throw Error('Arquivo inválido.');return d;}
export const hasVault=()=>Boolean(localStorage.getItem(VAULT));
export const profileName=()=>localStorage.getItem(META)??'';
export async function createVault(email:string,password:string,data:AppData){if(hasVault())throw Error('Já existe um usuário cadastrado neste aparelho.');const raw=await seal(data,password,random(16));localStorage.setItem(VAULT,raw);localStorage.setItem(META,email.trim().toLowerCase());}
export async function unlock(email:string,password:string){if(email.trim().toLowerCase()!==profileName())throw Error('Usuário ou senha incorretos.');try{return await unseal(localStorage.getItem(VAULT)??'',password);}catch{throw Error('Usuário ou senha incorretos, ou dados corrompidos.');}}
export async function store(data:AppData,password:string){if(!hasVault())throw Error('Cofre não encontrado.');const old=JSON.parse(localStorage.getItem(VAULT)??'{}');const raw=await seal(data,password,from64(old.salt));localStorage.setItem(VAULT,raw);}
export const exportEncrypted=()=>localStorage.getItem(VAULT)??'';
export async function restoreEncrypted(raw:string,email:string,password:string){const data=await unseal(raw,password);localStorage.setItem(VAULT,raw);localStorage.setItem(META,email.trim().toLowerCase());return data;}
