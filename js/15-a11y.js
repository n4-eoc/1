/* ===== الوصول وسهولة الاستخدام (من قواعد ui-ux-pro-max) =====
   1) ربط كل عنوان حقل بحقله: يُقرأ مع الحقل، والنقر عليه يضع المؤشر فيه
   2) زر الرجوع في المتصفح يعود للبطاقة السابقة بدل الخروج من اللوحة،
      وروابط مثل index.html#fire تفتح البطاقة مباشرة (اختصارات التطبيق)
   3) إعلان نتائج الحفظ والتحقق لقارئ الشاشة */

/* ── 1) ربط العناوين بالحقول ── */
(function(){
  document.querySelectorAll('label:not([for])').forEach(function(lbl){
    if(lbl.querySelector('input,select,textarea')) return;          /* العنوان يحتوي حقله أصلاً */
    var box = lbl.closest('.rc-field, .num-field, .check-item') || lbl.parentElement;
    if(!box) return;
    var ctrl = box.querySelector('input[id]:not([type=hidden]):not([type=file]), select[id], textarea[id]');
    if(ctrl && !(ctrl.labels && ctrl.labels.length)) lbl.htmlFor = ctrl.id;
  });
  /* الحقول الثانوية في الحقل نفسه (خانة «أخرى» بجانب القائمة): اسم من عنوان الحقل */
  document.querySelectorAll('.rc-field input, .rc-field select, .rc-field textarea').forEach(function(c){
    if((c.labels && c.labels.length) || c.getAttribute('aria-label') || c.type==='hidden' || c.type==='file') return;
    var lbl = c.closest('.rc-field').querySelector('label');
    var name = lbl ? lbl.textContent.trim() : (c.placeholder || '');
    if(name) c.setAttribute('aria-label', name + (/other/.test(c.id) ? ' — أخرى' : ''));
  });
  /* ما تبقى بلا عنوان (حقول الإضافة في الإعدادات): النص الإرشادي اسماً له */
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function(c){
    if(!(c.labels && c.labels.length) && !c.getAttribute('aria-label')) c.setAttribute('aria-label', c.placeholder.replace(/\.{2,}|…/g,'').trim());
  });
})();

/* ── 3) منطقة إعلان لقارئ الشاشة ── */
var hhLive = document.createElement('div');
hhLive.id = 'hh-live';
hhLive.className = 'sr-only';
hhLive.setAttribute('role', 'status');
hhLive.setAttribute('aria-live', 'polite');
document.body.appendChild(hhLive);
function hhAnnounce(msg){
  hhLive.textContent = '';
  setTimeout(function(){ hhLive.textContent = msg; }, 50);
}

(function(){
  var origSave = window.hhGlobalSave;
  if(typeof origSave !== 'function') return;
  window.hhGlobalSave = function(){
    var before = hhGetLogs().length;
    origSave.apply(this, arguments);
    if(hhGetLogs().length > before) hhAnnounce('تم حفظ الحادثة في السجل');
  };
})();

/* ── 2) سجل التنقل بين البطاقات ── */
(function(){
  var orig = window.switchCard;
  if(typeof orig !== 'function') return;
  var restoring = false;
  var exists = function(card){ return !!document.getElementById('panel-'+card); };

  window.switchCard = function(card){
    orig.apply(this, arguments);
    if(restoring || !exists(card)) return;
    var target = card === 'home' ? location.pathname + location.search : '#' + card;
    var current = (location.hash || '').slice(1) || 'home';
    if(current !== card) history.pushState({card: card}, '', target);
  };

  window.addEventListener('popstate', function(e){
    var card = (e.state && e.state.card) || (location.hash || '').slice(1) || 'home';
    if(!exists(card)) card = 'home';
    restoring = true;
    try{ window.switchCard(card); } finally { restoring = false; }
  });

  /* فتح البطاقة من الرابط عند التحميل (اختصارات manifest مثل #fire) */
  var start = (location.hash || '').slice(1);
  history.replaceState(Object.assign({}, history.state, {card: exists(start) ? start : 'home'}), '');   /* يحافظ على صفحة القسم إن فُتحت من الرابط */
  if(start && start !== 'home' && exists(start)){
    window.addEventListener('load', function(){
      restoring = true;
      try{ window.switchCard(start); } finally { restoring = false; }
    });
  }
})();
