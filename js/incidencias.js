/** Suscripciones iniciales al arrancar la app *********************/
var myScrollIncidencias = null;

$('#pageIncidencias').on('pageinit', function() {
    
    $('#listaIncidencias').delegate('.asignarme', 'click', function(e) {
    	asignarmeIncidencia($(this).attr("id"));
    });
    
    $('#listaIncidencias').delegate('.divBtnCerrar', 'click', function(e) {
    	cerrarIncidencia($(this).attr("id"));
    });
    
    myScrollIncidencias = new IScroll('#incidenciasContenido', {
		snap: true, 
		momentum: false, 
		hScrollbar: false, 
		checkDOMChanges: true,
		click: false,
	    preventDefaultException: { tagName:/.*/ },
		onScrollEnd: function () {}
	});
});

$(document).on('pagebeforeshow', '#pageIncidencias',function(e,data) {
	getIncidencias();
});

$(document).on('pageshow', '#pageIncidencias',function(e,data) {
	if(null != myScrollIncidencias) {
		$('#incidenciasContenido').height(getRealContentHeight());
		myScrollIncidencias.refresh();
	}
});

/***************** Consultas BBDD *****************/
function getIncidencias() {
	$.ajax({
		type: "POST",
	    async: false,
		url : urlBase + 'expendedor/getExpendedores',
		dataType: "json",
		headers: {"Accept": "application/json"},
		success : function(response) {
			$('#listaIncidencias').empty();
			for(var i = 0; i < response.length; ++i) {
				var expendedor = response[i];
				
				switch(expendedor.estado) {
					case 0:
						var semaforo = 'images/punto_v.png';
						break;
					case 1:
						var semaforo = 'images/punto_a.png';
						break;
					case 2:
						var semaforo = 'images/punto_r.png';
						break;
				}
				
				var direccion = expendedor.direccion.direccion;
				
				$('#listaIncidencias').append(
				'<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-b ui-first-child">' +
				'	<img src="' + semaforo + '" width="15px"/><span> Exp. ' + expendedor.idExpendedor + ': </span><span> ' + direccion + '</span>' +
				'</li>');
				
				getIncidenciasByIdExpendedor(expendedor.idExpendedor);
			}    
		},
		error : function(xhr,textStatus,err)
		{
		    alert("Hay problemas de red. Revisa tu configuración e inténtalo más tarde.");
		}
	});
}

function getIncidenciasByIdExpendedor(idExpendedor) {
	$.ajax({
		type: "POST",
	    async: false,
		url : urlBase + 'expendedor/getListaIndicenciasNoSolventadasByExpendedor',
		data : 'idExpendedor='+ encodeURIComponent(idExpendedor),
		dataType: "json",
		headers: {"Accept": "application/json"},
		success : function(response) {
			$('#listaIncidencias_' + idExpendedor).empty();
			for(var i = 0; i < response.length; ++i) {
				var incidencia = response[i];
				
				var fecha = getDateFormated(new Date(incidencia.fechaApertura));
				var hora = getTimeFormated(new Date(incidencia.fechaApertura));
				
				var nombreTecnico = "";
				var usuarioActual = JSON.parse(localStorage.getItem('usuario'));
				var idUsuarioActual = usuarioActual.idUsuario;
				
				if(incidencia.usuario) {
					nombreTecnico = incidencia.usuario.nombre;
				}
				
				var notasTecnico = "";
				if(incidencia.notasTecnico) {
					notasTecnico = incidencia.notasTecnico;
				}				
				
				$('#listaIncidencias').append(
					'<li id="liIncidencia_' + incidencia.idIncidencia + '" class="li-incidencia ui-li ui-li-static ui-btn-up-d ui-li-has-count ui-last-child">' +
					'	<div id="incidenciaParent_' + incidencia.idIncidencia + '" class="incidenciaParent">' +
					'		<div class="divIncidenciaFloat"><strong>' + incidencia.tipo + '</strong></div>' +
					'		<div class="divIncidenciaFloat"><div class="incidenciaTecnico tecnicoAsignado_' + incidencia.idIncidencia + '"><span>Técnico asignado: </span><span id="nombreTecnico_' + incidencia.idIncidencia + '">' + nombreTecnico + '</span></div><div id="btnAsignar_' + incidencia.idIncidencia + '" class="btnIncidencia asignarme tecnicoNoAsignado_' + incidencia.idIncidencia + '"><span>Asignarme</span></div></div>' +
					'		<div class="divIncidenciaFloat"><span>Fecha apertura: </span><span>' + fecha + '</span><span> ' + hora + '</span></div>' +
					'		<div class="divIncidenciaFloat"><div id="btnCerrar_' + incidencia.idIncidencia + '" class="btnIncidencia divBtnCerrar tecnicoAsignadoYo_' + incidencia.idIncidencia + '"><span>Cerrar incidencia</span></div></div>' +
					'		<div class="divTextarea"><textarea name="textarea" id="textarea_' + incidencia.idIncidencia + '" class="textarea" placeholder="Notas resolución incidencia">' + notasTecnico + '</textarea></div>' +
					'	</div>' + 
					'</li>');
				
				//Ajustando la visisbilidad de elementos al usuario actual
				if(incidencia.usuario) {
					if(incidencia.usuario.idUsuario == idUsuarioActual) {
						//Usuario actual asignado
						$('.tecnicoAsignadoYo_' + incidencia.idIncidencia).show();
						$('#textarea_' + incidencia.idIncidencia).show();
					}
					else {
						//usuario actual no asignado
						$('.tecnicoAsignadoYo_' + incidencia.idIncidencia).hide();
						$('#textarea_' + incidencia.idIncidencia).hide();
					}
					//mostrar usuario asignado
					$('.tecnicoAsignado_' + incidencia.idIncidencia).show();
					$('.tecnicoNoAsignado_' + incidencia.idIncidencia).hide();
				}
				else {
					//ocultar usuario asignado
					$('.tecnicoAsignado_' + incidencia.idIncidencia).hide();
					$('.tecnicoNoAsignado_' + incidencia.idIncidencia).show();
					$('.tecnicoAsignadoYo_' + incidencia.idIncidencia).hide();
					$('#textarea_' + incidencia.idIncidencia).hide();
				}
			}
			
			$('#listaIncidencias').listview('refresh');
		},
		error : function(xhr,textStatus,err)
		{
		    alert("Hay problemas de red. Revisa tu configuración e inténtalo más tarde.");
		}
	});
}

function asignarmeIncidencia(divId) {
	var idIncidencia = divId.replace("btnAsignar_", "");
	var usuario = JSON.parse(localStorage.getItem('usuario'));
	
	$.ajax({
		type: "POST",
	    async: false,
		url : urlBase + 'expendedor/asignarIncidencia',
		data : 'idIncidencia='+ encodeURIComponent(idIncidencia) +
			   '&idUsuario='+ encodeURIComponent(usuario.idUsuario),
		headers: {"Accept": "application/json"},
		success : function(response) {
			//Ajustando la visisbilidad de elementos al usuario actual
			$('.tecnicoAsignadoYo_' + idIncidencia).show();
			$('#textarea_' + idIncidencia).show();
			$('.tecnicoAsignado_' + idIncidencia).show();
			$('.tecnicoNoAsignado_' + idIncidencia).hide();
			
			//Actualizando nombre tecnico asignado
			$('#nombreTecnico_' + idIncidencia).text(usuario.nombre);
		},
		error : function(xhr,textStatus,err)
		{
		    alert("Hay problemas de red. Revisa tu configuración e inténtalo más tarde.");
		}
	});
}

function cerrarIncidencia(divId) {
	var idIncidencia = divId.replace("btnCerrar_", "");
	var notasTecnico = $('#textarea_' + idIncidencia).val();
	
	$.ajax({
		type: "POST",
	    async: false,
		url : urlBase + 'expendedor/cerrarIncidencia',
		data : 'idIncidencia='+ encodeURIComponent(idIncidencia) +
			   '&notasTecnico='+ encodeURIComponent(notasTecnico),
		headers: {"Accept": "application/json"},
		success : function(response) {
			getIncidencias();
		},
		error : function(xhr,textStatus,err)
		{
		    alert("Hay problemas de red. Revisa tu configuración e inténtalo más tarde.");
		}
	});
}
