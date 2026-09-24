import MirsadApp from '@/components/mirsad/client';
import {signInPath,signOutPath} from '../auth';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{path:string[]}>}){const {path}=await params;const back='/'+path.join('/');return <MirsadApp initialPath={back} signInUrl={signInPath(back)} signOutUrl={signOutPath()}/>}
