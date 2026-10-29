(function(){
  // Toggle pages visibility on screen
  var pagesVisible = false;
  window.hypsTogglePages = function(){
    pagesVisible = !pagesVisible;
    var pages = document.querySelectorAll('#panel-hypothesis-sudden .hyps-page');
    pages.forEach(function(p, i){
      if(i === 0) return; // always show page 1
      if(p.id === 'hyps-page5'){
        p.style.display = (pagesVisible && window._hypsPhotos && window._hypsPhotos.length > 0) ? 'block' : 'none';
        return;
      }
      p.style.display = pagesVisible ? 'block' : 'none';
    });
    var btn = document.getElementById('hyps-toggle-btn');
    if(btn) btn.textContent = pagesVisible ? '📄 إخفاء الصفحات' : '📄 عرض الصفحات المنفصلة';
  };
  // On screen: show only page 1 by default, hide others
  var pages = document.querySelectorAll('#panel-hypothesis-sudden .hyps-page');
  pages.forEach(function(p, i){ if(i > 0) p.style.display = 'none'; });
  // Init date
  var d = document.getElementById('hyps-f-date');
  if(d && !d.value){ var now=new Date(); d.value=now.toISOString().split('T')[0]; }
  hypsUpdate();
  hypsRefreshCharts();
})();
