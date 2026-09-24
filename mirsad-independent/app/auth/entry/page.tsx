import {redirect} from 'next/navigation';
import {getSignedInUser,safeReturnPath} from '@/app/auth';
export const dynamic='force-dynamic';
export default async function Entry({searchParams}:{searchParams:Promise<{return_to?:string}>}){
 const user=await getSignedInUser();const params=await searchParams;
 if(user)redirect(safeReturnPath(params.return_to||'/login'));
 return <main style={{maxWidth:560,margin:'80px auto',padding:24}}><h1>تعذر إكمال الدخول</h1><p>لم تصل جلسة دخول موثّقة. يرجى الرجوع إلى مسؤول المنصة للتحقق من إعداد خدمة الدخول.</p><a href="/login">العودة إلى تسجيل الدخول</a></main>
}
