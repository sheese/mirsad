# مرصاد — حزمة الاستضافة المستقلة

هذه نسخة مستقلة مهيّأة لـ Cloudflare Workers + D1 + R2 + Cloudflare Access. لم تُنشر بعد في حساب خارجي. الموقع الأصلي في ChatGPT لم يتغير.

## الذي تم تجهيزه
- الواجهة العربية وإدارة الموظفين والتحليلات والعقود وطلبات المراجعة والإدارة.
- التنقل عبر روابط صفحات فعلية، شاملًا إصلاح أزرار الدخول.
- دخول مستخدمين بواسطة Cloudflare Access (رمز بريد إلكتروني)، دون حساب ChatGPT.
- التحقق من توقيع JWT ومدة صلاحيته والجهة المصدرة والجمهور باستخدام jose؛ لا تُقبل رؤوس الهوية غير الموقّعة.
- تقييد الإدارة بالبريد الموثّق الموجود في ADMIN_EMAILS، ثم رمز الإدارة الإضافي.
- إعداد Workers مستقل وترحيلات قاعدة البيانات وسكربتات النشر واختبارات الدخول.

## المطلوب لتفعيل النسخة
حساب Cloudflare يملكه صاحب المشروع، تفعيل Workers وD1 وR2 وZero Trust، ومستودع GitHub إذا أردت النشر من المستودع. قد يطلب المزود وسيلة دفع أو قبول شروط لتفعيل بعض الخدمات؛ لا توجد خطة مدفوعة أو شراء مفعّل بواسطة هذه الحزمة.

## تجهيز حساب Cloudflare
1. أنشئ الحساب وأكمل التحقق من البريد وشروط المزود بنفسك.
2. فعّل Zero Trust واختر اسم الفريق، ثم فعّل One-time PIN كطريقة الدخول.
3. شغّل `pnpm install --frozen-lockfile` ثم `pnpm exec wrangler login` محليًا.
4. شغّل `pnpm setup` لإنشاء قاعدة D1 جديدة وكتابة معرّفها في wrangler.jsonc. إذا كانت قاعدة بهذا الاسم موجودة يتوقف السكربت حتى تراجعها؛ لا يحذف أو يستبدل قواعد موجودة.
5. أنشئ bucket خاصًا باسم `mirsad-documents` عبر R2 أو الأمر `pnpm exec wrangler r2 bucket create mirsad-documents`. لا تفعّل public access.
6. شغّل `pnpm deploy`. ينفّذ فحص الأنواع والبناء وتطبيق الترحيلات ثم النشر. النشر الأول يعرض الواجهة العامة فقط؛ عمليات البيانات تتطلب جلسة موثّقة.

## إعداد دخول المستخدمين قبل العرض
بعد معرفة رابط Worker:
1. في Zero Trust > Access > Applications أنشئ تطبيق Self-hosted يحمي المسار `HOSTNAME/auth/entry` على نفس مضيف Worker. إن أضفت دومينًا خاصًا أضف مسار الدخول لذلك الدومين أيضًا إلى التطبيق نفسه.
2. فعّل One-time PIN وضع Allow policy تتضمن بريد المالك والشركات المدعوة فقط. لا تستخدم Bypass أو Everyone.
3. اترك الصفحة الرئيسية و`/login` و`/register` عامة. يتحقق خادم التطبيق من الجلسة على جميع APIs والمستندات بنفسه؛ لا تحمِ `/api/*` بتحويل HTML إلى صفحة الدخول كي تظل أخطاء API بصيغة JSON.
4. انسخ Team Domain وApplication AUD من Access. في إعدادات Worker > Variables and Secrets أضف:
   - ACCESS_TEAM_DOMAIN: مثال `https://your-team.cloudflareaccess.com`.
   - ACCESS_AUD: معرّف الجمهور الصحيح لهذا التطبيق.
   - ADMIN_EMAILS: البريد الموثّق للمالك، أو قائمة مفصولة بفواصل للفريق القانوني.
   - ADMIN_ACCESS_CODE: رمز عشوائي طويل يُحفظ كـ Secret.
5. انشر الإعدادات، وافتح `/login` ثم «متابعة الدخول الآمن». بعد التحقق من البريد تعود إلى المنصة ويمكن اختيار الشركة التجريبية أو إنشاء شركة.
6. قبل دعوة الشركات، تحقّق على الرابط الحقيقي من الدخول والخروج ورفع مستند، ثم دخول الإدارة وتغيير حالة الطلب. اختبارات الحزمة لا تحل محل تحقق إعداد حسابك الفعلي.

لا يمكن تشغيل بريد التحقق قبل إعداد Access والسياسة والمتغيرات. لا توجد كلمات مرور إنتاج أو مفاتيح Cloudflare في المصدر.

## النشر عبر GitHub
ارفع محتويات هذا المجلد إلى المستودع مع الملفات المخفية والـ lockfile. حدّث معرّف D1 في wrangler.jsonc بعد إعداد حسابك؛ ليس سرًا. اربط المستودع بـ Workers Builds باسم Worker المطابق (`mirsad`).

- Build command: `pnpm run typecheck && pnpm run build`
- Deploy command: `pnpm run db:remote && pnpm exec wrangler deploy --config dist/server/wrangler.json`
- Install command عند توفره: `pnpm install --frozen-lockfile`

اضبط أسرار التشغيل في Cloudflare، وليس في GitHub أو الكود. تحتاج هوية النشر صلاحيات Worker وD1 وR2 الخاصة بمشروعك. لا تستخدم GitHub Pages لهذا التطبيق.

## تشغيل واختبار محلي
Node.js >=22.13 وpnpm بالإصدار المحدد في package.json.

```sh
pnpm install --frozen-lockfile
pnpm db:local
pnpm dev
pnpm typecheck
pnpm test:auth
pnpm build
node tests/integration.mjs
```

محليًا تُعرض الواجهة، لكن الدخول الحقيقي يحتاج تطبيق Access مهيّأ. الاختبارات تستخدم مفاتيح جلسات مؤقتة داخل بيئة الاختبار ولا تضيف باب دخول خلفيًا إلى المنتج.

## حدود النسخة
التحليلات نتائج تجريبية ثابتة كما في النموذج السابق. قاعدة الاستضافة الجديدة تبدأ فارغة؛ الحزمة لا تنقل بيانات العملاء أو الملفات من الموقع السابق. إدارة صلاحيات دعوة المستخدمين تتم عبر Access، ولكل مستخدم مساحة شركة واحدة في النموذج الحالي. أي حساب Cloudflare أو موارد خارجية لم يتم إنشاؤها حتى الآن.

## مراجع الإعداد
- https://developers.cloudflare.com/workers/configuration/cloudflare-access/
- https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- https://developers.cloudflare.com/workers/ci-cd/builds/
