import {env} from 'cloudflare:workers';
export function rawDb(){if(!env.DB)throw new Error('Database unavailable');return env.DB}
export function bucket(){if(!env.BUCKET)throw new Error('Document storage unavailable');return env.BUCKET}
export function stmt(sql:string,...args:any[]){return rawDb().prepare(sql).bind(...args)}
export async function rows<T=any>(sql:string,...args:any[]):Promise<T[]>{return (await stmt(sql,...args).all<T>()).results}
export async function first<T=any>(sql:string,...args:any[]):Promise<T|null>{return stmt(sql,...args).first<T>()}
export function timestamp(){return new Date().toISOString()}
export function newId(){return crypto.randomUUID()}
