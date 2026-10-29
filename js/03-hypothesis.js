// ===== تقرير فرضية LOGIC =====
function hypGetNum(id){const el=document.getElementById(id);return el?parseInt(el.value)||0:0;}
function hypGetVal(id){const el=document.getElementById(id);return el?el.value||'':''; }
function hypSetTxt(id,v){const el=document.getElementById(id);if(el)el.textContent=v;}

function hypCalcTable(tid){
  const sels=document.querySelectorAll('#'+tid+' .hyp-eval-sel');
  let total=0,gained=0,allNA=true;
  sels.forEach(s=>{
    if(s.value==='n') return;
    allNA=false; total+=100;
    if(s.value==='c') gained+=100;
    else if(s.value==='p') gained+=80;
  });
  if(allNA||total===0) return null;
  return(gained/total)*100;
}

function hypEvalChanged(sel){
  const colors={c:'#16a34a',p:'#ca8a04',i:'#dc2626',n:'#6b7280'};
  sel.style.color=colors[sel.value]||'#16a34a';
  hypRefreshCharts();
}

function hypRefreshCharts(){
  const cards=document.querySelectorAll('#hyp-charts-row [data-table]');
  let total=0,count=0;
  cards.forEach(card=>{
    const tid=card.getAttribute('data-table');
    const score=hypCalcTable(tid);
    const circle=card.querySelector('.hyp-mini-circle');
    const pctEl=card.querySelector('.hyp-mini-pct');
    if(score===null){
      circle.setAttribute('stroke-dasharray','0,100');
      circle.style.color='#9ca3af';
      if(pctEl){pctEl.textContent='N/A';pctEl.setAttribute('fill','#9ca3af');}
    } else {
      circle.setAttribute('stroke-dasharray',score+',100');
      const col=score>=95?'#16a34a':score>=85?'#ca8a04':'#dc2626';
      circle.style.color=col;
      if(pctEl){pctEl.textContent=Math.round(score)+'%';pctEl.setAttribute('fill',col);}
      total+=score; count++;
    }
  });
  const finalPct=count>0?Math.round(total/count):null;
  const fp=document.getElementById('hyp-final-pct');
  const fc=document.getElementById('hyp-final-circle');
  if(fp){
    if(finalPct===null){
      fp.textContent='—';
      if(fc){fc.setAttribute('stroke-dasharray','0,100');fc.style.color='#9ca3af';}
    } else {
      const col=finalPct>=95?'#16a34a':finalPct>=85?'#ca8a04':'#dc2626';
      fp.textContent=finalPct+'%';
      fp.setAttribute('fill',col);
      if(fc){fc.setAttribute('stroke-dasharray',finalPct+',100');fc.style.color=col;}
    }
  }
}

function hypUpdate(){
  const hosp=hypGetVal('hyp-f-hosp');
  const type=hypGetVal('hyp-f-type');
  const dept=hypGetVal('hyp-f-dept');
  const date=hypGetVal('hyp-f-date');
  const start=hypGetVal('hyp-f-start');
  const end=hypGetVal('hyp-f-end');

  hypSetTxt('hyp-hosp-disp', hosp||'—');
  document.querySelectorAll('.hyp-hosp-disp-cls').forEach(el=>el.textContent=hosp||'—');
  hypSetTxt('hyp-type-disp', type||'—');
  hypSetTxt('hyp-date-disp', date||'—');
  hypSetTxt('hyp-d-hosp', hosp||'—');
  hypSetTxt('hyp-d-type', type||'—');
  hypSetTxt('hyp-d-dept', dept||'—');
  hypSetTxt('hyp-d-date', date||'—');
  function fmt12(t){
    if(!t) return '—';
    var parts=t.split(':');
    var h=parseInt(parts[0]),m=parts[1];
    var period=h>=12?'مساءً':'صباحاً';
    var h12=h%12||12;
    return String(h12).padStart(2,'0')+':'+m+' '+period;
  }
  hypSetTxt('hyp-d-start', fmt12(start));
  hypSetTxt('hyp-d-end', fmt12(end));

  // Patients
  const b=hypGetNum('hyp-f-black'),r=hypGetNum('hyp-f-red'),y=hypGetNum('hyp-f-yellow'),g=hypGetNum('hyp-f-green');
  const tot=b+r+y+g;
  document.getElementById('hyp-f-total').value=tot;
  hypSetTxt('hyp-d-black',b);hypSetTxt('hyp-d-red',r);hypSetTxt('hyp-d-yellow',y);hypSetTxt('hyp-d-green',g);
  hypSetTxt('hyp-d-total',tot);

  // Entities (checkboxes)
  const entChecks=document.querySelectorAll('#hyp-entities-checks input:checked');
  const entList=document.getElementById('hyp-d-entities-list');
  if(entList){
    const selected=Array.from(entChecks).map(c=>c.value);
    entList.innerHTML=selected.length
      ? selected.map(e=>'<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #F0F7FB;"><span style="color:#00AEEF;font-size:13px;">•</span><span style="font-size:12px;font-weight:600;color:#1A3A4A;">'+e+'</span></div>').join('')
      : '<span style="color:#aaa;font-size:11px;">— لم يتم الاختيار —</span>';
  }

  // Evaluators (checkboxes)
  const evChecks=document.querySelectorAll('#hyp-evaluators-checks input:checked');
  const evList=document.getElementById('hyp-d-evaluators-list');
  if(evList){
    const selected=Array.from(evChecks).map(c=>c.value);
    evList.innerHTML=selected.length
      ? selected.map(e=>'<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #F0F7FB;"><span style="color:#00AEEF;font-size:13px;">•</span><span style="font-size:12px;font-weight:600;color:#1A3A4A;">'+e+'</span></div>').join('')
      : '<span style="color:#aaa;font-size:11px;">— لم يتم الاختيار —</span>';
  }

  // Notes & Recs
  hypSetTxt('hyp-d-notes', document.getElementById('hyp-f-notes').value||'—');
  hypSetTxt('hyp-d-recs', document.getElementById('hyp-f-recs').value||'—');

  // ICS
  const icsFields = ['commander','ops','plan','safety'];
  icsFields.forEach(f=>{
    const inp = document.getElementById('hyp-f-ics-'+f);
    hypSetTxt('hyp-ics-'+f, inp&&inp.value ? inp.value : '—');
  });
}

function hypToggleTables(){
  const cont=document.getElementById('hyp-tables-container');
  const icon=document.getElementById('hyp-tables-toggle-icon');
  if(cont.style.display==='none'){cont.style.display='block';icon.textContent='▲ إخفاء';}
  else{cont.style.display='none';icon.textContent='▼ عرض';}
}

function hypReset(){
  ['hyp-f-hosp','hyp-f-type','hyp-f-dept','hyp-f-date','hyp-f-start','hyp-f-end','hyp-f-notes','hyp-f-recs'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  ['hyp-f-black','hyp-f-red','hyp-f-yellow','hyp-f-green'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value=0;
  });
  document.querySelectorAll('#hyp-entities-checks input,#hyp-evaluators-checks input').forEach(c=>c.checked=false);
  ['hyp-f-ics-commander','hyp-f-ics-ops','hyp-f-ics-plan','hyp-f-ics-safety'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.querySelectorAll('.hyp-eval-sel').forEach(s=>{s.value='c';s.style.color='#16a34a';});
  hypUpdate();hypRefreshCharts();
}

// Init
(function(){
  const now=new Date();
  const d=document.getElementById('hyp-f-date');
  if(d) d.value=now.toISOString().split('T')[0];
  hypUpdate();
  hypRefreshCharts();
})();
