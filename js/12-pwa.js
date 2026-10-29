(function(){
  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
        .then(function(reg){ console.log('[PWA] تسجيل ناجح:', reg.scope); reg.update(); })
        .catch(function(err){ console.warn('[PWA] فشل التسجيل:', err); });
    });
  }

  var _deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    _deferredPrompt = e;
    var btn = document.getElementById('pwa-install-btn');
    if(btn) btn.style.display = '';
  });

  window.hhPwaInstall = function(){
    if(!_deferredPrompt) return;
    _deferredPrompt.prompt();
    _deferredPrompt.userChoice.then(function(choice){
      if(choice.outcome === 'accepted'){
        var btn = document.getElementById('pwa-install-btn');
        if(btn) btn.style.display = 'none';
      }
      _deferredPrompt = null;
    });
  };

  window.addEventListener('appinstalled', function(){
    var btn = document.getElementById('pwa-install-btn');
    if(btn) btn.style.display = 'none';
    _deferredPrompt = null;
  });
})();
