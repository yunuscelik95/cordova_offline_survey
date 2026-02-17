
window.addEventListener('load', () => {
    //  const axios = require('axios');

    window.vueLogin = new Vue({
        el: "#login",
        data: {
            isButtonDisable: true,
            uname: "",
            psw: "",
            oran: 0

        },
        methods: {
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
                
                window.localStorage["version"] = "2.0.1";

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
                var request = new XMLHttpRequest();
                var serviceUrl = 'https://vta.diyalog.com.tr/api/version';
                axios.get(serviceUrl)
                    .then(response => {

                        var responseParse = JSON.parse(response.data);
                        // responseParse = JSON.parse(response);

                        myUpdate("OPTIONS", "optionValue=" + responseParse.ziyaretsayisi, " optionID=2");

                        if (responseParse.version != window.localStorage["version"]) {
                            if (responseParse.sonuc == "Delete") {
                                alert("Lütfen uygulamanın güncellenmiş versiyonunu yükleyiniz. Sisteme girişiniz engellenmiştir.");
                                //   deleteTable("users", "");
                            }
                            else {

                                alert("Lütfen uygulamanın güncellenmiş versiyonunu yükleyiniz.");
                                this.login();
                            }
                        }
                        else {
                            this.login();
                        }

                    }).catch(error => {
                       // alert(error);
                        this.login();
                    })
            }

        }
    })
})