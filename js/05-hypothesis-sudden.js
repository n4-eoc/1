// ===== تقرير فرضية LOGIC =====
function hypsGetNum(id){const el=document.getElementById(id);return el?parseInt(el.value)||0:0;}
function hypsGetVal(id){const el=document.getElementById(id);return el?el.value||'':''; }
function hypsSetTxt(id,v){const el=document.getElementById(id);if(el)el.textContent=v;}

function hypsCalcTable(tid){
  const sels=document.querySelectorAll('#'+tid+' .hyps-eval-sel');
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

function hypsEvalChanged(sel){
  const colors={c:'#16a34a',p:'#ca8a04',i:'#dc2626',n:'#6b7280'};
  sel.style.color=colors[sel.value]||'#16a34a';
  hypsRefreshCharts();
}

function hypsRefreshCharts(){
  const cards=document.querySelectorAll('#hyps-charts-row [data-table]');
  let total=0,count=0;
  cards.forEach(card=>{
    const tid=card.getAttribute('data-table');
    const score=hypsCalcTable(tid);
    const circle=card.querySelector('.hyps-mini-circle');
    const pctEl=card.querySelector('.hyps-mini-pct');
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
  const fp=document.getElementById('hyps-final-pct');
  const fc=document.getElementById('hyps-final-circle');
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

function hypsUpdate(){
  const hosp=hypsGetVal('hyps-f-hosp');
  const type=hypsGetVal('hyps-f-type');
  const dept=hypsGetVal('hyps-f-dept');
  const date=hypsGetVal('hyps-f-date');
  const start=hypsGetVal('hyps-f-start');
  const end=hypsGetVal('hyps-f-end');

  hypsSetTxt('hyps-hosp-disp', hosp||'—');
  document.querySelectorAll('.hyps-hosp-disp-cls').forEach(el=>el.textContent=hosp||'—');
  hypsSetTxt('hyps-type-disp', type||'—');
  hypsSetTxt('hyps-date-disp', date||'—');
  hypsSetTxt('hyps-d-hosp', hosp||'—');
  hypsSetTxt('hyps-d-type', type||'—');
  hypsSetTxt('hyps-d-dept', dept||'—');
  hypsSetTxt('hyps-d-date', date||'—');
  function fmt12(t){
    if(!t) return '—';
    var parts=t.split(':');
    var h=parseInt(parts[0]),m=parts[1];
    var period=h>=12?'مساءً':'صباحاً';
    var h12=h%12||12;
    return String(h12).padStart(2,'0')+':'+m+' '+period;
  }
  hypsSetTxt('hyps-d-start', fmt12(start));
  hypsSetTxt('hyps-d-end', fmt12(end));

  // Patients
  const b=hypsGetNum('hyps-f-black'),r=hypsGetNum('hyps-f-red'),y=hypsGetNum('hyps-f-yellow'),g=hypsGetNum('hyps-f-green');
  const tot=b+r+y+g;
  document.getElementById('hyps-f-total').value=tot;
  hypsSetTxt('hyps-d-black',b);hypsSetTxt('hyps-d-red',r);hypsSetTxt('hyps-d-yellow',y);hypsSetTxt('hyps-d-green',g);
  hypsSetTxt('hyps-d-total',tot);

  // Entities (checkboxes)
  const entChecks=document.querySelectorAll('#hyps-entities-checks input:checked');
  const entList=document.getElementById('hyps-d-entities-list');
  if(entList){
    const selected=Array.from(entChecks).map(c=>c.value);
    entList.innerHTML=selected.length
      ? selected.map(e=>'<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #F0F7FB;"><span style="color:#00AEEF;font-size:13px;">•</span><span style="font-size:12px;font-weight:600;color:#1A3A4A;">'+e+'</span></div>').join('')
      : '<span style="color:#aaa;font-size:11px;">— لم يتم الاختيار —</span>';
  }

  // Evaluators (checkboxes)
  const evChecks=document.querySelectorAll('#hyps-evaluators-checks input:checked');
  const evList=document.getElementById('hyps-d-evaluators-list');
  if(evList){
    const selected=Array.from(evChecks).map(c=>c.value);
    evList.innerHTML=selected.length
      ? selected.map(e=>'<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #F0F7FB;"><span style="color:#00AEEF;font-size:13px;">•</span><span style="font-size:12px;font-weight:600;color:#1A3A4A;">'+e+'</span></div>').join('')
      : '<span style="color:#aaa;font-size:11px;">— لم يتم الاختيار —</span>';
  }

  // Notes & Recs
  hypsSetTxt('hyps-d-notes', document.getElementById('hyps-f-notes').value||'—');
  hypsSetTxt('hyps-d-recs', document.getElementById('hyps-f-recs').value||'—');

  // ICS
  const icsFields = ['commander','ops','plan','safety'];
  icsFields.forEach(f=>{
    const inp = document.getElementById('hyps-f-ics-'+f);
    hypsSetTxt('hyps-ics-'+f, inp&&inp.value ? inp.value : '—');
  });
}

function hypsToggleTables(){
  const cont=document.getElementById('hyps-tables-container');
  const icon=document.getElementById('hyps-tables-toggle-icon');
  if(cont.style.display==='none'){cont.style.display='block';icon.textContent='▲ إخفاء';}
  else{cont.style.display='none';icon.textContent='▼ عرض';}
}

function hypsReset(){
  ['hyps-f-hosp','hyps-f-type','hyps-f-dept','hyps-f-date','hyps-f-start','hyps-f-end','hyps-f-notes','hyps-f-recs'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  ['hyps-f-black','hyps-f-red','hyps-f-yellow','hyps-f-green'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value=0;
  });
  document.querySelectorAll('#hyps-entities-checks input,#hyps-evaluators-checks input').forEach(c=>c.checked=false);
  ['hyps-f-ics-commander','hyps-f-ics-ops','hyps-f-ics-plan','hyps-f-ics-safety'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.querySelectorAll('.hyps-eval-sel').forEach(s=>{s.value='c';s.style.color='#16a34a';});
  if(typeof hypsClearPhotos==='function') hypsClearPhotos();
  hypsUpdate();hypsRefreshCharts();
}

// Init
(function(){
  const now=new Date();
  const d=document.getElementById('hyps-f-date');
  if(d) d.value=now.toISOString().split('T')[0];
  hypsUpdate();
  hypsRefreshCharts();
})();
