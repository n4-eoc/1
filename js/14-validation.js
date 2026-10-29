/* ===== التحقق من المدخلات قبل الطباعة والحفظ =====
   - الحقول الأساسية: الجهة والتاريخ
   - تسلسل الأوقات: البداية ← الإبلاغ لصحة 8 ← الانتهاء
   التحقق تنبيهي: يوضح النقص ويترك للمستخدم قرار المتابعة */

var HH_VALIDATION_PREFIX = {
  'readiness':'rd','electricity':'el','oxygen':'ox','fire':'fi','injuries':'inj',
  'hazard-human':'hh','hazard-tech':'ht','hazard-nature':'hn','hazard-hazmat':'hz',
  'hypothesis':'hyp','hypothesis-sudden':'hyps'
};

function hhValidateActive(){
  var active = document.querySelector('.card-panel.active');
  if(!active) return [];
  var p = HH_VALIDATION_PREFIX[active.id.replace('panel-','')];
  if(!p) return [];
  var problems = [];
  var el = function(f){ return document.getElementById(p+'-f-'+f); };
  var mark = function(node){ if(node){ node.classList.add('hh-invalid'); node.setAttribute('aria-invalid','true'); } };

  [['hosp','جهة الحدث / المستشفى'],['date','التاريخ']].forEach(function(r){
    var node = el(r[0]);
    if(node && !node.value.trim()){ problems.push('لم يُحدد: ' + r[1]); mark(node); }
  });

  /* تسلسل الأوقات — يُتجاهل أي حقل فارغ */
  var start = el('start') || el('time'), notify = el('notify8'), end = el('end') || el('restore');
  var mins = function(node){ return node && node.value ? hhMinutes(node.value) : null; };
  var s = mins(start), n = mins(notify), e = mins(end);
  if(s!==null && n!==null && n < s){ problems.push('وقت الإبلاغ لصحة 8 قبل وقت بداية الحدث'); mark(notify); }
  if(s!==null && e!==null && e < s){ problems.push('وقت الانتهاء قبل وقت بداية الحدث (إن امتد الحدث لليوم التالي فتجاهل هذا التنبيه)'); mark(end); }
  return problems;
}

/* إزالة التمييز الأحمر عند تعديل الحقل */
function hhClearInvalid(e){ if(e.target.classList){ e.target.classList.remove('hh-invalid'); e.target.removeAttribute('aria-invalid'); } }
document.addEventListener('input', hhClearInvalid, true);
document.addEventListener('change', hhClearInvalid, true);

function hhConfirmProblems(problems, action){
  if(!problems.length) return true;
  var go = confirm('تنبيه — البطاقة غير مكتملة:\n\n• ' + problems.join('\n• ') + '\n\nهل تريد ' + action + ' رغم ذلك؟');
  /* عند التراجع: المؤشر ينتقل لأول حقل يحتاج تصحيحاً */
  if(!go){
    var first = document.querySelector('.card-panel.active .hh-invalid');
    if(first){ first.scrollIntoView({block:'center'}); first.focus({preventScroll:true}); }
  }
  return go;
}

/* الطباعة: كل أزرار الطباعة تستدعي window.print */
(function(){
  var origPrint = window.print.bind(window);
  window.print = function(){
    if(!hhConfirmProblems(hhValidateActive(), 'الطباعة')) return;
    origPrint();
  };
  /* Ctrl+P لا يمر عبر window.print — نعترضه ونمرره عبر التحقق */
  document.addEventListener('keydown', function(e){
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='p'){ e.preventDefault(); window.print(); }
  });
})();

/* الحفظ في السجل */
(function(){
  var origSave = window.hhGlobalSave;
  if(typeof origSave !== 'function') return;
  window.hhGlobalSave = function(){
    if(!hhConfirmProblems(hhValidateActive(), 'الحفظ')) return;
    origSave.apply(this, arguments);
  };
})();
