/* ===== INCIDENT LOG SYSTEM ===== */
var HH_LOG_KEY = 'hh_incident_log_v1';
var _hhFilter = 'day';

var HH_PANEL_LABELS = {
  'readiness':'بطاقة الاستعداد','electricity':'انقطاع كهرباء','oxygen':'انقطاع أكسجين',
  'fire':'حريق','injuries':'إصابات متعددة','hypothesis':'تقرير الفرضية',
  'hypothesis-sudden':'فرضية مفاجئة','hazard-human':'خطر بشري','hazard-tech':'خطر تكنولوجي',
  'hazard-nature':'خطر طبيعي','hazard-hazmat':'مواد خطرة','readiness-check':'قائمة الاستعداد','ops':'مؤشر تترا'
};
var HH_PANEL_COLORS = {
  'readiness':'#00AEEF','electricity':'#F59E0B','oxygen':'#60A5FA','fire':'#EF4444',
  'injuries':'#F97316','hypothesis':'#8B5CF6','hypothesis-sudden':'#EC4899',
  'hazard-human':'#EF4444','hazard-tech':'#06B6D4','hazard-nature':'#10B981',
  'hazard-hazmat':'#84CC16','readiness-check':'#A78BFA','ops':'#14B8A6'
};

function hhGetLogs(){
  try{
    var logs = JSON.parse(localStorage.getItem(HH_LOG_KEY)||'[]');
    return Array.isArray(logs) ? logs : [];
  }catch(e){
    console.warn('[السجل] بيانات تالفة — سيُعرض سجل فارغ', e);
    return [];
  }
}
function hhSaveLogs(logs){
  try{ localStorage.setItem(HH_LOG_KEY, JSON.stringify(logs)); }
  catch(e){ alert('تعذر حفظ السجل — قد تكون مساحة التخزين ممتلئة.\nخذ نسخة احتياطية ثم احذف سجلات قديمة.'); }
}

function hhGlobalSave(){
  var active = document.querySelector('.card-panel.active');
  if(!active || active.id === 'panel-stats-log' || active.id === 'panel-home') {
    alert('افتح بطاقة الحادثة أولاً ثم اضغط حفظ');
    return;
  }
  var panelId = active.id.replace('panel-','');

  // Explicit per-panel data extraction
  function gid(id){ var el=document.getElementById(id); return el?el.value.trim():''; }
  function gta(id){ var el=document.getElementById(id); return el?el.value.trim():''; }
  var HH_EXTRACTORS = {
    'readiness':         function(){ return { hospital:gid('rd-f-hosp'),  type:gid('rd-f-hyp')||gid('rd-f-ev'), date:gid('rd-f-date') }; },
    'electricity':       function(){ return { hospital:gid('el-f-hosp'),  type:gid('el-f-outage-type'),          date:gid('el-f-date') }; },
    'oxygen':            function(){ return { hospital:gid('ox-f-hosp'),  type:gid('ox-f-outage-type'),          date:gid('ox-f-date') }; },
    'fire':              function(){ return { hospital:gid('fi-f-hosp'),  type:gid('fi-f-event-type'),           date:gid('fi-f-date') }; },
    'injuries':          function(){ return { hospital:gid('inj-f-hosp'), type:gid('inj-f-type'),               date:gid('inj-f-date') }; },
    'hypothesis':        function(){ return { hospital:gid('hyp-f-hosp'), type:gid('hyp-f-type'),               date:gid('hyp-f-date') }; },
    'hypothesis-sudden': function(){ return { hospital:gid('hyps-f-hosp'),type:gid('hyps-f-type'),              date:gid('hyps-f-date') }; },
    'hazard-human':      function(){ return { hospital:gid('hh-f-hosp'),  type:gid('hh-f-event'),               date:gid('hh-f-date') }; },
    'hazard-tech':       function(){ return { hospital:gid('ht-f-hosp'),  type:gid('ht-f-event'),               date:gid('ht-f-date') }; },
    'hazard-nature':     function(){ return { hospital:gid('hn-f-hosp'),  type:gid('hn-f-event'),               date:gid('hn-f-date') }; },
    'hazard-hazmat':     function(){ return { hospital:gid('hz-f-hosp'),  type:gid('hz-f-event'),               date:gid('hz-f-date') }; },
    'readiness-check':   function(){ return { hospital:'—', type:'—', date:new Date().toISOString().split('T')[0] }; },
    'ops':               function(){ return { hospital:'—', type:'—', date:new Date().toISOString().split('T')[0] }; }
  };
  var extractor = HH_EXTRACTORS[panelId] || function(){ return {hospital:'—',type:'—',date:new Date().toISOString().split('T')[0]}; };
  var extracted = extractor();
  var hospital = extracted.hospital || '—';
  var type     = extracted.type     || '—';
  var date     = extracted.date     || new Date().toISOString().split('T')[0];
  var notes    = '';

  var logs = hhGetLogs();
  logs.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2,5),
    ts: new Date().toISOString(),
    panel: panelId,
    label: HH_PANEL_LABELS[panelId] || panelId,
    hospital: hospital,
    type: type,
    date: date,
    notes: notes.slice(0,80),
    snap: hhSnapshotPanel(active)
  });
  hhSaveLogs(logs);

  // Feedback
  var btn = document.getElementById('hhglobal-save-btn');
  if(btn){
    var orig = btn.innerHTML;
    btn.innerHTML = '<span class="mob-bar-btn-icon">✅</span><span class="mob-bar-btn-lbl">تم</span>';
    btn.classList.add('is-saved');
    setTimeout(function(){ btn.innerHTML = orig; btn.classList.remove('is-saved'); }, 2000);
  }

  if(document.getElementById('panel-stats-log').classList.contains('active')) hhRenderStats();
}

function hhFilterLogs(logs, f){
  var now = new Date();
  if(f==='day'){
    var today = now.toISOString().split('T')[0];
    return logs.filter(function(l){ return l.ts && l.ts.startsWith(today); });
  } else if(f==='week'){
    var ago = new Date(now - 7*24*60*60*1000);
    return logs.filter(function(l){ return new Date(l.ts) >= ago; });
  } else if(f==='month'){
    var ago2 = new Date(now - 30*24*60*60*1000);
    return logs.filter(function(l){ return new Date(l.ts) >= ago2; });
  }
  return logs;
}

function hhSetFilter(f){
  _hhFilter = f;
  ['day','week','month','all'].forEach(function(x){
    var b = document.getElementById('slf-'+x);
    if(b) b.className = 'sl-filter-btn' + (x===f?' active':'');
  });
  hhRenderStats();
}

/* نسبة تأهب كل مستشفى من تقارير تحقق التأهب — قائمة أشرطة، لونها يدل على الحالة فقط */
function hhDrawRckChart(){
  var box=document.getElementById("sl-rck-chart");if(!box)return;
  var data={};
  try{data=JSON.parse(localStorage.getItem("rck_v2")||"{}");}catch(e){}
  var stats={};
  Object.keys(data).forEach(function(p){(data[p]||[]).forEach(function(r){
    if(!stats[r.name])stats[r.name]={a:0,t:0};
    (r.cells||[]).forEach(function(v){if(v==="1"){stats[r.name].a++;stats[r.name].t++;}else if(v==="0"){stats[r.name].t++;}});
  });});
  var names=Object.keys(stats).filter(function(n){return stats[n].t>0;});
  if(!names.length){box.innerHTML="<div class=\"sl-empty\">لا توجد بيانات تحقق تأهب بعد</div>";return;}
  names.sort(function(a,b){return stats[b].a/stats[b].t-stats[a].a/stats[a].t;});
  box.innerHTML=names.map(function(n){
    var pct=Math.round(stats[n].a/stats[n].t*100);
    var cls=pct>=80?"is-good":pct>=50?"is-warn":"is-bad";
    return "<div class=\"sl-hbar "+cls+"\"><span class=\"sl-hbar-name\" title=\""+escHtml(n)+"\">"+escHtml(n)+"</span>"+
           "<span class=\"sl-hbar-track\"><span style=\"width:"+pct+"%\"></span></span>"+
           "<span class=\"sl-hbar-num\">"+pct+"%</span></div>";
  }).join("");
}

function hhRenderStats(){
  var logs = hhGetLogs();
  var filtered = hhSearchLogs(hhFilterLogs(logs, _hhFilter));

  // Summary counts
  document.getElementById('sl-today').textContent  = hhFilterLogs(logs,'day').length;
  document.getElementById('sl-week').textContent   = hhFilterLogs(logs,'week').length;
  document.getElementById('sl-month').textContent  = hhFilterLogs(logs,'month').length;
  document.getElementById('sl-total').textContent  = logs.length;

  // Chart
  hhDrawChart(filtered);
  hhDrawRckChart();
  hhRenderKpis(filtered);

  // Table
  var tbody = document.getElementById('sl-tbody');
  tbody.innerHTML = '';
  if(!filtered.length){
    tbody.innerHTML = '<tr><td colspan="5" class="sl-empty">لا توجد أحداث في هذه الفترة</td></tr>';
    return;
  }
  filtered.forEach(function(l){
    var d = new Date(l.ts);
    var ds = d.toLocaleDateString('ar-SA',{day:'2-digit',month:'2-digit',year:'numeric'})
           + ' ' + d.toLocaleTimeString('ar-SA',{hour:'2-digit',minute:'2-digit'});
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td class="sl-td-date">'+ds+'</td>'+
      '<td class="sl-td-kind">'+escHtml(l.label||'—')+'</td>'+
      '<td>'+escHtml(l.hospital||'—')+'</td>'+
      '<td class="sl-td-muted">'+escHtml(l.type||'—')+'</td>'+
      '<td style="white-space:nowrap;">'+
        (l.snap ? '<button class="sl-open-btn" onclick="hhOpenLog(\'' + l.id + '\')">فتح</button> ' : '')+
        '<button class="sl-del-btn" onclick="hhDeleteLog(\'' + l.id + '\')">حذف</button></td>';
    tbody.appendChild(tr);
  });
}

function escHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function hhDeleteLog(id){
  if(!confirm('حذف هذا الحدث؟')) return;
  var logs = hhGetLogs().filter(function(l){ return l.id!==id; });
  hhSaveLogs(logs);
  hhRenderStats();
}

function hhClearLog(){
  if(!confirm('مسح كامل السجل؟ لا يمكن التراجع.')) return;
  localStorage.removeItem(HH_LOG_KEY);
  hhRenderStats();
}

function hhExportLog(){
  var logs = hhGetLogs();
  var blob = new Blob([JSON.stringify(logs, null, 2)], {type:'application/json'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'hh-log-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
}

/* الأحداث حسب نوع البطاقة — لون واحد لكل الأشرطة */
function hhDrawChart(logs){
  var box=document.getElementById("sl-chart");
  if(!box) return;
  var counts={};
  logs.forEach(function(l){ counts[l.panel]=(counts[l.panel]||0)+1; });
  var keys=Object.keys(counts).sort(function(a,b){ return counts[b]-counts[a]; });
  if(!keys.length){ box.innerHTML="<div class=\"sl-empty\">لا توجد أحداث في هذه الفترة</div>"; return; }
  var max=counts[keys[0]];
  box.innerHTML=keys.map(function(k){
    return "<div class=\"sl-hbar\"><span class=\"sl-hbar-name\">"+escHtml(HH_PANEL_LABELS[k]||k)+"</span>"+
           "<span class=\"sl-hbar-track\"><span style=\"width:"+Math.round(counts[k]/max*100)+"%\"></span></span>"+
           "<span class=\"sl-hbar-num\">"+counts[k]+"</span></div>";
  }).join("");
}

// Auto-render when panel becomes visible
var _slOrigSwitch = window.switchCard;
window.switchCard = function(card){
  if(_slOrigSwitch) _slOrigSwitch(card);
  if(card==='stats-log') setTimeout(hhRenderStats, 50);
};

window.hhGlobalSave = hhGlobalSave;
window.hhSetFilter  = hhSetFilter;
window.hhDeleteLog  = hhDeleteLog;
window.hhClearLog   = hhClearLog;
window.hhExportLog  = hhExportLog;
window.hhRenderStats= hhRenderStats;
