/** Suscripciones iniciales al arrancar la app *********************/
var myScrollIndex = null;

$('#pageIndex').on('pageinit', function(){
	 
    $(".login").delegate('#botonLogin', 'click', function(e){
//////////TODO TEMPORAL MIENTRAS DESARROLLO
    	login();
//    	$.mobile.changePage("#pageInstituciones");
//
//    	//Se crea el array de apuntes del Pedido
//		var listaApuntesPedido = new Array();
//		localStorage["listaApuntesPedido"] = JSON.stringify(listaApuntesPedido);
////////////////////////////////////////////
    });
    
    $('.headerLogout').delegate('.logOut', 'click', function(e) {
    	//TODO TEMPORAL MIENTRAS DESARROLLO
    	logout();
//    	$.mobile.changePage("#pageIndex");
    });
    
    $(".textLogin").focus(function () {
        $("#loginFail").css('display','none');
    });
    
    myScrollIndex = new IScroll('#indexContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});
    
});

$(document).on('pageshow', '#pageIndex',function(e,data) {
	
	if(null != myScrollIndex) {
		$('#indexContenido').height(getRealContentHeight());
		myScrollIndex.refresh();
	}
});

function login() {
	localStorage.setItem('descripcionPedido', "");
	localStorage.setItem('idPedido', "");
	localStorage.setItem('listaApuntesPedido', "");
	
	var usu = $("#nombredeusuario").val();
	var pass = $("#clave").val();
	
	tryLogin(usu, pass);
}

function logout() {
	var usuario = JSON.parse(localStorage.getItem('usuario'));
	tryLogout(usuario.idUsuario);
	localStorage.setItem('descripcionPedido', "");
	localStorage.setItem('idPedido', "");
	localStorage.setItem('listaApuntesPedido', "");
}

/***************** Consultas BBDD *****************/
function tryLogin(usu, pass) {
$.ajax({
type: "POST",
url : urlBase + 'acceso/login',
data : 'email='+ encodeURIComponent(usu) +
		'&password='+ encodeURIComponent(pass),
dataType: "json",
headers: {"Accept": "application/json"},
success : function(response) {
	if(null != response) {
		localStorage.setItem('usuario', JSON.stringify(response));
		$(".headerNombreUsuario").text(response.nombre);
		$(".headerNombreUsuario").attr('id', response.idUsuario);
		updateSaldo(response.saldo.toFixed(2));
		$('.carritoNumEltos').text("0");
		
		//Se crea el array de apuntes del Pedido
		var listaApuntesPedido = new Array();
		localStorage["listaApuntesPedido"] = JSON.stringify(listaApuntesPedido);

		//Acceder a la pag de apuntes
		$.mobile.changePage("#pageInstituciones", {transition: "slideup", reverse: false});
	}
	else {
		$("#loginFail").show();
	}
	
	$(".textLogin").val('');
},
error : function(xhr,textStatus,err)
{
	//No se ha encontrado ninguna coincidencia
    $("#loginFail").show();
    $(".textLogin").val('');
}
});
}

function tryLogout(id) {
	$.ajax({
	type: "POST",
	url : urlBase + 'acceso/logout',
	data : 'idUsuario='+ encodeURIComponent(id),
	success : function(response) {
		if("OK" == response) {
			localStorage.removeItem('usuario');
			
			//Se elimina el array de Apuntes del pedido
			var listaApuntesPedido = new Array();
			localStorage["listaApuntesPedido"] = JSON.stringify(listaApuntesPedido);
			localStorage.removeItem("listaApuntesPedido");	
			
			/*//se borran los datos del pedido actual del usuario
			cleanOnLogOut();*/
			
			//Acceder a la pag de login
			$.mobile.changePage("#pageIndex", {transition: "slideup", reverse: true});
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
