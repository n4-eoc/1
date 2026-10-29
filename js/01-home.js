/* ===== الصفحة الرئيسية: الساعة، الوضع الفاتح/الداكن، الأقسام الثلاثة ===== */

// الساعة
(function(){
  function updateClock(){
    var now=new Date();
    var days=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    var t=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    var el=document.getElementById('hp-clock');
    if(el) el.textContent=days[now.getDay()]+' '+t;
  }
  updateClock();
  setInterval(updateClock,30000);
})();

/* ── الوضع الفاتح/الداكن: يُحفظ لكل جهاز، والافتراضي يتبع إعداد النظام ── */
function hhApplyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  var meta=document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', '#003d5c');   /* شريط المتصفح بلون شريط الهوية في الوضعين */
  var lbl=document.querySelector('.hx-theme-lbl');
  if(lbl) lbl.textContent = t==='dark' ? 'الوضع الفاتح' : 'الوضع الداكن';
  /* الرسوم في السجل تُرسم على canvas فتحتاج إعادة رسم بالألوان الجديدة */
  var sl=document.getElementById('panel-stats-log');
  if(sl && sl.classList.contains('active') && typeof hhRenderStats==='function') hhRenderStats();
}
function hhToggleTheme(){
  var t = document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark';
  try{ localStorage.setItem('hh_theme', t); }catch(e){}
  hhApplyTheme(t);
}
hhApplyTheme(document.documentElement.getAttribute('data-theme') || 'light');

/* ── الأقسام الثلاثة: الرئيسية تعرض الأيقونات الثلاث فقط، والنقر على قسم يفتح صفحته بأيقونات بطاقاته.
   زر «الأقسام» وزر الرجوع في المتصفح يعيدان للأيقونات الثلاث، والعودة من بطاقة تعيد لصفحة قسمها ── */
(function(){
  var main = document.querySelector(".hx-main");
  var cats = [].slice.call(document.querySelectorAll(".hx-cat"));
  if(!main || !cats.length) return;
  var pages = {};
  cats.forEach(function(c){ pages[c.dataset.cat] = document.getElementById(c.getAttribute("aria-controls")); });

  function show(cat, focus){
    var page = cat && pages[cat];
    Object.keys(pages).forEach(function(k){ pages[k].hidden = pages[k] !== page; });
    if(page){ main.setAttribute("data-page", cat); } else { main.removeAttribute("data-page"); }
    window.scrollTo(0, 0);
    if(focus){
      if(page){ var h = page.querySelector(".hx-page-title"); if(h) h.focus({preventScroll:true}); }
      else { var c = cats.filter(function(x){ return x.dataset.cat === focus; })[0]; if(c) c.focus({preventScroll:true}); }
    }
  }

  cats.forEach(function(c){
    c.addEventListener("click", function(){
      show(c.dataset.cat, true);
      history.pushState({card:"home", cat:c.dataset.cat, pushed:true}, "", "#" + c.dataset.cat + "-menu");
    });
  });

  window.hhHomeBack = function(){
    var cur = main.getAttribute("data-page");
    /* إن فُتحت الصفحة من الأيقونات فالرجوع خطوة في السجل، وإلا (رابط مباشر) نرجع ونستبدل الرابط */
    if(history.state && history.state.pushed){ history.back(); }
    else { show(null, cur); history.replaceState({card:"home"}, "", location.pathname + location.search); }
  };

  /* زر الرجوع/التقدم في المتصفح */
  window.addEventListener("popstate", function(e){
    var st = e.state || {};
    if(st.card && st.card !== "home") return;           /* الانتقال لبطاقة: صفحة القسم تبقى كما هي خلفها */
    var prev = main.getAttribute("data-page");
    show(st.cat || null, st.cat ? true : prev);
  });

  /* فتح صفحة قسم من الرابط مباشرة، مثل index.html#ops-menu */
  var m = /^#([a-z]+)-menu$/.exec(location.hash);
  if(m && pages[m[1]]){ show(m[1]); history.replaceState({card:"home", cat:m[1]}, ""); }
})();
