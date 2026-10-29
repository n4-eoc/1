/* ════ شاشة البداية ════ */
(function(){
  /* تختفي فور اكتمال التحميل بدل انتظار ثابت — أداة طوارئ لا يُنتظر فيها شيء */
  var sp=document.getElementById('app-splash');
  if(!sp)return;
  var gone=false;
  function hide(){
    if(gone)return;gone=true;
    sp.classList.add('sp-hide');
    setTimeout(function(){if(sp.parentNode)sp.parentNode.removeChild(sp);},250);
  }
  if(document.readyState==='complete')hide();else window.addEventListener('load',hide);
  setTimeout(hide,1200);   /* حد أقصى إن تأخر تحميل أي ملف */
})();

/* ════ اختصارات لوحة المفاتيح ════ */
document.addEventListener('keydown',function(e){
  var tag=(e.target.tagName||'').toLowerCase();
  var typing=tag==='input'||tag==='textarea'||tag==='select'||e.target.isContentEditable;
  if(e.key==='Escape'&&!typing){
    var hp=document.getElementById('panel-home');
    if(hp&&!hp.classList.contains('active'))switchCard('home');
  }
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){
    e.preventDefault();
    if(typeof hhGlobalSave==='function')hhGlobalSave();
  }
});

/* ════ نسخ احتياطي واستعادة ════ */
function hhBackupAll(){
  var data={};
  for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);data[k]=localStorage.getItem(k);}
  var payload={app:'hail-dashboard',version:2,exported:new Date().toISOString(),data:data};
  var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='نسخة-احتياطية-لوحة-حائل-'+new Date().toISOString().split('T')[0]+'.json';
  document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);
}
function hhRestoreAll(){document.getElementById('hh-restore-input').click();}
function hhDoRestore(input){
  var f=input.files&&input.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(){
    try{
      var p=JSON.parse(r.result);
      if(!p||p.app!=='hail-dashboard'||!p.data){alert('هذا الملف ليس نسخة احتياطية من هذه اللوحة.\nاختر الملف الذي صدّرته اللوحة باسم «نسخة-احتياطية-لوحة-حائل-…json».');input.value='';return;}
      if(!confirm('سيتم استبدال جميع البيانات الحالية بمحتوى النسخة الاحتياطية.\nهل أنت متأكد؟')){input.value='';return;}
      /* لقطة من البيانات الحالية للرجوع إليها إن فشلت الاستعادة */
      var snapshot={};
      for(var i=0;i<localStorage.length;i++){var sk=localStorage.key(i);snapshot[sk]=localStorage.getItem(sk);}
      try{
        localStorage.clear();
        Object.keys(p.data).forEach(function(k){localStorage.setItem(k,String(p.data[k]));});
      }catch(writeErr){
        localStorage.clear();
        Object.keys(snapshot).forEach(function(k){try{localStorage.setItem(k,snapshot[k]);}catch(e){}});
        throw writeErr;
      }
      alert('تمت الاستعادة بنجاح — سيُعاد تحميل اللوحة');
      location.reload();
    }catch(err){alert('تعذرت الاستعادة — الملف تالف أو أكبر من مساحة التخزين.\nلم يتغير شيء في بياناتك الحالية. جرّب نسخة احتياطية أخرى.');}
    input.value='';
  };
  r.readAsText(f);
}

/* ════ استبدال الإيموجي بأيقونات SVG (شامل + ديناميكي) ════ */
(function(){
var P={
hospital:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/>',
chart:'<path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>',
landmark:'<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="m12 2 8 5H4Z"/>',
clipboard:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
pen:'<path d="M21.17 6.81a2.82 2.82 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.63l4.35-1.32a2 2 0 0 0 .83-.5z"/>',
award:'<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
plus:'<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
radio:'<circle cx="12" cy="12" r="2"/><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>',
wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/>',
zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
trash:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/>',
printer:'<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3h12v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
map:'<path d="m20 3-6 3-6-3-6 3v15l6-3 6 3 6-3z"/><path d="M8 3v15"/><path d="M14 6v15"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
sliders:'<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/>',
user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 20h16a2 2 0 0 0 1.73-2Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
wind:'<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
bulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
megaphone:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/>',
bed:'<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
flask:'<path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>',
target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
hash:'<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="m16 3-2 18"/>'};
var EM={
'\u{1F3E5}':['hospital'],'\u{1F4CA}':['chart'],'\u{1F3DB}':['landmark'],'\u{1F4CB}':['clipboard'],
'\u2714':['check'],'\u2713':['check'],'\u2705':['check'],
'\u{1F534}':['dot','#D32F2F'],'\u{1F7E1}':['dot','#F9A825'],'\u{1F7E2}':['dot','#2E7D32'],'\u26AB':['dot','#263238'],'\u{1F7E0}':['dot','#EF6C00'],
'\u{1F4DD}':['pen'],'\u270F':['pen'],'\u{1F396}':['award'],'\u{1F550}':['clock'],'\u23F0':['clock'],
'\u2695':['plus'],'\u{1F4E1}':['radio'],'\u{1F6E0}':['wrench'],'\u{1F527}':['wrench'],
'\u{1F525}':['flame'],'\u{1F4DE}':['phone'],'\u26A1':['zap'],'\u{1F4A5}':['zap'],
'\u{1F691}':['plus'],'\u{1F4C5}':['calendar'],'\u{1F5D1}':['trash'],'\u{1F4C4}':['file'],'\u{1F5A8}':['printer'],
'\u{1F5FA}':['map'],'\u{1F305}':['sun'],'\u{1F319}':['moon'],'\u2699':['sliders'],
'\u{1F9D1}':['user'],'\u{1F464}':['user'],'\u{1F4BB}':['monitor'],'\u{1F33F}':['leaf'],
'\u2623':['alert'],'\u26A0':['alert'],'\u{1FAC1}':['wind'],'\u{1F4A8}':['wind'],
'\u{1F504}':['refresh'],'\u{1F441}':['eye'],'\u{1F4A1}':['bulb'],'\u{1F4CD}':['pin'],'\u{1F4CC}':['pin'],
'\u2717':['x'],'\u2718':['x'],'\u274C':['x'],'\u{1F6A8}':['megaphone'],'\u2709':['mail'],
'\u{1F50C}':['plug'],'\u{1F6CF}':['bed'],'\u2B07':['download'],'\u{1F6E1}':['shield'],'\u{1F52C}':['flask'],
'\u2697':['flask'],'\u2715':['x'],'\u{1F32A}':['wind'],'\u{1F3AF}':['target'],'\u{1F3E0}':['home'],
'\u{1F3E8}':['hospital'],'\u{1F454}':['user'],'\u{1F465}':['users'],'\u{1F46E}':['user'],'\u{1F4BE}':['save'],
'\u{1F4C1}':['folder'],'\u{1F4F8}':['camera'],'\u{1F514}':['bell'],'\u{1F522}':['hash'],'\u{1F91D}':['users']};
function emSvg(m){
  if(m[0]==='dot')return '<svg viewBox="0 0 24 24" fill="'+m[1]+'" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P[m[0]]+'</svg>';
}
var keys=Object.keys(EM);
var rx=new RegExp('('+keys.map(function(k){return k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|')+')\uFE0F?','gu');
var _lock=false;
function deEmoji(root){
  if(!root||root.nodeType!==1&&root.nodeType!==9)return;
  _lock=true;
  try{
    var tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      var p=n.parentElement;
      if(!p)return NodeFilter.FILTER_REJECT;
      var t=p.tagName;
      if(t==='SCRIPT'||t==='STYLE'||t==='OPTION'||t==='TEXTAREA'||t==='TITLE')return NodeFilter.FILTER_REJECT;
      rx.lastIndex=0;
      return rx.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    var nodes=[],n;
    while(n=tw.nextNode())nodes.push(n);
    nodes.forEach(function(node){
      var frag=document.createDocumentFragment();
      var txt=node.nodeValue,last=0,m2;
      rx.lastIndex=0;
      while(m2=rx.exec(txt)){
        if(m2.index>last)frag.appendChild(document.createTextNode(txt.slice(last,m2.index)));
        var span=document.createElement('span');
        span.className='em-svg';
        span.innerHTML=emSvg(EM[m2[1]]);
        frag.appendChild(span);
        last=m2.index+m2[0].length;
      }
      if(last<txt.length)frag.appendChild(document.createTextNode(txt.slice(last)));
      node.parentNode.replaceChild(frag,node);
    });
  }finally{_lock=false;}
}
var st=document.createElement('style');
st.textContent='.em-svg{display:inline-block;vertical-align:-0.13em;line-height:1;}.em-svg svg{width:1em;height:1em;display:block;}';
document.head.appendChild(st);
deEmoji(document.body);
var _pend=null;
new MutationObserver(function(recs){
  if(_lock)return;
  var targets=[];
  recs.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType===1)targets.push(n);else if(n.nodeType===3&&n.parentElement)targets.push(n.parentElement);});});
  if(!targets.length)return;
  clearTimeout(_pend);
  _pend=setTimeout(function(){targets.forEach(deEmoji);},60);
}).observe(document.body,{childList:true,subtree:true});
window.hhDeEmoji=deEmoji;
})();

/* ════ نسخ التقرير كصورة (للواتساب وغيره) ════ */
function hhCopyImage(btn){
  var active=document.querySelector(".card-panel.active");if(!active)return;
  var el=active.querySelector(".a4-page,.rck-a4,.ops-a4,.hyp-page,.hyps-page");
  if(!el){alert("افتح بطاقة أو تقريراً أولاً، ثم اضغط «نسخ كصورة».");return;}
  if(btn&&btn.disabled)return;                       /* منع التشغيل المزدوج */
  var orig=btn?btn.innerHTML:"";
  if(btn){btn.disabled=true;btn.setAttribute("aria-busy","true");btn.textContent="جارٍ تجهيز الصورة…";}
  function done(msg){
    if(!btn)return;
    btn.removeAttribute("aria-busy");btn.textContent=msg;
    if(typeof hhAnnounce==="function")hhAnnounce(msg);
    setTimeout(function(){btn.innerHTML=orig;btn.disabled=false;},2200);
  }
  function fail(){
    if(btn){btn.innerHTML=orig;btn.disabled=false;btn.removeAttribute("aria-busy");}
    alert("تعذر إنشاء الصورة من البطاقة.\nبديل: اضغط «طباعة A4» واختر «حفظ بتنسيق PDF».");
  }
  function dl(blob){
    var a=document.createElement("a");a.href=URL.createObjectURL(blob);
    a.download=(document.title||"تقرير")+".png";document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);
    done("حُفظت الصورة في التنزيلات");
  }
  function run(){
    html2canvas(el,{scale:2,useCORS:true,backgroundColor:"#ffffff"}).then(function(cv){
      cv.toBlob(function(blob){
        if(!blob){fail();return;}
        if(navigator.clipboard&&window.ClipboardItem){
          navigator.clipboard.write([new ClipboardItem({"image/png":blob})])
            .then(function(){done("تم النسخ — الصقها في واتساب");})
            .catch(function(){dl(blob);});
        }else dl(blob);
      },"image/png");
    }).catch(fail);
  }
  if(typeof html2canvas!=="undefined"){run();return;}
  /* المكتبة محفوظة مع اللوحة في js/vendor فتعمل بلا إنترنت */
  var s=document.createElement("script");
  s.src="js/vendor/html2canvas-1.4.1.min.js";
  s.onload=run;
  s.onerror=fail;
  document.head.appendChild(s);
}
