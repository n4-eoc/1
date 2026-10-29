/* ===== إدارة العمليات — مؤشر تحضير تترا ===== */
var OPS_COUNT=0;
var _opsPrintMode='both';

function toArabicNum(n){
  return String(n).split('').map(function(d){return'٠١٢٣٤٥٦٧٨٩'[+d]||d;}).join('');
}

function opsPopulateRows(){
  var tbody=document.getElementById('ops-tbody');
  if(!tbody)return;
  var hospitals=getHospitals();
  OPS_COUNT=hospitals.length;
  tbody.innerHTML='';
  hospitals.forEach(function(hosp,idx){
    var n=idx+1;
    var ev=n%2===0;
    var bgH=ev?' style="background:#EAF4FA;"':'';
    var bgC=ev?' style="background:#E8F4FF;"':'';
    var bg =ev?' style="background:#F2F8FC;"':'';
    var code='شفاء '+toArabicNum(n);
    var tr=document.createElement('tr');
    tr.innerHTML=
      '<td class="td-hosp"'+bgH+'>'+hosp+'</td>'+
      '<td class="td-code"'+bgC+'>'+code+'</td>'+
      '<td class="td-am"'+bg+'><span class="ops-time" id="ops-am-time-'+n+'" contenteditable="true" oninput="opsSave()"></span></td>'+
      '<td class="ops-resp ops-empty td-am" id="ops-am-resp-'+n+'" onclick="opsToggleResp(\'ops-am-resp-'+n+'\')"></td>'+
      '<td class="td-am"'+bg+'><span class="ops-note" id="ops-am-note-'+n+'" contenteditable="true" oninput="opsSave()"></span></td>'+
      '<td class="td-pm"'+bg+'><span class="ops-time" id="ops-pm-time-'+n+'" contenteditable="true" oninput="opsSave()"></span></td>'+
      '<td class="ops-resp ops-empty td-pm" id="ops-pm-resp-'+n+'" onclick="opsToggleResp(\'ops-pm-resp-'+n+'\')"></td>'+
      '<td class="td-pm"'+bg+'><span class="ops-note" id="ops-pm-note-'+n+'" contenteditable="true" oninput="opsSave()"></span></td>';
    tbody.appendChild(tr);
  });
}

function opsToggleResp(id){
  var el=document.getElementById(id);if(!el)return;
  var c=el.textContent.trim();
  var nxt=c===''?'مكتمل':c==='مكتمل'?'غير مكتمل':'';
  var per=id.indexOf('-am-')>-1?'am':'pm';
  el.textContent=nxt;
  el.className='ops-resp td-'+per+' '+(nxt==='مكتمل'?'ops-complete':nxt==='غير مكتمل'?'ops-incomplete':'ops-empty');
  opsUpdateSummary();opsSave();
}

function opsSetAll(period,val){
  for(var i=1;i<=OPS_COUNT;i++){
    var el=document.getElementById('ops-'+period+'-resp-'+i);if(!el)continue;
    el.textContent=val;
    el.className='ops-resp td-'+period+' '+(val==='مكتمل'?'ops-complete':val==='غير مكتمل'?'ops-incomplete':'ops-empty');
  }
  opsUpdateSummary();opsSave();
}

function opsFormatTime(val){
  if(!val)return'';
  var pts=val.split(':');
  var h=parseInt(pts[0]);var m=pts[1]||'00';
  var ampm=h<12?'AM':'PM';
  var hd=h%12;if(hd===0)hd=12;
  return String(hd).padStart(2,'0')+':'+m+' '+ampm;
}

function opsSetDefaultTime(period){
  var inp=document.getElementById('ops-f-'+period+'-time');
  if(!inp||!inp.value)return;
  var fmt=opsFormatTime(inp.value);
  for(var i=1;i<=OPS_COUNT;i++){
    var el=document.getElementById('ops-'+period+'-time-'+i);
    if(el)el.textContent=fmt;
  }
  opsSave();
}

function opsUpdate(){
  var AR=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  var de=document.getElementById('ops-f-date');
  var dd=document.getElementById('ops-disp-date');
  if(de&&dd){
    if(de.value){var pts=de.value.split('-');dd.textContent=parseInt(pts[2])+' '+AR[parseInt(pts[1])-1]+' '+pts[0];}
    else dd.textContent='';
  }
  var ee=document.getElementById('ops-f-exec');
  var ev='';
  if(ee){ev=ee.tagName==='SELECT'?(ee.selectedIndex>0?ee.options[ee.selectedIndex].text:''):ee.value||'';}
  ev=ev.trim();
  var de2=document.getElementById('ops-disp-exec');var fe=document.getElementById('ops-footer-exec');
  if(de2)de2.textContent=ev||'';
  if(fe)fe.textContent='مناوب العمليات: '+(ev||'—');
  opsUpdateSummary();opsSave();
}

function opsUpdateSummary(){
  var ac=0,ai=0,pc=0,pi=0;
  for(var i=1;i<=OPS_COUNT;i++){
    var at=((document.getElementById('ops-am-resp-'+i)||{}).textContent||'').trim();
    var pt=((document.getElementById('ops-pm-resp-'+i)||{}).textContent||'').trim();
    if(at==='مكتمل')ac++;else if(at==='غير مكتمل')ai++;
    if(pt==='مكتمل')pc++;else if(pt==='غير مكتمل')pi++;
  }
  function ss(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
  ss('ops-sum-am-comp',ac);ss('ops-sum-am-incomp',ai);
  ss('ops-sum-pm-comp',pc);ss('ops-sum-pm-incomp',pi);
}

function opsSave(){
  try{
    var ee=document.getElementById('ops-f-exec');
    var execVal=ee?(ee.tagName==='SELECT'?ee.value:ee.value)||'':'';
    var data={date:(document.getElementById('ops-f-date')||{}).value||'',exec:execVal,rows:{}};
    var tbody=document.getElementById('ops-tbody');
    if(tbody){
      var trs=tbody.querySelectorAll('tr');
      trs.forEach(function(tr,idx){
        var hc=tr.querySelector('.td-hosp');if(!hc)return;
        var hosp=hc.textContent.trim();var n=idx+1;
        function gt(id){var e=document.getElementById(id);return e?e.textContent.trim():'';}
        data.rows[hosp]={at:gt('ops-am-time-'+n),ar:gt('ops-am-resp-'+n),an:gt('ops-am-note-'+n),
                         pt:gt('ops-pm-time-'+n),pr:gt('ops-pm-resp-'+n),pn:gt('ops-pm-note-'+n)};
      });
    }
    localStorage.setItem('ops_tetra_v1',JSON.stringify(data));
  }catch(e){}
}

function opsLoad(){
  try{
    var raw=localStorage.getItem('ops_tetra_v1');if(!raw)return;
    var data=JSON.parse(raw);
    var de=document.getElementById('ops-f-date');if(de&&data.date)de.value=data.date;
    var ee=document.getElementById('ops-f-exec');if(ee&&data.exec)ee.value=data.exec;
    if(data.rows){
      var tbody=document.getElementById('ops-tbody');if(!tbody)return;
      tbody.querySelectorAll('tr').forEach(function(tr,idx){
        var hc=tr.querySelector('.td-hosp');if(!hc)return;
        var hosp=hc.textContent.trim();
        var r=data.rows[hosp];if(!r)return;
        var n=idx+1;
        function st(id,v){var e=document.getElementById(id);if(e)e.textContent=v||'';}
        function sr(id,v,p){
          var e=document.getElementById(id);if(!e)return;
          e.textContent=v||'';
          e.className='ops-resp td-'+p+' '+(v==='مكتمل'?'ops-complete':v==='غير مكتمل'?'ops-incomplete':'ops-empty');
        }
        st('ops-am-time-'+n,r.at);sr('ops-am-resp-'+n,r.ar,'am');st('ops-am-note-'+n,r.an);
        st('ops-pm-time-'+n,r.pt);sr('ops-pm-resp-'+n,r.pr,'pm');st('ops-pm-note-'+n,r.pn);
      });
    }
    opsUpdate();
  }catch(e){}
}

function opsClearAll(){
  for(var i=1;i<=OPS_COUNT;i++){
    var tids=['ops-am-time-','ops-am-note-','ops-pm-time-','ops-pm-note-'];
    for(var j=0;j<tids.length;j++){var e=document.getElementById(tids[j]+i);if(e)e.textContent='';}
    var rids=[['ops-am-resp-','am'],['ops-pm-resp-','pm']];
    for(var j=0;j<rids.length;j++){
      var e=document.getElementById(rids[j][0]+i);
      if(e){e.textContent='';e.className='ops-resp td-'+rids[j][1]+' ops-empty';}
    }
  }
  opsUpdateSummary();opsSave();
}

function opsPrint(mode){
  var a4=document.getElementById('ops-a4-el');
  var dp=document.getElementById('ops-disp-period');
  if(a4){a4.classList.remove('print-am','print-pm');}
  if(mode==='am'){if(a4)a4.classList.add('print-am');if(dp)dp.textContent='الفترة الصباحية';}
  else if(mode==='pm'){if(a4)a4.classList.add('print-pm');if(dp)dp.textContent='الفترة المسائية';}
  else{if(dp)dp.textContent='الفترة الصباحية والمسائية';}
  _opsPrintMode=mode;
  window.print();
  function cleanup(){
    if(a4){a4.classList.remove('print-am','print-pm');}
    if(dp)dp.textContent='الفترة الصباحية والمسائية';
    _opsPrintMode='both';
    window.removeEventListener('afterprint',cleanup);
  }
  window.addEventListener('afterprint',cleanup);
}

function opsInit(){
  opsPopulateRows();
  opsLoad();
  opsUpdateSummary();
}
