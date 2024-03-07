var lastGorusulen = -1;
var lastReis = -1;



$(".sira").click(function () {
    var num = parseInt($(this).closest("table").find("input[name^='E5']").val()) || 0;

    if (num < 18) {
        alert("18 yaşından küçükler ile görüşülemez!");
        $(this).prop("checked", false);
    }
    else {
        //    $(this).parent().append($("#divGorusKisi"));
        //$("input:radio[name=E3b"]).val($(this).attr("value"));
        //      $(this).closest("tr").closest("table").closest("table").find(".tdgorusulen").text("");
        //    var dTable = $("#example").find(".tdgorusulen").closest("tr").next().find("table"); //.find(".sira").attr("id").split('_');
        //     TableFor(dTable);
        //  yakinlikKosul(arr[arr.length - 1], nesne.attr("id"));
        // TableFor($("#example").find(".tdgorusulen").closest("table"));
        $("#example").find(".tdgorusulen").text("");
        $(this).closest("tr").closest("table").closest("tr").prev().find("td").eq(4).text("Görüşülen Kişi");
        onLoad(false, $(this).attr("id"), "tablolar");

        // TableFor( $(this).closest("tr").closest("table"));



    }
});

$(".reis").click(function () {
    var num = parseInt($(this).closest("table").find("input[name^='E5']").val()) || 0;
    if (num < 18) {
        alert("18 yaşından küçükler hane reisi olamaz!");
        $(this).prop("checked", false);
    }
    else {
        //      $(this).parent().append($("#divReis"));
        $("input:radio[name=E4a]").val($(this).attr("value"));
        //   var dTable = $("#example").find(".tdreis").closest("tr").next().find("table"); //.find(".sira").attr("id").split('_');
        //    TableFor(dTable);

        //$(this).closest("tr").closest("table").closest("table").find(".tdreis").text("");
        $("#example").find(".tdreis").text("");
        $(this).closest("tr").closest("table").closest("tr").prev().find("td").eq(5).text("Hane Reisi");
        MeslekEk($(this), "reis");
        onLoad(false, $(this).attr("id"), "tablolar");
    }

});


$('select').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var row = $(this).closest("table");
    // var valueSelected = this.attr("Other");
    if (optionSelected.attr("OtherState") != "false") {
        $("#" + optionSelected.attr("Other")).show();
    }
    else {
        $("#" + optionSelected.attr("Other")).hide();
        $("#" + optionSelected.attr("Other")).val("");
    }
    if ($(this).attr("class") == "meslek") {
        if (row.find("input[name^='E4a']").is(':checked') > 0) {
            MeslekEk($(this), "meslek");
            /*  $(".meslekUzman select option:eq(0)").prop('selected', true);
              $(".meslekYonetici").hide();
              $(".meslekUzman").hide();
              if (parseInt($(this).val()) > 11 && parseInt($(this).val()) < 16) {
                  var yonetici = $("#" + $(this).attr("id").replace("E9c", "E9ca")).parent().show();
              }*/
        }
    }
    else if ($(this).attr("class") == "S10meslek") {
        if (row.find("input[name^='E4a']").is(':checked') > 0) {
            MeslekEmekli($(this), "meslek");
            /*  $(".meslekUzman select option:eq(0)").prop('selected', true);
              $(".meslekYonetici").hide();
              $(".meslekUzman").hide();
              if (parseInt($(this).val()) > 11 && parseInt($(this).val()) < 16) {
                  var yonetici = $("#" + $(this).attr("id").replace("E9c", "E9ca")).parent().show();
              }*/
        }
    }
    else if ($(this).attr("class") == "cinsiyet") {
        var id = $(this).attr("id");
        $(this).closest("tr").closest("table").closest("tr").prev().find("td").eq(2).text($("#" + id + " option:selected").text());
    }

    onLoad(false, $(this).attr("id"), "tektablo");
    /* $($(this).parent().parent().children()).each(function () {
         if ($(this).children(0).length > 0) {
             var nesne = $("#" + $(this).children(0)[0].id);
             if (nesne.attr("kosul") != undefined && nesne.attr("kosul") != "" && nesne[0].type == "select-one") {
                 var arr = nesne.attr("id").split('_');
                 yakinlikKosul(arr[arr.length - 1], nesne.attr("id"));
             }
         }


     });*/

    /* if ($(this).attr("kosul") != undefined && $(this).attr("kosul") != "")
     {
         var arr = $(this).attr("id").split('_');
         yakinlikKosul(arr[arr.length - 1], $(this).attr("id"));
     }*/

});

function MeslekEk(elem, ayrac) {

    $($(".meslekUzman select")).each(function () {
        if ($(this).val() != "") {
            $(this).val("");
            $(this).selectpicker('refresh');
        }
    });

    $($(".meslekGelir select")).each(function () {
        if ($(this).val() != "") {
            $(this).val("");
            $(this).selectpicker('refresh');
        }
    });
    $(".meslekYonetici").find("input").val("");
    $(".meslekIsyeri").find("input").val("");
    $(".S10meslekYonetici").find("input").val("");
    $(".S10meslekIsyeri").find("input").val("");

    // $(".meslekUzman select option:eq(0)").prop('selected', true);
    //  $(".meslekUzman select").selectpicker('refresh');
    $(".meslekYonetici").hide();
    $(".meslekUzman").hide();
    $(".meslekIsyeri").hide();
    $(".meslekGelir").hide();
    $(".meslekMeslekAcik").hide();


    $(".S10meslek").hide();
    $(".S10meslekYonetici").hide();
    $(".S10meslekUzman").hide();
    $(".S10meslekIsyeri").hide();
    $(".S10meslekGelir").hide();



    $(".meslekYonetici").find("input").hide();
    $(".meslekUzman").find("select").hide();
    $(".meslekIsyeri").find("input").hide();
    $(".meslekGelir").find("select").hide();

    var meslek = elem.closest("table").find(".tdMeslek").children().filter("select").filter(".meslek");
    $("#" + meslek.attr("id").replace("E9c", "E9b") + "_O").parent().show();
    $("#" + meslek.attr("id").replace("E9c", "E9b") + "_O").show();
    if (ayrac == "reis") {
        $("#" + meslek.attr("id").replace("E9c", "E9b") + "_O").val("");
    }

    if (parseInt(meslek.val()) > 11 && parseInt(meslek.val()) < 16) {
        $("#" + meslek.attr("id").replace("E9c", "E9ca") + "_O").parent().show();
        $("#" + meslek.attr("id").replace("E9c", "E9ca") + "_O").show();
    }
    else if (meslek.val() == "1" || meslek.val() == "2") {
        $("#" + meslek.attr("id").replace("E9c", "E10")).show();
    }
    else if (meslek.val() == "17") {
        $("#" + meslek.attr("id").replace("E9c", "E9cb")).parent().show();
        $("#" + meslek.attr("id").replace("E9c", "E9cb")).show();
    }
    else if (parseInt(meslek.val()) > 20 && parseInt(meslek.val()) < 25) {
        $("#" + meslek.attr("id").replace("E9c", "E9cc") + "_O").parent().show();
        $("#" + meslek.attr("id").replace("E9c", "E9cc") + "_O").show();
    }
    else if (parseInt(meslek.val()) > 2 && parseInt(meslek.val()) < 7) {
        $("#" + meslek.attr("id").replace("E9c", "E9cd")).parent().show();
        $("#" + meslek.attr("id").replace("E9c", "E9cd")).show();
    }


}

function MeslekEmekli(elem, ayrac) {

    $($(".S10meslekUzman select")).each(function () {
        if ($(this).val() != "") {
            $(this).val("");
            $(this).selectpicker('refresh');
        }
    });

    $($(".S10meslekGelir select")).each(function () {
        if ($(this).val() != "") {
            $(this).val("");
            $(this).selectpicker('refresh');
        }
    });

    $(".S10meslekIsyeri").find("input").val("");
    $(".S10meslekYonetici").find("input").val("");


    $(".S10meslekYonetici").hide();
    $(".S10meslekUzman").hide();
    $(".S10meslekIsyeri").hide();
    $(".S10meslekGelir").hide();



    $(".S10meslekYonetici").find("input").hide();
    $(".S10meslekUzman").find("select").hide();
    $(".S10meslekIsyeri").find("input").hide();
    $(".S10meslekGelir").find("select").hide();

    var meslek = elem.closest("table").find(".S10tdMeslek").children().filter("select").filter(".S10meslek");


    if (parseInt(meslek.val()) > 11 && parseInt(meslek.val()) < 16) {
        $("#" + meslek.attr("id").replace("E10_", "E10ca_") + "_O").parent().show();
        $("#" + meslek.attr("id").replace("E10_", "E10ca_") + "_O").show();
    }

    else if (meslek.val() == "17") {
        //                  $("#" + meslek.attr("id").replace("E10_", "E10cb_")).parent().show();
        //                    $("#" + meslek.attr("id").replace("E10_", "E10cb_")).show();
    }
    else if (parseInt(meslek.val()) > 20 && parseInt(meslek.val()) < 25) {
        $("#" + meslek.attr("id").replace("E10_", "E10cc_") + "_O").parent().show();
        $("#" + meslek.attr("id").replace("E10_", "E10cc_") + "_O").show();
    }
    else if (parseInt(meslek.val()) > 2 && parseInt(meslek.val()) < 7) {
        //                    $("#" + meslek.attr("id").replace("E10", "E10cd_")).parent().show();
        //                   $("#" + meslek.attr("id").replace("E10", "E10cd_")).show();
    }


}

$(".adsoyad").keyup(function (e) {

    $(this).closest("tr").closest("table").closest("tr").prev().find("td").eq(1).text($(this).val());
    //     $(this).closest("table").closest("tr").closest("td").eq(1).innerHTML($(this).val());
})

$(".number").keydown(function (e) {
    
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }


});
$(".number ").keyup(function (e) {


});

$("input[name^='E5']").blur(function (e) {
    alert("sd");
    if ($(this).val() == "" || parseInt($(this).val()) < 15) {
        $(this).closest("tr").nextAll(".buyukYas").hide()
        /*  find("td:eq(7)").nextAll('td').h if ($(this).parent().parent().find("#E3b").length > -1)
        {
            alert("Görüşülen kişi 18 yaşından küçük olamaz!");
        }*/
    }
    else {
        //  $(this).closest("tr").next().show()
        $(this).closest("tr").nextAll(".buyukYas").show()
    }
    //   $("input:radio[name=E3b]")
    var row = $(this).closest("table");
    if (parseInt($(this).val()) < 18) {
        if (row.find("input:radio[name=E3b]").is(':checked') > 0 || row.find("input:radio[name=E4a]").is(':checked') > 0) {
            alert("Görüşülen kişi 18 yaşından küçük olamaz! İşaretlemeler kaldırılıyor");
            row.find("input:radio[name=E3b]").prop("checked", false);
            row.find("input:radio[name=E4a]").prop("checked", false);
        }
    }

    $(this).closest("tr").closest("table").closest("tr").prev().find("td").eq(3).text($(this).val());
    onLoad(false, $(this).attr("id"), "tektablo");
    //onLoad(false);
    /* $(row.find("tr")).each(function () {
         $(this).children().each(function () {
             if ($(this).children(0).length > 0) {
                 var nesne = $("#" + $(this).children(0)[0].id);
                 if (nesne.attr("kosul") != undefined && nesne.attr("kosul") != "" && nesne[0].type == "select-one") {
                     var arr = nesne.attr("id").split('_');
                     yakinlikKosul(arr[arr.length - 1], nesne.attr("id"));
                 }
             }
     
         });
         
     });*/
});

function yakinlikKosul(sira, elemid) {

    var kosul = $("#" + elemid).attr("kosul");
    if (kosul != "") {

        // if ($("#E3b").val() == "" && kosul.indexOf("E3b") > -1) {kosul= kosul.replace("E3b", "item").replace("E3b", "item").replace("E3b", "item"); };
        // if ($("#E4a").val() == "" && kosul.indexOf("E4a") > -1) {kosul= kosul.replace("E4a", "item").replace("E4a", "item").replace("E4a", "item"); };
        //    if ($("input:radio[name=E3b]").val() == "" && kosul.indexOf("E3b") > -1) { kosul = kosul.replace("E3b", "item").replace("E3b", "item").replace("E3b", "item"); };
        ///  if ($("#E4a").val() == "" && kosul.indexOf("E4a") > -1) {kosul= kosul.replace("E4a", "item").replace("E4a", "item").replace("E4a", "item"); };

        var E3b = $("#tr" + sira).closest("table").find("input:radio[name=E3b]:checked").val();
        if (E3b == "" || E3b == undefined) E3b = "0";
        var E4a = $("#tr" + sira).closest("table").find("input:radio[name=E4a]:checked").val();
        if (E4a == "" || E4a == undefined) E4a = "0";
        var E6 = $("#tr" + sira).closest("table").find("input:radio[name=E6]:checked").val();
        if (E6 == "" || E6 == undefined) E6 = "0";

        kosul = kosul = kosul.replace(/\E3b/g, E3b);
        kosul = kosul = kosul.replace(/\E4a/g, E4a);
        kosul = kosul = kosul.replace(/\E6/g, E6);
        //     kosul = kosul.replace("E4a", $("input:radio[name=E4a]").val()).replace("E4a", $("input:radio[name=E4a]").val()).replace("E4a", $("input:radio[name=E4a]").val());
        kosul = kosul.replace(/\Index/g, sira); //kosul.replace("Index", sira).replace("Index", sira).replace("Index", sira).replace("Index", sira).replace("Index", sira);

        $("#tr" + sira).closest("table").find("td").each(function (Index, eleman) {
            if ($(this).children(0).length > 0) {
                if ($(this).children(0).length > 1) {
                    id = $(this).children(0)[1].id.split('_')[0];
                }
                else {
                    id = $(this).children(0)[0].id.split('_')[0];
                }

                if (id != "") {
                    if (id == "E5") {
                        var yas = $("#" + id + "_" + sira + "_O").val();
                        if (yas == "") yas = "0";

                        //      kosul = kosul.replace(id, yas).replace(id, yas).replace(id, yas).replace(id, yas).replace(id, yas).replace(id, yas).replace(id, yas).replace(id, yas).replace(id, yas).replace(id, yas).replace(id, yas);
                        kosul = kosul.replace(/\E5/g, yas);
                        //   kosul.replace(new RegExp(id, 'g'), yas);
                    }
                    kosul = kosul.replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val()).replace(id, $("#" + id + "_" + sira).val());
                    kosul = kosul.replace(new RegExp(id, 'g'), $("#" + id + "_" + sira).val());

                }
            }

        })

        //   var cins = $("#E6_" + sira);

        $("#" + elemid + " > option").each(function () {
            if ($(this).val() != "") {
                var syntax = eval(kosul.toString().replace(/\item/g, $(this).val()));
                //   if ($(this).attr("kosul") != "") {
                //  if ($(this).attr("kosul").toString().replace("E6", cins.val())) {
                if (syntax) {
                    $(this).prop('disabled', true);
                    if ($(this).is(':selected')) {
                        $("#" + elemid + "  option:eq(0)").prop('selected', true);
                    }
                }
                else {
                    $(this).prop('disabled', false);
                }
            }
            //    }
        });

        $("#" + elemid).selectpicker('refresh');
    }
}

function OtherDisplay(elem) {
    // alert(this.value);
    alert(elem.text());
}

function Gonder() {

}

function onLoad(isLoad, id, tableType) {
    /*  if ($('input[name=E3b]:checked') != undefined && $('input[name=E3b]:checked').val() != undefined && $('input[name=E3b]:checked').val() != "") {
          var arr = $('input[name=E3b]:checked').attr("id").split('_');
          lastGorusulen = arr[arr.length - 1];
      }
      if ($('input[name=E4a]:checked') != undefined && $('input[name=E4a]:checked').val() != undefined && $('input[name=E4a]:checked').val() != "") {
          var arr = $('input[name=E4a]:checked').attr("id").split('_');
          lastReis = arr[arr.length - 1];
      }*/
    if (tableType == "tablolar") {
        $(".objectTable").each(function () {
            TableFor($(this), id, isLoad);
        });
    }
    else {
        TableFor($("#" + id).closest("table"), id, isLoad);
    }
}

function TableFor(table, id, isLoad) {
    table.find("tr").each(function (i, satir) {
        $(satir.children).each(function () {
            if ($(this).children(0).length > 0) {
                if ($(this).children(0).length > 1) {
                    var nesne = $("#" + $(this).children(0)[1].id);
                }
                else {
                    var nesne = $("#" + $(this).children(0)[0].id);
                }
                //  var nesne = $("#" + $(this).children(0)[0].id);
                if (nesne.attr("kosul") != undefined && nesne.attr("kosul") != "" && nesne[0].type == "select-one" && (nesne.attr("kosul").indexOf(id.split("_")[0]) > -1 || id == "")) {
                    var arr = nesne.attr("id").split('_');
                    yakinlikKosul(arr[arr.length - 1], nesne.attr("id"));
                }
            }
            if ($(this).prop("tagName") == "SELECT" && isLoad) {
                $(this).change();
            }
            /*  if (parseInt($(this).find("input[name^='E5']").val()) < 15) {
                  $(this).find("input[name^='E5']").find("td:eq(7)").nextAll('td').hide();
              }*/
        });

    });
    if (isLoad) {
        table.find("input[name^='E5']").blur();
        table.find("input[class^='adsoyad']").keyup();
        table.find("input[class^='number']").keyup();
    }

}
