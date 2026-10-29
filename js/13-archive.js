/* ===== أرشيف الحوادث: لقطة كاملة لكل بطاقة + مؤشرات الأداء + تصدير CSV ===== */

/* بادئة معرّفات الحقول لكل بطاقة — تُستخدم لحساب المؤشرات */
var HH_PANEL_PREFIX = {
  'readiness':'rd','electricity':'el','oxygen':'ox','fire':'fi','injuries':'inj',
  'hazard-human':'hh','hazard-tech':'ht','hazard-nature':'hn','hazard-hazmat':'hz'
};

/* لقطة من قيم البطاقة النشطة (الحقول غير الفارغة فقط لتوفير المساحة) */
function hhSnapshotPanel(panel){
  var snap = {};
  panel.querySelectorAll('input[id],select[id],textarea[id]').forEach(function(el){
    if(el.type==='file' || el.readOnly || el.id.endsWith('-total')) return;
    if(el.type==='checkbox' || el.type==='radio'){ if(el.checked) snap[el.id] = true; return; }
    if(el.value!=='') snap[el.id] = el.value;
  });
  /* الأقسام المتأثرة تُنشأ ديناميكياً بدون معرّفات */
  var areas = [];
  panel.querySelectorAll('input[data-aname]:checked').forEach(function(cb){ areas.push(cb.dataset.aname); });
  if(areas.length) snap.__areas__ = areas;
  return snap;
}

/* إعادة فتح حادثة محفوظة: تعبئة البطاقة بالقيم ثم تحديث المعاينة */
function hhOpenLog(id){
  var log = hhGetLogs().filter(function(l){ return l.id===id; })[0];
  if(!log || !log.snap){ alert('هذا السجل محفوظ قبل تفعيل الأرشيف الكامل — لا توجد بيانات تفصيلية له'); return; }
  if(!confirm('سيتم استبدال محتوى بطاقة «'+(log.label||log.panel)+'» الحالي ببيانات الحادثة المحفوظة.\nهل تريد المتابعة؟')) return;
  switchCard(log.panel);
  var panel = document.getElementById('panel-'+log.panel);
  if(!panel) return;
  /* إغلاق أي خانة «أخرى...» مفتوحة وإرجاع قائمتها */
  panel.querySelectorAll('select').forEach(function(sel){
    var w = sel.nextSibling;
    if(sel.style.display==='none' && w && w.querySelector && w.querySelector('button')) w.querySelector('button').click();
  });
  /* تفريغ الحقول أولاً حتى لا تبقى قيم من حادثة أخرى */
  panel.querySelectorAll('input[id],select[id],textarea[id]').forEach(function(el){
    if(el.type==='file' || el.readOnly || el.id.endsWith('-total')) return;
    if(el.type==='checkbox' || el.type==='radio') el.checked = false; else el.value = '';
  });
  Object.keys(log.snap).forEach(function(k){
    if(k==='__areas__') return;
    var el = document.getElementById(k);
    if(!el) return;
    var v = log.snap[k];
    if(el.type==='checkbox' || el.type==='radio'){ el.checked = !!v; return; }
    /* قيمة كُتبت يدوياً عبر «أخرى...» ولا توجد في القائمة: تُضاف كخيار */
    if(el.tagName==='SELECT' && ![].some.call(el.options, function(o){ return o.value===v; })){
      var o = document.createElement('option'); o.value = v; o.textContent = v; el.appendChild(o);
    }
    el.value = v;
  });
  var areas = log.snap.__areas__ || [];
  panel.querySelectorAll('input[data-aname]').forEach(function(cb){ cb.checked = areas.indexOf(cb.dataset.aname) > -1; });
  /* إطلاق الأحداث لتحديث المعاينة والمجاميع والحقول المرتبطة */
  panel.querySelectorAll('input,select,textarea').forEach(function(el){
    if(el.type==='file') return;
    el.dispatchEvent(new Event('input', {bubbles:true}));
    el.dispatchEvent(new Event('change', {bubbles:true}));
  });
  window.scrollTo(0,0);
}

/* ── المؤشرات ── */
function hhMinutes(t){ var m = /^(\d{1,2}):(\d{2})/.exec(t||''); return m ? (+m[1])*60 + (+m[2]) : null; }
function hhDiff(a, b){ var x = hhMinutes(a), y = hhMinutes(b); return (x===null || y===null || y < x) ? null : y - x; }
function hhAvg(arr){ return arr.length ? Math.round(arr.reduce(function(s,v){ return s+v; },0) / arr.length) : null; }

function hhCalcKpis(logs){
  var k = { byHosp:{}, notify:[], duration:[], triage:{black:0,red:0,yellow:0,green:0}, withSnap:0 };
  logs.forEach(function(l){
    if(l.hospital && l.hospital!=='—') k.byHosp[l.hospital] = (k.byHosp[l.hospital]||0) + 1;
    var p = HH_PANEL_PREFIX[l.panel], s = l.snap;
    if(!p || !s) return;
    k.withSnap++;
    var start = s[p+'-f-start'] || s[p+'-f-time'];
    var end   = s[p+'-f-end'] || s[p+'-f-restore'];
    var n = hhDiff(start, s[p+'-f-notify8']); if(n!==null) k.notify.push(n);
    var d = hhDiff(start, end);               if(d!==null) k.duration.push(d);
    ['black','red','yellow','green'].forEach(function(c){ k.triage[c] += parseInt(s[p+'-f-'+c], 10) || 0; });
  });
  return k;
}

function hhRenderKpis(logs){
  var box = document.getElementById('sl-kpis');
  if(!box) return;
  var k = hhCalcKpis(logs);
  var fmt = function(v){ return v===null ? '<span class="sl-na">لا توجد أوقات كافية</span>' : v + ' د'; };
  var hosp = Object.keys(k.byHosp).sort(function(a,b){ return k.byHosp[b]-k.byHosp[a]; });
  var maxH = hosp.length ? k.byHosp[hosp[0]] : 1;
  var t = k.triage, tTotal = t.black + t.red + t.yellow + t.green;
  box.innerHTML =
    '<div class="sl-kpi-grid">'+
      '<div class="sl-kpi"><div class="sl-kpi-num">'+fmt(hhAvg(k.notify))+'</div><div class="sl-kpi-lbl">متوسط زمن الإبلاغ لصحة 8<br><small>من بداية الحدث ('+k.notify.length+' حادثة)</small></div></div>'+
      '<div class="sl-kpi"><div class="sl-kpi-num">'+fmt(hhAvg(k.duration))+'</div><div class="sl-kpi-lbl">متوسط مدة الحدث<br><small>من البداية حتى الانتهاء ('+k.duration.length+' حادثة)</small></div></div>'+
      '<div class="sl-kpi"><div class="sl-kpi-num">'+tTotal+'</div><div class="sl-kpi-lbl">إجمالي الحالات المصنّفة<br><small>'+
        '<span class="sl-tri" style="background:#111"></span>'+t.black+' · <span class="sl-tri" style="background:#EF4444"></span>'+t.red+
        ' · <span class="sl-tri" style="background:#FACC15"></span>'+t.yellow+' · <span class="sl-tri" style="background:#22C55E"></span>'+t.green+'</small></div></div>'+
    '</div>'+
    '<h3 class="sl-section-title" style="margin-top:16px;">الحوادث حسب الجهة</h3>'+
    (hosp.length ? hosp.slice(0,10).map(function(h){
      return '<div class="sl-hbar"><span class="sl-hbar-name">'+escHtml(h)+'</span>'+
             '<span class="sl-hbar-track"><span style="width:'+Math.round(k.byHosp[h]/maxH*100)+'%"></span></span>'+
             '<span class="sl-hbar-num">'+k.byHosp[h]+'</span></div>';
    }).join('') : '<div class="sl-empty" style="padding:16px;">لا توجد بيانات</div>') +
    (logs.length > k.withSnap ? '<div class="sl-kpi-note">'+(logs.length-k.withSnap)+' سجل محفوظ قبل تفعيل الأرشيف الكامل لا يدخل في حساب الأزمنة والحالات</div>' : '');
}

/* ── البحث داخل السجل ── */
var _hhSearch = '';
function hhSetSearch(v){ _hhSearch = (v||'').trim(); hhRenderStats(); }
/* توحيد صور الحروف حتى تطابق «اصابات» كلمة «إصابات»: الهمزات، التاء المربوطة، الألف المقصورة، التشكيل والتطويل */
function hhNormalizeAr(s){
  return String(s||'').toLowerCase()
    .replace(/[ً-ٰٟـ]/g,'')
    .replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي');
}
function hhSearchLogs(logs){
  if(!_hhSearch) return logs;
  var q = hhNormalizeAr(_hhSearch);
  return logs.filter(function(l){
    return hhNormalizeAr([l.label, l.hospital, l.type, l.date].join(' ')).indexOf(q) > -1 ||
           (l.snap && hhNormalizeAr(JSON.stringify(l.snap)).indexOf(q) > -1);
  });
}

/* ── تصدير CSV (يفتح في Excel بالعربية بفضل BOM) ── */
function hhExportCsv(){
  var logs = hhSearchLogs(hhFilterLogs(hhGetLogs(), _hhFilter));
  if(!logs.length){ alert('لا توجد سجلات في الفترة المحددة'); return; }
  var cols = ['تاريخ الحفظ','وقت الحفظ','نوع البطاقة','الجهة','التفاصيل','تاريخ الحدث',
              'وقت البداية','وقت الإبلاغ لصحة 8','وقت الانتهاء','زمن الإبلاغ (د)','مدة الحدث (د)',
              'سوداء','حمراء','صفراء','خضراء','ملاحظات'];
  var q = function(v){ v = v==null ? '' : String(v); return '"' + v.replace(/"/g,'""').replace(/\r?\n/g,' ') + '"'; };
  var rows = logs.map(function(l){
    var d = new Date(l.ts), p = HH_PANEL_PREFIX[l.panel], s = l.snap || {};
    var g = function(f){ return p ? (s[p+'-f-'+f] || '') : ''; };
    var start = g('start') || g('time'), end = g('end') || g('restore');
    return [d.toISOString().split('T')[0], d.toTimeString().slice(0,5), l.label, l.hospital, l.type, l.date,
            start, g('notify8'), end, hhDiff(start, g('notify8')), hhDiff(start, end),
            g('black'), g('red'), g('yellow'), g('green'), g('notes')].map(q).join(',');
  });
  var csv = '﻿' + cols.map(q).join(',') + '\r\n' + rows.join('\r\n');
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
  a.download = 'سجل-الحوادث-' + new Date().toISOString().split('T')[0] + '.csv';
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
