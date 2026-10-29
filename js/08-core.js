const HOSPITALS = [
  "مستشفى الملك سلمان التخصصي","مستشفى الملك خالد","مستشفى حائل العام",
  "مستشفى الولادة والأطفال","مجمع إرادة والصحة النفسية","مستشفى بقعاء العام",
  "مستشفى موقق العام","مستشفى السليمي العام","مستشفى سميراء العام",
  "مستشفى الشملي العام","مستشفى الشنان العام","مستشفى الغزالة العام",
  "مستشفى الحائط العام","مستشفى اجاء للرعاية المديدة","مستشفى شراف"
];

// ===== DYNAMIC DATA MANAGEMENT =====
const DEFAULT_OFFICERS=[
  'بندر مصلح الرشيدي','وليد حبيب الشمري','سلطان سليمان الشمري',
  'عبدالله محمد الخلف','سعود سعد الشمري','احمد خلف الزبني',
  'ممدوح محمد الرشيدي','معاذ حبيب الشمري','نادر خلف العنزي',
  'محمد نايف الشمري','خلف محمد الشمري'
];

// ===== القوائم القابلة للتخصيص — قراءة وحفظ موحّدان =====
const DEFAULT_REPORTERS=['وحدة التخطيط والاستعداد','مدير المستشفى','نائب مدير المستشفى','الهلال الأحمر','عمليات صحة 8','عمليات النقل الطبي','الدفاع المدني','مواطن'];
const DEFAULT_EXECS=['م. حاتم بن محمد الرشدان (غيث 1)','د. سلطان بن نعيس الشمري (غيث 1)','د. سالم بن فهد الرديعان (غيث 1)','أ. فهد بن حمدان الهربيد (غيث 1)'];
const DEFAULT_TRANSPORTS=['إسعاف المستشفى','إسعاف المستشفى - الهلال الأحمر','إسعاف المستشفى - مركز النقل الطبي بحائل - الهلال الأحمر','إسعاف المستشفى - مركز النقل الطبي بحائل','مركز النقل الطبي بحائل','مركز النقل الطبي بالشنان','مركز النقل الطبي بموقق','مركز النقل الطبي بالشملي','مركز النقل الطبي بالحائط','مركز النقل الطبي بالغزالة','مركز النقل الطبي ببقعاء'];
const DEFAULT_PARTICIPANTS=['مراكز إدارة الأزمات والكوارث الصحية بفرع الوزارة','الدفاع المدني','الدفاع المدني - الهلال الأحمر','الهلال الأحمر','الدفاع المدني - الهلال الأحمر - المرور','الدفاع المدني - الهلال الأحمر - المرور - شركة الكهرباء','شركة الكهرباء'];
const DEFAULT_OUTAGE_TYPES=['انقطاع كهرباء كامل','انقطاع كهرباء جزئي','انقطاع كهرباء لحظي','انقطاع أكسجين كامل','انقطاع أكسجين جزئي'];
const DEFAULT_DEPARTMENTS=['كامل المستشفى','الطوارئ','العناية المركزة للبالغين','العناية المركزة للأطفال','عناية المواليد','غرف العمليات','قسم الولادة','وحدة الغسيل الكلوي','تنويم الرجال','تنويم النساء','تنويم الأطفال','المختبر','الأشعة','الصيدلية','العيادات الخارجية','القسطرة القلبية','وحدة الإنعاش','خدمات الدعم'];
const DEFAULT_ACTIONS=['تفعيل خطة الطوارئ','إخلاء جزئي','إخلاء كلي','الاستعانة بمولدات احتياطية','إبلاغ الجهات المعنية','تحويل المرضى'];
const DEFAULT_FIRE_TYPES=['حريق منزل مواطن','حريق سيارة','حريق مصنع','حريق مبنى سكني','حريق مبنى حكومي','حريق مزرعة'];
const DEFAULT_INJ_TYPES=['حادث مروري','حادث تصادم','حادث انقلاب','انهيار مبنى سكني','انهيار مبنى تحت الانشاء'];
const DEFAULT_CITIES=['حائل','بقعاء','الشنان','الغزالة','الشملي','موقق','سميراء','السليمي','الحائط'];
const DEFAULT_CODES=['30+ بشري 1','30+ تقني 1','30+ تقني 4','30+ بشري 5','30+ تقني 6'];
const DEFAULT_RD_EV_TYPES=['إصابات متعددة','حريق','اختطاف طفل','انقطاع كهرباء','انقطاع الغازات الطبية'];

/* قراءة قائمة من التخزين، وإن لم توجد أو تلفت تُعاد القيم الافتراضية */
function loadList(key,defaults){
  try{const s=localStorage.getItem(key);const v=s?JSON.parse(s):null;return Array.isArray(v)?v:[...defaults];}
  catch(e){return[...defaults];}
}
function saveList(key,list){
  try{localStorage.setItem(key,JSON.stringify(list));}
  catch(e){alert("تعذر حفظ القائمة — قد تكون مساحة التخزين ممتلئة.");}
}

/* اسم كل قائمة ← مفتاح التخزين + القيم الافتراضية؛ تولّد منها دوال getX/saveX المستخدمة في بقية الملفات */
const CONFIG_LISTS={
  Hospitals:['custom_hospitals',HOSPITALS],
  Officers:['custom_officers',DEFAULT_OFFICERS],
  Reporters:['custom_reporters',DEFAULT_REPORTERS],
  Execs:['custom_execs',DEFAULT_EXECS],
  Transports:['custom_transports',DEFAULT_TRANSPORTS],
  Participants:['custom_participants',DEFAULT_PARTICIPANTS],
  OutageTypes:['custom_outage_types',DEFAULT_OUTAGE_TYPES],
  Departments:['custom_departments',DEFAULT_DEPARTMENTS],
  Actions:['custom_actions',DEFAULT_ACTIONS],
  FireTypes:['custom_fire_types',DEFAULT_FIRE_TYPES],
  InjTypes:['custom_inj_types',DEFAULT_INJ_TYPES],
  Cities:['custom_cities',DEFAULT_CITIES],
  Codes:['custom_codes',DEFAULT_CODES],
  RdEvTypes:['custom_rd_ev_types',DEFAULT_RD_EV_TYPES]
};
Object.keys(CONFIG_LISTS).forEach(function(name){
  const key=CONFIG_LISTS[name][0],defaults=CONFIG_LISTS[name][1];
  window['get'+name]=function(){return loadList(key,defaults);};
  window['save'+name]=function(l){saveList(key,l);};
});

function populateReporterSelects(){
  const list=getReporters();
  ['el-f-reporter-org','ox-f-reporter-org','fi-f-reporter-org','inj-f-reporter-org','hh-f-reporter','ht-f-reporter','hn-f-reporter','hz-f-reporter'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
    list.forEach(r=>{const o=document.createElement('option');o.value=r;o.textContent=r;sel.appendChild(o);});
    if(cur)sel.value=cur;
  });
}
function populateExecSelects(){
  const list=getExecs();
  ['rd-f-exec'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
    list.forEach(e=>{const o=document.createElement('option');o.value=e;o.textContent=e;sel.appendChild(o);});
    if(cur)sel.value=cur;
  });
}
function populateTransportSelects(){
  const list=getTransports();
  ['rd-f-transport'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
    list.forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;sel.appendChild(o);});
    if(cur)sel.value=cur;
  });
}
function populateParticipantSelects(){
  const list=getParticipants();
  ['rd-f-participants','rd-f-participants2'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
    list.forEach(p=>{const o=document.createElement('option');o.value=p;o.textContent=p;sel.appendChild(o);});
    const oo=document.createElement('option');oo.value='__other__';oo.textContent='أخرى...';sel.appendChild(oo);
    if(cur)sel.value=cur;
  });
}
function populateOutageTypeSelects(){
  const list=getOutageTypes();
  ['el-f-outage-type','ox-f-outage-type'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
    list.forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;sel.appendChild(o);});
    if(cur)sel.value=cur;
  });
}
function populateActionSelects(){
  const list=getActions();
  ['el-f-action','ox-f-action','fi-f-action','inj-f-action','hh-f-action','ht-f-action','hn-f-action','hz-f-action'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
    list.forEach(a=>{const o=document.createElement('option');o.value=a;o.textContent=a;sel.appendChild(o);});
    const oo=document.createElement('option');oo.value='__other__';oo.textContent='أخرى';sel.appendChild(oo);
    if(cur)sel.value=cur;
  });
}
function populateFireTypeSelects(){
  const list=getFireTypes();
  const sel=document.getElementById('fi-f-event-type');if(!sel)return;
  const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
  list.forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;sel.appendChild(o);});
  if(cur)sel.value=cur;
}
function populateInjTypeSelects(){
  const list=getInjTypes();
  const sel=document.getElementById('inj-f-type');if(!sel)return;
  const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
  list.forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;sel.appendChild(o);});
  if(cur)sel.value=cur;
}
function populateCitySelects(){
  const list=getCities();
  ['fi-f-city','inj-f-city'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
    list.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;sel.appendChild(o);});
    if(cur)sel.value=cur;
  });
}
function populateCodeSelects(){
  const list=getCodes();
  const sel=document.getElementById('rd-f-code');if(!sel)return;
  const cur=sel.value;sel.innerHTML='<option value="">— اختر —</option>';
  list.forEach(cd=>{const o=document.createElement('option');o.value=cd;o.textContent=cd;sel.appendChild(o);});
  const oo=document.createElement('option');oo.value='__manual__';oo.textContent='أدخل يدوي...';sel.appendChild(oo);
  if(cur)sel.value=cur;
}
function populateRdEvTypeSelects(){
  const list=getRdEvTypes();
  const sel=document.getElementById('rd-f-ev');if(!sel)return;
  const cur=sel.value;
  sel.innerHTML='<option value="">— اختر —</option>';
  list.forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;sel.appendChild(o);});
  if(cur)sel.value=cur;
}
function buildAreaChecks(prefix,updateFn){
  const depts=getDepartments();
  const container=document.getElementById(prefix+'-area-container');
  if(!container)return;
  const otherFn=prefix==='el'?'elAreaOtherToggle()':'oxAreaOtherToggle()';
  /* معرّف لكل خانة حتى يعمل النقر على اسم القسم نفسه */
  container.innerHTML=depts.map((d,i)=>
    `<div class="check-item"><input type="checkbox" id="${prefix}-area-${i}" data-aname="${d}" onchange="${updateFn}"><label for="${prefix}-area-${i}">${d}</label></div>`
  ).join('')+`<div class="check-item"><input type="checkbox" id="${prefix}-area-other-chk" onchange="${otherFn}"><label for="${prefix}-area-other-chk">أخرى</label></div>`;
}


function buildRecvHospChecks(prefix){
  const hosp=getHospitals();
  const container=document.getElementById(prefix+'-recv-checks');
  if(!container) return;
  const fn=prefix==='fi'?'updateFire()':'updateInjuries()';
  container.innerHTML=hosp.map(h=>`<label style="display:flex;align-items:center;gap:4px;font-size:11px;color:rgba(255,255,255,0.85);cursor:pointer;white-space:nowrap;"><input type="checkbox" data-name="${h}" onchange="${fn}" style="accent-color:#00AEEF;"/>${h}</label>`).join('');
}
function populateHospitalSelects(){
  const hospitals=getHospitals();
  ['rd-f-hosp','el-f-hosp','ox-f-hosp','fi-f-hosp','inj-f-hosp','hh-f-hosp','ht-f-hosp','hn-f-hosp','hz-f-hosp'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;
    sel.innerHTML='<option value="">— اختر —</option>';
    hospitals.forEach(h=>{const o=document.createElement('option');o.value=h;o.textContent=h;sel.appendChild(o);});
    if(cur)sel.value=cur;
  });
}

function populateRecvHospSelects(){
  const hospitals=getHospitals();
  const recvIds=[
    ['fi-f-recv1','— المستشفى الأول —'],['fi-f-recv2','— المستشفى الثاني —'],['fi-f-recv3','— المستشفى الثالث —'],
    ['inj-f-recv1','— المستشفى الأول —'],['inj-f-recv2','— المستشفى الثاني —'],['inj-f-recv3','— المستشفى الثالث —'],
    ['hh-f-recv1','— المستشفى الأول —'],['hh-f-recv2','— المستشفى الثاني —'],['hh-f-recv3','— المستشفى الثالث —'],
    ['hn-f-recv1','— المستشفى الأول —'],['hn-f-recv2','— المستشفى الثاني —'],['hn-f-recv3','— المستشفى الثالث —'],
    ['hz-f-recv1','— المستشفى الأول —'],['hz-f-recv2','— المستشفى الثاني —'],['hz-f-recv3','— المستشفى الثالث —']
  ];
  recvIds.forEach(([id,ph])=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">'+ph+'</option>';
    hospitals.forEach(h=>{const o=document.createElement('option');o.value=h;o.textContent=h;sel.appendChild(o);});
    if(cur)sel.value=cur;
  });
}
function populateOfficerSelects(){
  const officers=getOfficers();
  ['el-f-exec','ox-f-exec','fi-f-exec','inj-f-exec','hh-f-exec','ht-f-exec','hn-f-exec','hz-f-exec','ops-f-exec'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;
    sel.innerHTML='<option value="">— اختر —</option>';
    officers.forEach(o=>{const opt=document.createElement('option');opt.value=o;opt.textContent=o;sel.appendChild(opt);});
    const oo=document.createElement('option');oo.value='__other__';oo.textContent='أخرى...';sel.appendChild(oo);
    if(cur)sel.value=cur;
  });
}

// Populate and init moved to DOMContentLoaded at end of file

/* ===== TAB SWITCH ===== */
function switchCard(card){
  document.querySelectorAll('.card-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('panel-'+card).classList.add('active');
  const tabBtn=document.querySelector('[data-card="'+card+'"]');
  if(tabBtn) tabBtn.classList.add('active');
  const _tb=document.querySelector('.top-bar');
  if(_tb)_tb.style.display=card==='home'?'none':'';
  const _tn=document.querySelector('.tab-nav');
  if(_tn)_tn.style.display='none';
  // Home panel: full viewport fixed
  const _hp=document.getElementById('panel-home');
  if(card==='home'){
    if(_hp){_hp.style.position='fixed';_hp.style.inset='0';_hp.style.zIndex='100';_hp.style.overflow='hidden';}
  } else {
    if(_hp){_hp.style.position='';_hp.style.inset='';_hp.style.zIndex='';_hp.style.overflow='';}
  }
  // ── شريط الجوال السفلي ──
  const _mob=document.getElementById('mobile-action-bar');
  if(_mob){
    if(card==='home') _mob.classList.add('bar-home');
    else _mob.classList.remove('bar-home');
    // تمييز زر الطباعة بحسب الصفحة
    const _hipHyp = card==='hypothesis';
    const _printBtn=_mob.querySelector('.mob-primary');
    if(_printBtn) _printBtn.title = _hipHyp ? 'طباعة الفرضية (متعددة الصفحات)' : 'طباعة A4';
  }
  // التمرير للأعلى عند تبديل التبويب على الجوال
  if(window.innerWidth<=768) window.scrollTo({top:0,behavior:'smooth'});
}

// Dynamic print page size based on active panel
(function(){
  var _ps = document.createElement('style');
  _ps.id = 'hyp-print-style';
  document.head.appendChild(_ps);

  window.addEventListener('beforeprint', function(){
    var active = document.querySelector('.card-panel.active');
    var isHyp  = active && active.id === 'panel-hypothesis' || active.id === 'panel-hypothesis-sudden';

    if(isHyp){
      // Portrait + fix all hyp-page sizing
      _ps.textContent = [
        '@page { size: 210mm 297mm; margin: 0; }',
        '.hyp-page, .hyps-page {',
        '  width: 210mm !important;',
        '  height: 297mm !important;',
        '  min-height: unset !important;',
        '  max-height: 297mm !important;',
        '  margin: 0 !important;',
        '  padding: 0 !important;',
        '  overflow: hidden !important;',
        '  page-break-after: always !important;',
        '  break-after: page !important;',
        '  box-shadow: none !important;',
        '  border-radius: 0 !important;',
        '  display: flex !important;',
        '  flex-direction: column !important;',
        '  position: relative !important;',
        '  background: #fff !important;',
        '}',
        '.hyp-page:last-of-type { page-break-after: auto !important; break-after: auto !important; }',
        /* إخفاء الـ spacers */
        '.hyp-spacer, [style*="height:calc(297mm"] { display: none !important; }',
        /* تمديد المحتوى ليملأ الصفحة */
        '.hyp-page > [style*="flex:1"] { flex:1 !important; justify-content:center !important; }',
        '.hyp-page > [style*="flex: 1"] { flex:1 !important; justify-content:center !important; }',
        /* hyps-page centering */
        '.hyps-page > [style*="flex:1"] { flex:1 !important; justify-content:center !important; }',
        '.hyps-page > [style*="flex: 1"] { flex:1 !important; justify-content:center !important; }',
        /* hyps footer */
        '.hyps-page .a4-footer { position: absolute !important; bottom: 0 !important; left: 0 !important; right: 0 !important; }',
        /* الألوان */
        '.hyp-page * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }',
        /* الفوتر */
        '.hyp-page .a4-footer { position: absolute !important; bottom: 0 !important; left: 0 !important; right: 0 !important; }',
        /* select */
        '.hyp-page select { -webkit-appearance: none !important; appearance: none !important; border: none !important; background: transparent !important; }',
        /* إخفاء النموذج */
        '#panel-hypothesis .no-print, #panel-hypothesis .form-section, #panel-hypothesis-sudden .no-print, #panel-hypothesis-sudden .form-section { display: none !important; }',
        /* التأكد من ظهور الفرضية فقط */
        '.card-panel { display: none !important; }',
        (active.id === 'panel-hypothesis-sudden' ? '#panel-hypothesis-sudden { display: block !important; }' : '#panel-hypothesis { display: block !important; }'),
        '.top-bar { display: none !important; }',
        '.tab-nav { display: none !important; }',
      ].join('\n');

      // إخفاء صفحة 5 عند الطباعة إذا لم تكن هناك صور
      if(active.id === 'panel-hypothesis-sudden'){
        var p5 = document.getElementById('hyps-page5');
        if(p5){
          var hasPhotos = window._hypsPhotos && window._hypsPhotos.length > 0;
          p5.style.setProperty('display', hasPhotos ? 'block' : 'none', 'important');
        }
      }
    } else {
      _ps.textContent = '@page { size: A4 landscape; margin: 0; }';
    }
  });

  window.addEventListener('afterprint', function(){
    _ps.textContent = '';
  });
})();

/* ===== PRINT FILENAME ===== */
(function(){
  var AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو',
                   'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  var _origTitle = document.title;

  function gv(id){ var e=document.getElementById(id); if(!e) return ''; return (e.tagName==='SELECT'?e.options[e.selectedIndex]&&e.options[e.selectedIndex].text:e.value)||''; }
  function gvVal(id){ var e=document.getElementById(id); return e?e.value||'':''; }

  function monthFromDate(dateVal){
    if(!dateVal) return '';
    var parts = dateVal.split('-');
    if(parts.length<2) return '';
    var m = parseInt(parts[1],10);
    return AR_MONTHS[m-1]||'';
  }
  function yearFromDate(dateVal){
    if(!dateVal) return '';
    return dateVal.split('-')[0]||'';
  }

  function buildTitle(){
    var active = document.querySelector('.card-panel.active');
    if(!active) return _origTitle;
    var id = active.id;

    if(id === 'panel-readiness-check'){
      var period = gv('rck-f-period') || '....';
      var today = new Date();
      var AR_DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
      var todayStr = AR_DAYS[today.getDay()] + ' ' + today.getDate() + ' ' + AR_MONTHS[today.getMonth()] + ' ' + today.getFullYear();
      return 'تحقق تأهب مستشفيات التجمع للفترة ' + period + ' ' + todayStr;
    }

    if(id === 'panel-ops'){
      var dateEl=document.getElementById('ops-f-date');
      var dateVal=dateEl?dateEl.value:'';
      var mn=monthFromDate(dateVal);
      var yr=yearFromDate(dateVal)||(new Date().getFullYear());
      return 'مؤشر تحضير تترا - '+(mn?mn+' ':'')+yr;
    }

    if(id === 'panel-hypothesis'){
      var hosp = gv('hyp-f-hosp') || '....';
      var mn   = monthFromDate(gvVal('hyp-f-date'));
      return 'تقرير فرضية - ' + hosp + (mn?' - '+mn:'');
    }

    if(id === 'panel-readiness'){
      var hosp = gv('rd-f-hosp') || '....';
      var mn   = monthFromDate(gvVal('rd-f-date'));
      var yr   = yearFromDate(gvVal('rd-f-date'));
      return 'بطاقة الاستعداد - ' + hosp + (mn?' - '+mn:'') + (yr?' - '+yr:'');
    }

    if(id === 'panel-electricity'){
      return 'تقرير انقطاع كهرباء - ' + (gv('el-f-hosp')||'....');
    }
    if(id === 'panel-oxygen'){
      return 'تقرير انقطاع أكسجين - ' + (gv('ox-f-hosp')||'....');
    }
    if(id === 'panel-fire'){
      return 'تقرير حريق - ' + (gv('fi-f-hosp')||'....');
    }
    if(id === 'panel-injuries'){
      return 'تقرير إصابات متعددة - ' + (gv('inj-f-hosp')||'....');
    }
    if(id === 'panel-hazard-human'){
      return 'تقرير مخاطر بشرية - ' + (gv('hh-f-hosp')||'....');
    }
    if(id === 'panel-hazard-tech'){
      return 'تقرير مخاطر تكنولوجية - ' + (gv('ht-f-hosp')||'....');
    }
    if(id === 'panel-hazard-nature'){
      return 'تقرير مخاطر طبيعية - ' + (gv('hn-f-hosp')||'....');
    }
    if(id === 'panel-hazard-hazmat'){
      return 'تقرير مواد خطرة - ' + (gv('hz-f-hosp')||'....');
    }
    return _origTitle;
  }

  window.addEventListener('beforeprint', function(){
    _origTitle = document.title;
    document.title = buildTitle();
  });
  window.addEventListener('afterprint', function(){
    document.title = _origTitle;
  });
})();

/* ===== HELPERS ===== */
function fmtDate(dateVal, timeVal){
  if(!dateVal) return '—';
  const d = new Date(dateVal+'T00:00:00');
  let s = d.getFullYear()+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0');
  if(timeVal) s += ' — '+timeVal;
  return s;
}
function getNum(id){ const el=document.getElementById(id); return el?parseInt(el.value)||0:0; }
function getVal(id){ const el=document.getElementById(id); return el?el.value||'':''; }
function setTxt(id,v){ const el=document.getElementById(id); if(el) el.textContent=v; }
function show(id,v){ const el=document.getElementById(id); if(el) el.style.display=v?'flex':'none'; }

/* ===== 1. READINESS ===== */
function rdParticipantsToggle(){
  const sel=document.getElementById('rd-f-participants');
  const otherIn=document.getElementById('rd-f-participants-other');
  if(sel && otherIn){ otherIn.style.display=sel.value==='__other__'?'block':'none'; if(sel.value!=='__other__') otherIn.value=''; }
  const sel2=document.getElementById('rd-f-participants2');
  const otherIn2=document.getElementById('rd-f-participants2-other');
  if(sel2 && otherIn2){ otherIn2.style.display=sel2.value==='__other__'?'block':'none'; if(sel2.value!=='__other__') otherIn2.value=''; }
  updateReadiness();
}
function rdCodeToggle(){
  const v = document.getElementById('rd-f-code').value;
  document.getElementById('rd-f-code-m').style.display = v==='__manual__'?'block':'none';
  if(v!=='__manual__') document.getElementById('rd-f-code-m').value='';
  updateReadiness();
}
document.getElementById('rd-f-code').addEventListener('change', rdCodeToggle);

function updateReadiness(){
  const black=getNum('rd-f-black'), red=getNum('rd-f-red'), yellow=getNum('rd-f-yellow'), green=getNum('rd-f-green');
  const total=black+red+yellow+green;
  setTxt('rd-black',black); setTxt('rd-red',red); setTxt('rd-yellow',yellow); setTxt('rd-green',green); setTxt('rd-total',total);
  document.getElementById('rd-f-total').value=total;

  const hyp=getVal('rd-f-hyp');
  setTxt('rd-hyp-disp', hyp||'—');
  const badge=document.getElementById('rd-badge');
  if(badge) badge.textContent=hyp||'بطاقة الاستعداد';

  const evType=getVal('rd-f-ev');
  setTxt('rd-ev-disp', evType||'—');
  setTxt('rd-evtype', evType||'—');

  const tb=document.getElementById('rd-titlebar');
  if(tb){
    let g='linear-gradient(90deg,#00AEEF,#005B82)';
    if(evType==='انقطاع كهرباء'||evType==='انقطاع الغازات الطبية') g='linear-gradient(90deg,#7B4A2D,#5C3520)';
    else if(evType==='حريق') g='linear-gradient(90deg,#C62828,#8E1B1B)';
    else if(evType==='اختطاف طفل') g='linear-gradient(90deg,#E91E90,#AD1457)';
    else if(evType==='إصابات متعددة') g='linear-gradient(90deg,#F9A825,#C17900)';
    tb.style.background=g;
  }

  const codeS=document.getElementById('rd-f-code'), codeM=document.getElementById('rd-f-code-m');
  const codeVal=codeS.value==='__manual__'?codeM.value:codeS.value;
  const evCodeEl=document.getElementById('rd-evcode');
  evCodeEl.textContent=codeVal||''; evCodeEl.style.display=codeVal?'block':'none';

  const hosp=getVal('rd-f-hosp'), dept=getVal('rd-f-dept');
  setTxt('rd-hospital', hosp||'—');
  const deptEl=document.getElementById('rd-dept');
  deptEl.textContent=dept?'القسم: '+dept:''; deptEl.style.display=dept?'block':'none';

  const dt=fmtDate(getVal('rd-f-date'),getVal('rd-f-time'));
  setTxt('rd-date',dt.split(' — ')[0]||'—');
  const timeEl=document.getElementById('rd-time');
  const tv=getVal('rd-f-time');
  timeEl.textContent=tv?'الساعة: '+tv:''; timeEl.style.display=tv?'block':'none';

  setTxt('rd-transport', getVal('rd-f-transport')||'—');

  const partSel=document.getElementById('rd-f-participants');
  const partVal=partSel?partSel.value:'';
  const partOther=document.getElementById('rd-f-participants-other');
  const partFinal=partVal==='__other__'?(partOther?partOther.value:''):(partVal||'');
  setTxt('rd-p1',partFinal||'—');
  const partSel2=document.getElementById('rd-f-participants2');
  const partVal2=partSel2?partSel2.value:'';
  const partOther2=document.getElementById('rd-f-participants2-other');
  const partFinal2=partVal2==='__other__'?(partOther2?partOther2.value:''):(partVal2||'');
  setTxt('rd-p2',partFinal2); show('rd-p2-row',!!partFinal2);
  show('rd-p3-row',false); show('rd-p4-row',false);

  const exec=getVal('rd-f-exec');
  if(exec){ const bi=exec.indexOf('('); setTxt('rd-exec',bi>-1?exec.substring(0,bi).trim():exec); setTxt('rd-exec-code',bi>-1?exec.substring(bi):''); }
  else { setTxt('rd-exec','—'); setTxt('rd-exec-code',''); }

  const notes=getVal('rd-f-notes').trim();
  document.getElementById('rd-notes-text').textContent=notes;
  document.getElementById('rd-notes-block').style.display=notes?'block':'none';

}

/* ===== 2. ELECTRICITY ===== */
function elAreaOtherToggle(){
  const chk=document.getElementById('el-area-other-chk');
  const inp=document.getElementById('el-f-area-other-txt');
  if(inp) inp.style.display=chk&&chk.checked?'block':'none';
  if(inp&&chk&&!chk.checked) inp.value='';
  updateElectricity();
}
function oxAreaOtherToggle(){
  const chk=document.getElementById('ox-area-other-chk');
  const inp=document.getElementById('ox-f-area-other-txt');
  if(inp) inp.style.display=chk&&chk.checked?'block':'none';
  if(inp&&chk&&!chk.checked) inp.value='';
  updateOxygen();
}
function elExecToggle(){
  const s=document.getElementById('el-f-exec'), i=document.getElementById('el-f-exec-other');
  if(s&&i){i.style.display=s.value==='__other__'?'block':'none'; if(s.value!=='__other__')i.value='';}
  updateElectricity();
}
function oxExecToggle(){
  const s=document.getElementById('ox-f-exec'), i=document.getElementById('ox-f-exec-other');
  if(s&&i){i.style.display=s.value==='__other__'?'block':'none'; if(s.value!=='__other__')i.value='';}
  updateOxygen();
}
function updateElectricity(){
  const hosp=getVal('el-f-hosp'), date=getVal('el-f-date'), time=getVal('el-f-time');
  const dt=fmtDate(date,time);
  setTxt('el-hosp-disp', hosp||'—'); setTxt('el-date-disp', dt);
  setTxt('el-hosp', hosp||'—');
  setTxt('el-report-dt', dt);
  setTxt('el-outage-type', getVal('el-f-outage-type')||'—');
  setTxt('el-start-time', getVal('el-f-start')||'—');
  setTxt('el-notify8', getVal('el-f-notify8')||'—');
  setTxt('el-restore-time', getVal('el-f-restore')||'—');
  setTxt('el-gen-status', getVal('el-f-gen')||'—');
  setTxt('el-inpatients', getNum('el-f-inpatients'));
  setTxt('el-ventilators', getNum('el-f-ventilators'));
  const elActSel=document.getElementById('el-f-action');const elActVal=elActSel&&elActSel.value==='__other__'?getVal('el-f-action-other'):(elActSel?elActSel.value:'');setTxt('el-action', elActVal||'—');
  setTxt('el-reporter-org', getVal('el-f-reporter-org')||'—');
  setTxt('el-reporter-name', getVal('el-f-reporter-name')||'');
  const elExecSel=document.getElementById('el-f-exec');
  const elExecOther=document.getElementById('el-f-exec-other');
  const elExecVal=elExecSel&&elExecSel.value==='__other__'?(elExecOther?elExecOther.value:''):(elExecSel?elExecSel.value:'');
  setTxt('el-exec', elExecVal||'—');
  // Areas chips
  const areas=[...document.querySelectorAll('#el-area-container input[data-aname]:checked')].map(cb=>cb.dataset.aname);
  const other=getVal('el-f-area-other-txt'); if(other) areas.push(other);
  const chipsEl=document.getElementById('el-areas-chips');
  chipsEl.innerHTML=areas.length?areas.map(a=>'<span class="affected-chip chip-amber">'+a+'</span>').join(''):'<span style="color:#aaa;font-size:11px;">—</span>';
  const notes=getVal('el-f-notes').trim();
  document.getElementById('el-notes-text').textContent=notes;
  document.getElementById('el-notes-block').style.display=notes?'block':'none';
}

/* ===== 3. OXYGEN ===== */
function updateOxygen(){
  const hosp=getVal('ox-f-hosp'), date=getVal('ox-f-date'), time=getVal('ox-f-time');
  const dt=fmtDate(date,time);
  setTxt('ox-hosp-disp', hosp||'—'); setTxt('ox-date-disp', dt);
  setTxt('ox-hosp', hosp||'—');
  setTxt('ox-report-dt', dt);
  setTxt('ox-outage-type', getVal('ox-f-outage-type')||'—');
  setTxt('ox-start-time', getVal('ox-f-start')||'—');
  setTxt('ox-notify8', getVal('ox-f-notify8')||'—');
  setTxt('ox-end-time', getVal('ox-f-end')||'—');
  setTxt('ox-cylinders', getNum('ox-f-cylinders'));
  setTxt('ox-inpatients', getNum('ox-f-inpatients'));
  setTxt('ox-ventilators', getNum('ox-f-ventilators'));
  setTxt('ox-severity', getVal('ox-f-severity')||'—');
  const oxActSel=document.getElementById('ox-f-action');const oxActVal=oxActSel&&oxActSel.value==='__other__'?getVal('ox-f-action-other'):(oxActSel?oxActSel.value:'');setTxt('ox-action', oxActVal||'—');
  setTxt('ox-reporter-org', getVal('ox-f-reporter-org')||'—');
  setTxt('ox-reporter-name', getVal('ox-f-reporter-name')||'');
  const oxExecSel=document.getElementById('ox-f-exec');
  const oxExecOther=document.getElementById('ox-f-exec-other');
  const oxExecVal=oxExecSel&&oxExecSel.value==='__other__'?(oxExecOther?oxExecOther.value:''):(oxExecSel?oxExecSel.value:'');
  setTxt('ox-exec', oxExecVal||'—');
  // ox areas chips
  const oxAreas=[...document.querySelectorAll('#ox-area-container input[data-aname]:checked')].map(cb=>cb.dataset.aname);
  const oxOther=getVal('ox-f-area-other-txt'); if(oxOther) oxAreas.push(oxOther);
  const oxChipsEl=document.getElementById('ox-areas-chips');
  if(oxChipsEl) oxChipsEl.innerHTML=oxAreas.length?oxAreas.map(a=>'<span class="affected-chip chip-cyan">'+a+'</span>').join(''):'<span style="color:#aaa;font-size:11px;">—</span>';
  // Gas chips
  // عناصر الغازات اختيارية — تُتجاهل إن لم تكن موجودة في البطاقة
  const gc=document.getElementById('ox-gas-chips');
  if(gc){
    const gases=[];
    [['ox-gas-o2','O₂ أكسجين'],['ox-gas-n2o','N₂O'],['ox-gas-air','هواء طبي'],['ox-gas-vac','شفط طبي'],['ox-gas-co2','CO₂']]
      .forEach(([id,label])=>{const cb=document.getElementById(id); if(cb&&cb.checked) gases.push(label);});
    gc.innerHTML=gases.length?gases.map(g=>'<span class="affected-chip chip-teal">'+g+'</span>').join(''):'<span style="color:#aaa;font-size:11px;">—</span>';
  }
  const notes=getVal('ox-f-notes').trim();
  document.getElementById('ox-notes-text').textContent=notes;
  document.getElementById('ox-notes-block').style.display=notes?'block':'none';

}

/* ===== 4. FIRE ===== */
function fiExecToggle(){
  const s=document.getElementById('fi-f-exec'), i=document.getElementById('fi-f-exec-other');
  if(s&&i){i.style.display=s.value==='__other__'?'block':'none'; if(s.value!=='__other__')i.value='';}
  updateFire();
}
function injExecToggle(){
  const s=document.getElementById('inj-f-exec'), i=document.getElementById('inj-f-exec-other');
  if(s&&i){i.style.display=s.value==='__other__'?'block':'none'; if(s.value!=='__other__')i.value='';}
  updateInjuries();
}
function elActionToggle(){
  const s=document.getElementById('el-f-action'), i=document.getElementById('el-f-action-other');
  if(s&&i){i.style.display=s.value==='__other__'?'block':'none'; if(s.value!=='__other__')i.value='';}
  updateElectricity();
}
function oxActionToggle(){
  const s=document.getElementById('ox-f-action'), i=document.getElementById('ox-f-action-other');
  if(s&&i){i.style.display=s.value==='__other__'?'block':'none'; if(s.value!=='__other__')i.value='';}
  updateOxygen();
}
function fiActionToggle(){
  const s=document.getElementById('fi-f-action'), i=document.getElementById('fi-f-action-other');
  if(s&&i){i.style.display=s.value==='__other__'?'block':'none'; if(s.value!=='__other__')i.value='';}
  updateFire();
}
function injActionToggle(){
  const s=document.getElementById('inj-f-action'), i=document.getElementById('inj-f-action-other');
  if(s&&i){i.style.display=s.value==='__other__'?'block':'none'; if(s.value!=='__other__')i.value='';}
  updateInjuries();
}
function updateFire(){
  const hosp=getVal('fi-f-hosp'), date=getVal('fi-f-date'), time=getVal('fi-f-time');
  const dt=fmtDate(date,time);
  setTxt('fi-hosp-disp', hosp||'—'); setTxt('fi-date-disp', dt);
  setTxt('fi-location', hosp||'—');
  setTxt('fi-event-type', getVal('fi-f-event-type')||'—');
  setTxt('fi-floor', getVal('fi-f-floor')||'—');
  setTxt('fi-start-time', getVal('fi-f-start')||'—');
  setTxt('fi-notify8', getVal('fi-f-notify8')||'—');
  setTxt('fi-end-time', getVal('fi-f-end')||'—');
  // Receiving hospitals
  // Receiving hospitals (3 selects)
  for(let i=1;i<=3;i++){const rv=document.getElementById('fi-recv'+i),rr=document.getElementById('fi-recv-hosp-'+i),val=getVal('fi-f-recv'+i);if(rv)rv.textContent=val;if(rr)rr.classList.toggle('empty-row',!val);}
  const fiAnyRecv=[1,2,3].some(i=>getVal('fi-f-recv'+i));
  const fiRecvSec=document.getElementById('fi-recv-section');if(fiRecvSec)fiRecvSec.classList.toggle('recv-section-empty',!fiAnyRecv);
  const bk=getNum('fi-f-black'), rd=getNum('fi-f-red'), yw=getNum('fi-f-yellow'), gn=getNum('fi-f-green');
  const tot=bk+rd+yw+gn;
  setTxt('fi-black',bk); setTxt('fi-red',rd); setTxt('fi-yellow',yw); setTxt('fi-green',gn); setTxt('fi-total',tot);
  document.getElementById('fi-f-total').value=tot;
  setTxt('fi-reporter-org', getVal('fi-f-reporter-org')||'—');
  setTxt('fi-reporter-name', getVal('fi-f-reporter-name')||'—');
  const fiActSel=document.getElementById('fi-f-action');
  const fiActVal=fiActSel&&fiActSel.value==='__other__'?getVal('fi-f-action-other'):(fiActSel?fiActSel.value:'');
  setTxt('fi-action', fiActVal||'');
  const fiActRow=document.getElementById('fi-action-row');if(fiActRow)fiActRow.classList.toggle('empty-row',!fiActVal);
  const fiExecSel=document.getElementById('fi-f-exec');
  const fiExecOther=document.getElementById('fi-f-exec-other');
  const fiExecVal=fiExecSel&&fiExecSel.value==='__other__'?(fiExecOther?fiExecOther.value:''):(fiExecSel?fiExecSel.value:'');
  setTxt('fi-exec', fiExecVal||'—');
  const notes=getVal('fi-f-notes').trim();
  document.getElementById('fi-notes-text').textContent=notes;
  document.getElementById('fi-notes-block').style.display=notes?'block':'none';

}

/* ===== 5. INJURIES ===== */
function updateInjuries(){
  const loc=getVal('inj-f-location'), date=getVal('inj-f-date'), time=getVal('inj-f-time');
  const dt=fmtDate(date,time);
  const hosp_inj=getVal('inj-f-hosp');
  setTxt('inj-location-disp', hosp_inj||loc||'—'); setTxt('inj-date-disp', dt);
  setTxt('inj-location', hosp_inj||'—');
  setTxt('inj-type', getVal('inj-f-type')||'—');
  setTxt('inj-addr', loc||'—');
  setTxt('inj-start-time', getVal('inj-f-start')||'—');
  setTxt('inj-notify8', getVal('inj-f-notify8')||'—');
  setTxt('inj-end-time', getVal('inj-f-end')||'—');
  // Receiving hospitals
  // Receiving hospitals (3 selects)
  for(let i=1;i<=3;i++){const rv=document.getElementById('inj-recv'+i),rr=document.getElementById('inj-recv-hosp-'+i),val=getVal('inj-f-recv'+i);if(rv)rv.textContent=val;if(rr)rr.classList.toggle('empty-row',!val);}
  const injAnyRecv=[1,2,3].some(i=>getVal('inj-f-recv'+i));
  const injRecvSec=document.getElementById('inj-recv-section');if(injRecvSec)injRecvSec.classList.toggle('recv-section-empty',!injAnyRecv);
  const bk=getNum('inj-f-black'), rd=getNum('inj-f-red'), yw=getNum('inj-f-yellow'), gn=getNum('inj-f-green');
  const tot=bk+rd+yw+gn;
  setTxt('inj-black',bk); setTxt('inj-red',rd); setTxt('inj-yellow',yw); setTxt('inj-green',gn); setTxt('inj-total',tot);
  document.getElementById('inj-f-total').value=tot;
  setTxt('inj-reporter-org', getVal('inj-f-reporter-org')||'—');
  setTxt('inj-reporter-name', getVal('inj-f-reporter-name')||'—');
  const injActSel=document.getElementById('inj-f-action');
  const injActVal=injActSel&&injActSel.value==='__other__'?getVal('inj-f-action-other'):(injActSel?injActSel.value:'');
  setTxt('inj-action', injActVal||'');
  const injActRow=document.getElementById('inj-action-row');if(injActRow)injActRow.classList.toggle('empty-row',!injActVal);
  const injExecSel=document.getElementById('inj-f-exec');
  const injExecOther=document.getElementById('inj-f-exec-other');
  const injExecVal=injExecSel&&injExecSel.value==='__other__'?(injExecOther?injExecOther.value:''):(injExecSel?injExecSel.value:'');
  setTxt('inj-exec', injExecVal||'—');
  const notes=getVal('inj-f-notes').trim();
  document.getElementById('inj-notes-text').textContent=notes;
  document.getElementById('inj-notes-block').style.display=notes?'block':'none';

}

/* ===== RESET ===== */
function resetActive(){
  const active=document.querySelector('.card-panel.active').id.replace('panel-','');
  if(!confirm('هل تريد إعادة تعيين جميع البيانات؟')) return;
  if(active==='readiness'){
    ['rd-f-hyp','rd-f-ev','rd-f-code','rd-f-hosp','rd-f-exec'].forEach(id=>{document.getElementById(id).value='';});
    ['rd-f-dept','rd-f-notes'].forEach(id=>{document.getElementById(id).value='';}); document.getElementById('rd-f-transport').value=''; document.getElementById('rd-f-participants').value=''; document.getElementById('rd-f-participants2').value=''; const _rpo=document.getElementById('rd-f-participants-other'); if(_rpo){_rpo.value='';_rpo.style.display='none';} const _rpo2=document.getElementById('rd-f-participants2-other'); if(_rpo2){_rpo2.value='';_rpo2.style.display='none';};
    ['rd-f-black','rd-f-red','rd-f-yellow','rd-f-green'].forEach(id=>{document.getElementById(id).value=0;});
    document.getElementById('rd-f-date').value=todayStr; document.getElementById('rd-f-time').value=timeStr;
    document.getElementById('rd-f-code-m').style.display='none';
    updateReadiness();
  } else if(active==='electricity'){
    ['el-f-hosp','el-f-outage-type','el-f-gen','el-f-reporter-org','el-f-exec','el-f-action'].forEach(id=>{document.getElementById(id).value='';}); const _ee=document.getElementById('el-f-exec-other'); if(_ee){_ee.value='';_ee.style.display='none';};
    ['el-f-reporter-name','el-f-action-other','el-f-notes','el-f-start','el-f-restore'].forEach(id=>{document.getElementById(id).value='';});
    ['el-f-inpatients','el-f-ventilators'].forEach(id=>{document.getElementById(id).value=0;});
    ['el-area-all','el-area-er','el-area-icu','el-area-picu','el-area-nicu','el-area-or','el-area-ob','el-area-dial','el-area-mward','el-area-fward','el-area-pward','el-area-lab','el-area-rad','el-area-pharm','el-area-clinic','el-area-cath','el-area-ccu','el-area-support','el-area-other-chk'].forEach(id=>{document.getElementById(id).checked=false;});
    document.getElementById('el-f-action-other').style.display='none';
    document.getElementById('el-f-area-other-txt').style.display='none'; document.getElementById('el-f-area-other-txt').value='';
    document.getElementById('el-f-date').value=todayStr; document.getElementById('el-f-time').value=timeStr;
    updateElectricity();
  } else if(active==='oxygen'){
    ['ox-f-hosp','ox-f-outage-type','ox-f-severity','ox-f-reporter-org','ox-f-exec','ox-f-action'].forEach(id=>{document.getElementById(id).value='';}); const _oe=document.getElementById('ox-f-exec-other'); if(_oe){_oe.value='';_oe.style.display='none';};
    ['ox-f-start','ox-f-end','ox-f-reporter-name','ox-f-action-other','ox-f-area-other-txt','ox-f-notes'].forEach(id=>{document.getElementById(id).value='';});
    ['ox-f-cylinders','ox-f-inpatients','ox-f-ventilators'].forEach(id=>{document.getElementById(id).value=0;});
    ['ox-area-all','ox-area-er','ox-area-icu','ox-area-picu','ox-area-nicu','ox-area-or','ox-area-ob','ox-area-dial','ox-area-mward','ox-area-fward','ox-area-pward','ox-area-lab','ox-area-rad','ox-area-pharm','ox-area-clinic','ox-area-cath','ox-area-ccu','ox-area-support','ox-area-other-chk'].forEach(id=>{document.getElementById(id).checked=false;});
    document.getElementById('ox-f-action-other').style.display='none';
    document.getElementById('ox-f-area-other-txt').style.display='none';
    document.getElementById('ox-f-date').value=todayStr; document.getElementById('ox-f-time').value=timeStr;
    updateOxygen();
  } else if(active==='fire'){
    ['fi-f-hosp','fi-f-exec','fi-f-recv1','fi-f-recv2','fi-f-recv3','fi-f-action'].forEach(id=>{document.getElementById(id).value='';}); const _fe=document.getElementById('fi-f-exec-other'); if(_fe){_fe.value='';_fe.style.display='none';};
    ['fi-f-floor','fi-f-reporter-org','fi-f-reporter-name','fi-f-notes'].forEach(id=>{const el=document.getElementById(id); if(el) el.value='';});
    ['fi-f-black','fi-f-red','fi-f-yellow','fi-f-green'].forEach(id=>{document.getElementById(id).value=0;});
    document.getElementById('fi-f-date').value=todayStr; document.getElementById('fi-f-time').value=timeStr;
    updateFire();
  } else if(active==='injuries'){
    ['inj-f-hosp','inj-f-type','inj-f-exec','inj-f-recv1','inj-f-recv2','inj-f-recv3','inj-f-action'].forEach(id=>{document.getElementById(id).value='';}); const _ie=document.getElementById('inj-f-exec-other'); if(_ie){_ie.value='';_ie.style.display='none';};
    ['inj-f-location','inj-f-reporter-org','inj-f-reporter-name','inj-f-notes'].forEach(id=>{const el=document.getElementById(id); if(el) el.value='';});
    ['inj-f-black','inj-f-red','inj-f-yellow','inj-f-green'].forEach(id=>{document.getElementById(id).value=0;});
    document.getElementById('inj-f-date').value=todayStr; document.getElementById('inj-f-time').value=timeStr;
    updateInjuries();
  }
}

// Init handled by loadFormData() + auto-save setup above

// ===== LOCALSTORAGE AUTO-SAVE =====
function saveFormData(){
  try{
    const data={};
    document.querySelectorAll('input[id],select[id],textarea[id]').forEach(el=>{
      if(el.readOnly||el.id.endsWith('-total'))return;
      data[el.id]=el.type==='checkbox'?el.checked:el.value;
    });
    // Save dynamic area checkboxes by data-aname
    const elAreas=[...document.querySelectorAll('#el-area-container input[data-aname]:checked')].map(c=>c.dataset.aname);
    const oxAreas=[...document.querySelectorAll('#ox-area-container input[data-aname]:checked')].map(c=>c.dataset.aname);
    data['__el_areas__']=elAreas;
    data['__ox_areas__']=oxAreas;
    localStorage.setItem('hail_form_v2',JSON.stringify(data));
  }catch(e){}
}

function loadFormData(){
  try{
    const saved=localStorage.getItem('hail_form_v2');
    if(!saved)return;
    const data=JSON.parse(saved);
    Object.entries(data).forEach(([id,value])=>{
      if(id.startsWith('__'))return;
      const el=document.getElementById(id);
      if(!el||el.readOnly)return;
      if(el.type==='checkbox')el.checked=value;
      else el.value=value;
    });
    // Restore dynamic area checkboxes by data-aname
    if(data['__el_areas__']){
      const checked=new Set(data['__el_areas__']);
      document.querySelectorAll('#el-area-container input[data-aname]').forEach(cb=>{cb.checked=checked.has(cb.dataset.aname);});
    }
    if(data['__ox_areas__']){
      const checked=new Set(data['__ox_areas__']);
      document.querySelectorAll('#ox-area-container input[data-aname]').forEach(cb=>{cb.checked=checked.has(cb.dataset.aname);});
    }
    // Re-trigger toggles after loading
    rdCodeToggle();rdParticipantsToggle();
    const elEx=document.getElementById('el-f-exec');if(elEx&&elEx.value==='__other__'){const i=document.getElementById('el-f-exec-other');if(i)i.style.display='block';}
    const oxEx=document.getElementById('ox-f-exec');if(oxEx&&oxEx.value==='__other__'){const i=document.getElementById('ox-f-exec-other');if(i)i.style.display='block';}
    const fiEx=document.getElementById('fi-f-exec');if(fiEx&&fiEx.value==='__other__'){const i=document.getElementById('fi-f-exec-other');if(i)i.style.display='block';}
    const inEx=document.getElementById('inj-f-exec');if(inEx&&inEx.value==='__other__'){const i=document.getElementById('inj-f-exec-other');if(i)i.style.display='block';}
    const elAct=document.getElementById('el-f-action');if(elAct)elActionToggle();
    const oxAct=document.getElementById('ox-f-action');if(oxAct)oxActionToggle();
    elAreaOtherToggle();oxAreaOtherToggle();
  }catch(e){}
}

// Auto-save on any change
document.addEventListener('input',saveFormData);
document.addEventListener('change',saveFormData);

// loadFormData and updates moved to DOMContentLoaded

// ===== SETTINGS MODAL =====
function openSettings(){
  document.getElementById('settings-overlay').classList.add('open');
  settingsTab('hospitals');
  renderAllSettingsLists();
}
function closeSettings(){
  document.getElementById('settings-overlay').classList.remove('open');
  populateHospitalSelects();opsPopulateRows();opsLoad();populateOfficerSelects();populateRecvHospSelects();
  populateReporterSelects();populateExecSelects();populateTransportSelects();populateParticipantSelects();
  populateOutageTypeSelects();populateActionSelects();populateFireTypeSelects();populateInjTypeSelects();
  populateCitySelects();populateCodeSelects();populateRdEvTypeSelects();
  buildAreaChecks('el','updateElectricity()');buildAreaChecks('ox','updateOxygen()');
  rckPopulateAddSelect();
  opsInit();
}
function renderAllSettingsLists(){
  renderHospitalsList();renderOfficersList();renderReportersList();renderExecsList();
  renderTransportsList();renderParticipantsList();renderOutageTypesList();renderDeptsList();
  renderActionsList();renderFireTypesList();renderInjTypesList();renderCitiesList();renderCodesList();renderRdEvTypesList();
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSettings();});

function settingsTab(tab){
  document.querySelectorAll('.settings-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.stab').forEach(b=>b.classList.remove('active'));
  document.getElementById('spanel-'+tab).classList.add('active');
  document.getElementById('stab-'+tab).classList.add('active');
}

// HOSPITALS
function renderHospitalsList(){
  const hospitals=getHospitals();
  const list=document.getElementById('s-hospitals-list');
  if(!hospitals.length){list.innerHTML='<div class="settings-empty">لا توجد جهات مضافة</div>';return;}
  list.innerHTML=hospitals.map((h,i)=>
    `<div class="settings-item"><span>${h}</span><button class="settings-del" onclick="deleteHospital(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> حذف</button></div>`
  ).join('');
}
function addHospital(){
  const inp=document.getElementById('s-new-hospital');
  const val=(inp.value||'').trim();
  if(!val)return;
  const list=getHospitals();
  if(list.includes(val)){inp.value='';inp.focus();return;}
  list.push(val);
  saveHospitals(list);
  inp.value='';
  renderHospitalsList();
  populateHospitalSelects();
}
function deleteHospital(i){
  const list=getHospitals();list.splice(i,1);
  saveHospitals(list);renderHospitalsList();populateHospitalSelects();
}
function resetHospitals(){
  if(!confirm('هل تريد استعادة قائمة الجهات الافتراضية؟ ستُحذف الجهات المضافة.'))return;
  localStorage.removeItem('custom_hospitals');
  renderHospitalsList();populateHospitalSelects();
}
document.getElementById('s-new-hospital')&&document.getElementById('s-new-hospital').addEventListener('keydown',function(e){if(e.key==='Enter')addHospital();});

// OFFICERS
function renderOfficersList(){
  const officers=getOfficers();
  const list=document.getElementById('s-officers-list');
  if(!officers.length){list.innerHTML='<div class="settings-empty">لا يوجد مناوبون مضافون</div>';return;}
  list.innerHTML=officers.map((o,i)=>
    `<div class="settings-item"><span>${o}</span><button class="settings-del" onclick="deleteOfficer(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> حذف</button></div>`
  ).join('');
}
function addOfficer(){
  const inp=document.getElementById('s-new-officer');
  const val=(inp.value||'').trim();
  if(!val)return;
  const list=getOfficers();
  if(list.includes(val)){inp.value='';inp.focus();return;}
  list.push(val);
  saveOfficers(list);
  inp.value='';
  renderOfficersList();
  populateOfficerSelects();
}
function deleteOfficer(i){
  const list=getOfficers();list.splice(i,1);
  saveOfficers(list);renderOfficersList();populateOfficerSelects();
}
function resetOfficers(){
  if(!confirm('هل تريد استعادة قائمة المناوبين الافتراضية؟'))return;
  localStorage.removeItem('custom_officers');
  renderOfficersList();populateOfficerSelects();
}
document.getElementById('s-new-officer')&&document.getElementById('s-new-officer').addEventListener('keydown',function(e){if(e.key==='Enter')addOfficer();});

// ===== EXTENDED SETTINGS RENDER FUNCTIONS =====
function makeSettingsListFns(key,getF,saveF,listId,inputId,renderF,populateF,emptyMsg){
  window['render'+renderF]=function(){
    const list=getF();const el=document.getElementById(listId);
    if(!list.length){el.innerHTML='<div class="settings-empty">'+emptyMsg+'</div>';return;}
    el.innerHTML=list.map((item,i)=>`<div class="settings-item"><span>${item}</span><button class="settings-del" onclick="del_${key}(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> حذف</button></div>`).join('');
  };
  window['add_'+key]=function(){
    const inp=document.getElementById(inputId);const val=(inp.value||'').trim();if(!val)return;
    const lst=getF();if(lst.includes(val)){inp.value='';inp.focus();return;}
    lst.push(val);saveF(lst);inp.value='';window['render'+renderF]();if(populateF)populateF();
  };
  window['del_'+key]=function(i){
    const lst=getF();lst.splice(i,1);saveF(lst);window['render'+renderF]();if(populateF)populateF();
  };
  window['reset_'+key]=function(){
    if(!confirm('هل تريد استعادة القائمة الافتراضية؟'))return;
    localStorage.removeItem('custom_'+key);window['render'+renderF]();if(populateF)populateF();
  };
  const inp2=document.getElementById(inputId);
  if(inp2)inp2.addEventListener('keydown',function(e){if(e.key==='Enter')window['add_'+key]();});
}

makeSettingsListFns('reporters',getReporters,saveReporters,'s-reporters-list','s-new-reporter','ReportersList',populateReporterSelects,'لا توجد جهات بلاغ');
makeSettingsListFns('execs',getExecs,saveExecs,'s-execs-list','s-new-exec','ExecsList',populateExecSelects,'لا يوجد رؤساء تنفيذيون');
makeSettingsListFns('transports',getTransports,saveTransports,'s-transports-list','s-new-transport','TransportsList',populateTransportSelects,'لا توجد مركبات');
makeSettingsListFns('participants',getParticipants,saveParticipants,'s-participants-list','s-new-participant','ParticipantsList',populateParticipantSelects,'لا توجد جهات مشاركة');
makeSettingsListFns('outage_types',getOutageTypes,saveOutageTypes,'s-outage-types-list','s-new-outage-type','OutageTypesList',populateOutageTypeSelects,'لا توجد أنواع انقطاع');
makeSettingsListFns('departments',getDepartments,saveDepartments,'s-depts-list','s-new-dept','DeptsList',function(){buildAreaChecks('el','updateElectricity()');buildAreaChecks('ox','updateOxygen()');
  rckPopulateAddSelect();updateElectricity();updateOxygen();},'لا توجد أقسام');
makeSettingsListFns('actions',getActions,saveActions,'s-actions-list','s-new-action','ActionsList',populateActionSelects,'لا توجد إجراءات');
makeSettingsListFns('fire_types',getFireTypes,saveFireTypes,'s-fire-types-list','s-new-fire-type','FireTypesList',populateFireTypeSelects,'لا توجد أنواع حرائق');
makeSettingsListFns('inj_types',getInjTypes,saveInjTypes,'s-inj-types-list','s-new-inj-type','InjTypesList',populateInjTypeSelects,'لا توجد أنواع إصابات');
makeSettingsListFns('cities',getCities,saveCities,'s-cities-list','s-new-city','CitiesList',populateCitySelects,'لا توجد مدن');
makeSettingsListFns('codes',getCodes,saveCodes,'s-codes-list','s-new-code','CodesList',populateCodeSelects,'لا توجد أكواد');
makeSettingsListFns('rd_ev_types',getRdEvTypes,saveRdEvTypes,'s-rd-ev-types-list','s-new-rd-ev-type','RdEvTypesList',populateRdEvTypeSelects,'لا توجد أنواع أحداث');

/* ===== أخرى — تحويل أي قائمة منسدلة إلى حقل نص ===== */
function initOtherOptions(){
  var sels=document.querySelectorAll('.form-section select, .ops-form select, .rck-form select');
  sels.forEach(function(sel){
    if(sel.dataset.otherInited)return;
    if(sel.closest('#settings-overlay'))return;
    /* تخطّ القوائم التي لها خيار __other__ وحقل «-other» خاص بها (تعمل بدالة toggle خاصة) */
    if(sel.querySelector('option[value="__other__"]') && document.getElementById(sel.id+'-other'))return;
    if(!sel.querySelector('option[value="__other__"]')){
      var opt=document.createElement('option');
      opt.value='__other__';opt.textContent='أخرى...';
      sel.appendChild(opt);
    }
    sel.dataset.otherInited='1';
    sel.addEventListener('change',function(){
      if(sel.value==='__other__') showOtherInput(sel);
    });
  });
}

function showOtherInput(sel){
  /* أنشئ خيار مخفي يحمل القيمة المكتوبة */
  var dynOpt=document.createElement('option');
  dynOpt.value='';dynOpt.dataset.dyn='1';
  sel.insertBefore(dynOpt,sel.firstChild);
  sel.value='';

  /* أخفِ القائمة */
  sel.style.display='none';

  /* حقل النص */
  var inp=document.createElement('input');
  inp.type='text';
  inp.placeholder='اكتب هنا...';
  inp.className='hx-other-input';   /* الألوان من css/09-theme.css */
  inp.style.cssText='width:100%;padding:8px 44px 8px 11px;outline:none;direction:rtl;box-sizing:border-box;display:block;';

  /* زر الرجوع */
  var wrap=document.createElement('div');
  wrap.style.cssText='position:relative;width:100%;';
  var btn=document.createElement('button');
  btn.type='button';btn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>';btn.title='العودة للقائمة';btn.setAttribute('aria-label','العودة للقائمة');
  btn.className='hx-other-back';
  btn.style.cssText='position:absolute;left:6px;top:50%;transform:translateY(-50%);';

  btn.onclick=function(){
    /* إزالة الخيار الديناميكي وإعادة القائمة */
    dynOpt.remove();
    sel.style.display='';
    sel.value='';
    wrap.remove();
    var ev=new Event('change');sel.dispatchEvent(ev);
  };

  /* تحديث الخيار الديناميكي عند الكتابة */
  inp.addEventListener('input',function(){
    dynOpt.value=inp.value;dynOpt.textContent=inp.value;
    sel.value=inp.value;
    sel.dispatchEvent(new Event('change'));
  });

  wrap.appendChild(inp);
  wrap.appendChild(btn);
  sel.parentNode.insertBefore(wrap,sel.nextSibling);
  inp.focus();
}

setTimeout(initOtherOptions,600);


