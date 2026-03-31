
window.addEventListener('load', () => {
    //  const axios = require('axios');

    // GitHub ayarları - BURAYA KENDİ REPO BİLGİLERİNİZİ YAZIN
    var GITHUB_USER = "yunuscelik95";
    var GITHUB_REPO = "cordova_offline_survey";
    var GITHUB_BRANCH = "main";
    var VERSION_URL = "https://raw.githubusercontent.com/" + GITHUB_USER + "/" + GITHUB_REPO + "/" + GITHUB_BRANCH + "/www/version.json";

    // Google Drive dosya ID'leri (sabit, değişmez)
    var GDRIVE_VERSION_ID = "1Szy882ShZNsIqPyxsYme1o-2PJphcxxL";
    var GDRIVE_APK_ID = "1B0weGC3e6YqSDEjRV8IexyU-12ZgdyU9";

    window.vueLogin = new Vue({
        el: "#login",
        data: {
            isButtonDisable: true,
            uname: "",
            psw: "",
            oran: 0,
            appVersion: "...",
            // Güncelleme değişkenleri
            updateVisible: false,
            updateProgress: 0,
            updateMessage: "",
            updateDone: false,
            updateError: false,
            // Yönetici panel değişkenleri
            adminVisible: false,
            adminAuth: false,
            adminPass: "",
            tapCount: 0,
            tapTimer: null,
            kioskActive: true

        },
        created() {
            var self = this;
            // version.json'dan sürümü oku (tek kaynak)
            fetch('version.json?t=' + new Date().getTime())
                .then(function(r) { return r.json(); })
                .then(function(v) {
                    self.appVersion = v.version;
                    window.localStorage["version"] = v.version;
                })
                .catch(function() {
                    // Dosya okunamazsa localStorage'dan al
                    self.appVersion = window.localStorage["version"] || "0.0.0";
                });
            
            // Kiosk modunu her zaman aktif et
            document.addEventListener('deviceready', function() {
                if (window.KioskMode) {
                    window.KioskMode.enableKiosk(
                        function(msg) { console.log("Kiosk: " + msg); },
                        function(err) { console.log("Kiosk hata: " + err); }
                    );
                }
            }, false);
        },
        methods: {
            // =============================================
            // GÜNCELLEME FONKSİYONLARI
            // =============================================
            installApk(filePath, self) {
                // Device Owner ise PackageInstaller Session ile sessiz kurulum
                // Değilse FileOpener2 ile dene
                var doSilentInstall = function() {
                    console.log("Sessiz kurulum başlatılıyor: " + filePath);
                    window.KioskMode.silentInstall(
                        filePath,
                        function(msg) {
                            console.log("Sessiz kurulum başarılı: " + msg);
                            self.updateMessage = "Güncelleme kurulumu tamamlandı. Uygulama yeniden başlatılıyor...";
                            self.updateDone = true;
                            self.updateError = false;
                            setTimeout(function() {
                                window.KioskMode.enableKiosk(
                                    function() { navigator.app.exitApp(); },
                                    function() { navigator.app.exitApp(); }
                                );
                            }, 2000);
                        },
                        function(err) {
                            console.error("Sessiz kurulum hatası: " + err);
                            // Sessiz kurulum başarısız, FileOpener2 ile dene
                            doFileOpenerInstall();
                        }
                    );
                };
                var doFileOpenerInstall = function() {
                    console.log("FileOpener2 ile kurulum deneniyor");
                    cordova.plugins.fileOpener2.open(
                        filePath,
                        'application/vnd.android.package-archive',
                        {
                            error: function(e) {
                                console.error("APK açma hatası:", e);
                                self.updateMessage = "Kurulum başlatılamadı: " + (e.message || JSON.stringify(e));
                                self.updateError = true;
                                self.updateDone = false;
                                if (window.KioskMode) { window.KioskMode.enableKiosk(function(){}, function(){}); }
                            },
                            success: function() {
                                console.log("APK kurulum ekranı açıldı");
                            }
                        }
                    );
                };
                if (window.KioskMode) {
                    window.KioskMode.disableKiosk(
                        function() {
                            console.log("Kiosk geçici kapatıldı");
                            // Önce silentInstall dene
                            window.KioskMode.isDeviceOwner(
                                function(result) {
                                    if (result == 1) {
                                        doSilentInstall();
                                    } else {
                                        doFileOpenerInstall();
                                    }
                                },
                                function() { doFileOpenerInstall(); }
                            );
                        },
                        function() { console.log("Kiosk kapatılamadı, yine de dene"); doFileOpenerInstall(); }
                    );
                } else {
                    doFileOpenerInstall();
                }
            },
            checkForUpdate() {
                var self = this;
                self.updateVisible = true;
                self.updateProgress = 0;
                self.updateDone = false;
                self.updateError = false;
                self.updateMessage = "Güncelleme kontrol ediliyor...";

                // Bağlantı durumunu tekrar kontrol et (WiFi açılıp dönülmüş olabilir)
                updateConnectionProperties();

                if (!state.isOnline) {
                    self.updateMessage = "İnternet bağlantısı yok! Güncelleme kontrol edilemiyor.";
                    self.updateError = true;
                    return;
                }

                var localVersion = window.localStorage["version"] || "0.0.0";

                // GitHub'dan version.json çek (cache önlemek için timestamp ekle)
                var url = VERSION_URL + "?t=" + new Date().getTime();
                
                fetch(url)
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error("Sunucuya erişilemedi (HTTP " + response.status + ")");
                        }
                        return response.json();
                    })
                    .then(function(remoteVersion) {
                        console.log("Yerel sürüm: " + localVersion + ", Uzak sürüm: " + remoteVersion.version);

                        if (remoteVersion.version !== localVersion) {
                            // Güncelleme mevcut
                            self.updateMessage = "Güncelleme mevcut! Mevcut: v" + localVersion + " → Yeni: v" + remoteVersion.version;
                            
                            if (confirm("Yeni güncelleme mevcut (v" + remoteVersion.version + ").\n" + 
                                       (remoteVersion.description || "") + "\n\n" +
                                       "Güncellemek ister misiniz?")) {
                                self.downloadUpdate(remoteVersion);
                            } else {
                                self.updateMessage = "Güncelleme iptal edildi.";
                                setTimeout(function() { self.updateVisible = false; }, 3000);
                            }
                        } else {
                            // DB Migration kontrolü - sürüm aynı ama dbVersion farklı olabilir
                            var localDbVersion = parseInt(window.localStorage["dbVersion"] || "0");
                            if (remoteVersion.dbVersion && remoteVersion.dbVersion > localDbVersion) {
                                self.updateMessage = "Veritabanı güncelleniyor...";
                                if (typeof migrateDatabase === 'function') {
                                    migrateDatabase(localDbVersion, remoteVersion.dbVersion);
                                }
                                self.updateMessage = "Veritabanı güncellendi!";
                                self.updateDone = true;
                                setTimeout(function() { self.updateVisible = false; }, 3000);
                            } else {
                                self.updateMessage = "✓ Uygulamanız güncel! (v" + localVersion + ")";
                                self.updateDone = true;
                                setTimeout(function() { self.updateVisible = false; }, 3000);
                            }
                        }
                    })
                    .catch(function(error) {
                        console.error("Güncelleme kontrol hatası:", error);
                        self.updateMessage = "Güncelleme kontrol edilemedi: " + error.message;
                        self.updateError = true;
                    });
            },

            downloadUpdate(remoteVersion, retryCount) {
                var self = this;
                retryCount = retryCount || 0;
                var maxRetry = 3;
                self.updateProgress = 0;
                self.updateMessage = retryCount > 0 ? ("Tekrar deneniyor (" + retryCount + "/" + maxRetry + ")...") : "İndirme başlatılıyor...";

                var apkUrl = remoteVersion.apkUrl;
                if (!apkUrl) {
                    self.updateMessage = "APK indirme adresi bulunamadı!";
                    self.updateError = true;
                    return;
                }

                // İndirme hedef yolu
                var targetDir = cordova.file.externalCacheDirectory || cordova.file.cacheDirectory;
                var targetPath = targetDir + "update.apk";

                // FileTransfer redirect'leri kendisi çözer, direkt indirmeye başla
                self.doDownload(apkUrl, targetPath, remoteVersion, retryCount, maxRetry);
            },

            doDownload(downloadUrl, targetPath, remoteVersion, retryCount, maxRetry) {
                var self = this;
                retryCount = retryCount || 0;
                maxRetry = maxRetry || 3;
                self.updateMessage = "İndirme başlatılıyor...";

                var fileTransfer = new FileTransfer();

                // Progress takibi
                fileTransfer.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        var percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        var loadedMB = (progressEvent.loaded / (1024 * 1024)).toFixed(1);
                        var totalMB = (progressEvent.total / (1024 * 1024)).toFixed(1);
                        
                        self.updateProgress = percent;
                        self.updateMessage = "İndiriliyor... " + loadedMB + " MB / " + totalMB + " MB";
                    } else {
                        var loadedMB2 = (progressEvent.loaded / (1024 * 1024)).toFixed(1);
                        self.updateMessage = "İndiriliyor... " + loadedMB2 + " MB indirildi";
                    }
                };

                // FileTransfer ile indirme başlat
                fileTransfer.download(
                    downloadUrl,
                    targetPath,
                    function(entry) {
                        // İndirme başarılı
                        self.updateProgress = 100;
                        self.updateMessage = "✓ Güncelleme indirildi! Kurulum başlatılıyor...";
                        self.updateDone = true;

                        // DB Migration çalıştır
                        var localDbVersion = parseInt(window.localStorage["dbVersion"] || "0");
                        if (remoteVersion.dbVersion && remoteVersion.dbVersion > localDbVersion) {
                            if (typeof migrateDatabase === 'function') {
                                migrateDatabase(localDbVersion, remoteVersion.dbVersion);
                            }
                        }

                        // APK kurulumunu başlat
                        setTimeout(function() {
                            // Native dosya yolunu al
                            var filePath = entry.toURL();
                            // cdvfile:// veya content:// yerine file:// yolunu kullan
                            if (entry.nativeURL) {
                                filePath = entry.nativeURL;
                            }
                            console.log("APK dosya yolu: " + filePath);
                            
                            self.installApk(filePath, self);
                        }, 1000);
                    },
                    function(error) {
                        console.error("İndirme hatası:", JSON.stringify(error));
                        if (retryCount < maxRetry) {
                            self.updateProgress = 0;
                            self.updateMessage = "İndirme başarısız, " + (3 * (retryCount + 1)) + " saniye sonra tekrar denenecek...";
                            setTimeout(function() {
                                self.downloadUpdate(remoteVersion, retryCount + 1);
                            }, 3000 * (retryCount + 1));
                        } else {
                            self.updateProgress = 0;
                            self.updateMessage = "İndirme hatası (kod:" + error.code + "): " + (error.body || error.exception || "Bilinmeyen hata");
                            self.updateError = true;
                        }
                    },
                    true, // trustAllHosts
                    { headers: { "Accept": "application/octet-stream" } }
                );
            },

            // =============================================
            // GOOGLE DRIVE GÜNCELLEME FONKSİYONLARI
            // =============================================
            checkForUpdateDrive() {
                var self = this;
                self.updateVisible = true;
                self.updateProgress = 0;
                self.updateDone = false;
                self.updateError = false;
                self.updateMessage = "Google Drive'dan kontrol ediliyor...";

                updateConnectionProperties();
                if (!state.isOnline) {
                    self.updateMessage = "İnternet bağlantısı yok!";
                    self.updateError = true;
                    return;
                }

                var localVersion = window.localStorage["version"] || "0.0.0";
                var versionUrl = "https://drive.usercontent.google.com/download?id=" + GDRIVE_VERSION_ID + "&export=download&confirm=t&t=" + new Date().getTime();
                var targetDir = cordova.file.externalCacheDirectory || cordova.file.cacheDirectory;
                var versionPath = targetDir + "version_check_" + new Date().getTime() + ".json";

                // FileTransfer ile version.json indir (CORS sorunu yok)
                var ft = new FileTransfer();
                ft.download(
                    versionUrl,
                    versionPath,
                    function(entry) {
                        // Dosyayı oku
                        entry.file(function(file) {
                            var reader = new FileReader();
                            reader.onloadend = function() {
                                try {
                                    var remoteVersion = JSON.parse(this.result);
                                    console.log("Drive - Yerel: " + localVersion + ", Uzak: " + remoteVersion.version);

                                    if (remoteVersion.version !== localVersion) {
                                        self.updateMessage = "Güncelleme mevcut! v" + localVersion + " → v" + remoteVersion.version;
                                        if (confirm("Yeni güncelleme mevcut (v" + remoteVersion.version + ").\n" +
                                                   (remoteVersion.description || "") + "\n\nGüncellemek ister misiniz?")) {
                                            self.driveDownload(remoteVersion);
                                        } else {
                                            self.updateMessage = "Güncelleme iptal edildi.";
                                            setTimeout(function() { self.updateVisible = false; }, 3000);
                                        }
                                    } else {
                                        self.updateMessage = "✓ Uygulamanız güncel! (v" + localVersion + ")";
                                        self.updateDone = true;
                                        setTimeout(function() { self.updateVisible = false; }, 3000);
                                    }
                                } catch(e) {
                                    console.error("Drive version.json parse hatası:", e, this.result);
                                    self.updateMessage = "Sürüm bilgisi okunamadı";
                                    self.updateError = true;
                                }
                            };
                            reader.readAsText(file);
                        });
                    },
                    function(error) {
                        console.error("Drive version.json indirme hatası:", JSON.stringify(error));
                        self.updateMessage = "Google Drive'a erişilemedi! (kod:" + error.code + ")";
                        self.updateError = true;
                    },
                    true,
                    {}
                );
            },

            driveDownload(remoteVersion, retryCount) {
                var self = this;
                retryCount = retryCount || 0;
                var maxRetry = 3;
                self.updateProgress = 0;
                self.updateMessage = retryCount > 0 ? ("Tekrar deneniyor (" + retryCount + "/" + maxRetry + ")...") : "Drive'dan indiriliyor...";

                var downloadUrl = "https://drive.usercontent.google.com/download?id=" + GDRIVE_APK_ID + "&export=download&confirm=t";
                var targetDir = cordova.file.externalCacheDirectory || cordova.file.cacheDirectory;
                var targetPath = targetDir + "update.apk";

                var fileTransfer = new FileTransfer();

                fileTransfer.onprogress = function(e) {
                    if (e.lengthComputable) {
                        var percent = Math.round((e.loaded / e.total) * 100);
                        self.updateProgress = percent;
                        self.updateMessage = "İndiriliyor... " + (e.loaded / 1048576).toFixed(1) + " MB / " + (e.total / 1048576).toFixed(1) + " MB";
                    } else {
                        self.updateMessage = "İndiriliyor... " + (e.loaded / 1048576).toFixed(1) + " MB";
                    }
                };

                fileTransfer.download(
                    downloadUrl,
                    targetPath,
                    function(entry) {
                        // Dosya boyutu kontrol
                        entry.file(function(file) {
                            console.log("Drive APK boyutu: " + file.size);
                            if (file.size < 1000000) {
                                console.error("İndirilen dosya çok küçük: " + file.size + " byte");
                                handleDriveError("Dosya doğrulanamadı (" + file.size + " byte)");
                                return;
                            }
                            // Kurulum başlat
                            self.updateProgress = 100;
                            self.updateMessage = "✓ İndirildi! Kurulum başlatılıyor...";
                            self.updateDone = true;
                            setTimeout(function() {
                                var filePath = entry.nativeURL || entry.toURL();
                                console.log("APK yolu: " + filePath);
                                self.installApk(filePath, self);
                            }, 1000);
                        }, function() {
                            // file() hata - yine de dene
                            self.updateProgress = 100;
                            self.updateMessage = "✓ İndirildi! Kurulum başlatılıyor...";
                            self.updateDone = true;
                            setTimeout(function() {
                                var filePath2 = entry.nativeURL || entry.toURL();
                                self.installApk(filePath2, self);
                            }, 1000);
                        });
                    },
                    function(error) {
                        handleDriveError("İndirme hatası (kod:" + error.code + ")");
                    },
                    true,
                    { headers: { "Accept": "application/octet-stream" } }
                );

                function handleDriveError(msg) {
                    console.error("Drive hatası: " + msg);
                    if (retryCount < maxRetry) {
                        var waitSec = 5 * (retryCount + 1);
                        self.updateProgress = 0;
                        self.updateMessage = msg + " - " + waitSec + "sn sonra tekrar...";
                        setTimeout(function() { self.driveDownload(remoteVersion, retryCount + 1); }, waitSec * 1000);
                    } else {
                        self.updateProgress = 0;
                        self.updateMessage = "İndirme hatası: " + msg;
                        self.updateError = true;
                    }
                }
            },

            // =============================================
            // MEVCUT FONKSİYONLAR
            // =============================================
            onlineFunction() {
                this.isButtonDisable = false; 
                deleteTable("users", "");
			    this.webApiCall();
            },

            createDropSec() {
                db.transaction(function (tx) {
                    tx.executeSql("SELECT optionValue FROM OPTIONS where optionID=1", [], function (tx, val1) {
                        if (val1.rows.length > 0) {
                            if (val1.rows.item(0).optionValue == 2) {
                                DropCreate();
                            }
                            else if (val1.rows.item(0).optionValue == 3) {
                                deleteTable("INTERVIEWS", "");
                                deleteTable("LISTE", "");
                                deleteTable("BLOKOZET", "");
                                create();
                            }
                            else if (val1.rows.item(0).optionValue == 1) {
                                create();
                            }
                        }
                        else {
                            DropCreate();
                        }
                    },
                        function (error) {
                            DropCreate();
                        }
                    )
                })
            },

            webApiCall() {
                let self = this;
                var users;
                axios.get("https://vta.diyalog.com.tr/api/users")
                    .then(response => {
                        let userStr = jQuery.parseJSON(response.data);
                        var say = 0;
                        oran = 0; 
                        $.each(userStr, (key, val) => {
                            var keys = [];
                            var values = [];
                            $.each(val, function (key1, val1) {
                                keys.push(key1);
                                values.push(val1);
                            })

                            db.transaction(function (tx) {
                                tx.executeSql("insert into [users] (userID,userName,password,guid) values(?,?,?,?)", values);
                                say++;
                                self.oran = (say / userStr.length * 100).toFixed(0);
                                if (say == userStr.length) {
                                    $("<ul/>", {
                                        "class": "my-new-list",
                                        html: "Kullanıcılar Yüklendi."
                                    }).appendTo("body");
                                    self.createDropSec();
                                    self.isButtonDisable = true;
                                    //self.responsesFunction();
                                }
                            },
                                function (error) {
                                    self.isButtonDisable = true;

                                 },
                                function () { }

                            );
                        })

                    });

            },

         

            KullaniciYukle() {
 
                //  this.webApiCall();
                var self = this;
                if(self.isButtonDisable != true)
                {
                    alert("Şuan kullanıcı yükleme işlem devam ediyor, lütfen bekleyiniz.");
                    return;
                }
               // $(this).attr("disabled", true);

                if (state.isOnline) {
                    db.transaction(function (tx) {
                        tx.executeSql("SELECT count(*) as sayi1 FROM INTERVIEWS where (gonderim is null or gonderim=0) and InterviewStatu is not null and InterviewStatu<>0", [], function (tx, val1) {
                            if (val1.rows.item(0).sayi1 < 1) {
                                self.onlineFunction();

                            }
                            else {
                                alert("Önce giriş yapıp içerideki datayı gönderiniz.");
                                self.isButtonDisable = true;
                                return;
                            }
                        })
                    },
                        function (error) {
                            self.onlineFunction();

                        })
                }
                else {
                    self.isButtonDisable = true;
                    alert("İnterneti Kontrol edin!");


                }
               
            },

            loginClick() {
                if(this.isButtonDisable != true)
                {
                    alert("Şuan kullanıcı yükleme işlem devam ediyor, lütfen bekleyiniz.");
                    return;
                }
                
                // Her zaman version kontrolü dene
                this.getVersion();
            },

            login() {
                var self = this;
                db.transaction(function (tx) {
                    var sql = "SELECT * FROM users where userName=? and password=?;";
                    tx.executeSql(sql, [self.uname.toUpperCase(), self.psw], function (tx, val) {

                        if (val.rows.length > 0) {
                            window.localStorage.setItem("userID", val.rows.item(0).userID);
                            window.localStorage.setItem("userGuid", val.rows.item(0).guid);
                            window.location.href = "blokOzet.html";
                        }
                        else {
                            alert("Kullanıcı adı veya şifre hatalı!");
                        }

                    }
                        , function (tx, error) {
                           // alert(error.message);
                            console.log('Error : ' + error.message);
                            return true;
                        }
                    );
                })
            },

            // =============================================
            // YÖNETİCİ PANELİ FONKSİYONLARI
            // =============================================
            adminTap() {
                var self = this;
                self.tapCount++;
                if (self.tapTimer) clearTimeout(self.tapTimer);
                self.tapTimer = setTimeout(function() { self.tapCount = 0; }, 2000);
                if (self.tapCount >= 7) {
                    self.tapCount = 0;
                    self.adminVisible = true;
                    self.adminAuth = false;
                    self.adminPass = "";
                }
            },

            adminLogin() {
                if (this.adminPass === "2219") {
                    this.adminAuth = true;
                    this.kioskActive = true;
                } else {
                    alert("Şifre hatalı!");
                    this.adminPass = "";
                }
            },

            toggleKiosk() {
                var self = this;
                if (!window.KioskMode) { alert("KioskMode plugin yüklü değil!"); return; }
                
                if (self.kioskActive) {
                    window.KioskMode.disableKiosk(
                        function(msg) {
                            self.kioskActive = false;
                            alert("Kiosk modu geçici olarak kapatıldı. Uygulama yeniden başlatıldığında tekrar açılacak.");
                        },
                        function(err) { alert("Kiosk kapatma hatası: " + err); }
                    );
                } else {
                    window.KioskMode.enableKiosk(
                        function(msg) {
                            self.kioskActive = true;
                            alert("Kiosk modu açıldı.");
                        },
                        function(err) { alert("Kiosk açma hatası: " + err); }
                    );
                }
            },

            getVersion() {
                var self = this;
                var url = VERSION_URL + "?t=" + new Date().getTime();
                
                fetch(url)
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error("HTTP " + response.status);
                        }
                        return response.json();
                    })
                    .then(function(remoteVersion) {
                        window.localStorage["serverVersion"] = remoteVersion.version;

                        if (remoteVersion.version != window.localStorage["version"]) {
                            alert("Yeni güncelleme mevcut (v" + remoteVersion.version + "). Lütfen Güncelleme Kontrol Et butonunu kullanarak güncelleyiniz.");
                            self.login();
                        }
                        else {
                            self.login();
                        }
                    })
                    .catch(function(error) {
                        console.error("Version kontrol hatası:", error);
                        self.login();
                    });
            }

        }
    })
})