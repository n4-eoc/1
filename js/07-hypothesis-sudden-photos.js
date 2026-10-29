// ===== PHOTO MANAGEMENT FOR تقرير فرضية مفاجئة =====
window._hypsPhotos = [];

window.hypsAddPhotos = function(input){
  var files = Array.from(input.files);
  files.forEach(function(file){
    var reader = new FileReader();
    reader.onload = function(e){
      var photoData = { src: e.target.result, caption: file.name.replace(/\.[^.]+$/, ''), id: Date.now() + Math.random() };
      window._hypsPhotos.push(photoData);
      hypsRenderPhotos();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
};

window.hypsRemovePhoto = function(id){
  window._hypsPhotos = window._hypsPhotos.filter(function(p){ return p.id !== id; });
  hypsRenderPhotos();
};

window.hypsUpdateCaption = function(id, val){
  var p = window._hypsPhotos.find(function(p){ return p.id === id; });
  if(p) p.caption = val;
  hypsRenderPhotosPage();
};

window.hypsClearPhotos = function(){
  window._hypsPhotos = [];
  hypsRenderPhotos();
};

function hypsRenderPhotos(){
  var cnt = document.getElementById('hyps-photo-count');
  if(cnt) cnt.textContent = window._hypsPhotos.length ? window._hypsPhotos.length + ' صورة' : 'لا توجد صور';

  var preview = document.getElementById('hyps-photo-preview');
  if(preview){
    if(window._hypsPhotos.length === 0){
      preview.innerHTML = '';
    } else {
      preview.innerHTML = window._hypsPhotos.map(function(p){
        return '<div style="position:relative;border-radius:10px;overflow:hidden;background:rgba(0,0,0,0.3);border:1px solid rgba(0,174,239,0.2);">'
          + '<img src="'+p.src+'" style="width:100%;height:100px;object-fit:contain;display:block;background:#1a2a3a;"/>'
          + '<button onclick="hypsRemovePhoto('+p.id+')" style="position:absolute;top:4px;left:4px;background:rgba(220,38,38,0.8);border:none;color:#fff;width:22px;height:22px;border-radius:50%;cursor:pointer;font-size:13px;font-weight:900;line-height:1;padding:0;">×</button>'
          + '</div>';
      }).join('');
    }
  }
  hypsRenderPhotosPage();
}

function hypsRenderPhotosPage(){
  var grid = document.getElementById('hyps-photos-grid');
  var noPhotos = document.getElementById('hyps-no-photos');
  var page5 = document.getElementById('hyps-page5');
  if(!grid) return;

  if(window._hypsPhotos.length === 0){
    if(noPhotos) noPhotos.style.display = '';
    grid.querySelectorAll('.hyps-photo-card,.hyps-photo-row').forEach(function(el){ el.remove(); });
    if(page5) page5.style.display = 'none';
    return;
  }

  if(noPhotos) noPhotos.style.display = 'none';
  if(page5) page5.style.display = '';

  var n = window._hypsPhotos.length;

  // تحديد الصفوف حسب عدد الصور
  var rows = [];
  if(n === 1){
    rows = [[0]];
  } else if(n === 2){
    rows = [[0,1]];
  } else if(n === 3){
    // صورة كاملة + صورتان
    rows = [[0],[1,2]];
  } else if(n === 4){
    // صفان بصورتين
    rows = [[0,1],[2,3]];
  } else if(n === 5){
    rows = [[0,1],[2,3],[4]];
  } else if(n === 6){
    rows = [[0,1],[2,3],[4,5]];
  } else {
    for(var i=0;i<n;i+=2){
      rows.push(i+1<n ? [i,i+1] : [i]);
    }
  }

  // حساب الارتفاع المتاح:
  // الصفحة = 297mm = ~1122px (at 3.78px/mm)
  // رأس الصفحة ~52px + titlebar ~32px + section-title ~30px + padding ~18px + footer ~30px = ~162px
  var PX_PER_MM = 3.7795;
  var pageH = Math.round(297 * PX_PER_MM);         // ~1122px
  var reserved = 162;                               // header+bar+title+footer+padding
  var gapSize = 8;
  var rowCount = rows.length;
  var totalGaps = gapSize * (rowCount - 1);
  var availH = pageH - reserved - totalGaps;
  var rowH = Math.floor(availH / rowCount);         // ارتفاع كل صف بالبكسل

  // إعادة بناء الشبكة
  grid.style.cssText = 'display:flex;flex-direction:column;gap:'+gapSize+'px;flex:1;min-height:0;';
  grid.querySelectorAll('.hyps-photo-card,.hyps-photo-row').forEach(function(el){ el.remove(); });

  rows.forEach(function(rowIdxArr){
    var rowEl = document.createElement('div');
    rowEl.className = 'hyps-photo-row';
    rowEl.style.cssText = 'display:flex;gap:8px;height:'+rowH+'px;flex-shrink:0;';

    rowIdxArr.forEach(function(photoIdx){
      var p = window._hypsPhotos[photoIdx];
      var imgH = rowH;
      var card = document.createElement('div');
      card.className = 'hyps-photo-card';
      card.style.cssText = 'flex:1;min-width:0;border-radius:8px;overflow:hidden;border:1px solid #C8E4F0;background:#fff;display:flex;flex-direction:column;';
      card.innerHTML = '<img src="'+p.src+'" style="width:100%;height:'+imgH+'px;object-fit:contain;display:block;flex-shrink:0;background:#fff;"/>';
      rowEl.appendChild(card);
    });

    grid.appendChild(rowEl);
  });
}
