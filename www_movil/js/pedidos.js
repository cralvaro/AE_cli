/** Inicializacion ***/
var myScrollPedidos = null;

$("#pagePedidos").on("pageinit", function(event, ui) {
	localStorage.setItem('descripcionPedido', "");
	localStorage.setItem('idPedido', "");

	$('#tablePedido').delegate('#botonGuardarPedido', 'click', function(e) {
		guardarPedido();
	});
	
	$('#lineasPedido').delegate('.tdDelete', 'click', function(e) {
    	borrarLineaPedido($(this).attr("id"));
    });
    
	myScrollPedidos = new IScroll('#pedidosContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});
});

$("#pagePedidos").on("pagebeforeshow", function(event, ui) {
	iniciarPagePedidos();
});

$(document).on('pageshow', '#pagePedidos',function(e,data) {
	if(null != myScrollPedidos) {
		$('#pedidosContenido').height(getRealContentHeight());
		myScrollPedidos.refresh();
	}
});

/** Resto metodos ****/
function iniciarPagePedidos() {
	$('#lineasPedido').empty();
	
	//Cabecera del pedido
	$("#descripcionPedido").val("");
	$("#descripcionPedido").val(localStorage.getItem('descripcionPedido'));
	$('#pedidoFechaCreacion').text(getDateFormated(new Date()));
	
	//Lineas del pedido
	var listaApuntesPedido = JSON.parse(localStorage["listaApuntesPedido"]);
	if(jQuery.isEmptyObject(listaApuntesPedido)) {
		$('#pedidoVacio').show();
	}
	else {
		$('#pedidoVacio').hide();
		
		//Se cargan las lineas de pedido
		loadLineasPedido();
	}
}

function borrarLineaPedido(strIdApuntes) {
	var idApuntes = strIdApuntes.replace("tdDelete_", "");
	
	//Se borran los apuntes del Array del Pedido
	var listaApuntesPedido = JSON.parse(localStorage["listaApuntesPedido"]);
	listaApuntesPedido = jQuery.grep(listaApuntesPedido, function(value) {
							  return value != idApuntes;
							});
	localStorage["listaApuntesPedido"] = JSON.stringify(listaApuntesPedido);

	//Se actualiza el num eltos del carrito
	$('.carritoNumEltos').text(listaApuntesPedido.length);
	
	//Se actualizan los precios Totales
	var precioTotal = parseFloat($('.headerPedido').first().text());
	precioTotal -= parseFloat($('#liAptesPedido_' + idApuntes).find('.spanPrecio').text());
	updateTotalPrices(precioTotal.toFixed(2));
	
	//Borrar linea de BBDD
	$('#liAptesPedido_' + idApuntes).remove();
	$("#lineasPedido").listview("refresh");
	
}

function guardarPedido() {
	var idPedido = localStorage.getItem('idPedido');
	localStorage.setItem('descripcionPedido', $('#descripcionPedido').val());
	if(idPedido) { //Si no está vacía
		actualizarPedido(idPedido);
		actualizarLineasPedido(idPedido);
		
		alert("Pedido actualizado");
	}
	else {
		crearPedido();
		//Se crean las lineas de pedido
		var listaApuntesPedido = JSON.parse(localStorage["listaApuntesPedido"]);
		for(var i = 0; i < listaApuntesPedido.length; ++i) {
			addLineaPedido(localStorage.getItem('idPedido'), listaApuntesPedido[i]);
		}
		
		alert("Pedido guardado");
	}
}


/** BBDD *************************/
function loadLineasPedido() {
	var listaApuntesPedido = JSON.parse(localStorage["listaApuntesPedido"]);
	
	$('#lineasPedido').empty();
	
	for(var i = 0; i < listaApuntesPedido.length; ++i) {
		$.ajax({
		type: "POST",
	    async: false,
		url : urlBase + 'apuntes/apuntesById',
		data : 'idApuntes='+ encodeURIComponent(listaApuntesPedido[i]),
		dataType: "json",
		headers: {"Accept": "application/json"},
		success : function(response) {			
		    var fecha = getDateFormated(new Date(response.fechaAlta));
		   
	        $('#lineasPedido').append(
//	 			'<li id="liAptesPedido_' + response.idApuntes + '">'+
	        	'<li id="liAptesPedido_' + response.idApuntes + '" data-role="fieldcontain" class="ui-field-contain ui-body ui-br ui-li ui-li-static ui-btn-up-c">' +
	    		'<a href="#">'+
	    		
	    		'<table id="tablaApuntes">' +
	       		'<tr>' +
	       		'<td id="tdDelete_' + response.idApuntes + '"  class="tdDelete" rowspan="3">' +
				   '<img src="images/remove.png" width="35" height="35"></img>' +
	       		'</td><td class="aptesDesc"> <span class="descripcionApuntes">' + response.descripcion + '</span></td><td><strong><span class="spanPrecio">' + response.precio.toFixed(2) + '</span>&euro;</strong></td>' +
	       		'</tr><tr>' +
	       		'<td><strong>' + response.profesor + '</strong></td><td>P&aacute;ginas: ' + response.numPaginas + '</td>' +
	       		'</tr><tr>' +
	       		'<td>Fecha de alta: ' + fecha + '</td><td>Veces impreso: ' + response.numImpresiones + '</td>' +
	       		'</tr></table>' +           			
	   			
	   			'</a></li>');
		},
		error : function(xhr,textStatus,err)
		{
		    alert("readyState: " + xhr.readyState + 
		    		" responseText: "+ xhr.responseText + 
		    		" status: " + xhr.status + 
		    		" text status: " + textStatus + 
		    		" error: " + err);
		}
		});
	}
}

function crearPedido() {
	var usuario = JSON.parse(localStorage.getItem('usuario'));
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'pedidos/crearPedido',
	data : 'idUsuario='+ encodeURIComponent(usuario.idUsuario) +
		   '&descripcion='+ encodeURIComponent(localStorage.getItem('descripcionPedido')),
	headers: {"Accept": "application/json"},
	success : function(response) {
		//Se guarda el idPedido
		localStorage.setItem('idPedido', response);
	},
	error : function(xhr,textStatus,err)
	{
	    alert("readyState: " + xhr.readyState + 
	    		" responseText: "+ xhr.responseText + 
	    		" status: " + xhr.status + 
	    		" text status: " + textStatus + 
	    		" error: " + err);
	}
	});
}

function actualizarPedido(strId) {
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'pedidos/updatePedido',
	data : 'idPedido='+ encodeURIComponent(strId) +
	       '&descripcion='+ encodeURIComponent(localStorage.getItem('descripcionPedido')),
	headers: {"Accept": "application/json"},
	success : function(response) {},
	error : function(xhr,textStatus,err)
	{
	    alert("readyState: " + xhr.readyState + 
	    		" responseText: "+ xhr.responseText + 
	    		" status: " + xhr.status + 
	    		" text status: " + textStatus + 
	    		" error: " + err);
	}
	});
}

function addLineaPedido(strIdPedido, strIdApuntes) {
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'pedidos/addLineaPedido',
	data : 'idPedido='+ encodeURIComponent(strIdPedido) +
	       '&idApuntes='+ encodeURIComponent(strIdApuntes),
	headers: {"Accept": "application/json"},
	success : function(response) {},
	error : function(xhr,textStatus,err)
	{
	    alert("readyState: " + xhr.readyState + 
	    		" responseText: "+ xhr.responseText + 
	    		" status: " + xhr.status + 
	    		" text status: " + textStatus + 
	    		" error: " + err);
	}
	});
}

function actualizarLineasPedido(strIdPedido) {
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'pedidos/updateLineasPedido',
	data : 'idPedido='+ encodeURIComponent(strIdPedido) +
	       '&listaApuntes='+ encodeURIComponent(localStorage.getItem('listaApuntesPedido')),
	headers: {"Accept": "application/json"},
	success : function(response) {},
	error : function(xhr,textStatus,err)
	{
	    alert("readyState: " + xhr.readyState + 
	    		" responseText: "+ xhr.responseText + 
	    		" status: " + xhr.status + 
	    		" text status: " + textStatus + 
	    		" error: " + err);
	}
	});
}