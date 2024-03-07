// INIT DATATABLES
$(function () {
	// Init
    var spinner = $( ".spinner" ).spinner();
    var table = $('#table_id').dataTable( {
        "lengthMenu": [[50, 100, 200, -1], [50, 100, 200, "All"]]
    } );

    var tableTools = new $.fn.dataTable.TableTools( table, {
    	/*"sSwfPath": "../vendors/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
        "buttons": [
   
        ]*/
    } );
    $(".DTTT_container").css("float","right");
});


