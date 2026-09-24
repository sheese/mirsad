import {headers} from 'next/headers';
import {env} from 'cloudflare:workers';
import {accessConfig,verifyAccessToken} from '@/lib/access-token';
export async function getSignedInUser(){
 const h=await headers();
 const cookie=h.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith('CF_Authorization='))?.slice('CF_Authorization='.length);
 const token=h.get('Cf-Access-Jwt-Assertion')||cookie;
 if(!token)return null;
 try{return await verifyAccessToken(token,accessConfig((env as any).ACCESS_TEAM_DOMAIN||'',(env as any).ACCESS_AUD||''))}catch{return null}
}
export function signInPath(returnTo='/login'){return '/auth/entry?return_to='+encodeURIComponent(safeReturnPath(returnTo))}
export function signOutPath(){return '/cdn-cgi/access/logout'}
export function safeReturnPath(value:string){
 try{const u=new URL(value,'https://mirsad.local');if(u.origin!=='https://mirsad.local'||!value.startsWith('/')||value.startsWith('//')||u.pathname.startsWith('/auth/')||u.pathname.startsWith('/api/')||u.pathname.startsWith('/cdn-cgi/'))return '/login';return u.pathname+u.search}catch{return '/login'}
}
