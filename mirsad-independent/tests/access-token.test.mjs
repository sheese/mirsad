import assert from 'node:assert/strict';
import {test} from 'node:test';
import {generateKeyPair,SignJWT} from 'jose';
import {accessConfig,verifyAccessToken} from '../lib/access-token.ts';
const config=accessConfig('https://mirsad-demo.cloudflareaccess.com','aud-demo');
const {privateKey,publicKey}=await generateKeyPair('RS256');
const resolver=async()=>publicKey;
async function token(overrides={},key=privateKey){return new SignJWT({email:'Owner@Example.test',sub:'test-user',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+3600,iss:config.issuer,aud:[config.audience],...overrides}).setProtectedHeader({alg:'RS256',kid:'test'}).sign(key)}
test('verified identity uses signed subject and normalized email',async()=>{const u=await verifyAccessToken(await token(),config,resolver);assert.equal(u.userId,'cf:test-user');assert.equal(u.email,'owner@example.test')});
test('rejects expired, wrong issuer, wrong audience and absent email',async()=>{for(const change of [{exp:1},{iss:'https://attacker.test'},{aud:['other-app']},{email:null},{sub:''},{iat:Math.floor(Date.now()/1000)+3600}])await assert.rejects(verifyAccessToken(await token(change),config,resolver))});
test('rejects forged signature and unsigned tokens',async()=>{const other=await generateKeyPair('RS256');await assert.rejects(verifyAccessToken(await token({},other.privateKey),config,resolver));await assert.rejects(verifyAccessToken('eyJhbGciOiJub25lIn0.e30.',config,resolver))});
test('rejects untrusted JWKS hosts',()=>{for(const host of ['http://team.cloudflareaccess.com','https://attacker.test','https://team.cloudflareaccess.com.attacker.test','https://team.cloudflareaccess.com/path'])assert.throws(()=>accessConfig(host,'aud'))});
