window.addEventListener('load', () => {
    //  const axios = require('axios');
    const config = {
        headers: {
            'Content-Type': 'application/json;',
            'charset': 'utf-8'
        }
    }

    var tanimliBlokYok = true;
    console.log("Vue instance oluşturuluyor...");
    window.blokOzet = new Vue({
        el: "#blokozet",
        data: {
            isButtonDisable: true,
            uname: "",
            psw: "",
            oran: 0,
            gonderimsayisi: 0,
            gonderilen: 0,
            liste:[]
        },
        methods: {
            blokKapat(guid) {
                window.location.href = "BlokCloseStatu.html?guid=" + guid + "&Statu=2";
            },
            blokAc(guid) {
                window.location.href = "BlokCloseStatu.html?guid=" + guid + "&Statu=0";
            },
            blokDetay(guid) {
                window.localStorage["blokGuid"] = guid;
                window.location.href = "liste.html?guid=" + guid;
            },
            sendOfflineData(ayrac) {
                // İnternet durumunu güncelle
                updateConnectionProperties();
                
                if (state.isOnline) {
              
                    this.sendData(" (gonderim is null or gonderim=0) and InterviewStatu is not null and InterviewStatu<>0");
                }
                else if (ayrac == "button") {
                    alert("Internet bağlantısı bulunamadı!");

                }
                //    sendData(" (gonderim is null or gonderim=0) and InterviewStatu is not null and InterviewStatu<>0");
            },
            storageData(where)
            {
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM INTERVIEWS WHERE ' + where, [], function (tx, res) {
                        self.gonderimsayisi = res.rows.length;
                    });
                });

            },
            sendData(where) {
                // İnternet durumunu güncelle
                updateConnectionProperties();
                
                if (!state.isOnline) {
                    alert("İnternet bağlantısı yok! Lütfen interneti açın.");
                    return;
                }
                
                var self = this;
                self.gonderilen = 0;
                var toplamGonderilecek = 0;
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM INTERVIEWS WHERE ' + where, [], function (tx, res) {
                        self.gonderimsayisi = res.rows.length;
                        if (res.rows.length > 0) {
                            toplamGonderilecek = res.rows.length;
                            for (var i = 0; i < res.rows.length; i++) {
                                var link = "https://vta.diyalog.com.tr/api/veri/" + window.localStorage["userGuid"];
                                //{   headers: headers   }
                                var veri = JSON.stringify(res.rows.item(i), function(key, value) {
                                    // Özel karakterleri temizle
                                    if (typeof value === 'string') {
                                        value =value.replace(/[^\x20-\x7EİıŞşĞğÜüÇç]/g, function(match) {
                                            return match;
                                        });

                                        return value;// ASCII dışındaki karakterleri temizle
                                    }
                                    
                                    return value;
                                });

                                axios.put(link, veri, config)
                                    .then((response) => {
                                        console.log("API Response:", response);
                                        console.log("Response data:", response.data);
                                        console.log("Response data type:", typeof response.data);
                                        
                                        // response.data zaten obje olabilir, string ise parse et
                                        var responseParse;
                                        if (typeof response.data === 'string') {
                                            responseParse = JSON.parse(response.data);
                                        } else {
                                            responseParse = response.data;
                                        }
                                        
                                        console.log("Parsed response:", responseParse);
                                        console.log("Sonuc değeri:", responseParse.Sonuc);
                                        
                                        if (responseParse.Sonuc == "OK") {
                                            console.log("Başarılı, InterviewID:", responseParse.InterviewID);
                                            myUpdate("INTERVIEWS", "gonderim=1", " InterviewID=" + responseParse.InterviewID);
                                            self.gonderilen = parseInt(self.gonderilen) + 1;
                                            if (toplamGonderilecek == self.gonderilen)
                                            {
                                                alert("Datalar başarı ile sunucuya gönderildi");
                                            }
                                        } else {
                                            console.log("API Sonuc != OK, responseParse:", responseParse);
                                            alert("API hatası: " + (responseParse.Mesaj || "Bilinmeyen hata"));
                                        }

                                    })
                                    .catch((error) => {
                                        console.error("API HATA:", error);
                                        console.error("Error response:", error.response);
                                        console.error("Error message:", error.message);
                                        alert("Hata: " + error.message);
                                    })


                            }
                        }

                    },
                        function (error) {
                            console.log("Hata: " + error);
                        }
                    );
                    //  myUpdateRedirect("INTERVIEWS", "InterviewStatu=" + statu, " InterviewID=" + id, "blokOzet.html");
                });
            },

            setBlokStatuServer() {

                if (state.isOnline) {
                    //   alert("1");
                    db.transaction(function (tx) {
                        tx.executeSql('SELECT * FROM BLOKOZET WHERE (Bgonderim=0) ', [], function (tx, res) {
                            if (res.rows.length > 0) {
                                var say = 0;
                        /*        const config = {
                                    headers: {
                                        'Content-Type': 'application/json;',
                                        'charset': 'utf-8',
                                        'dataType': 'json'
                                    }
                                }*/
                                
                                for (var i = 0; i < res.rows.length; i++) {
                                    var link = "https://vta.diyalog.com.tr/api/setBlokStatu/" + window.localStorage["userGuid"] + "/" + res.rows.item(i).statu + "/" + res.rows.item(i).guid;
                                    axios.put(link, res.rows.item(i).blokAciklama, config)
                                        .then((response) => {
                                            responseParse = JSON.parse(response);
                                            if (responseParse.sonuc == "OK") {
                                                myUpdate("BLOKOZET", "Bgonderim=1", " guid='" + responseParse.guid + "'");
                                            }

                                        })
                                        .catch((error) => {
                                            alert("Hata:" + error);
                                        })
                                }
                            }
                        })
                    })
                }
                else {
 
                }

            },

            btnWebService() {
                console.log("btnWebService çağrıldı");
                this.blokYukle();
            },

            blokYukle() {
                console.log("blokYukle başladı, isOnline:", state.isOnline);
                this.liste=[];
                if (state.isOnline) {
                    console.log("Online mod - onlineFunction çağrılıyor");
                    this.onlineFunction();
                }
                else {
                    console.log("Offline mod - querySuccess çağrılıyor");
                    this.querySuccess();
                }
            },
            onlineFunction() {
                this.onlineDeleteBlok();
            },
            blokListeDownload(blokNos) {
                var self = this;
                db.transaction(function (tx) {
					  tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='LISTE'", [], function (tx, result) {
						if (result.rows.length > 0) {
								tx.executeSql("delete from [LISTE] where guid in (" + blokNos + ")");
						}
						else
						{
							
							alert("Liste yok");
						}
					  })
                },
                    function (error) {
							alert(error);
							console.log(error);
                            self.querySuccess();
						},
                    function () { self.blokListeServis(blokNos); }
                )
            },
            blokListeServis(bloknos) {

                var self = this;
                var serviceUrl = 'https://vta.diyalog.com.tr/api/getMultiBlokListe/' + window.localStorage["userGuid"];
                axios.post(serviceUrl, bloknos)
                    .then((response) => {
                        var items1 = [];
                        //JSON.parse
                        var j = jQuery.parseJSON(response.data);
                        var insertData = [];
                        
                        // Tüm insert verilerini hazırla
                        $.each(j, function (key, val) {
                            var keys = [];
                            var values = [];
                            var keysStr = "";
                            var Parameters = "";
                            $.each(val, function (key1, val1) {
                                keys.push(key1);
                                values.push(val1);
                                if (keysStr != "") { keysStr += ","; Parameters += ","; };
                                keysStr += key1;
                                Parameters += "?";
                            });
                            insertData.push({ keysStr: keysStr, Parameters: Parameters, values: values });
                        });
                        
                        // Tek transaction'da tüm insert'leri yap
                        db.transaction(function (tx) {
                            for (var i = 0; i < insertData.length; i++) {
                                var item = insertData[i];
                                tx.executeSql("insert into [LISTE] (" + item.keysStr + ") values(" + item.Parameters + ")", item.values);
                            }
                        }, function (error) { 
                            alert(error); 
                            self.querySuccess();
                        }, function () {
                            // Transaction başarılı
                            console.log("Liste insert tamamlandı, querySuccess çağrılıyor");
                            self.querySuccess();
                        });
                    })
                    .catch((error) => { alert("Hata:" + error); self.querySuccess(); })
            },

            onlineBlokIndir() {
				// db.transaction(function (tx) {
    // tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function (tx, result) {
        // for (var i = 0; i < result.rows.length; i++) {
            // console.log("Table Name: " + result.rows.item(i).name);
        // }
    // });
// });

                console.log("onlineBlokIndir başladı");
                tanimliBlokYok = true;
                var self = this;
                var bloknos = "";
                var serviceUrl = 'https://vta.diyalog.com.tr/api/getUserToBlok/' + window.localStorage["userGuid"];
                console.log("getUserToBlok Service URL:", serviceUrl);
                axios.get(serviceUrl, "", config)
                    .then((response) => {
                        console.log("getUserToBlok response:", response.data);
                        var items1 = [];
                        var j = jQuery.parseJSON(response.data);
                        console.log("Parsed blok sayısı:", j.length);
                        var say = 0;
                        if (j.length  < 1)
                        {
                            console.log("Kullanıcıya atanmış blok yok");
                            self.querySuccess();
                            return;
                        }
                        $.each(j, function (key, val) {
                            var keys = [];
                            var values = [];
                            var keysStr = "";
                            var Parameters = "";
                            $.each(val, function (key1, val1) {
                                if (key1 != "Yapilan" && key1 != "Kalan") {
                                    if (key1 == "blokstatu") key1 = "statu";
                                    if (keysStr != "") { keysStr += ","; Parameters += ","; };
                                    keysStr += key1;
                                    Parameters += "?";
                                    keys.push(key1);
                                    values.push(val1);
                                }
                            });
                            if (Parameters == "") { tanimliBlokYok = false; }
                            if (bloknos != "") { bloknos += ","; }
                            bloknos += "'" + val.guid + "'";
                            db.transaction(function (tx) {
                                tx.executeSql("SELECT count(*) as sayi1 FROM BLOKOZET where userId=? and blokno=?", [window.localStorage["userID"], val.blokno], function (tx, val1) {
                                    if (val1.rows.item(0).sayi1 < 1) {
                                        tx.executeSql("insert into [BLOKOZET] (" + keysStr + ") values(" + Parameters + ")", values);
                                        self.querySuccess();
                                    }
                                })
                                say++;
                                if (say == j.length) {
                                    self.blokListeDownload(bloknos);
                                }
                            }), function (error) { alert(error); 
                                self.querySuccess();
                            };
                        });

                    })
                    .catch((error) => { alert("Hata:" + error); 
                    self.querySuccess();
                })

            },

            onlineDeleteBlok() {
                var self = this;
                console.log("onlineDeleteBlok başladı");
                var bloknos = "";
                var serviceUrl = 'https://vta.diyalog.com.tr/api/deleteBlok/' + window.localStorage["userGuid"];
                console.log("Service URL:", serviceUrl);
                axios.get(serviceUrl,"", config)
                    .then((response) => {
                        console.log("deleteBlok response:", response.data);
                        var items1 = [];
                        var j = jQuery.parseJSON(response.data);
                        var say = 0;
                        var blokno = '';
                        
                        // Eğer silinecek blok yoksa direkt onlineBlokIndir'e geç
                        if (j.length === 0) {
                            console.log("Silinecek blok yok, direkt onlineBlokIndir çağrılıyor");
                            self.onlineBlokIndir();
                            return;
                        }
                        
                        $.each(j, function (key, val) {
                            if (blokno != "") { blokno += ","; }
                            blokno += val.blokno;
                        })
                        db.transaction(function (tx) {
                            tx.executeSql("delete from [BLOKOZET] where blokno in (" + blokno + ") and userID=" + window.localStorage["userID"], [], function (tx1, res1) {
                                self.onlineBlokIndir();
                            })
                        },
                            function (error) {
                                self.onlineBlokIndir();
                                if (tanimliBlokYok)
                                { self.querySuccess(); }
                            },
                            function () {
                              
                                // if (tanimliBlokYok)
                                // { self.querySuccess(); }
                            }
                        )
                    })
                    .catch((error) => { 
                        console.log("onlineDeleteBlok HATA:", error);
                        alert("Hata:" + error); 
                    })
            },

             querySuccess() {
                var items1 = [];
                var self = this;
                var say = 0;
                db.transaction(function (tx) {
                    tx.executeSql("SELECT guid,blokno,iladi,ilceadi,koyadi,mahalleadi,statu,blokAciklama FROM BLOKOZET where userID=? order by blokno", [window.localStorage["userID"]], function (tx, val) {
                    //self.liste = val.rows;
					    var listeArray = [];

						for (var i = 0; i < val.rows.length; i++) {
							var row = val.rows.item(i);
							listeArray.push(row);
						}
						 self.liste = listeArray;
                         self.storageData(" (gonderim is null or gonderim=0) and InterviewStatu is not null and InterviewStatu<>0");
                    })

                });
                return items1.join("");
            }
        },
        beforeMount() {
            console.log("Vue beforeMount çağrıldı");
            //this.blokYukle();
        },
        mounted() {
            console.log("Vue mounted - instance hazır");
        }

    })
    console.log("Vue instance oluşturuldu:", window.blokOzet);

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        if (window.blokOzet) {
            // Vue instance'ının listeYukle methodunu çağır
            window.blokOzet.blokYukle();
        } else {
            console.error("Vue instance bulunamadı.");
        }
    }

})