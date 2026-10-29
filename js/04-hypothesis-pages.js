(function(){
  // Toggle pages visibility on screen
  var pagesVisible = false;
  window.hypTogglePages = function(){
    pagesVisible = !pagesVisible;
    var pages = document.querySelectorAll('#panel-hypothesis .hyp-page');
    pages.forEach(function(p, i){
      if(i === 0) return; // always show page 1
      p.style.display = pagesVisible ? 'block' : 'none';
    });
    var btn = document.getElementById('hyp-toggle-btn');
    if(btn) btn.textContent = pagesVisible ? '📄 إخفاء الصفحات' : '📄 عرض الصفحات المنفصلة';
  };
  // On screen: show only page 1 by default, hide others
  var pages = document.querySelectorAll('#panel-hypothesis .hyp-page');
  pages.forEach(function(p, i){ if(i > 0) p.style.display = 'none'; });
  // Init date
  var d = document.getElementById('hyp-f-date');
  if(d && !d.value){ var now=new Date(); d.value=now.toISOString().split('T')[0]; }
  hypUpdate();
  hypRefreshCharts();
})();
