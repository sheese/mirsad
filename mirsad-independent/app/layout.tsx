import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"مرصاد | قرارات أوضح ومخاطر أقل",description:"مساحة الشركات لتحليل القرارات والعقود، إدارة الموظفين وطلب المراجعة القانونية.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body>{children}</body></html>}
