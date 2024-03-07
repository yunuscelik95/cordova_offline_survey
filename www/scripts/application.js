define(["require", "exports"], function (require, exports) {
    // Boş şablona giriş için aşağıdaki belgelere bakın:
    // http://go.microsoft.com/fwlink/?LinkID=397705
    // Cordova-simulate içinde veya Android cihazlarda/öykünücülerinde sayfa yükleme durumunda kodlarda hata ayıklamak için: Uygulamanızı çalıştırın, kesme noktalarını ayarlayın, 
    // ve ardından JavaScript Konsolu'ndan "window.location.reload()" kodunu çalıştırın.
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function initialize() {
        document.addEventListener('deviceready', onDeviceReady, false);
    }
    exports.initialize = initialize;
    function onDeviceReady() {
        document.addEventListener('pause', onPause, false);
        document.addEventListener('resume', onResume, false);
        // TODO: Cordova yüklendi. Burada Cordova gerektiren tüm başlatma işlemlerini gerçekleştirin.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    }
    function onPause() {
        // TODO: Bu uygulama askıya alındı. Burada uygulama durumunu kaydedin.
    }
    function onResume() {
        // TODO: Bu uygulama yeniden etkinleştirildi. Burada uygulama durumunu geri yükleyin.
    }
});
//# sourceMappingURL=application.js.map