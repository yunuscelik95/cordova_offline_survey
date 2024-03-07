var ziyaretSayisi = 100;
var guid = ""

window.addEventListener('load', () => {

    guid = getUrlVars()["guid"];

    const config = {
        headers: {
            'Content-Type': 'application/json;',
            'charset': 'utf-8'
        }
    }

    


    function getUrlVars() {
        var vars = [], hash;
        var indexofHash = window.location.href.indexOf('#');
        var hashes;
        if (indexofHash == -1) {
            hashes = window.location.href.slice((window.location.href.indexOf('?')) + 1).split('&');
        } else {
            hashes = window.location.href.slice((window.location.href.indexOf('#')) + 1).split('&');
        }
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }


    window.blokOzet = new Vue({
        el: "#blokliste",
        data: {
            liste: [],
            ziyaretSayisi: 1000
        },
        methods: {
            InterviewSelect(id) {
                window.localStorage["InterviewID"] = id;
                db.transaction(function (tx) {
                    tx.executeSql("SELECT InterviewID FROM INTERVIEWS where InterviewID=" + id, [], function (tx, val) {
                        var keys = [];
                        var values = [];
                        if (val.rows.length < 1) {
                            keys.push("InterviewID");
                            values.push(id);
                            tx.executeSql("insert into [INTERVIEWS] (InterviewID) values(?)", values);
    
                        }
                    });
                }
                    ,
                    function (error) {
                        alert(error.message);
                    },
                    function () {
    
                        //myUpdateRedirect("INTERVIEWS", "userID=" + window.localStorage["userID"].split('.')[0] + ",[start]= datetime('now'),ziyaretTarihi='',ziyaretAciklama=''", " InterviewID=" + id, "p3.html?id=" + id);
                        myUpdateRedirect("INTERVIEWS", "userID=" + window.localStorage["userID"].split('.')[0] + ",[start]= datetime('now'),ziyaretTarihi='',ziyaretAciklama=''", " InterviewID=" + id, "Giris.html?id=" + id);
                    }
                );
            },
    
            listeYukle(request) {
                console.log(request);
                liste = [];
                this.ziyaretSayisi = ziyaretSayisi;
                if (request == "") {
                    this.Offline("start");
                }
                else {
                    if (state.isOnline) {
                        deleteTable("LISTE", " where guid='" + guid + "'");
                        this.onlineYukleme();
                    }
                    else {
                        alert("Internetinizi kontrol ediniz!");
                        this.Offline("");
    
                    }
                }
            },
            Offline(request) {
                var self = this;
                db.transaction(function (tx) {
                    tx.executeSql("SELECT id, ilId, iladi ,ilceadi ,koyadi,mahalleadi ,cad_sok_ad ,binasitead ,binablokad ,diskapi_no ,ickapi_no,ziyaretTarihi,case when ZiyaretSayi is null then 0 else ZiyaretSayi end as ZiyaretSayi,statu,ResponseText, ResponseType FROM LISTE LEFT join RESPONSES on LISTE.statu=RESPONSES.ResponseID  where guid='" + guid + "' order by cad_sok_ad,diskapi_no,ickapi_no", [], function (tx, val) {
                            var listeArray = [];
                        
                        if (val.rows.length <1 && state.isOnline && request == "start")
                        {
                            self.onlineYukleme();
                            return true;
                        }
                        else
                        {
                            for (var i = 0; i < val.rows.length; i++) {
                                var row = val.rows.item(i);
                                listeArray.push(row);
                            }
                                self.liste = listeArray;
                        }
                        
                    })
                        , function (tx, error) {
                            console.log('Error : ' + error.message);
                            return true;
                        }
                });
            },
            onlineYukleme() {
                var request = new XMLHttpRequest();
                var serviceUrl = 'https://vta.diyalog.com.tr/api/getBlokListe/' + guid + '/' + window.localStorage["userGuid"];
                var self = this;
                axios.get(serviceUrl, "", config)
                    .then((response) => {
                        var items1 = [];
                        var j = jQuery.parseJSON(response.data);
                        var say = 0;
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
    
                            db.transaction(function (tx) {
                                tx.executeSql("insert into [LISTE] (" + keysStr + ") values(" + Parameters + ")", values);
                                say++;
                                if (say == j.length) {
                                    self.Offline("");
                                }
                            }), function (error) {
                             //   alert(error);
                            };
    
                        });
                    })
            }
        },
        beforeMount() {
            // this.listeYukle("");
        //  gps("stop");
        },
    })



    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {

        //db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
        //db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' }, openDatabaseSuccess, openDatabaseError);
        
        db.transaction(function (tx) {
            tx.executeSql("SELECT optionValue FROM OPTIONS where optionID=2", [], function (tx, val) {
                if (val.rows.length > 0) {
                    ziyaretSayisi = val.rows.item(0).optionValue;
                }

            }, function (tx, error) {
            
            })
        })

        if (window.blokOzet) {
            // Vue instance'ının listeYukle methodunu çağır
            window.blokOzet.listeYukle("");
        } else {
            console.error("Vue instance bulunamadı.");
        }

        //listeYukle("");
        //  gps("stop");
    }


})



    