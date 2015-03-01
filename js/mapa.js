/***************************************************/
/*************** INDEX MAPA ************************/
/***************************************************/

/** Inicializacion ***/
var myScrollMapaIndex = null;

$("#pageIndexMapa").on("pageinit", function(event, ui) {
	//Se crea el array de coordenadas
	var listaCoordenadas = new Array();
	localStorage["listaCoordenadas"] = JSON.stringify(listaCoordenadas);
    
	myScrollMapaIndex = new IScroll('#mapaIndexContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});
});

$("#pageIndexMapa").on("pagebeforeshow", function(event, ui) {
	iniciarPageMapa();
});

$(document).on('pageshow', '#pageIndexMapa',function(e,data) {
	
	$('#mapaIndexContenido').height(getRealIndexContentHeight());
	$('#divIndexMapa').height(getRealIndexContentHeight());
	drawMap("divIndexMapa");
	
	if(null != myScrollMapaIndex) {
		myScrollMapaIndex.refresh();
	}
});


/***************************************************/
/******************* MAPA **************************/
/***************************************************/

/** Inicializacion ***/
var myScrollMapa = null;

$("#pageMapa").on("pagebeforeshow", function(event, ui) {
	iniciarPageMapa();
});

$("#pageMapa").on("pageinit", function(event, ui) {
	//Se crea el array de coordenadas
	var listaCoordenadas = new Array();
	localStorage["listaCoordenadas"] = JSON.stringify(listaCoordenadas);
    
	myScrollMapa = new IScroll('#mapaContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});
});

$(document).on('pageshow', '#pageMapa',function(e,data) {
	
	$('#mapaContenido').height(getRealContentHeight());
	drawMap("divMapa");
	
	if(null != myScrollMapa) {
		myScrollMapa.refresh();
	}
});

/** Resto metodos ****/
function iniciarPageMapa() {
	loadCoordenadas();
}

function drawMap(divId) {
	var latlngbounds = new google.maps.LatLngBounds();
	var alfaMarkerIconV = 'images/map_marker_av.png';
	var alfaMarkerIconA = 'images/map_marker_aa.png';
	var alfaMarkerIconR = 'images/map_marker_ar.png';
	var userMarkerIcon = 'images/map_marker_u.png';
	
	// This is the minimum zoom level that we'll allow
	var minZoomLevel = 17;

	var map = new google.maps.Map(document.getElementById(divId), {
		zoom: minZoomLevel,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			//Posicionando usuario
			var userPos = new google.maps.LatLng(position.coords.latitude, 
												 position.coords.longitude);
			var userMarker = new google.maps.Marker({position: userPos, map: map, icon: userMarkerIcon });
			latlngbounds.extend(userPos);
		});		
	}
	
	//Posicionando expendedores
	var listaCoordenadas = JSON.parse(localStorage["listaCoordenadas"]);
	for(var i = 0; i < listaCoordenadas.length; ++i) {
		var exp = listaCoordenadas[i];
		var alfaPos = new google.maps.LatLng(exp.coordenadas.split(',')[0], exp.coordenadas.split(',')[1]);
		
		switch(exp.estado) {
			case 0:
				var alfaMarker = new google.maps.Marker({position: alfaPos, map: map, icon: alfaMarkerIconV });
				break;
			case 1:
				var alfaMarker = new google.maps.Marker({position: alfaPos, map: map, icon: alfaMarkerIconA });
				break;
			case 2:
				var alfaMarker = new google.maps.Marker({position: alfaPos, map: map, icon: alfaMarkerIconR });
				break;
		}

		latlngbounds.extend(alfaPos);
	}
	
	//Centrando el mapa para ver todas las marcas
	map.setCenter(latlngbounds.getCenter());
	map.fitBounds(latlngbounds); 
}


/** BBDD *************************/
function loadCoordenadas() {
	var listaCoordenadas = JSON.parse(localStorage["listaCoordenadas"]);
	
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'expendedor/getExpendedores',
	dataType: "json",
	headers: {"Accept": "application/json"},
	success : function(response) {
		for(var i = 0; i < response.length; ++i) {
			var expendedor = response[i];
			var exp = {"coordenadas": expendedor.coordenadas,
					   "estado": expendedor.estado};
			listaCoordenadas.push(exp);
		}
		localStorage["listaCoordenadas"] = JSON.stringify(listaCoordenadas);	    
	},
	error : function(xhr,textStatus,err)
	{
	    alert("Hay problemas de red. Revisa tu configuración e inténtalo más tarde.");
	}
	});
}
