"use client";
import {forwardRef,type AnchorHTMLAttributes} from 'react';

// Real document navigation remains usable when the framework's client router
// cannot complete a transition. All destinations are existing server routes.
const DocumentLink=forwardRef<HTMLAnchorElement,AnchorHTMLAttributes<HTMLAnchorElement>>(
 function DocumentLink(props,ref){return <a {...props} ref={ref}/>}
);
export default DocumentLink;
function push(href:string){
 const target=new URL(href,window.location.origin);
 if(target.origin!==window.location.origin||!href.startsWith('/')||href.startsWith('//'))throw new Error('Invalid navigation target');
 window.location.assign(target.href);
}
const router={push};
export function useDocumentRouter(){return router}
