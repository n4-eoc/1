// Init all selects and form after full page load
window.addEventListener('DOMContentLoaded', function(){
  populateHospitalSelects();
  populateOfficerSelects();
  populateRecvHospSelects();
  populateReporterSelects();
  populateExecSelects();
  populateTransportSelects();
  populateParticipantSelects();
  populateOutageTypeSelects();
  populateActionSelects();
  populateFireTypeSelects();
  populateInjTypeSelects();
  populateCitySelects();
  populateCodeSelects();
  populateRdEvTypeSelects();
  buildAreaChecks('el','updateElectricity()');
  buildAreaChecks('ox','updateOxygen()');
  rckPopulateAddSelect();
  opsInit();
  const now=new Date();
  const todayStr=now.toISOString().split('T')[0];
  const timeStr=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  ['rd-f-date','el-f-date','ox-f-date','fi-f-date','inj-f-date'].forEach(id=>{const el=document.getElementById(id);if(el&&!el.value)el.value=todayStr;});
  ['rd-f-time','el-f-time','ox-f-time','fi-f-time','inj-f-time'].forEach(id=>{const el=document.getElementById(id);if(el&&!el.value)el.value=timeStr;});
  loadFormData();
  updateReadiness();updateElectricity();updateOxygen();updateFire();updateInjuries();
  hypReplaceStaticInputs();
  hypInitAllSettings();
  hazardPopulateSelects();
  // Set today's date for hazard panels
  var now2=new Date();
  var todayStr2=now2.toISOString().split('T')[0];
  var timeStr2=String(now2.getHours()).padStart(2,'0')+':'+String(now2.getMinutes()).padStart(2,'0');
  ['hh-f-date','ht-f-date','hn-f-date','hz-f-date'].forEach(function(id){var el=document.getElementById(id);if(el&&!el.value)el.value=todayStr2;});
  ['hh-f-time','ht-f-time','hn-f-time','hz-f-time'].forEach(function(id){var el=document.getElementById(id);if(el&&!el.value)el.value=timeStr2;});
  const _tb=document.querySelector('.top-bar');if(_tb)_tb.style.display='none';
  const _tn=document.querySelector('.tab-nav');if(_tn)_tn.style.display='none';
  // Force home panel on startup
  document.querySelectorAll('.card-panel').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
  var _hp=document.getElementById('panel-home');
  if(_hp){_hp.classList.add('active');_hp.style.position='fixed';_hp.style.inset='0';_hp.style.zIndex='100';_hp.style.overflow='hidden auto';}   /* أفقياً مخفي، وعمودياً يتمرر */
  var _htb=document.querySelector('.tab-btn[data-card="home"]');
  if(_htb)_htb.classList.add('active');
  // Wire up Enter key for all settings inputs
  const settingsInputMap={
    's-new-reporter':'add_reporters','s-new-exec':'add_execs','s-new-transport':'add_transports',
    's-new-participant':'add_participants','s-new-outage-type':'add_outage_types',
    's-new-dept':'add_departments','s-new-action':'add_actions','s-new-fire-type':'add_fire_types',
    's-new-inj-type':'add_inj_types','s-new-city':'add_cities','s-new-code':'add_codes','s-new-rd-ev-type':'add_rd_ev_types'
  };
  Object.entries(settingsInputMap).forEach(([id,fn])=>{
    const el=document.getElementById(id);
    if(el)el.addEventListener('keydown',function(e){if(e.key==='Enter'&&window[fn])window[fn]();});
  });
});
// ========== HYPOTHESIS SETTINGS ==========
const HYP_DEFAULTS = {
  hospitals: [
    'مستشفى الملك سلمان التخصصي','مستشفى الملك خالد','مستشفى حائل العام',
    'مستشفى الولادة والأطفال','مجمع إرادة والصحة النفسية','مستشفى أجا للرعاية المديدة',
    'مستشفى شراف للرعاية العاجلة','مستشفى موقق العام','مستشفى بقعاء العام',
    'مستشفى الغزالة العام','مستشفى الشنان العام','مستشفى الشملي العام',
    'مستشفى السليمي العام','مستشفى الحائط العام','مستشفى سميراء العام'
  ],
  depts: [
    'قسم الطوارئ','قسم العناية المركزة (ICU)','قسم العمليات (OR)',
    'قسم تنويم رجال','قسم تنويم نساء','قسم الجراحة','قسم الباطنية',
    'قسم الأطفال','قسم النساء والولادة','قسم المختبر وبنك الدم',
    'قسم الأشعة','قسم الصيدلية','قسم العيادات الخارجية','قسم الكلى',
    'قسم الأمن والسلامة','قسم الصيانة والتشغيل'
  ],
  disasters: [
    'طبيعي / الحرائق','تقني / انقطاع الكهرباء','تقني / إخفاق الغازات الطبية',
    'حريق داخلي','حريق خارجي','تسرب مواد كيميائية خطرة',
    'حادث كتلة (MCI)','سيول وفيضانات','انقطاع التيار الكهربائي العام',
    'نقص حاد في إمدادات الأكسجين','تهديد أمني / هجوم',
    'وباء / تفشي مرضي معدي','زلزال','أخرى'
  ],
  entities: [
    'مركز الأزمات فرع وزارة الصحة بحائل','المديرية العامة للدفاع المدني',
    'هيئة الهلال الأحمر السعودي','إدارة المرور','شرطة منطقة حائل',
    'أمانة منطقة حائل','إدارة التعليم بمنطقة حائل','جامعة حائل',
    'فرع وزارة الموارد البشرية','شركة الغاز والتصنيع الأهلية',
    'شركة الكهرباء السعودية','شركة المياه الوطنية','فرع وزارة التجارة'
  ],
  evaluators: [
    'عبدالعزيز محمد الشمري','عبدالعزيز عبدالمحسن الشمري','وليد حبيب الشمري',
    'بندر مصلح الرشيدي','عبدالله محمد الخلف','سعود سعد الشمري',
    'احمد صبيح العنزي','سلطان سليمان الشمري','احمد خلف الرشيدي',
    'ممدوح محمد الرشيدي','معاذ حبيب الشمري','خلف محمد الشمري',
    'نادر خلف العنزي','محمد نايف الشمري'
  ]
};

function hyp_getList(key){ try{const s=localStorage.getItem('hyp_'+key);return s?JSON.parse(s):[...HYP_DEFAULTS[key]];}catch(e){return[...HYP_DEFAULTS[key]];} }
function hyp_saveList(key,arr){ try{localStorage.setItem('hyp_'+key,JSON.stringify(arr));}catch(e){} }

function hyp_renderSettings(key){
  const list = hyp_getList(key);
  const container = document.getElementById('s-hyp-'+key+'-list');
  if(!container) return;
  container.innerHTML = list.length ? list.map((item,i)=>
    `<div class="settings-item"><span>${item}</span><button class="settings-del" onclick="hyp_del('${key}',${i})">حذف</button></div>`
  ).join('') : '<div class="settings-empty">لا توجد عناصر</div>';
  hypPopulateFormSelects(key);
}

function hyp_add(key){
  const inputMap={hospitals:'s-new-hyp-hospital',depts:'s-new-hyp-dept',disasters:'s-new-hyp-disaster',entities:'s-new-hyp-entity',evaluators:'s-new-hyp-evaluator'};
  const inp = document.getElementById(inputMap[key]);
  if(!inp||!inp.value.trim()) return;
  const list = hyp_getList(key);
  list.push(inp.value.trim());
  hyp_saveList(key, list);
  inp.value = '';
  hyp_renderSettings(key);
}

function hyp_del(key,idx){
  const list = hyp_getList(key);
  list.splice(idx,1);
  hyp_saveList(key,list);
  hyp_renderSettings(key);
}

function hyp_reset(key){
  hyp_saveList(key,[...HYP_DEFAULTS[key]]);
  hyp_renderSettings(key);
}

function hypPopulateFormSelects(key){
  const list = hyp_getList(key);
  if(key==='hospitals'){
    const sel = document.getElementById('hyp-f-hosp');
    if(!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">— اختر —</option>' + list.map(h=>`<option value="${h}">${h}</option>`).join('');
    if(cur) sel.value = cur;
    sel.onchange = function(){ document.getElementById('hyp-hosp-disp').textContent=this.value||'—'; document.querySelectorAll('.hyp-hosp-disp-cls').forEach(el=>el.textContent=this.value||'—'); hypUpdate(); };
  }
  if(key==='depts'){
    const sel = document.getElementById('hyp-f-dept');
    if(!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">— اختر —</option>' + list.map(d=>`<option value="${d}">${d}</option>`).join('');
    if(cur) sel.value = cur;
  }
  if(key==='disasters'){
    const sel = document.getElementById('hyp-f-type');
    if(!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">— اختر —</option>' + list.map(d=>`<option value="${d}">${d}</option>`).join('');
    if(cur) sel.value = cur;
  }
  if(key==='entities'){
    const checks = document.getElementById('hyp-entities-checks');
    if(!checks) return;
    const checked = Array.from(checks.querySelectorAll('input:checked')).map(c=>c.value);
    checks.innerHTML = list.map(e=>`<label class="check-item"><input type="checkbox" value="${e}" onchange="hypUpdate()" ${checked.includes(e)?'checked':''}/><label>${e}</label></label>`).join('');
  }
  if(key==='evaluators'){
    const checks = document.getElementById('hyp-evaluators-checks');
    if(!checks) return;
    const checked = Array.from(checks.querySelectorAll('input:checked')).map(c=>c.value);
    checks.innerHTML = list.map(e=>`<label class="check-item"><input type="checkbox" value="${e}" onchange="hypUpdate()" ${checked.includes(e)?'checked':''}/><label>${e}</label></label>`).join('');
  }
}

function hypInitAllSettings(){
  ['hospitals','depts','disasters','entities','evaluators'].forEach(key=>{
    hyp_renderSettings(key);
    // Enter key
    const inputMap={hospitals:'s-new-hyp-hospital',depts:'s-new-hyp-dept',disasters:'s-new-hyp-disaster',entities:'s-new-hyp-entity',evaluators:'s-new-hyp-evaluator'};
    const inp = document.getElementById(inputMap[key]);
    if(inp) inp.addEventListener('keydown',function(e){if(e.key==='Enter') hyp_add(key);});
  });
}

// Replace hyp-f-hosp with select, hyp-f-type with select, hyp-f-dept with select
function hypReplaceStaticInputs(){
  // Replace hospital input with select if not already
  const hospInp = document.getElementById('hyp-f-hosp');
  if(hospInp && hospInp.tagName==='INPUT'){
    const sel = document.createElement('select');
    sel.id='hyp-f-hosp'; sel.style.cssText=hospInp.style.cssText;
    sel.className=hospInp.className;
    hospInp.parentNode.replaceChild(sel,hospInp);
  }
  // Replace dept input with select if not already
  const deptInp = document.getElementById('hyp-f-dept');
  if(deptInp && deptInp.tagName==='INPUT'){
    const sel2=document.createElement('select');
    sel2.id='hyp-f-dept'; sel2.style.cssText=deptInp.style.cssText;
    sel2.className=deptInp.className;
    sel2.oninput=function(){hypUpdate();};
    sel2.onchange=function(){hypUpdate();};
    deptInp.parentNode.replaceChild(sel2,deptInp);
  }
  // Replace type input with select if not already
  const typeInp = document.getElementById('hyp-f-type');
  if(typeInp && typeInp.tagName==='INPUT'){
    const sel3=document.createElement('select');
    sel3.id='hyp-f-type'; sel3.style.cssText=typeInp.style.cssText;
    sel3.className=typeInp.className;
    sel3.oninput=function(){hypUpdate();};
    sel3.onchange=function(){hypUpdate();};
    typeInp.parentNode.replaceChild(sel3,typeInp);
  }
}

// ══════════════════════════════════════════
// HAZARD PANELS — Helper
// ══════════════════════════════════════════
function hazardGetVal(id){ var el=document.getElementById(id); return el?el.value||'':''; }
function hazardGetNum(id){ var el=document.getElementById(id); return el?parseInt(el.value)||0:0; }
function hazardSetTxt(id,v){ var el=document.getElementById(id); if(el) el.textContent=v||'—'; }
function hazardFmtDate(d,t){ if(!d) return '—'; var dt=new Date(d+'T00:00:00'); var s=dt.getFullYear()+'/'+String(dt.getMonth()+1).padStart(2,'0')+'/'+String(dt.getDate()).padStart(2,'0'); if(t) s+=' — '+t; return s; }

// Populate hospital/reporter/exec/action selects for hazard panels
function hazardPopulateSelects(){
  // Uses the shared populate functions — new IDs already added to each list above
  populateHospitalSelects();
  populateReporterSelects();
  populateOfficerSelects();
  populateActionSelects();
}

// ── بطاقة بشرية ──
function hhEventChange(){
  var v=hazardGetVal('hh-f-event');
  if(v==='__fire__'){ switchCard('fire'); return; }
  if(v==='__injuries__'){ switchCard('injuries'); return; }
  updateHazardHuman();
}
function updateHazardHuman(){
  var hosp=hazardGetVal('hh-f-hosp');
  var event=hazardGetVal('hh-f-event');
  var date=hazardGetVal('hh-f-date');
  var time=hazardGetVal('hh-f-time');
  var notify8=hazardGetVal('hh-f-notify8');
  var end=hazardGetVal('hh-f-end');
  var loc=hazardGetVal('hh-f-loc');
  var reporter=hazardGetVal('hh-f-reporter');
  var reporterName=hazardGetVal('hh-f-reporter-name');
  var exec=hazardGetVal('hh-f-exec');
  var action=hazardGetVal('hh-f-action');
  var notes=hazardGetVal('hh-f-notes');
  var recv1=hazardGetVal('hh-f-recv1');
  var recv2=hazardGetVal('hh-f-recv2');
  var recv3=hazardGetVal('hh-f-recv3');
  var blk=hazardGetNum('hh-f-black'), red=hazardGetNum('hh-f-red'), yel=hazardGetNum('hh-f-yellow'), grn=hazardGetNum('hh-f-green');
  var tot=blk+red+yel+grn;
  var totEl=document.getElementById('hh-f-total'); if(totEl) totEl.value=tot;
  hazardSetTxt('hh-hosp-disp', hosp);
  hazardSetTxt('hh-event-disp', event);
  hazardSetTxt('hh-date-disp', hazardFmtDate(date,time));
  hazardSetTxt('hh-location', hosp);
  hazardSetTxt('hh-event-type', event);
  hazardSetTxt('hh-location-detail', loc);
  hazardSetTxt('hh-time', time||'—');
  hazardSetTxt('hh-notify8', notify8||'—');
  hazardSetTxt('hh-end-time', end||'—');
  hazardSetTxt('hh-reporter', reporter);
  var _rn=document.getElementById('hh-reporter-name');if(_rn)_rn.textContent=reporterName||'';
  hazardSetTxt('hh-exec', exec);
  hazardSetTxt('hh-total', tot);
  hazardSetTxt('hh-black', blk);
  hazardSetTxt('hh-red', red);
  hazardSetTxt('hh-yellow', yel);
  hazardSetTxt('hh-green', grn);
  // Receiving hospitals
  var recvSec=document.getElementById('hh-recv-section');
  var hasRecv=recv1||recv2||recv3;
  if(recvSec) recvSec.className=hasRecv?'':'recv-section-empty';
  function hhSetRecv(rowId,valId,val){
    var row=document.getElementById(rowId);
    var el=document.getElementById(valId);
    if(row) row.className='recv-hosp-row'+(val?'':' empty-row');
    if(el) el.textContent=val||'';
  }
  hhSetRecv('hh-recv-hosp-1','hh-recv1',recv1);
  hhSetRecv('hh-recv-hosp-2','hh-recv2',recv2);
  hhSetRecv('hh-recv-hosp-3','hh-recv3',recv3);
  // Action row
  var actRow=document.getElementById('hh-action-row');
  if(actRow) actRow.className='info-row'+(action?'':' empty-row');
  hazardSetTxt('hh-action', action);
  var nb=document.getElementById('hh-notes-block'); if(nb) nb.style.display=notes?'block':'none';
  hazardSetTxt('hh-notes-text', notes);
}

// ── بطاقة تكنولوجية ──
function htEventChange(){
  var v=hazardGetVal('ht-f-event');
  if(v==='__electricity__'){ switchCard('electricity'); return; }
  if(v==='__oxygen__'){ switchCard('oxygen'); return; }
  updateHazardTech();
}
function updateHazardTech(){
  var hosp=hazardGetVal('ht-f-hosp');
  var event=hazardGetVal('ht-f-event');
  var date=hazardGetVal('ht-f-date');
  var time=hazardGetVal('ht-f-time');
  var notify8=hazardGetVal('ht-f-notify8');
  var end=hazardGetVal('ht-f-end');
  var affected=hazardGetVal('ht-f-affected');
  var severity=hazardGetVal('ht-f-severity');
  var reporter=hazardGetVal('ht-f-reporter');
  var reporterName=hazardGetVal('ht-f-reporter-name');
  var exec=hazardGetVal('ht-f-exec');
  var action=hazardGetVal('ht-f-action');
  var notes=hazardGetVal('ht-f-notes');
  hazardSetTxt('ht-hosp-disp', hosp);
  hazardSetTxt('ht-event-disp', event);
  hazardSetTxt('ht-date-disp', hazardFmtDate(date,time));
  hazardSetTxt('ht-location', hosp);
  hazardSetTxt('ht-event-type', event);
  hazardSetTxt('ht-affected', affected);
  hazardSetTxt('ht-time', time||'—');
  hazardSetTxt('ht-notify8', notify8||'—');
  hazardSetTxt('ht-end-time', end||'—');
  hazardSetTxt('ht-severity', severity);
  hazardSetTxt('ht-reporter', reporter);
  var _rn=document.getElementById('ht-reporter-name');if(_rn)_rn.textContent=reporterName||'';
  hazardSetTxt('ht-exec', exec);
  hazardSetTxt('ht-action', action);
  var nb=document.getElementById('ht-notes-block'); if(nb) nb.style.display=notes?'block':'none';
  hazardSetTxt('ht-notes-text', notes);
}

// ── بطاقة طبيعية ──
function hnEventChange(){
  var v=hazardGetVal('hn-f-event');
  if(v==='__fire__'){ switchCard('fire'); return; }
  updateHazardNature();
}
function updateHazardNature(){
  var hosp=hazardGetVal('hn-f-hosp');
  var event=hazardGetVal('hn-f-event');
  var date=hazardGetVal('hn-f-date');
  var time=hazardGetVal('hn-f-time');
  var notify8=hazardGetVal('hn-f-notify8');
  var end=hazardGetVal('hn-f-end');
  var area=hazardGetVal('hn-f-area');
  var reporter=hazardGetVal('hn-f-reporter');
  var reporterName=hazardGetVal('hn-f-reporter-name');
  var exec=hazardGetVal('hn-f-exec');
  var action=hazardGetVal('hn-f-action');
  var notes=hazardGetVal('hn-f-notes');
  var recv1=hazardGetVal('hn-f-recv1');
  var recv2=hazardGetVal('hn-f-recv2');
  var recv3=hazardGetVal('hn-f-recv3');
  var blk=hazardGetNum('hn-f-black'), red=hazardGetNum('hn-f-red'), yel=hazardGetNum('hn-f-yellow'), grn=hazardGetNum('hn-f-green');
  var tot=blk+red+yel+grn;
  var totEl=document.getElementById('hn-f-total'); if(totEl) totEl.value=tot;
  hazardSetTxt('hn-hosp-disp', hosp);
  hazardSetTxt('hn-event-disp', event);
  hazardSetTxt('hn-date-disp', hazardFmtDate(date,time));
  hazardSetTxt('hn-location', hosp);
  hazardSetTxt('hn-event-type', event);
  hazardSetTxt('hn-area', area);
  hazardSetTxt('hn-time', time||'—');
  hazardSetTxt('hn-notify8', notify8||'—');
  hazardSetTxt('hn-end-time', end||'—');
  hazardSetTxt('hn-reporter', reporter);
  var _rn=document.getElementById('hn-reporter-name');if(_rn)_rn.textContent=reporterName||'';
  hazardSetTxt('hn-exec', exec);
  hazardSetTxt('hn-action', action);
  hazardSetTxt('hn-total', tot);
  hazardSetTxt('hn-black', blk);
  hazardSetTxt('hn-red', red);
  hazardSetTxt('hn-yellow', yel);
  hazardSetTxt('hn-green', grn);
    // Recv hospitals
  function _setRecv(rowId,valId,val){var row=document.getElementById(rowId);var el=document.getElementById(valId);if(row)row.className='recv-hosp-row'+(val?'':' empty-row');if(el)el.textContent=val||'';}
  _setRecv('hn-recv-hosp-1','hn-recv1',recv1);
  _setRecv('hn-recv-hosp-2','hn-recv2',recv2);
  _setRecv('hn-recv-hosp-3','hn-recv3',recv3);
  var nb=document.getElementById('hn-notes-block'); if(nb) nb.style.display=notes?'block':'none';
  hazardSetTxt('hn-notes-text', notes);
}

// ── بطاقة مواد خطرة ──
function updateHazardHazmat(){
  var hosp=hazardGetVal('hz-f-hosp');
  var event=hazardGetVal('hz-f-event');
  var material=hazardGetVal('hz-f-material');
  var date=hazardGetVal('hz-f-date');
  var time=hazardGetVal('hz-f-time');
  var notify8=hazardGetVal('hz-f-notify8');
  var end=hazardGetVal('hz-f-end');
  var area=hazardGetVal('hz-f-area');
  var reporter=hazardGetVal('hz-f-reporter');
  var reporterName=hazardGetVal('hz-f-reporter-name');
  var exec=hazardGetVal('hz-f-exec');
  var action=hazardGetVal('hz-f-action');
  var notes=hazardGetVal('hz-f-notes');
  var recv1=hazardGetVal('hz-f-recv1');
  var recv2=hazardGetVal('hz-f-recv2');
  var recv3=hazardGetVal('hz-f-recv3');
  var blk=hazardGetNum('hz-f-black'), red=hazardGetNum('hz-f-red'), yel=hazardGetNum('hz-f-yellow'), grn=hazardGetNum('hz-f-green');
  var tot=blk+red+yel+grn;
  var totEl=document.getElementById('hz-f-total'); if(totEl) totEl.value=tot;
  hazardSetTxt('hz-hosp-disp', hosp);
  hazardSetTxt('hz-event-disp', event);
  hazardSetTxt('hz-date-disp', hazardFmtDate(date,time));
  hazardSetTxt('hz-location', hosp);
  hazardSetTxt('hz-event-type', event);
  hazardSetTxt('hz-material', material);
  hazardSetTxt('hz-area', area);
  hazardSetTxt('hz-time', time||'—');
  hazardSetTxt('hz-notify8', notify8||'—');
  hazardSetTxt('hz-end-time', end||'—');
  hazardSetTxt('hz-reporter', reporter);
  var _rn=document.getElementById('hz-reporter-name');if(_rn)_rn.textContent=reporterName||'';
  hazardSetTxt('hz-exec', exec);
  hazardSetTxt('hz-action', action);
  hazardSetTxt('hz-total', tot);
  hazardSetTxt('hz-black', blk);
  hazardSetTxt('hz-red', red);
  hazardSetTxt('hz-yellow', yel);
  hazardSetTxt('hz-green', grn);
    // Recv hospitals
  function _setRecv(rowId,valId,val){var row=document.getElementById(rowId);var el=document.getElementById(valId);if(row)row.className='recv-hosp-row'+(val?'':' empty-row');if(el)el.textContent=val||'';}
  _setRecv('hz-recv-hosp-1','hz-recv1',recv1);
  _setRecv('hz-recv-hosp-2','hz-recv2',recv2);
  _setRecv('hz-recv-hosp-3','hz-recv3',recv3);
  var nb=document.getElementById('hz-notes-block'); if(nb) nb.style.display=notes?'block':'none';
  hazardSetTxt('hz-notes-text', notes);
}

function hazardGetVal(id){ var el=document.getElementById(id); return el?el.value||'':''; }
function hazardGetNum(id){ var el=document.getElementById(id); return el?parseInt(el.value)||0:0; }
function hazardSetTxt(id,v){ var el=document.getElementById(id); if(el) el.textContent=v||'—'; }
function hazardFmtDate(d,t){ if(!d) return '—'; var dt=new Date(d+'T00:00:00'); var s=dt.getFullYear()+'/'+String(dt.getMonth()+1).padStart(2,'0')+'/'+String(dt.getDate()).padStart(2,'0'); if(t) s+=' — '+t; return s; }

// Populate hospital/reporter/exec/action selects for hazard panels
function hazardPopulateSelects(){
  // Uses the shared populate functions — new IDs already added to each list above
  populateHospitalSelects();
  populateReporterSelects();
  populateOfficerSelects();
  populateActionSelects();
}

// ── بطاقة بشرية ──
function hhEventChange(){
  var v=hazardGetVal('hh-f-event');
  if(v==='__fire__'){ switchCard('fire'); return; }
  if(v==='__injuries__'){ switchCard('injuries'); return; }
  updateHazardHuman();
}
function updateHazardHuman(){
  var hosp=hazardGetVal('hh-f-hosp');
  var event=hazardGetVal('hh-f-event');
  var date=hazardGetVal('hh-f-date');
  var time=hazardGetVal('hh-f-time');
  var notify8=hazardGetVal('hh-f-notify8');
  var end=hazardGetVal('hh-f-end');
  var loc=hazardGetVal('hh-f-loc');
  var reporter=hazardGetVal('hh-f-reporter');
  var exec=hazardGetVal('hh-f-exec');
  var action=hazardGetVal('hh-f-action');
  var notes=hazardGetVal('hh-f-notes');
  var recv1=hazardGetVal('hh-f-recv1');
  var recv2=hazardGetVal('hh-f-recv2');
  var recv3=hazardGetVal('hh-f-recv3');
  var blk=hazardGetNum('hh-f-black'), red=hazardGetNum('hh-f-red'), yel=hazardGetNum('hh-f-yellow'), grn=hazardGetNum('hh-f-green');
  var tot=blk+red+yel+grn;
  var totEl=document.getElementById('hh-f-total'); if(totEl) totEl.value=tot;
  hazardSetTxt('hh-hosp-disp', hosp);
  hazardSetTxt('hh-event-disp', event);
  hazardSetTxt('hh-date-disp', hazardFmtDate(date,time));
  hazardSetTxt('hh-location', hosp);
  hazardSetTxt('hh-event-type', event);
  hazardSetTxt('hh-location-detail', loc);
  hazardSetTxt('hh-time', time||'—');
  hazardSetTxt('hh-notify8', notify8||'—');
  hazardSetTxt('hh-end-time', end||'—');
  hazardSetTxt('hh-reporter', reporter);
  hazardSetTxt('hh-exec', exec);
  hazardSetTxt('hh-total', tot);
  hazardSetTxt('hh-black', blk);
  hazardSetTxt('hh-red', red);
  hazardSetTxt('hh-yellow', yel);
  hazardSetTxt('hh-green', grn);
  // Receiving hospitals
  var recvSec=document.getElementById('hh-recv-section');
  var hasRecv=recv1||recv2||recv3;
  if(recvSec) recvSec.className=hasRecv?'':'recv-section-empty';
  function hhSetRecv(rowId,valId,val){
    var row=document.getElementById(rowId);
    var el=document.getElementById(valId);
    if(row) row.className='recv-hosp-row'+(val?'':' empty-row');
    if(el) el.textContent=val||'';
  }
  hhSetRecv('hh-recv-hosp-1','hh-recv1',recv1);
  hhSetRecv('hh-recv-hosp-2','hh-recv2',recv2);
  hhSetRecv('hh-recv-hosp-3','hh-recv3',recv3);
  // Action row
  var actRow=document.getElementById('hh-action-row');
  if(actRow) actRow.className='info-row'+(action?'':' empty-row');
  hazardSetTxt('hh-action', action);
  var nb=document.getElementById('hh-notes-block'); if(nb) nb.style.display=notes?'block':'none';
  hazardSetTxt('hh-notes-text', notes);
}

// ── بطاقة تكنولوجية ──
function htEventChange(){
  var v=hazardGetVal('ht-f-event');
  if(v==='__electricity__'){ switchCard('electricity'); return; }
  if(v==='__oxygen__'){ switchCard('oxygen'); return; }
  updateHazardTech();
}
function updateHazardTech(){
  var hosp=hazardGetVal('ht-f-hosp');
  var event=hazardGetVal('ht-f-event');
  var date=hazardGetVal('ht-f-date');
  var time=hazardGetVal('ht-f-time');
  var notify8=hazardGetVal('ht-f-notify8');
  var end=hazardGetVal('ht-f-end');
  var affected=hazardGetVal('ht-f-affected');
  var severity=hazardGetVal('ht-f-severity');
  var reporter=hazardGetVal('ht-f-reporter');
  var exec=hazardGetVal('ht-f-exec');
  var action=hazardGetVal('ht-f-action');
  var notes=hazardGetVal('ht-f-notes');
  hazardSetTxt('ht-hosp-disp', hosp);
  hazardSetTxt('ht-event-disp', event);
  hazardSetTxt('ht-date-disp', hazardFmtDate(date,time));
  hazardSetTxt('ht-location', hosp);
  hazardSetTxt('ht-event-type', event);
  hazardSetTxt('ht-affected', affected);
  hazardSetTxt('ht-time', time||'—');
  hazardSetTxt('ht-notify8', notify8||'—');
  hazardSetTxt('ht-end-time', end||'—');
  hazardSetTxt('ht-severity', severity);
  hazardSetTxt('ht-reporter', reporter);
  hazardSetTxt('ht-exec', exec);
  hazardSetTxt('ht-action', action);
  var nb=document.getElementById('ht-notes-block'); if(nb) nb.style.display=notes?'block':'none';
  hazardSetTxt('ht-notes-text', notes);
}

// ── بطاقة طبيعية ──
function hnEventChange(){
  var v=hazardGetVal('hn-f-event');
  if(v==='__fire__'){ switchCard('fire'); return; }
  updateHazardNature();
}
function updateHazardNature(){
  var hosp=hazardGetVal('hn-f-hosp');
  var event=hazardGetVal('hn-f-event');
  var date=hazardGetVal('hn-f-date');
  var time=hazardGetVal('hn-f-time');
  var notify8=hazardGetVal('hn-f-notify8');
  var end=hazardGetVal('hn-f-end');
  var area=hazardGetVal('hn-f-area');
  var reporter=hazardGetVal('hn-f-reporter');
  var exec=hazardGetVal('hn-f-exec');
  var action=hazardGetVal('hn-f-action');
  var notes=hazardGetVal('hn-f-notes');
  var blk=hazardGetNum('hn-f-black'), red=hazardGetNum('hn-f-red'), yel=hazardGetNum('hn-f-yellow'), grn=hazardGetNum('hn-f-green');
  var tot=blk+red+yel+grn;
  var totEl=document.getElementById('hn-f-total'); if(totEl) totEl.value=tot;
  hazardSetTxt('hn-hosp-disp', hosp);
  hazardSetTxt('hn-event-disp', event);
  hazardSetTxt('hn-date-disp', hazardFmtDate(date,time));
  hazardSetTxt('hn-location', hosp);
  hazardSetTxt('hn-event-type', event);
  hazardSetTxt('hn-area', area);
  hazardSetTxt('hn-time', time||'—');
  hazardSetTxt('hn-notify8', notify8||'—');
  hazardSetTxt('hn-end-time', end||'—');
  hazardSetTxt('hn-reporter', reporter);
  hazardSetTxt('hn-exec', exec);
  hazardSetTxt('hn-action', action);
  hazardSetTxt('hn-total', tot);
  hazardSetTxt('hn-black', blk);
  hazardSetTxt('hn-red', red);
  hazardSetTxt('hn-yellow', yel);
  hazardSetTxt('hn-green', grn);
  var nb=document.getElementById('hn-notes-block'); if(nb) nb.style.display=notes?'block':'none';
  hazardSetTxt('hn-notes-text', notes);
}

// ── بطاقة مواد خطرة ──
function updateHazardHazmat(){
  var hosp=hazardGetVal('hz-f-hosp');
  var event=hazardGetVal('hz-f-event');
  var material=hazardGetVal('hz-f-material');
  var date=hazardGetVal('hz-f-date');
  var time=hazardGetVal('hz-f-time');
  var notify8=hazardGetVal('hz-f-notify8');
  var end=hazardGetVal('hz-f-end');
  var area=hazardGetVal('hz-f-area');
  var reporter=hazardGetVal('hz-f-reporter');
  var exec=hazardGetVal('hz-f-exec');
  var action=hazardGetVal('hz-f-action');
  var notes=hazardGetVal('hz-f-notes');
  var blk=hazardGetNum('hz-f-black'), red=hazardGetNum('hz-f-red'), yel=hazardGetNum('hz-f-yellow'), grn=hazardGetNum('hz-f-green');
  var tot=blk+red+yel+grn;
  var totEl=document.getElementById('hz-f-total'); if(totEl) totEl.value=tot;
  hazardSetTxt('hz-hosp-disp', hosp);
  hazardSetTxt('hz-event-disp', event);
  hazardSetTxt('hz-date-disp', hazardFmtDate(date,time));
  hazardSetTxt('hz-location', hosp);
  hazardSetTxt('hz-event-type', event);
  hazardSetTxt('hz-material', material);
  hazardSetTxt('hz-area', area);
  hazardSetTxt('hz-time', time||'—');
  hazardSetTxt('hz-notify8', notify8||'—');
  hazardSetTxt('hz-end-time', end||'—');
  hazardSetTxt('hz-reporter', reporter);
  hazardSetTxt('hz-exec', exec);
  hazardSetTxt('hz-action', action);
  hazardSetTxt('hz-total', tot);
  hazardSetTxt('hz-black', blk);
  hazardSetTxt('hz-red', red);
  hazardSetTxt('hz-yellow', yel);
  hazardSetTxt('hz-green', grn);
  var nb=document.getElementById('hz-notes-block'); if(nb) nb.style.display=notes?'block':'none';
  hazardSetTxt('hz-notes-text', notes);
}


var rckData = {};
function rckSave(){
  try{localStorage.setItem('rck_v2',JSON.stringify(rckData));}catch(e){}
  var d=document.getElementById('rck-f-date');if(d)try{localStorage.setItem('rck_date_v2',d.value);}catch(e){}
  var p=document.getElementById('rck-f-period');if(p)try{localStorage.setItem('rck_period_v2',p.value);}catch(e){}
}
function rckLoad(){
  try{var s=localStorage.getItem('rck_v2');if(s)rckData=JSON.parse(s);}catch(e){}
  try{var d=localStorage.getItem('rck_date_v2');var el=document.getElementById('rck-f-date');if(d&&el)el.value=d;}catch(e){}
  try{var pv=localStorage.getItem('rck_period_v2');var ps=document.getElementById('rck-f-period');if(pv&&ps)ps.value=pv;}catch(e){}
}
function rckCurrentPeriod(){var s=document.getElementById('rck-f-period');return s?s.value:'';}
function rckGetRows(){var p=rckCurrentPeriod();if(!p)return[];if(!rckData[p])rckData[p]=[];return rckData[p];}
function rckCalcInd(cells){
  var avail=0,total=0;
  cells.forEach(function(v){if(v==='1'){avail++;total++;}else if(v==='0'){total++;}});
  if(total===0)return{label:'—',cls:'rck-ind'};
  var pct=Math.round(avail/total*100);
  var cls=pct===100?'rck-ind rck-ind-100':pct>=75?'rck-ind rck-ind-hi':pct>=50?'rck-ind rck-ind-mid':'rck-ind rck-ind-low';
  return{label:pct+'%',cls:cls};
}

var RCK_HOSPITALS = [
  'مستشفى الملك سلمان التخصصي',
  'مستشفى الملك خالد',
  'مستشفى حائل العام',
  'مستشفى الولادة والأطفال',
  'مجمع إرادة والصحة النفسية',
  'مستشفى أجا للرعاية المديدة',
  'مستشفى شراف للرعاية العاجلة',
  'مستشفى موقق العام',
  'مستشفى بقعاء العام',
  'مستشفى الغزالة العام',
  'مستشفى الشنان العام',
  'مستشفى الشملي العام',
  'مستشفى السليمي العام',
  'مستشفى الحائط العام',
  'مستشفى سميراء العام'
];

function rckRender(){
  var tbody=document.getElementById('rck-tbody');if(!tbody)return;
  var rows=rckGetRows();var period=rckCurrentPeriod();
  if(rows.length===0){
    var msg=period?'لا توجد مستشفيات — أضف من النموذج أدناه':'اختر الفترة أولاً من القائمة';
    tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:20px;color:#9E9E9E;font-size:12px;">'+msg+'</td></tr>';
    var z=document.getElementById('rck-cnt-avail');if(z)z.textContent='0';
    var z2=document.getElementById('rck-cnt-unavail');if(z2)z2.textContent='0';
    var z3=document.getElementById('rck-cnt-empty');if(z3)z3.textContent='0';
    var z4=document.getElementById('rck-overall');if(z4)z4.textContent='—';
    rckPopulateAddSelect();return;
  }
  var avail=0,unavail=0,empty=0;
  var html='';
  rows.forEach(function(row,ri){
    html+='<tr>';
    html+='<td class="td-hosp">'+row.name+'</td>';
    var cells=row.cells||['','','','','',''];
    cells.forEach(function(v,ci){
      var cls=v==='1'?'rck-avail':v==='0'?'rck-unavail':'rck-empty';
      var lbl=v==='1'?'✓':v==='0'?'✗':'—';
      if(v==='1')avail++;else if(v==='0')unavail++;else empty++;
      html+='<td class="'+cls+'" onclick="rckToggleCell('+ri+','+ci+')" style="cursor:pointer;min-width:38px;">'+lbl+'</td>';
    });
    var ind=rckCalcInd(cells);
    html+='<td><span class="'+ind.cls+'">'+ind.label+'</span></td>';
    html+='</tr>';
  });
  tbody.innerHTML=html;
  var el1=document.getElementById('rck-cnt-avail');if(el1)el1.textContent=avail;
  var el2=document.getElementById('rck-cnt-unavail');if(el2)el2.textContent=unavail;
  var el3=document.getElementById('rck-cnt-empty');if(el3)el3.textContent=empty;
  var allCells=[];rows.forEach(function(r){allCells=allCells.concat(r.cells||[]);});
  var ov=rckCalcInd(allCells);
  var el4=document.getElementById('rck-overall');if(el4)el4.textContent=ov.label;
  rckPopulateAddSelect();
}

function rckToggleCell(ri,ci){
  var period=rckCurrentPeriod();if(!period)return;
  var rows=rckGetRows();if(!rows[ri])return;
  if(!rows[ri].cells)rows[ri].cells=['','','','','',''];
  var v=rows[ri].cells[ci];
  rows[ri].cells[ci]=v==='1'?'0':v==='0'?'':'1';
  rckData[period]=rows;
  rckSave();rckRender();
}

function rckPopulateAddSelect(){
  var sel=document.getElementById('rck-f-addhosp');if(!sel)return;
  var rows=rckGetRows();
  var used={};rows.forEach(function(r){used[r.name]=1;});
  var prev=sel.value;
  sel.innerHTML='<option value="">— اختر —</option>';
  RCK_HOSPITALS.forEach(function(h){
    if(!used[h]){
      var opt=document.createElement('option');
      opt.value=h;opt.textContent=h;
      sel.appendChild(opt);
    }
  });
  if(prev&&sel.querySelector('option[value="'+prev+'"]'))sel.value=prev;
}

function rckAddRow(){
  var period=rckCurrentPeriod();
  if(!period){alert('اختر الفترة أولاً');return;}
  var sel=document.getElementById('rck-f-addhosp');
  var name=sel?sel.value:'';
  if(!name){alert('اختر مستشفى');return;}
  var rows=rckGetRows();
  if(rows.find(function(r){return r.name===name;})){alert('المستشفى موجود مسبقاً');return;}
  rows.push({name:name,cells:['','','','','','']});
  rckData[period]=rows;rckSave();rckRender();
}

function rckAddAll(){
  var period=rckCurrentPeriod();
  if(!period){alert('اختر الفترة أولاً');return;}
  var rows=rckGetRows();
  var used={};rows.forEach(function(r){used[r.name]=1;});
  RCK_HOSPITALS.forEach(function(h){
    if(!used[h])rows.push({name:h,cells:['','','','','','']});
  });
  rckData[period]=rows;rckSave();rckRender();
}

function rckCheckAll(){
  var period=rckCurrentPeriod();if(!period)return;
  var rows=rckGetRows();
  rows.forEach(function(r){r.cells=['1','1','1','1','1','1'];});
  rckData[period]=rows;rckSave();rckRender();
}

function rckUncheckAll(){
  var period=rckCurrentPeriod();if(!period)return;
  var rows=rckGetRows();
  rows.forEach(function(r){r.cells=['0','0','0','0','0','0'];});
  rckData[period]=rows;rckSave();rckRender();
}

function rckClear(){
  if(!confirm('مسح كل المستشفيات من هذه الفترة؟'))return;
  var period=rckCurrentPeriod();if(!period)return;
  rckData[period]=[];rckSave();rckRender();
}

function rckUpdate(){
  var period=rckCurrentPeriod();
  var date=document.getElementById('rck-f-date');
  var dateVal=date?date.value:'';
  var dp=document.getElementById('rck-disp-period');if(dp)dp.textContent=period||'—';
  var dd=document.getElementById('rck-disp-date');
  if(dd&&dateVal){
    var d=new Date(dateVal);
    var dayName=d.toLocaleDateString('ar-SA',{weekday:'long'});
    dd.textContent=dayName+' '+d.toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'});
  }
  rckSave();rckRender();
}


