
window.addEventListener('load', () => {
    //  const axios = require('axios');

    // GitHub ayarları - BURAYA KENDİ REPO BİLGİLERİNİZİ YAZIN
    var GITHUB_USER = "yunuscelik95";
    var GITHUB_REPO = "cordova_offline_survey";
    var GITHUB_BRANCH = "main";
    var VERSION_URL = "https://raw.githubusercontent.com/" + GITHUB_USER + "/" + GITHUB_REPO + "/" + GITHUB_BRANCH + "/www/version.json";

    window.vueLogin = new Vue({
        el: "#login",
        data: {
            isButtonDisable: true,
            uname: "",
            psw: "",
            oran: 0,
            appVersion: "2.0.6",
            // Güncelleme değişkenleri
            updateVisible: false,
            updateProgress: 0,
            updateMessage: "",
            updateDone: false,
            updateError: false

        },
        created() {
            // Uygulama açıldığında sürümü localStorage'a yaz
            window.localStorage["version"] = this.appVersion;
        },
        methods: {
            // =============================================
            // GÜNCELLEME FONKSİYONLARI
            // =============================================
            checkForUpdate() {
                var self = this;
                self.updateVisible = true;
                self.updateProgress = 0;
                self.updateDone = false;
                self.updateError = false;
                self.updateMessage = "Güncelleme kontrol ediliyor...";

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

            downloadUpdate(remoteVersion) {
                var self = this;
                self.updateProgress = 0;
                self.updateMessage = "İndirme başlatılıyor...";

                var apkUrl = remoteVersion.apkUrl;
                if (!apkUrl) {
                    self.updateMessage = "APK indirme adresi bulunamadı!";
                    self.updateError = true;
                    return;
                }

                // İndirme hedef yolu
                var targetDir = cordova.file.externalCacheDirectory || cordova.file.cacheDirectory;
                var targetPath = targetDir + "update.apk";

                // Önce GitHub redirect URL'sini çöz, sonra FileTransfer ile indir
                self.updateMessage = "Bağlantı hazırlanıyor...";

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
                    apkUrl,
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
                            
                            cordova.plugins.fileOpener2.open(
                                filePath,
                                'application/vnd.android.package-archive',
                                {
                                    error: function(e) {
                                        console.error("APK açma hatası:", e);
                                        self.updateMessage = "Kurulum başlatılamadı: " + (e.message || JSON.stringify(e)) + " Yol: " + filePath;
                                        self.updateError = true;
                                        self.updateDone = false;
                                    },
                                    success: function() {
                                        console.log("APK kurulum ekranı açıldı");
                                    }
                                }
                            );
                        }, 1000);
                    },
                    function(error) {
                        console.error("İndirme hatası:", JSON.stringify(error));
                        self.updateProgress = 0;
                        self.updateMessage = "İndirme hatası (kod:" + error.code + "): " + (error.body || error.exception || "Bilinmeyen hata") + " - URL: " + apkUrl;
                        self.updateError = true;
                    },
                    true, // trustAllHosts
                    { headers: { "Accept": "application/octet-stream" } }
                );
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
                                alert("Servera gönderilmemiş data tespit edildi, lütfen önce data gönderimini sağlayınız.");
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
                
                
                if (state.isOnline) {
                    this.getVersion();
                }
                else {
                    this.login();
                }
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