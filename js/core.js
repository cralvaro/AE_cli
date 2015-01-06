/******************************************************************************/
/******************************************************************************/
/****************************  CORE  ******************************************/
/******************************************************************************/
/******************************************************************************/

/** URL BASE ******************/
var urlBase = "http://192.168.1.11:8080/alfaCentral/";//"http://127.0.0.1:8080/alfaCentral/";

/** COMMON FUNCTIONS *********/
function getDateFormated(date) {
	var curr_date = ("0" + date.getDate()).slice(-2);
	var curr_month = ("0" + (date.getMonth() + 1)).slice(-2);
	var curr_year = date.getFullYear();
	
	var dateFormated = curr_date + "/" + curr_month + "/" + curr_year; 
	return dateFormated;
}

function getTimeFormated(date) {
	var curr_hour = ("0" + date.getHours()).slice(-2);;
	var curr_min = ("0" + date.getMinutes()).slice(-2);;
	
	var timeFormated = curr_hour + ":" + curr_min;
	return timeFormated;
}

function updateTotalPrices(price) {
	$('.headerPedido').text(price);
	
	// Actualizar Saldo resultante
	var saldo = $('.saldo').first().text();
}

function updateSaldo(saldo) {
	$(".saldo").text(saldo);
	$('.headerPedido').text("0.00");
}

/** Set scroll **/

$(window).on('orientationchange', function(){ 
	
	switch($.mobile.activePage.attr('id')) {
		/** INDEX *************************/
		case "pageIndex":
			$('#indexContenido').height(getRealIndexContentHeight());
			if(null != myScrollIndex) {
				myScrollIndex.refresh();
			}
			break;
		/** INDEX MAPA *************************/
		case "pageIndexMapa":
			$('#indexMapaContenido').height(getRealIndexContentHeight());
			if(null != myScrollIndexMapa) {
				myScrollIndexMapa.refresh();
			}
			break;
		/** APUNTES *************************/
		case "pageInstituciones":
			$('#institucionesContenido').height(getRealContentHeight());
			if(null != myScrollInstituciones) {
				myScrollInstituciones.refresh();
			}
			break;
		case "pageTitulaciones":
			$('#titulacionesContenido').height(getRealContentHeight());
			if(null != myScrollTitulaciones) {
				myScrollTitulaciones.refresh();
			}
			break;
		case "pageCursos":
			$('#cursosContenido').height(getRealContentHeight());
			if(null != myScrollCursos) {
				myScrollCursos.refresh();
			}
			break;
		case "pageAsignaturas":
			$('#asignaturasContenido').height(getRealContentHeight());
			if(null != myScrollAsignaturas) {
				myScrollAsignaturas.refresh();
			}
			break;
		case "pageApuntes":
			$('#apuntesContenido').height(getRealContentHeight());
			if(null != myScrollApuntes) {
				myScrollApuntes.refresh();
			}
			break;
		/** PEDIDOS *************************/
		case "pagePedidos":
			$('#pedidosContenido').height(getRealContentHeight());
			if(null != myScrollPedidos) {
				myScrollPedidos.refresh();
			}
			break;
		/** MAPA *************************/
		case "pageMapa":
			$('#mapaContenido').height(getRealContentHeight());
			if(null != myScrollMapa) {
				myScrollMapa.refresh();
			}
			break;
		/** INCIDENCIAS *************************/
		case "pageIncidencias":
			$('#incidenciasContenido').height(getRealContentHeight());
			if(null != myScrollIncidencias) {
				myScrollIncidencias.refresh();
			}
			break;
	}
});

/** Calculo de tamaño de pantalla **/
function getRealContentHeight() {
	var header = $.mobile.activePage.find("div[data-role='header']:visible");
	var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
	var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
	var viewport_height = $(window).height();

	var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
	if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
		content_height -= (content.outerHeight() - content.height());
	} 
	return content_height;
}

function getRealIndexContentHeight() {
	var header = $.mobile.activePage.find("div[data-role='header']:visible");
	var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
	var viewport_height = $(window).height();

	var content_height = viewport_height - header.outerHeight();
	if((content.outerHeight() - header.outerHeight()) <= viewport_height) {
		content_height -= (content.outerHeight() - content.height());
	} 
	return content_height;
}

