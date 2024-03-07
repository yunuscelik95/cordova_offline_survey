//var db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
var db;

var options = {
    name: 'my.db',
    location: 'default',
    androidDatabaseProvider: 'system',
    androidLockWorkaround: 1,
    androidPromptForLocation: 1,
    createFromLocation: 1,
    maxPreparedStatements: 10
};

// SQLite veritabanına bağlanma
var openDatabaseSuccess = function () {
    console.log("Veritabanına başarıyla bağlanıldı.");
    userCreate(function (success) {
        if (success) {
            console.log("db open.");
            // İşlemlerinizi burada devam ettirebilirsiniz
        } else {
            console.log("error db open error.");
        }
    });
};

var openDatabaseError = function (error) {
    console.error("Veritabanına bağlanırken hata oluştu: " + error.message);
};

document.addEventListener('deviceready', function () {
	
	if (!window.localStorage.getItem('databaseInitialized')) {
        // Veritabanınızı oluşturun
        db = window.sqlitePlugin.openDatabase(options, openDatabaseSuccess, openDatabaseError);

        // İlk açılışta oluşturuldu işaretini kaydedin
        window.localStorage.setItem('databaseInitialized', true);
    } else {
        // Daha önce oluşturulduysa sadece bağlanın
        db = window.sqlitePlugin.openDatabase(options, openDatabaseSuccess, openDatabaseError);
    }
	db.executeSql('PRAGMA busy_timeout = 5000');
    //db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' }, openDatabaseSuccess, openDatabaseError);
});

var userCreate = function (callback) {
    db.transaction(function (tx) {
			  tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", [], function (tx, result) {
				if (result.rows.length < 1) {
						tx.executeSql("CREATE TABLE IF NOT EXISTS users([userID] text,[userName] text,[password] text,[guid] text)", [], function (tx, resp) {
							console.log("Kullanıcılar tablosu oluşturuldu");
							if (callback) {
								callback(true); // Başarıyla tamamlandı
							}
						})	
					}
				})	
        },
        function (error) {
            console.log("Query hatası: " + error.message);
            if (callback) {
                callback(false); // Hata oluştu
            }
        });
};

 var responsesFunc =   function() {
                var request = new XMLHttpRequest();
                var serviceUrl = 'https://vta.diyalog.com.tr/api/responses';
                deleteTable("RESPONSES", "")
                axios.get(serviceUrl)
                    .then(response => {
                        var items1 = [];
                        var j = jQuery.parseJSON(response.data);
                        $.each(j, function (key, val) {
                            var keys = [];
                            var values = [];
                            $.each(val, function (key1, val1) {
                                keys.push(key1);
                                values.push(val1);
                            });
                            myInsert2("RESPONSES", keys, values, false);
                        })
                    })
            };
			
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
            tx.executeSql("DROP TABLE IF EXISTS LISTE", [], function () {
                console.log("LISTE tablosu başarıyla silindi.");
            }, function (tx, error) {
                console.error("LISTE tablosunu silme hatası: " + error.message);
            });
        },
            function (error) {
                console.error("LISTE tablosunu silme hatası: " + error.message);
                items1.push("<li id='BlokOzet'>LISTE ERROR 1</li>");
              },
            function () {
                db.transaction(function (tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS LISTE(" +
                        "[userId] INTEGER," +
                        "[id] TEXT," +
                        "[guid] TEXT," +
                        "[ilId] TEXT," +
                        "[iladi] TEXT," +
                        "[ilceadi] TEXT," +
                        "[koyadi] TEXT," +
                        "[mahalleadi] TEXT," +
                        "[blokno] TEXT," +
                        "[cad_sok_ad] TEXT," +
                        "[binasitead] TEXT," +
                        "[binablokad] TEXT," +
                        "[diskapi_no] TEXT," +
                        "[ickapi_no] TEXT," +
                        "[statu] TEXT," +
                        "[randevutarih] TEXT," +
                        "[blokstatu] TEXT," +
                        "[ListeDurum] TEXT," +
                        "[ZiyaretSayi] INTEGER," +
                        "[class] TEXT," +
                        "[IsCallBack] TEXT," +
                        "[isBack] INTEGER," +
                        "[ziyaretTarihi] TEXT," +
                        "[ziyaretAciklama] TEXT)", [], function () {
                            console.log("LISTE tablosu başarıyla oluşturuldu.");
                            items1.push("<li id='BlokOzet'>LISTE OK</li>");
                            $("<ul/>", {
                                "class": "my-new-list",
                                html: items1.join("")
                            }).appendTo("body");
                        }, function (tx, error) {
                            console.error("LISTE tablosunu oluşturma hatası: " + error.message);
                            items1.push("<li id='BlokOzet'>LISTE CREATE TABLE ERROR</li>");
                            $("<ul/>", {
                                "class": "my-new-list",
                                html: items1.join("")
                            }).appendTo("body");
                        });
                });
            });
    
    } catch (e) {
        console.error("Hata oluştu: " + e.message);
        items1.push("<li id='BlokOzet'>LISTE ERROR</li>");
  
    }
        
    var items1 = [];
    try {
        db.transaction(function (tx) {
            tx.executeSql("DROP TABLE IF EXISTS RESPONSES", [], function () {
                console.log("RESPONSES tablosu başarıyla silindi.");
            }, function (tx, error) {
                console.error("RESPONSES tablosunu silme hatası: " + error.message);
            });
        },
            function (error) {
                console.error("RESPONSES tablosunu silme hatası: " + error.message);
                items1.push("<li id='BlokOzet'>RESPONSES ERROR 1</li>");
                
            },
            function () {

                    db.transaction(function (tx) {
                        //    tx.executeSql("drop table RESPONSES");

                        tx.executeSql("CREATE TABLE IF NOT EXISTS RESPONSES(ResponseID INTEGER,ResponseText text,IsCallBack text,ResponseType text,InsertedTime text,InsertedUser text,SortIndex text)", [], function () {
                           responsesFunc();
                            items1.push("<li id='BlokOzet'>RESPONSES OK</li>");
                        });
            
                    });
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
            tx.executeSql("drop table IF EXISTS INTERVIEWS", [], function () {
                                    tx.executeSql(
                                        "CREATE TABLE IF NOT EXISTS INTERVIEWS([InterviewID] INTEGER,[guid] TEXT,[InterviewStatu] INTEGER,[InterviewStatu2] INTEGER,[QuoteID] INTEGER,[userID] INTEGER,[userID2] INTEGER,[CallStat] INTEGER,[telefon] TEXT,[ceptelefonu] TEXT,[Rote] TEXT,[RandevzousDate] datetime,[Start] datetime,[Stop] datetime,[lastpage] TEXT,[startlanguage] TEXT,[startdate] TEXT,[datestamp] TEXT,[blokno] TEXT,[updatedate] datetime,[updatedate2] TEXT,[bolgeId] INTEGER,[id] INTEGER,[datadurum] INTEGER,[randevutarih] TEXT,[konum] TEXT,[Latitude] TEXT,[Longitude] TEXT,[tabletID] INTEGER,[ilId] INTEGER,[GK_Yas_O] TEXT,[GK_Cinsiyet] INTEGER,[GK_Egitim] INTEGER,[GK_Meslek] INTEGER,[GK_AdSoyad_O] TEXT,[GK_Yas] INTEGER,[GK_AdSoyad] INTEGER,[GK_YasGrup] INTEGER,[AggMeslekOpen] INTEGER,[AggMeslekOpen_O] TEXT,[haneKontrol] INTEGER,[haneKontrol2] INTEGER,[startlatitude] TEXT,[stoplatitude] TEXT,[startlongitude] TEXT,[stoplongitude] TEXT,[MapKontrol] INTEGER,[tkkontrol] INTEGER,[gonderim] INTEGER, [T1] INTEGER, [A1] INTEGER, [A2a1] INTEGER, [E3b] INTEGER, [B1] INTEGER, [B1_O] TEXT, [C2] TEXT, [C2_O_1] TEXT, [C2_O_2] TEXT, [C2_O_3] TEXT, [C3] INTEGER, [D6_O_2_2] TEXT, [D6_O_3_2] TEXT, [D6_O_4_2] TEXT, [D6_O_5_2] TEXT, [GK] INTEGER, [GK_O] TEXT, [B3_1_1] INTEGER, [B3_2_1] INTEGER, [B4_1] INTEGER, [B4_2] INTEGER, [B5_1] INTEGER, [B5_2] INTEGER, [hata] TEXT, [B6_1] INTEGER, [B6_2] INTEGER, [B7_1] INTEGER, [B7_2] INTEGER, [B2a_1_1] TEXT, [B2a_2_1] TEXT, [tel_O] TEXT, [C4] TEXT, [C4_O_1] TEXT, [C4_O_2] TEXT, [C4_O_3] TEXT, [B2Text] TEXT, [ziyaretTarihi] TEXT, [ziyaretAciklama] TEXT, [ZiyaretSayi] INTEGER, [Nott] INTEGER, [Nott_O] TEXT, [Itk] INTEGER, [Ibackcheck] INTEGER, [Ieslik] INTEGER, [adres] TEXT, [anketorOnay] INTEGER, [PART2] INTEGER, [Not_O] TEXT, [A1a1] INTEGER, [A1a2] INTEGER, [A1b] INTEGER, [A1b_O] TEXT, [A1c] TEXT, [A1c_O_97] TEXT, [B9] INTEGER, [B101] INTEGER, [B101_O] TEXT, [B103] INTEGER, [B103_O] TEXT, [B104] INTEGER, [B105] INTEGER, [B105_O] TEXT, [B12] INTEGER, [B13] INTEGER, [B2a_16_1] TEXT, [B2a_11_1] TEXT, [B2a_10_1] TEXT, [B2a_15_1] TEXT, [B2a_14_1] TEXT, [B2a_13_1] TEXT, [B2a_12_1] TEXT, [B2a_9_1] TEXT, [B2a_8_1] TEXT, [B2a_7_1] TEXT, [B2a_6_1] TEXT, [B2a_5_1] TEXT, [B2a_4_1] TEXT, [B2a_3_1] TEXT, [B2a_17_1] TEXT, [B2a_18_1] TEXT, [B2a_19_1] TEXT, [B2a_20_1] TEXT, [B22] INTEGER, [B3_3_1] TEXT, [B3_4_1] TEXT, [B3_5_1] TEXT, [B3_6_1] TEXT, [B3_7_1] TEXT, [B3_8_1] TEXT, [B3_9_1] TEXT, [B3_10_1] TEXT, [B3_11_1] TEXT, [B3_12_1] TEXT, [B3_13_1] TEXT, [B3_14_1] TEXT, [B3_15_1] TEXT, [B3_16_1] TEXT, [B3_17_1] TEXT, [B3_18_1] TEXT, [B3_19_1] TEXT, [B3_20_1] TEXT, [B4_3] INTEGER, [B4_4] INTEGER, [B4_5] INTEGER, [B4_6] INTEGER, [B4_7] INTEGER, [B4_8] INTEGER, [B4_9] INTEGER, [B4_10] INTEGER, [B4_11] INTEGER, [B4_12] INTEGER, [B4_13] INTEGER, [B4_14] INTEGER, [B4_15] INTEGER, [B4_16] INTEGER, [B4_17] INTEGER, [B4_18] INTEGER, [B4_19] INTEGER, [B4_20] INTEGER, [B5_3] INTEGER, [B5_4] INTEGER, [B5_5] INTEGER, [B5_6] INTEGER, [B5_7] INTEGER, [B5_8] INTEGER, [B5_9] INTEGER, [B5_10] INTEGER, [B5_11] INTEGER, [B5_12] INTEGER, [B5_13] INTEGER, [B5_14] INTEGER, [B5_15] INTEGER, [B5_16] INTEGER, [B5_17] INTEGER, [B5_18] INTEGER, [B5_19] INTEGER, [B5_20] INTEGER, [B6_4] INTEGER, [B6_3] INTEGER, [B6_5] INTEGER, [B6_6] INTEGER, [B6_7] INTEGER, [B6_8] INTEGER, [B6_9] INTEGER, [B6_10] INTEGER, [B6_11] INTEGER, [B6_12] INTEGER, [B6_13] INTEGER, [B6_14] INTEGER, [B6_15] INTEGER, [B6_16] INTEGER, [B6_17] INTEGER, [B6_18] INTEGER, [B6_19] INTEGER, [B6_20] INTEGER, [B7_3] INTEGER, [B7_4] INTEGER, [B7_5] INTEGER, [B7_6] INTEGER, [B7_7] INTEGER, [B7_8] INTEGER, [B7_9] INTEGER, [B7_10] INTEGER, [B7_11] INTEGER, [B7_12] INTEGER, [B7_13] INTEGER, [B7_14] INTEGER, [B7_15] INTEGER, [B7_16] INTEGER, [B7_17] INTEGER, [B7_18] INTEGER, [B7_19] INTEGER, [B7_20] INTEGER, [B8e] INTEGER, [A2] TEXT, [B6A_1] TEXT, [B6A_2] TEXT, [F1] INTEGER, [hataB6] TEXT, [tel] TEXT, [tel_O_1] TEXT, [tel_O_2] TEXT, [tel_O_3] TEXT, [tela] INTEGER, [tela_O] TEXT, [B2b_1] INTEGER, [B2b_O_1_97] TEXT, [B2b_2] INTEGER, [B2b_O_2_97] TEXT, [B2b_3] INTEGER, [B2b_O_3_97] TEXT, [B2b_4] INTEGER, [B2b_O_4_97] TEXT, [B2b_5] INTEGER, [B2b_O_5_97] TEXT, [B2b_6] INTEGER, [B2b_O_6_97] TEXT, [B2b_7] INTEGER, [B2b_O_7_97] TEXT, [B2b_8] INTEGER, [B2b_O_8_97] TEXT, [B2b_9] INTEGER, [B2b_O_9_97] TEXT, [B2b_10] INTEGER, [B2b_O_10_97] TEXT, [B2b_11] INTEGER, [B2b_O_11_97] TEXT, [B2b_12] INTEGER, [B2b_O_12_97] TEXT, [B2b_13] INTEGER, [B2b_O_13_97] TEXT, [B2b_14] INTEGER, [B2b_O_14_97] TEXT, [B2b_15] INTEGER, [B2b_O_15_97] TEXT, [B2b_16] INTEGER, [B2b_O_16_97] TEXT, [B2b_17] INTEGER, [B2b_O_17_97] TEXT, [B2b_18] INTEGER, [B2b_O_18_97] TEXT, [B2b_19] INTEGER, [B2b_O_19_97] TEXT, [B2b_20] INTEGER, [B2b_O_20_97] TEXT, [B8H] INTEGER, [B8A] INTEGER, [A4A5_2] INTEGER, [A4A5_1] INTEGER, [A4A5_20] INTEGER, [A4A5_19] INTEGER, [A4A5_18] INTEGER, [A4A5_17] INTEGER, [A4A5_16] INTEGER, [A4A5_15] INTEGER, [A4A5_14] INTEGER, [A4A5_13] INTEGER, [A4A5_12] INTEGER, [A4A5_11] INTEGER, [A4A5_10] INTEGER, [A4A5_9] INTEGER, [A4A5_8] INTEGER, [A4A5_7] INTEGER, [A4A5_6] INTEGER, [A4A5_5] INTEGER, [A4A5_4] INTEGER, [A4A5_3] INTEGER, [A4B5_20] INTEGER, [A4B5_19] INTEGER, [A4B5_18] INTEGER, [A4B5_17] INTEGER, [A4B5_16] INTEGER, [A4B5_15] INTEGER, [A4B5_14] INTEGER, [A4B5_13] INTEGER, [A4B5_12] INTEGER, [A4B5_11] INTEGER, [A4B5_10] INTEGER, [A4B5_9] INTEGER, [A4B5_8] INTEGER, [A4B5_7] INTEGER, [A4B5_6] INTEGER, [A4B5_5] INTEGER, [A4B5_4] INTEGER, [A4B5_3] INTEGER, [A4B5_2] INTEGER, [A4B5_1] INTEGER, [A4C5_2] INTEGER, [A4C5_1] INTEGER, [A4C5_3] INTEGER, [A4C5_4] INTEGER, [A4C5_5] INTEGER, [A4C5_6] INTEGER, [A4C5_7] INTEGER, [A4C5_8] INTEGER, [A4C5_9] INTEGER, [A4C5_10] INTEGER, [A4C5_11] INTEGER, [A4C5_12] INTEGER, [A4C5_13] INTEGER, [A4C5_14] INTEGER, [A4C5_15] INTEGER, [A4C5_16] INTEGER, [A4C5_17] INTEGER, [A4C5_18] INTEGER, [A4C5_19] INTEGER, [A4C5_20] INTEGER, [A4A1] INTEGER, [A4A1_O] TEXT, [A4A3] TEXT, [A4B1] INTEGER, [A4B1_O] TEXT, [A4B3] TEXT, [A4C1] INTEGER, [A4C1_O] TEXT, [A4C3] TEXT, [A4D1] INTEGER, [A4D1_O] TEXT, [A4D3] TEXT, [A4E1] INTEGER, [A4E1_O] TEXT, [A4E3] TEXT, [A4E5_1] INTEGER, [A4E5_2] INTEGER, [A4E5_3] INTEGER, [A4E5_4] INTEGER, [A4E5_5] INTEGER, [A4E5_6] INTEGER, [A4E5_7] INTEGER, [A4E5_8] INTEGER, [A4E5_9] INTEGER, [A4E5_10] INTEGER, [A4E5_11] INTEGER, [A4E5_12] INTEGER, [A4E5_13] INTEGER, [A4E5_14] INTEGER, [A4E5_15] INTEGER, [A4E5_16] INTEGER, [A4E5_17] INTEGER, [A4E5_18] INTEGER, [A4E5_19] INTEGER, [A4E5_20] INTEGER, [C4_O_4] TEXT, [C4_O_5] TEXT, [C4_O_6] TEXT, [C4_O_7] TEXT, [C4_O_8] TEXT, [C4_O_9] TEXT, [C4_O_10] TEXT, [C4_O_11] TEXT, [C4_O_12] TEXT, [C4_O_13] TEXT, [C4_O_14] TEXT, [C4_O_15] TEXT, [C4_O_16] TEXT, [C4_O_17] TEXT, [C4_O_18] TEXT, [C4_O_19] TEXT, [C4_O_20] TEXT, [C1] INTEGER, [Last_B8_20] INTEGER, [Last_B8_19] INTEGER, [Last_B8_18] INTEGER, [Last_B8_17] INTEGER, [Last_B8_16] INTEGER, [Last_B8_15] INTEGER, [Last_B8_14] INTEGER, [Last_B8_13] INTEGER, [Last_B8_12] INTEGER, [Last_B8_11] INTEGER, [Last_B8_10] INTEGER, [Last_B8_9] INTEGER, [Last_B8_8] INTEGER, [Last_B8_7] INTEGER, [Last_B8_6] INTEGER, [Last_B8_5] INTEGER, [Last_B8_4] INTEGER, [Last_B8_3] INTEGER, [Last_B8_2] INTEGER, [Last_B8_1] INTEGER, [B8] INTEGER, [panelK] INTEGER, [A2a2a1] TEXT, [A2a2a1_O_97] TEXT, [A2a2a2] TEXT, [A2a2a2_O_97] TEXT, [A2a2a3] TEXT, [A2a2a4] TEXT, [A2a2a3_O_97] TEXT, [A2a2a4_O_97] TEXT, [A2a2a5] TEXT, [A4A4] INTEGER, [A4B4] INTEGER, [A4C4] INTEGER, [A2a2a5_O_97] TEXT, [A4E4] INTEGER, [B2b_O_97] TEXT, [P1_9] INTEGER, [P1_8] INTEGER, [P1_7] INTEGER, [P1_6] INTEGER, [P1_5] INTEGER, [P1_4] INTEGER, [P1_3] INTEGER, [P1_2] INTEGER, [P1_1] INTEGER, [B106] INTEGER, [B107] INTEGER)"
                                    , [], function () {
                                    items1.push("<li id='BlokOzet'>INTERVIEWS OK</li>");
                                }, function (tx, error) {
                                            console.error("INTERVIEWS tablosu oluşturulamadı " + error.message);
                                            });
            }, function (tx, error) {
                           console.error("INTERVIEWS tablosunu silme hatası: " + error.message);
        });
        },
        function (error) {
            items1.push("<li id='BlokOzet'>INTERVIEWS ERROR   1</li>");
            /* $("<ul/>", {
                 "class": "my-new-list",
                 html: items1.join("")
             }).appendTo("body");*/
        },
        function () {


        });

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
            tx.executeSql("CREATE TABLE IF NOT EXISTS LISTE([userId] INTEGER,[id] text,[guid] text ,[ilId] INTEGER, [iladi] text,[ilceadi] text,[koyadi] text,[mahalleadi] text,[blokno] text,[cad_sok_ad] text,[binasitead] text,[binablokad] text,[diskapi_no] text,[ickapi_no] text,[statu] text,[randevutarih] text,[blokstatu] text,[ListeDurum] text,[ZiyaretSayi] INTEGER,[class] text ,[IsCallBack] text,[isBack] INTEGER,[ziyaretTarihi] text,[ziyaretAciklama] text)");
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
			responsesFunc();
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
            tx.executeSql("drop table IF EXISTS INTERVIEWS", [], function () {
                                    tx.executeSql(
                                        "CREATE TABLE IF NOT EXISTS INTERVIEWS([InterviewID] INTEGER,[guid] TEXT,[InterviewStatu] INTEGER,[InterviewStatu2] INTEGER,[QuoteID] INTEGER,[userID] INTEGER,[userID2] INTEGER,[CallStat] INTEGER,[telefon] TEXT,[ceptelefonu] TEXT,[Rote] TEXT,[RandevzousDate] datetime,[Start] datetime,[Stop] datetime,[lastpage] TEXT,[startlanguage] TEXT,[startdate] TEXT,[datestamp] TEXT,[blokno] TEXT,[updatedate] datetime,[updatedate2] TEXT,[bolgeId] INTEGER,[id] INTEGER,[datadurum] INTEGER,[randevutarih] TEXT,[konum] TEXT,[Latitude] TEXT,[Longitude] TEXT,[tabletID] INTEGER,[ilId] INTEGER,[GK_Yas_O] TEXT,[GK_Cinsiyet] INTEGER,[GK_Egitim] INTEGER,[GK_Meslek] INTEGER,[GK_AdSoyad_O] TEXT,[GK_Yas] INTEGER,[GK_AdSoyad] INTEGER,[GK_YasGrup] INTEGER,[AggMeslekOpen] INTEGER,[AggMeslekOpen_O] TEXT,[haneKontrol] INTEGER,[haneKontrol2] INTEGER,[startlatitude] TEXT,[stoplatitude] TEXT,[startlongitude] TEXT,[stoplongitude] TEXT,[MapKontrol] INTEGER,[tkkontrol] INTEGER,[gonderim] INTEGER, [T1] INTEGER, [A1] INTEGER, [A2a1] INTEGER, [E3b] INTEGER, [B1] INTEGER, [B1_O] TEXT, [C2] TEXT, [C2_O_1] TEXT, [C2_O_2] TEXT, [C2_O_3] TEXT, [C3] INTEGER, [D6_O_2_2] TEXT, [D6_O_3_2] TEXT, [D6_O_4_2] TEXT, [D6_O_5_2] TEXT, [GK] INTEGER, [GK_O] TEXT, [B3_1_1] INTEGER, [B3_2_1] INTEGER, [B4_1] INTEGER, [B4_2] INTEGER, [B5_1] INTEGER, [B5_2] INTEGER, [hata] TEXT, [B6_1] INTEGER, [B6_2] INTEGER, [B7_1] INTEGER, [B7_2] INTEGER, [B2a_1_1] TEXT, [B2a_2_1] TEXT, [tel_O] TEXT, [C4] TEXT, [C4_O_1] TEXT, [C4_O_2] TEXT, [C4_O_3] TEXT, [B2Text] TEXT, [ziyaretTarihi] TEXT, [ziyaretAciklama] TEXT, [ZiyaretSayi] INTEGER, [Nott] INTEGER, [Nott_O] TEXT, [Itk] INTEGER, [Ibackcheck] INTEGER, [Ieslik] INTEGER, [adres] TEXT, [anketorOnay] INTEGER, [PART2] INTEGER, [Not_O] TEXT, [A1a1] INTEGER, [A1a2] INTEGER, [A1b] INTEGER, [A1b_O] TEXT, [A1c] TEXT, [A1c_O_97] TEXT, [B9] INTEGER, [B101] INTEGER, [B101_O] TEXT, [B103] INTEGER, [B103_O] TEXT, [B104] INTEGER, [B105] INTEGER, [B105_O] TEXT, [B12] INTEGER, [B13] INTEGER, [B2a_16_1] TEXT, [B2a_11_1] TEXT, [B2a_10_1] TEXT, [B2a_15_1] TEXT, [B2a_14_1] TEXT, [B2a_13_1] TEXT, [B2a_12_1] TEXT, [B2a_9_1] TEXT, [B2a_8_1] TEXT, [B2a_7_1] TEXT, [B2a_6_1] TEXT, [B2a_5_1] TEXT, [B2a_4_1] TEXT, [B2a_3_1] TEXT, [B2a_17_1] TEXT, [B2a_18_1] TEXT, [B2a_19_1] TEXT, [B2a_20_1] TEXT, [B22] INTEGER, [B3_3_1] TEXT, [B3_4_1] TEXT, [B3_5_1] TEXT, [B3_6_1] TEXT, [B3_7_1] TEXT, [B3_8_1] TEXT, [B3_9_1] TEXT, [B3_10_1] TEXT, [B3_11_1] TEXT, [B3_12_1] TEXT, [B3_13_1] TEXT, [B3_14_1] TEXT, [B3_15_1] TEXT, [B3_16_1] TEXT, [B3_17_1] TEXT, [B3_18_1] TEXT, [B3_19_1] TEXT, [B3_20_1] TEXT, [B4_3] INTEGER, [B4_4] INTEGER, [B4_5] INTEGER, [B4_6] INTEGER, [B4_7] INTEGER, [B4_8] INTEGER, [B4_9] INTEGER, [B4_10] INTEGER, [B4_11] INTEGER, [B4_12] INTEGER, [B4_13] INTEGER, [B4_14] INTEGER, [B4_15] INTEGER, [B4_16] INTEGER, [B4_17] INTEGER, [B4_18] INTEGER, [B4_19] INTEGER, [B4_20] INTEGER, [B5_3] INTEGER, [B5_4] INTEGER, [B5_5] INTEGER, [B5_6] INTEGER, [B5_7] INTEGER, [B5_8] INTEGER, [B5_9] INTEGER, [B5_10] INTEGER, [B5_11] INTEGER, [B5_12] INTEGER, [B5_13] INTEGER, [B5_14] INTEGER, [B5_15] INTEGER, [B5_16] INTEGER, [B5_17] INTEGER, [B5_18] INTEGER, [B5_19] INTEGER, [B5_20] INTEGER, [B6_4] INTEGER, [B6_3] INTEGER, [B6_5] INTEGER, [B6_6] INTEGER, [B6_7] INTEGER, [B6_8] INTEGER, [B6_9] INTEGER, [B6_10] INTEGER, [B6_11] INTEGER, [B6_12] INTEGER, [B6_13] INTEGER, [B6_14] INTEGER, [B6_15] INTEGER, [B6_16] INTEGER, [B6_17] INTEGER, [B6_18] INTEGER, [B6_19] INTEGER, [B6_20] INTEGER, [B7_3] INTEGER, [B7_4] INTEGER, [B7_5] INTEGER, [B7_6] INTEGER, [B7_7] INTEGER, [B7_8] INTEGER, [B7_9] INTEGER, [B7_10] INTEGER, [B7_11] INTEGER, [B7_12] INTEGER, [B7_13] INTEGER, [B7_14] INTEGER, [B7_15] INTEGER, [B7_16] INTEGER, [B7_17] INTEGER, [B7_18] INTEGER, [B7_19] INTEGER, [B7_20] INTEGER, [B8e] INTEGER, [A2] TEXT, [B6A_1] TEXT, [B6A_2] TEXT, [F1] INTEGER, [hataB6] TEXT, [tel] TEXT, [tel_O_1] TEXT, [tel_O_2] TEXT, [tel_O_3] TEXT, [tela] INTEGER, [tela_O] TEXT, [B2b_1] INTEGER, [B2b_O_1_97] TEXT, [B2b_2] INTEGER, [B2b_O_2_97] TEXT, [B2b_3] INTEGER, [B2b_O_3_97] TEXT, [B2b_4] INTEGER, [B2b_O_4_97] TEXT, [B2b_5] INTEGER, [B2b_O_5_97] TEXT, [B2b_6] INTEGER, [B2b_O_6_97] TEXT, [B2b_7] INTEGER, [B2b_O_7_97] TEXT, [B2b_8] INTEGER, [B2b_O_8_97] TEXT, [B2b_9] INTEGER, [B2b_O_9_97] TEXT, [B2b_10] INTEGER, [B2b_O_10_97] TEXT, [B2b_11] INTEGER, [B2b_O_11_97] TEXT, [B2b_12] INTEGER, [B2b_O_12_97] TEXT, [B2b_13] INTEGER, [B2b_O_13_97] TEXT, [B2b_14] INTEGER, [B2b_O_14_97] TEXT, [B2b_15] INTEGER, [B2b_O_15_97] TEXT, [B2b_16] INTEGER, [B2b_O_16_97] TEXT, [B2b_17] INTEGER, [B2b_O_17_97] TEXT, [B2b_18] INTEGER, [B2b_O_18_97] TEXT, [B2b_19] INTEGER, [B2b_O_19_97] TEXT, [B2b_20] INTEGER, [B2b_O_20_97] TEXT, [B8H] INTEGER, [B8A] INTEGER, [A4A5_2] INTEGER, [A4A5_1] INTEGER, [A4A5_20] INTEGER, [A4A5_19] INTEGER, [A4A5_18] INTEGER, [A4A5_17] INTEGER, [A4A5_16] INTEGER, [A4A5_15] INTEGER, [A4A5_14] INTEGER, [A4A5_13] INTEGER, [A4A5_12] INTEGER, [A4A5_11] INTEGER, [A4A5_10] INTEGER, [A4A5_9] INTEGER, [A4A5_8] INTEGER, [A4A5_7] INTEGER, [A4A5_6] INTEGER, [A4A5_5] INTEGER, [A4A5_4] INTEGER, [A4A5_3] INTEGER, [A4B5_20] INTEGER, [A4B5_19] INTEGER, [A4B5_18] INTEGER, [A4B5_17] INTEGER, [A4B5_16] INTEGER, [A4B5_15] INTEGER, [A4B5_14] INTEGER, [A4B5_13] INTEGER, [A4B5_12] INTEGER, [A4B5_11] INTEGER, [A4B5_10] INTEGER, [A4B5_9] INTEGER, [A4B5_8] INTEGER, [A4B5_7] INTEGER, [A4B5_6] INTEGER, [A4B5_5] INTEGER, [A4B5_4] INTEGER, [A4B5_3] INTEGER, [A4B5_2] INTEGER, [A4B5_1] INTEGER, [A4C5_2] INTEGER, [A4C5_1] INTEGER, [A4C5_3] INTEGER, [A4C5_4] INTEGER, [A4C5_5] INTEGER, [A4C5_6] INTEGER, [A4C5_7] INTEGER, [A4C5_8] INTEGER, [A4C5_9] INTEGER, [A4C5_10] INTEGER, [A4C5_11] INTEGER, [A4C5_12] INTEGER, [A4C5_13] INTEGER, [A4C5_14] INTEGER, [A4C5_15] INTEGER, [A4C5_16] INTEGER, [A4C5_17] INTEGER, [A4C5_18] INTEGER, [A4C5_19] INTEGER, [A4C5_20] INTEGER, [A4A1] INTEGER, [A4A1_O] TEXT, [A4A3] TEXT, [A4B1] INTEGER, [A4B1_O] TEXT, [A4B3] TEXT, [A4C1] INTEGER, [A4C1_O] TEXT, [A4C3] TEXT, [A4D1] INTEGER, [A4D1_O] TEXT, [A4D3] TEXT, [A4E1] INTEGER, [A4E1_O] TEXT, [A4E3] TEXT, [A4E5_1] INTEGER, [A4E5_2] INTEGER, [A4E5_3] INTEGER, [A4E5_4] INTEGER, [A4E5_5] INTEGER, [A4E5_6] INTEGER, [A4E5_7] INTEGER, [A4E5_8] INTEGER, [A4E5_9] INTEGER, [A4E5_10] INTEGER, [A4E5_11] INTEGER, [A4E5_12] INTEGER, [A4E5_13] INTEGER, [A4E5_14] INTEGER, [A4E5_15] INTEGER, [A4E5_16] INTEGER, [A4E5_17] INTEGER, [A4E5_18] INTEGER, [A4E5_19] INTEGER, [A4E5_20] INTEGER, [C4_O_4] TEXT, [C4_O_5] TEXT, [C4_O_6] TEXT, [C4_O_7] TEXT, [C4_O_8] TEXT, [C4_O_9] TEXT, [C4_O_10] TEXT, [C4_O_11] TEXT, [C4_O_12] TEXT, [C4_O_13] TEXT, [C4_O_14] TEXT, [C4_O_15] TEXT, [C4_O_16] TEXT, [C4_O_17] TEXT, [C4_O_18] TEXT, [C4_O_19] TEXT, [C4_O_20] TEXT, [C1] INTEGER, [Last_B8_20] INTEGER, [Last_B8_19] INTEGER, [Last_B8_18] INTEGER, [Last_B8_17] INTEGER, [Last_B8_16] INTEGER, [Last_B8_15] INTEGER, [Last_B8_14] INTEGER, [Last_B8_13] INTEGER, [Last_B8_12] INTEGER, [Last_B8_11] INTEGER, [Last_B8_10] INTEGER, [Last_B8_9] INTEGER, [Last_B8_8] INTEGER, [Last_B8_7] INTEGER, [Last_B8_6] INTEGER, [Last_B8_5] INTEGER, [Last_B8_4] INTEGER, [Last_B8_3] INTEGER, [Last_B8_2] INTEGER, [Last_B8_1] INTEGER, [B8] INTEGER, [panelK] INTEGER, [A2a2a1] TEXT, [A2a2a1_O_97] TEXT, [A2a2a2] TEXT, [A2a2a2_O_97] TEXT, [A2a2a3] TEXT, [A2a2a4] TEXT, [A2a2a3_O_97] TEXT, [A2a2a4_O_97] TEXT, [A2a2a5] TEXT, [A4A4] INTEGER, [A4B4] INTEGER, [A4C4] INTEGER, [A2a2a5_O_97] TEXT, [A4E4] INTEGER, [B2b_O_97] TEXT, [P1_9] INTEGER, [P1_8] INTEGER, [P1_7] INTEGER, [P1_6] INTEGER, [P1_5] INTEGER, [P1_4] INTEGER, [P1_3] INTEGER, [P1_2] INTEGER, [P1_1] INTEGER, [B106] INTEGER, [B107] INTEGER)"
                                    , [], function () {
                                    items1.push("<li id='BlokOzet'>INTERVIEWS OK</li>");
                                }, function (tx, error) {
                                            console.error("INTERVIEWS tablosu oluşturulamadı " + error.message);
                                            });
            }, function (tx, error) {
                           console.error("INTERVIEWS tablosunu silme hatası: " + error.message);
        });
        },
        function (error) {
            items1.push("<li id='BlokOzet'>INTERVIEWS ERROR   1</li>");
            /* $("<ul/>", {
                 "class": "my-new-list",
                 html: items1.join("")
             }).appendTo("body");*/
        },
        function () {


        });

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
        tx.executeSql("update [" + table + '] set ' + updatestr + ' where ' + where
            , [], function () {
            
            }, function (tx, error) {
                alert(error.message);

            }

        );
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
        tx.executeSql("update [" + table + '] set ' + updatestr + ' where ' + where
        , [], function () {
            
        }, function (tx, error) {
            alert(error.message);

        });
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
