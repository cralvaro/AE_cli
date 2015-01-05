
/*********************************************/
/*********************************************/
/** Instituciones ****************************/
/*********************************************/
/*********************************************/

/** Inicializacion ***/
var myScrollInstituciones = null;

$("#pageInstituciones").on("pagebeforeshow", function(event, ui) {
	iniciarPageInstituciones();
});

$("#pageInstituciones").on("pageinit", function(event, ui) {
	
    $("#listaInstituciones").delegate('li', 'click', function(e) {
    	localStorage.setItem('institucion', $(this).attr("id").replace("institucion_",""));
    	$.mobile.changePage("#pageTitulaciones", {transition: "slide", reverse: false});
    	return false;
    });
    
    myScrollInstituciones = new IScroll('#institucionesContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});

});

$(document).on('pageshow', '#pageInstituciones',function(e,data) {
	
	if(null != myScrollInstituciones) {
		$('#institucionesContenido').height(getRealContentHeight());
		myScrollInstituciones.refresh();
	}
});

/** Resto metodos ****/
function iniciarPageInstituciones() {
	localStorage.setItem('institucion', "");
	loadInstituciones();
}

function loadInstituciones() {
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'apuntes/instituciones',
	dataType: "json",
	headers: {"Accept": "application/json"},
	success : function(response) {
		$('#listaInstituciones').empty();
		for ( var i = 0, len = response.length; i < len; ++i) {
	       var institucion = response[i];
	       $('#listaInstituciones').append("" +
	       		"<li id=\"institucion_"+institucion.idInstitucion+"\" >" +
	       			"<a href=\"#\" >" + institucion.nombre + "</a>" +
	       		"</li>");
		}
		$('#listaInstituciones').listview('refresh');
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


/*********************************************/
/*********************************************/
/** Titulaciones *****************************/
/*********************************************/
/*********************************************/

/** Inicializacion ***/
var myScrollTitulaciones = null;

$("#pageTitulaciones").on("pagebeforeshow", function(event, ui) {
	iniciarPageTitulaciones();
});

$("#pageTitulaciones").on("pageinit", function(event, ui) {
    
    $("#listaTitulaciones").delegate('li', 'click', function(e) {
    	localStorage.setItem('titulacion', $(this).attr("id").replace("titulacion_",""));
    	$.mobile.changePage("#pageCursos", {transition: "slide", reverse: false});
    	return false;
    });
    
    $('.headerLeft').delegate('#backInstituciones', 'click', function(e) {
    	localStorage.setItem('titulacion', "");
    	$.mobile.changePage("#pageInstituciones", {transition: "slide", reverse: true});
    	return false;
    });
    
    myScrollTitulaciones = new IScroll('#titulacionesContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});

});

$(document).on('pageshow', '#pageTitulaciones',function(e,data) {
	
	if(null != myScrollTitulaciones) {
		$('#titulacionesContenido').height(getRealContentHeight());
		myScrollTitulaciones.refresh();
	}
});

/** Resto metodos ****/
function iniciarPageTitulaciones() {
	localStorage.setItem('titulacion', "");
	loadTitulaciones();
}

function loadTitulaciones() {
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'apuntes/titulaciones',
	data : 'idInstitucion='+ encodeURIComponent(localStorage.getItem('institucion')),
	dataType: "json",
	headers: {"Accept": "application/json"},
	success : function(response) {
		$('#listaTitulaciones').empty();
		for ( var i = 0, len = response.length; i < len; ++i) {
	       var titulacion = response[i];
	       $('#listaTitulaciones').append("" +
	       		"<li id=\"titulacion_"+titulacion.idTitulacion+"\" data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-theme=\"c\" class=\"ui-btn ui-btn-up-c ui-btn-icon-right ui-li-has-arrow ui-li ui-li-last\">" +
	       		"<div class=\"ui-btn-inner ui-li\">" +
	       		"<div class=\"ui-btn-text\">" +
	       		"<a href=\"#\" class=\"ui-link-inherit\">" +
	       		titulacion.nombre +
	       		"</a>" +
	       		"</div>" +
	       		"<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span>" +
	       		"</div>" +
	       		"</li>");
		}
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


/*********************************************/
/*********************************************/
/** Cursos ***********************************/
/*********************************************/
/*********************************************/

/** Inicializacion ***/
var myScrollCursos = null;

$("#pageCursos").on("pagebeforeshow", function(event, ui) {
	iniciarPageCursos();
});

$("#pageCursos").on("pageinit", function(event, ui) {
	
    $("#listaCursos").delegate('li', 'click', function(e) {
    	localStorage.setItem('curso', $(this).attr("id").replace("curso_",""));
    	$.mobile.changePage("#pageAsignaturas", {transition: "slide", reverse: false});
    	return false;
    });
    
    $('.headerLeft').delegate('#backTitulaciones', 'click', function(e) {
    	localStorage.setItem('curso', "");
    	$.mobile.changePage("#pageTitulaciones", {transition: "slide", reverse: true});
    	return false;
    });
    
    myScrollCursos = new IScroll('#cursosContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});

});

$(document).on('pageshow', '#pageCursos',function(e,data) {
	
	if(null != myScrollCursos) {
		$('#cursosContenido').height(getRealContentHeight());
		myScrollCursos.refresh();
	}
});

/** Resto metodos ****/
function iniciarPageCursos() {
	localStorage.setItem('curso', "");
	loadCursos();
}

function loadCursos() {
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'apuntes/cursos',
	data : 'idTitulacion='+ encodeURIComponent(localStorage.getItem('titulacion')),
	dataType: "json",
	headers: {"Accept": "application/json"},
	success : function(response) {
		$('#listaCursos').empty();
		for ( var i = 0, len = response.length; i < len; ++i) {
	       var curso = response[i];
	       $('#listaCursos').append("" +
	       		"<li id=\"curso_"+curso.idCurso+"\" data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-theme=\"c\" class=\"ui-btn ui-btn-up-c ui-btn-icon-right ui-li-has-arrow ui-li ui-li-last\">" +
	       		"<div class=\"ui-btn-inner ui-li\">" +
	       		"<div class=\"ui-btn-text\">" +
	       		"<a href=\"#\" class=\"ui-link-inherit\">" +
	       		curso.nombre +
	       		"</a>" +
	       		"</div>" +
	       		"<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span>" +
	       		"</div>" +
	       		"</li>");
		}
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


/*********************************************/
/*********************************************/
/** Asignaturas ******************************/
/*********************************************/
/*********************************************/

/** Inicializacion ***/
var myScrollAsignaturas = null;

$("#pageAsignaturas").on("pagebeforeshow", function(event, ui) {
	iniciarPageAsignaturas();
});

$("#pageAsignaturas").on("pageinit", function(event, ui) {
    
    $("#listaAsignaturas").delegate('li', 'click', function(e) {
    	localStorage.setItem('asignatura', $(this).attr("id").replace("asignatura_",""));
    	$.mobile.changePage("#pageApuntes", {transition: "slide", reverse: false});
    	return false;
    });
    
    $('.headerLeft').delegate('#backCursos', 'click', function(e) {
    	localStorage.setItem('asignatura', "");
    	$.mobile.changePage("#pageCursos", {transition: "slide", reverse: true});
    	return false;
    });
    
    myScrollAsignaturas = new IScroll('#asignaturasContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});

});

$(document).on('pageshow', '#pageAsignaturas',function(e,data) {
	
	if(null != myScrollAsignaturas) {
		$('#asignaturasContenido').height(getRealContentHeight());
		myScrollAsignaturas.refresh();
	}
});

/** Resto metodos ****/
function iniciarPageAsignaturas() {
	localStorage.setItem('asignatura', "");
	loadAsignaturas();
}

function loadAsignaturas() {
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'apuntes/asignaturas',
	data : 'idCurso='+ encodeURIComponent(localStorage.getItem('curso')),
	dataType: "json",
	headers: {"Accept": "application/json"},
	success : function(response) {
		$('#listaAsignaturas').empty();
		for ( var i = 0, len = response.length; i < len; ++i) {
	       var asignatura = response[i];
	       $('#listaAsignaturas').append("" +
	       		"<li id=\"asignatura_"+asignatura.idAsignatura+"\" data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-theme=\"c\" class=\"ui-btn ui-btn-up-c ui-btn-icon-right ui-li-has-arrow ui-li ui-li-last\">" +
	       		"<div class=\"ui-btn-inner ui-li\">" +
	       		"<div class=\"ui-btn-text\">" +
	       		"<a href=\"#\" class=\"ui-link-inherit\">" +
	       		asignatura.nombre +
	       		"</a>" +
	       		"</div>" +
	       		"<span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span>" +
	       		"</div>" +
	       		"</li>");
		}
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


/*********************************************/
/*********************************************/
/** Apuntes **********************************/
/*********************************************/
/*********************************************/

/** Inicializacion ***/
var myScrollApuntes = null;

$("#pageApuntes").on("pagebeforeshow", function(event, ui) {
	iniciarPageApuntes();
});

$("#pageApuntes").on("pageinit", function(event, ui) {
	
    $("#listaApuntes").delegate('li', 'click', function(e) {
    	selecDeselecApuntes($(this));
    	return false;
    });
    
	$('.headerLeft').delegate('#backAsignaturas', 'click', function(e) {
		$.mobile.changePage("#pageAsignaturas", {transition: "slide", reverse: true});
		return false;
	});
    
	myScrollApuntes = new IScroll('#apuntesContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});

});

$(document).on('pageshow', '#pageApuntes',function(e,data) {
	
	if(null != myScrollApuntes) {
		$('#apuntesContenido').height(getRealContentHeight());
		myScrollApuntes.refresh();
	}
});

/** Resto metodos ****/
function iniciarPageApuntes() {
	loadApuntes();
}

function selecDeselecApuntes(panel) {
	var idApuntes = $(panel).find("#tdCheck").attr("class").replace("tdCheck_","").replace(" selec", "");
	var precio = $(panel).find(".spanPrecio").text();
	
	if( ! $(panel).find("#tdCheck").hasClass('selec')) {
		$(panel).find('img').attr("src","images/shopping_cart_delete.png");
		$(panel).find("#tdCheck").addClass('selec');
		
		//Se añaden los apuntes al Array del Pedido
		var listaApuntesPedido = JSON.parse(localStorage["listaApuntesPedido"]);
		listaApuntesPedido.push(idApuntes);
		localStorage["listaApuntesPedido"] = JSON.stringify(listaApuntesPedido);
		
		//Se actualiza el num eltos del carrito
		$('.carritoNumEltos').text(listaApuntesPedido.length);
		
		//Se actualiza el precio del pedido
		var precioActual = $('.headerPedido').first().text();
		var precioTotal = parseFloat(precio) + parseFloat(precioActual);
		updateTotalPrices(precioTotal.toFixed(2));
	}
	else {
		$(panel).find('img').attr("src", "images/shopping_cart_add.png");
		$(panel).find("#tdCheck").removeClass('selec');

		//Se borran los apuntes del Array del Pedido
		var listaApuntesPedido = JSON.parse(localStorage["listaApuntesPedido"]);
		listaApuntesPedido = jQuery.grep(listaApuntesPedido, function(value) {
								  return value != idApuntes;
								});
		localStorage["listaApuntesPedido"] = JSON.stringify(listaApuntesPedido);

		//Se actualiza el num eltos del carrito
		$('.carritoNumEltos').text(listaApuntesPedido.length);
		
		//Se actualiza el precio del pedido
		var precioActual = $('.headerPedido').first().text();
		var precioTotal = parseFloat(precioActual) - parseFloat(precio);
		updateTotalPrices(precioTotal.toFixed(2));
	}
}

function loadApuntes() {
	$.ajax({
	type: "POST",
    async: false,
	url : urlBase + 'apuntes/apuntes',
	data : 'idAsignatura='+ encodeURIComponent(localStorage.getItem('asignatura')),
	dataType: "json",
	headers: {"Accept": "application/json"},
	success : function(response) {
		$('#listaApuntes').empty();
		for ( var i = 0, len = response.length; i < len; ++i) {
		   var apuntes = response[i];
		   var fecha = getDateFormated(new Date(apuntes.fechaAlta));
		   
		   //Calculo para mostrar los apuntes para Añadir o para Borrar
		   var htmlTdCheckAndImg = "";
		   var listaApuntesPedido = JSON.parse(localStorage["listaApuntesPedido"]);
		   if(-1 < jQuery.inArray( apuntes.idApuntes.toString(), listaApuntesPedido )) {
			   //Ya está en el pedido
			   htmlTdCheckAndImg = 
				   '<td id="tdCheck"  class="tdCheck_' + apuntes.idApuntes + ' selec" rowspan="3">' +
				   '<img src="images/shopping_cart_delete.png" width="35" height="35"></img>';
		   }
		   else {
			   //No está en el pedido
			   htmlTdCheckAndImg = 
				   '<td id="tdCheck"  class="tdCheck_' + apuntes.idApuntes + '" rowspan="3">' +
				   '<img src="images/shopping_cart_add.png" width="35" height="35"></img>';
		   }

	       $('#listaApuntes').append(
	 			'<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="false" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-up-c ui-btn-icon-right ui-li ui-li-has-alt ui-li-has-thumb ui-li-last">'+
	    		'<a href="#" class="apuntesSel ui-link-inherit">'+
	    		
	    		"<table id=\"tablaApuntes\">" +
	       		"<tr>" +
	       		
	       		htmlTdCheckAndImg +
	       		
	       		"</td><td class=\"aptesDesc\"> <span class=\"descripcionApuntes\">" + apuntes.descripcion + "</span></td><td><strong><span class=\"spanPrecio\">" + apuntes.precio.toFixed(2) + "</span>&euro;</strong></td>" +
	       		"</tr><tr>" +
	       		"<td><strong>" + apuntes.profesor + "</strong></td><td>P&aacute;ginas: " + apuntes.numPaginas + "</td>" +
	       		"</tr><tr>" +
	       		"<td>Fecha de alta: " + fecha + "</td><td>Veces impreso: " + apuntes.numImpresiones + "</td>" +
	       		"</tr></table>" +           			
	   			
	   			'</a></li>');
		}
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

