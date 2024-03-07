var db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
function onLoad() {
    //  alert("geldik");
};
var userCreate = function () {
    db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS users([userID] text,[userName] text,[password] text,[guid] text)", [], function (tx, resp) {
            console.log("Kullanıcılar tablosu oluşturuldu");
        },
            // tx.executeSql  Error callback
         /*   function (error) {
                // Error executing query
                console.log("query error");
               // vent.trigger('assets:error');
            }*/
          
        );

    },
    function (error) {
            // Error executing query
            console.log("query error");
            // vent.trigger('assets:error');
        },
    function () {
        $("<ul/>", {
            "class": "my-new-list",
            html: "Yükleniyor...."
        }).appendTo("body");
        window.vueLogin.webApiCall();
    }
    );
}


var DropCreate = function () {

    var items1 = [];
    try {

        //    tx.executeSql("drop table BLOKOZET");
        db.transaction(function (tx) {
            tx.executeSql("drop table IF EXISTS BLOKOZET");
        },
            function (error) {
                items1.push("<li id='BlokOzet'>BLOKOZET ERROR   1</li>");
                $("<ul/>", {
                    "class": "my-new-list",
                    html: items1.join("")
                }).appendTo("body");
            },
            function () {
                db.transaction(function (tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS BLOKOZET([guid] text,[kirkent] text,[blockkoy] text,[iladi] text,[ilkayitno] text,[ilceadi] text,[ilcekayitn] text,[bucakadi] text,[bucakkayit] text,[koyadi] text,[koykayitno] text,[mahalleadi] text,[mahallekod] text,[blokno] INTEGER,[f1] text,[f2] text,[tabletId] text,[ilId] INTEGER,[bolgeId] INTEGER,[ilceId] INTEGER,[mahalleId] INTEGER,[anketDurumu] INTEGER,[userId] INTEGER,[ilceadieng] text,[mahalleadieng] text,[koyadieng] text,[iladieng] text,[statu] INTEGER,[aciklama] text,[blokAciklama] text,[Bgonderim] INTEGER)");
                    items1.push("<li id='BlokOzet'>BLOKOZET OK</li>");
                })

            }
        );

    } catch (e) {
        items1.push("<li id='BlokOzet'>BLOKOZET ERROR</li>");

    }


    try {
        db.transaction(function (tx) {
            tx.executeSql("drop table IF EXISTS LISTE");
        },
            function (error) {
                items1.push("<li id='BlokOzet'>LISTE ERROR   1</li>");
                $("<ul/>", {
                    "class": "my-new-list",
                    html: items1.join("")
                }).appendTo("body");
            },
            function () {
                db.transaction(function (tx) {
                    //   tx.executeSql("drop table LISTE");
                    tx.executeSql("CREATE TABLE IF NOT EXISTS LISTE([userId] INTEGER,[id] text,[guid] text,[iladi] text,[ilceadi] text,[koyadi] text,[mahalleadi] text,[blokno] text,[cad_sok_ad] text,[binasitead] text,[binablokad] text,[diskapi_no] text,[ickapi_no] text,[statu] text,[randevutarih] text,[blokstatu] text,[ListeDurum] text,[ZiyaretSayi] INTEGER,[class] text ,[IsCallBack] text,[isBack] INTEGER,[ziyaretTarihi] text,[ziyaretAciklama] text)");
                    items1.push("<li id='BlokOzet'>LISTE OK</li>");

                })
            });

    } catch (e) {
        items1.push("<li id='BlokOzet'>LISTE ERROR</li>");
    }

    var items1 = [];
    try {
        db.transaction(function (tx) {
            //    tx.executeSql("drop table RESPONSES");

            tx.executeSql("CREATE TABLE IF NOT EXISTS RESPONSES(ResponseID INTEGER,ResponseText text,IsCallBack text,ResponseType text,InsertedTime text,InsertedUser text,SortIndex text,class text,isBack text)");
            items1.push("<li id='BlokOzet'>RESPONSES OK</li>");
        });

    } catch (e) {
        items1.push("<li id='BlokOzet'>RESPONSES ERROR</li>");

    }

    $("<ul/>", {
        "class": "my-new-list",
        html: items1.join("")
    }).appendTo("body");

    try {
        db.transaction(function (tx) {
            tx.executeSql("drop table IF EXISTS INTERVIEWS");
        },
            function (error) {
                items1.push("<li id='BlokOzet'>INTERVIEWS ERROR   1</li>");
                /* $("<ul/>", {
                     "class": "my-new-list",
                     html: items1.join("")
                 }).appendTo("body");*/
            },
            function () {

                db.transaction(function (tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS INTERVIEWS([InterviewID] INTEGER,[guid] text,[InterviewStatu] INTEGER,[InterviewStatu2] INTEGER,[QuoteID] INTEGER,[userID] INTEGER,[userID2] INTEGER,[CallStat] INTEGER,[telefon] text,[ceptelefonu] text,[Rote] text,[RandevzousDate] datetime,[Start] datetime,[Stop] datetime,[lastpage] text,[startlanguage] text,[startdate] text,[datestamp] text,[blokno] text,[updatedate] datetime,[updatedate2] text,[bolgeId] INTEGER,[id] INTEGER,[datadurum] INTEGER,[randevutarih] text,[konum] text,[Latitude] text,[Longitude] text,[tabletID] INTEGER,[ilId] INTEGER,[GK_Yas_O] text,[GK_Cinsiyet] INTEGER,[GK_Egitim] INTEGER,[GK_Meslek] INTEGER,[GK_AdSoyad_O] text,[GK_Yas] INTEGER,[GK_AdSoyad] INTEGER,[GK_YasGrup] INTEGER,[AggMeslekOpen] INTEGER,[AggMeslekOpen_O] text,[haneKontrol] INTEGER,[haneKontrol2] INTEGER,[startlatitude] text,[stoplatitude] text,[startlongitude] text,[stoplongitude] text,[MapKontrol] INTEGER,[tkkontrol] INTEGER,[gonderim] INTEGER,[F1] INTEGER,[T1] INTEGER,[A1] INTEGER,[A2] INTEGER,[E3b] INTEGER,[B1] INTEGER,[B1_O] text,[C1] text,[C1_O_1] text,[C1_O_2] text,[C1_O_3] text,[C2] INTEGER,[GK] INTEGER,[GK_O] text,[B3_1_1] text,[B3_2_1] text,[B4_1] INTEGER,[B4_2] INTEGER,[B5_1] INTEGER,[B5_2] INTEGER,[B6_1] INTEGER,[B6_2] INTEGER,[B6A_1] INTEGER,[B6A_2] INTEGER,[B7_1] INTEGER,[B7_2] INTEGER,[B2_1_1] text,[B2_2_1] text,[hataB6] text,[tela] INTEGER,[tel_O_1] text,[tel_O_2] text,[tel_O_3] text,[C3] text,[C3_O_1] text,[C3_O_2] text,[tela_O] text,[tel] text,[ziyaretTarihi] text,[ziyaretAciklama] text,[ZiyaretSayi] INTEGER,[Not_O] text)");
                    items1.push("<li id='BlokOzet'>INTERVIEWS OK</li>");
                    /*  $("<ul/>", {
                          "class": "my-new-list",
                          html: items1.join("")
                      }).appendTo("body");*/
                })
            }

        )

    } catch (e) {
        items1.push("<li id='BlokOzet'>INTERVIEWS ERROR</li>");
        /* $("<ul/>", {
             "class": "my-new-list",
             html: items1.join("")
         }).appendTo("body");*/
    }

    var items1 = [];

    try {
        db.transaction(function (tx) {
            tx.executeSql("drop table IF EXISTS OPTIONS");
        },
            function (error) {
                items1.push("<li id='BlokOzet'>OPTIONS ERROR   1</li>");
                $("<ul/>", {
                    "class": "my-new-list",
                    html: items1.join("")
                }).appendTo("body");
            },
            function () {

                db.transaction(function (tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS OPTIONS([optionID] INTEGER,[optionValue] INTEGER,[OptionText] text)");

                    items1.push("<li id='BlokOzet'>OPTIONS OK</li>");
                    $("<ul/>", {
                        "class": "my-new-list",
                        html: items1.join("")
                    }).appendTo("body");
                },
                    function (error) { },
                    function () {
                        db.transaction(function (tx) {
                            tx.executeSql("delete from OPTIONS");
                            tx.executeSql("insert into OPTIONS(optionID,optionValue) values(1,1)");
                            tx.executeSql("insert into OPTIONS(optionID,optionValue) values(2,100)");

                        })
                    }
                )
            }

        )

    } catch (e) {
        items1.push("<li id='BlokOzet'>OPTIONS ERROR</li>");
        $("<ul/>", {
            "class": "my-new-list",
            html: items1.join("")
        }).appendTo("body");
    }


};

var create = function () {
    /*  db.transaction(function (tx) {
          tx.executeSql("CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
  
      });*/


    var items1 = [];
    try {

        //    tx.executeSql("drop table BLOKOZET");

        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS BLOKOZET([guid] text,[kirkent] text,[blockkoy] text,[iladi] text,[ilkayitno] text,[ilceadi] text,[ilcekayitn] text,[bucakadi] text,[bucakkayit] text,[koyadi] text,[koykayitno] text,[mahalleadi] text,[mahallekod] text,[blokno] INTEGER,[f1] text,[f2] text,[tabletId] text,[ilId] INTEGER,[bolgeId] INTEGER,[ilceId] INTEGER,[mahalleId] INTEGER,[anketDurumu] INTEGER,[userId] INTEGER,[ilceadieng] text,[mahalleadieng] text,[koyadieng] text,[iladieng] text,[statu] INTEGER,[aciklama] text,[blokAciklama] text,[Bgonderim] INTEGER)");
            items1.push("<li id='BlokOzet'>BLOKOZET OK</li>");
        })


    } catch (e) {
        items1.push("<li id='BlokOzet'>BLOKOZET ERROR</li>");

    }


    try {

        db.transaction(function (tx) {
            //   tx.executeSql("drop table LISTE");
            tx.executeSql("CREATE TABLE IF NOT EXISTS LISTE([userId] INTEGER,[id] text,[guid] text,[iladi] text,[ilceadi] text,[koyadi] text,[mahalleadi] text,[blokno] text,[cad_sok_ad] text,[binasitead] text,[binablokad] text,[diskapi_no] text,[ickapi_no] text,[statu] text,[randevutarih] text,[blokstatu] text,[ListeDurum] text,[ZiyaretSayi] INTEGER,[class] text ,[IsCallBack] text,[isBack] INTEGER,[ziyaretTarihi] text,[ziyaretAciklama] text)");
            items1.push("<li id='BlokOzet'>LISTE OK</li>");

        })


    } catch (e) {
        items1.push("<li id='BlokOzet'>LISTE ERROR</li>");
    }

    var items1 = [];
    try {
        db.transaction(function (tx) {
            //    tx.executeSql("drop table RESPONSES");

            tx.executeSql("CREATE TABLE IF NOT EXISTS RESPONSES(ResponseID INTEGER,ResponseText text,IsCallBack text,ResponseType text,InsertedTime text,InsertedUser text,SortIndex text,class text,isBack text)");
            items1.push("<li id='BlokOzet'>RESPONSES OK</li>");
        });

    } catch (e) {
        items1.push("<li id='BlokOzet'>RESPONSES ERROR</li>");

    }

    $("<ul/>", {
        "class": "my-new-list",
        html: items1.join("")
    }).appendTo("body");

    try {


        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS INTERVIEWS([InterviewID] INTEGER,[guid] text,[InterviewStatu] INTEGER,[InterviewStatu2] INTEGER,[QuoteID] INTEGER,[userID] INTEGER,[userID2] INTEGER,[CallStat] INTEGER,[telefon] text,[ceptelefonu] text,[Rote] text,[RandevzousDate] datetime,[Start] datetime,[Stop] datetime,[lastpage] text,[startlanguage] text,[startdate] text,[datestamp] text,[blokno] text,[updatedate] datetime,[updatedate2] text,[bolgeId] INTEGER,[id] INTEGER,[datadurum] INTEGER,[randevutarih] text,[konum] text,[Latitude] text,[Longitude] text,[tabletID] INTEGER,[ilId] INTEGER,[GK_Yas_O] text,[GK_Cinsiyet] INTEGER,[GK_Egitim] INTEGER,[GK_Meslek] INTEGER,[GK_AdSoyad_O] text,[GK_Yas] INTEGER,[GK_AdSoyad] INTEGER,[GK_YasGrup] INTEGER,[AggMeslekOpen] INTEGER,[AggMeslekOpen_O] text,[haneKontrol] INTEGER,[haneKontrol2] INTEGER,[startlatitude] text,[stoplatitude] text,[startlongitude] text,[stoplongitude] text,[MapKontrol] INTEGER,[tkkontrol] INTEGER,[gonderim] INTEGER,[F1] INTEGER,[T1] INTEGER,[A1] INTEGER,[A2] INTEGER,[E3b] INTEGER,[B1] INTEGER,[B1_O] text,[C1] text,[C1_O_1] text,[C1_O_2] text,[C1_O_3] text,[C2] INTEGER,[GK] INTEGER,[GK_O] text,[B3_1_1] text,[B3_2_1] text,[B4_1] INTEGER,[B4_2] INTEGER,[B5_1] INTEGER,[B5_2] INTEGER,[B6_1] INTEGER,[B6_2] INTEGER,[B6A_1] INTEGER,[B6A_2] INTEGER,[B7_1] INTEGER,[B7_2] INTEGER,[B2_1_1] text,[B2_2_1] text,[hataB6] text,[tela] INTEGER,[tel_O_1] text,[tel_O_2] text,[tel_O_3] text,[C3] text,[C3_O_1] text,[C3_O_2] text,[tela_O] text,[tel] text,[ziyaretTarihi] text,[ziyaretAciklama] text,[ZiyaretSayi] INTEGER,[Not_O] text)");
            items1.push("<li id='BlokOzet'>INTERVIEWS OK</li>");
            /*  $("<ul/>", {
                  "class": "my-new-list",
                  html: items1.join("")
              }).appendTo("body");*/
        })

    } catch (e) {
        items1.push("<li id='BlokOzet'>INTERVIEWS ERROR</li>");
        /*  $("<ul/>", {
              "class": "my-new-list",
              html: items1.join("")
          }).appendTo("body");*/
    }
    var items1 = [];
    try {

        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS OPTIONS([optionID] INTEGER,[optionValue] INTEGER,[OptionText] text)");

            items1.push("<li id='BlokOzet'>OPTIONS OK</li>");
            $("<ul/>", {
                "class": "my-new-list",
                html: items1.join("")
            }).appendTo("body");
        },
            function (error) { },
            function () {
                db.transaction(function (tx) {
                    tx.executeSql("delete from OPTIONS");
                    tx.executeSql("insert into OPTIONS(optionID,optionValue) values(1,1)");
                    tx.executeSql("insert into OPTIONS(optionID,optionValue) values(2,100)");
                })
            }
        )
    } catch (e) {
        items1.push("<li id='BlokOzet'>OPTIONS ERROR</li>");
        $("<ul/>", {
            "class": "my-new-list",
            html: items1.join("")
        }).appendTo("body");
    }


};


var insert = function (firstname, lastname) {

    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO people (firstname, lastname) VALUES (?,?)", [firstname, lastname]);
        tx.executeSql("insert into blokozet (iladi) values(?)", [firstname]);
    });
};


var deleteTable = function (table, where) {
    db.transaction(function (tx) {
        tx.executeSql("delete from [" + table + "] " + where);
    },function (error) {
        alert(error.message);
    },
    function () {
      
        if (table == "users" && where == "")
        {
            userCreate(); 
        }
        
    });
};

var myInsert2 = function (table, keys, values, isDelete) {
    var keystr = "";
    var valuestr = "";
    var isaret = "";
    for (var i = 0; i < keys.length; i++) {
        if (keystr !== "") {
            keystr += ",";
            valuestr += ",";
            isaret += ",";
        }
        keystr += "[" + keys[i] + "]";
        valuestr += "\"" + values[i] + "\"";
        isaret += "?";
    }



    db.transaction(function (tx) {
        //  console.log("insert into BLOKOZET(" + keystr + ") values(" + isaret + ")");


        tx.executeSql("insert into [" + table + "] (" + keystr + ") values(" + isaret + ")", values);
    }), function (error) {
        alert(error);
    };
};

//bunu çağır bakalım 
var myInsert = function (iladi) {

    db.transaction(function (tx) {
        tx.executeSql("insert into blokozet (iladi) values(?)", [iladi]);
    });
};

var myUpdate = function (table, updatestr, where) {

    db.transaction(function (tx) {
        //  alert("update [" + table + '] set ' + updatestr + ' where ' + where);
        tx.executeSql("update [" + table + '] set ' + updatestr + ' where ' + where);
        //    alert("update [" + table + '] set ' + updatestr + ' where ' + where);

    },
        function (error) {
            alert(error.message);
        },
        function () {
        });

};

var myUpdateRedirect = function (table, updatestr, where, question) {

    db.transaction(function (tx) {
        //  alert("update [" + table + '] set ' + updatestr + ' where ' + where);
        tx.executeSql("update [" + table + '] set ' + updatestr + ' where ' + where);
        //   alert("update [" + table + '] set ' + updatestr + ' where ' + where);

    },
        function (error) {
            alert(error.message);
        },
        function () {

            if (question == "blokOzet.html" && updatestr.indexOf("InterviewStatu") > -1) {
               window.localStorage["InterviewID"] = "";
            }
            if (window.localStorage["InterviewID"] == "") {
                window.location.href = "blokOzet.html";
            }
            window.location.href = question;
        }
    );

};


/* var keystr = "";
 var valuestr = "";
 for (var i = 0; i < keys.length; i++) {
     if (keystr !== "") {
         keystr += ",";
         valuestr += ",";
     }
     keystr += keys[i];
     valuestr += values[i];
 }
 
 
 
 db.transaction(function (tx) {
     tx.executeSql("INSERT INTO [" + table + "] (" + keystr + ") select " + valuestr);
 });*/




var select = function () {
    db.transaction(function (tx) {
        tx.executeSql("SELECT userId,guid,ilId,iladi,ilceadi,koyadi,mahalleadi,blokno,Yapilan,Kalan,blokstatu,BlokAciklama,aciklama FROM BLOKOZET", [], function (tx, results) {
            if (results.rows.length > 0) {
                for (var i = 0; i < results.rows.length; i++) {

                    console.log("Result -> " + results.rows.item(i).firstname + " " + results.rows.item(i).lastname);
                }
            }
        });
    });

};
