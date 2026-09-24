'use client';
import {createContext,useContext} from 'react';
import type {AppData,Me} from '@/lib/models';
export const MirsadContext=createContext<{data:AppData;me:Me;refresh:()=>Promise<void>;admin:boolean;prefix:string;signInUrl:string;signOutUrl:string}>(null!);
export const useMirsad=()=>useContext(MirsadContext);
