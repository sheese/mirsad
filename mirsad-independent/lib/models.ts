export type Risk = 'high'|'review'|'unknown';
export type RequestStatus = 'new'|'reviewing'|'waiting'|'reviewed'|'closed';
export type AnalysisResult = {summary:string;risk:Risk;sections:{title:string;items:string[]}[];nextAction:string;source:string};
export type Company = {id:string;name:string;sector:string;contact_name:string;created_at:string;is_demo:number;employee_count?:number;request_count?:number};
export type Employee = {id:string;company_id:string;full_name:string;employee_number:string;job_title:string;department:string;email:string;start_date:string;contract_type:string;contract_end:string;status:string;notes:string;archived:number;created_at:string;updated_at:string};
export type DocumentRecord = {id:string;company_id:string;employee_id:string|null;name:string;mime:string;size:number;category:string;created_at:string;company_name?:string};
export type Analysis = {id:string;company_id:string;employee_id:string|null;kind:string;scenario:string;title:string;risk:Risk;inputs:Record<string,string>;result:AnalysisResult;created_at:string;document_ids:string[];company_name?:string};
export type LegalRequest = {seq:number;id:string;company_id:string;analysis_id:string|null;type:string;description:string;urgency:string;status:RequestStatus;resolution:string;version:number;created_at:string;updated_at:string;document_ids:string[];company_name?:string};
export type RequestEvent = {id:string;request_id:string;actor_name:string;from_status:string;to_status:string;message:string;created_at:string};
export type AppData = {company:Company|null;companies:Company[];employees:Employee[];documents:DocumentRecord[];analyses:Analysis[];requests:LegalRequest[]};
export type Me = {authenticated:boolean;displayName?:string;email?:string;company:Company|null;isAdmin:boolean};
export const statusLabels:Record<RequestStatus,string>={new:'جديد',reviewing:'قيد المراجعة',waiting:'بانتظار معلومات',reviewed:'تمت المراجعة',closed:'مغلق'};
export const riskLabels:Record<Risk,string>={high:'مخاطر مرتفعة',review:'تحتاج مراجعة',unknown:'غير محسوم'};
export const statusColors:Record<string,string>={new:'blue',reviewing:'teal',waiting:'amber',reviewed:'green',closed:'',active:'green',leave:'amber',ended:'',high:'red',review:'amber',unknown:''};
export const employeeStatuses:Record<string,string>={active:'على رأس العمل',leave:'في إجازة',ended:'منتهية خدماته'};
export function requestNumber(r:Pick<LegalRequest,'seq'|'created_at'>){return `LR-${r.created_at.slice(0,4)}-${String(r.seq).padStart(5,'0')}`}
export function serviceDuration(date:string){if(!date)return '';const start=new Date(date+'T00:00:00Z');const now=new Date();let m=(now.getUTCFullYear()-start.getUTCFullYear())*12+now.getUTCMonth()-start.getUTCMonth();if(now.getUTCDate()<start.getUTCDate())m--;m=Math.max(m,0);return `${Math.floor(m/12)} سنة و${m%12} أشهر`}
