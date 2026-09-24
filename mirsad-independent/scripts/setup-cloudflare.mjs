import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
const wrangler='node_modules/wrangler/bin/wrangler.js';
function run(args,capture=false){const r=spawnSync(process.execPath,[wrangler,...args],{stdio:capture?['inherit','pipe','inherit']:'inherit',encoding:'utf8'});if(r.error)throw r.error;if(r.status!==0)throw new Error('Cloudflare command failed; no deployment was made');return r.stdout||''}
const config=JSON.parse(readFileSync('wrangler.jsonc','utf8'));
run(['whoami']);
// Run only after the owner has enabled the necessary Cloudflare services.
const database=config.d1_databases[0];
if(database.database_id==='00000000-0000-4000-8000-000000000000'){
 const list=JSON.parse(run(['d1','list','--json'],true));
 const existing=list.find(d=>d.name===database.database_name);
 if(existing)throw new Error('A database with this name already exists. Review its ownership and put its UUID in wrangler.jsonc explicitly before continuing.');
 const output=run(['d1','create',database.database_name],true);
 const match=output.match(/"database_id"\s*:\s*"([a-f0-9-]+)"/i)||output.match(/database_id\s*=\s*"([a-f0-9-]+)"/i);
 if(!match)throw new Error('Database created, but its ID could not be read. Read it in Cloudflare and update wrangler.jsonc before retrying.');
 database.database_id=match[1];writeFileSync('wrangler.jsonc',JSON.stringify(config,null,2)+'\n');
}
console.log('Database configured. Create the private R2 bucket named '+config.r2_buckets[0].bucket_name+' if it does not already exist.');
console.log('Next: apply migrations with pnpm db:remote, configure Access and Worker secrets, then run pnpm deploy.');
