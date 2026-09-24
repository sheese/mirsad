import MirsadApp from '@/components/mirsad/client';
import {signInPath,signOutPath} from './auth';
export const dynamic='force-dynamic';
export default function Home(){return <MirsadApp initialPath="/" signInUrl={signInPath('/login')} signOutUrl={signOutPath()}/>}
