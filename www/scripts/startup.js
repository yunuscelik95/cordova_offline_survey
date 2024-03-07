define(["require", "exports", "./application"], function (require, exports, Application) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // /merges klasöründen platforma özgü kodu yüklemeyi deneyin.
    // Daha fazla bilgi için bkz. http://taco.visualstudio.com/tr-tr/docs/configure-app/#Content.
    require(["./platformOverrides"], function () { return Application.initialize(); }, function () { return Application.initialize(); });
});
//# sourceMappingURL=startup.js.map