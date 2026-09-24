import {createRemoteJWKSet,jwtVerify,type JWTVerifyGetKey} from 'jose';
export type AccessConfig={issuer:string;audience:string};
const verifiers=new Map<string,JWTVerifyGetKey>();
export function accessConfig(team:string,audience:string):AccessConfig{
 const issuer=team.replace(/\/$/,'');
 if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer)||!audience.trim())throw new Error('Cloudflare Access is not configured');
 return {issuer,audience:audience.trim()};
}
export async function verifyAccessToken(token:string,config:AccessConfig,key?:JWTVerifyGetKey){
 if(!token||token.length>16384)throw new Error('Invalid session');
 let resolver=key||verifiers.get(config.issuer);
 if(!resolver){resolver=createRemoteJWKSet(new URL(config.issuer+'/cdn-cgi/access/certs'),{timeoutDuration:5000,cooldownDuration:30000,cacheMaxAge:600000});verifiers.set(config.issuer,resolver)}
 const {payload}=await jwtVerify(token,resolver,{issuer:config.issuer,audience:config.audience,algorithms:['RS256'],requiredClaims:['sub','exp','iat','email']});
 if(typeof payload.sub!=='string'||!payload.sub||typeof payload.email!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))throw new Error('Invalid identity');
 if(typeof payload.iat!=='number'||payload.iat>Date.now()/1000+30)throw new Error('Invalid session time');
 const email=payload.email.trim().toLowerCase();
 return {userId:'cf:'+payload.sub,email,displayName:typeof payload.name==='string'?payload.name:email,fullName:typeof payload.name==='string'?payload.name:null};
}
