


function CompletarTablaRubros() {
    VaciarFormulario(); 
    $("#RubroID").val(0);  //cada vez que se abre la vista, lo resetea a 0
    $.ajax({
        type: "POST",
        url: '../../Rubros/BuscarRubros',
        data: {},
        success: function (listadoRubros) {
            $("#tbody-rubros").empty();
            $.each(listadoRubros, function (index, rubro) {

                let claseEliminado = 'bg-success';
                let botones = '<button type="button" onclick="BuscarRubro(' + rubro.rubroID + ')" class="btn btn-primary btn-sm" style="margin-right:5px"> Editar </button>' +
                    '<button type="button" onclick="EliminarRubro(' + rubro.rubroID + ',1)" class="btn btn-danger btn-sm"> Eliminar </button>';  
                if (rubro.eliminado) {
                    claseEliminado = 'table-danger';
                    botones = '<button type="button" onclick="EliminarRubro(' + rubro.rubroID + ',0)" class="btn btn-success btn-sm"> Activar </button>';
                    // EliminarRubro metodo que utilizamos para Desactivar y activar rubro, no eliminamos
                }


                 $("#tbody-rubros").append('<tr class='+claseEliminado+'>' +
                        '<td>' + rubro.descripcion + '</td>' +
                        '<td>' + rubro.rubroID + '</td>' +  //Ver esto
                        '<td class="text-center">' +
                        botones +
                        '</td>' + 
                        '</tr>');
                                 
            });
        },
        error: function (data) {
        }
    });
}

function GuardarRubro() {
    $("#ErrorRubroNombre").text("");
    let rubroID = $("#RubroID").val();
    let RubroNombre = $("#TipoDeRubro").val().trim(); // .trim valida los espacios
    // <------ crear validacion para no crear rubro vacio/null
    if (RubroNombre != "" && RubroNombre != null) {
        $.ajax({
            type: "POST",
            url: '../../Rubros/GuardarRubro',
            data: { RubroID: rubroID, Descripcion: RubroNombre },
            success: function (resultado) {
                if (resultado == 0) {
                    $("#exampleModal").modal("hide"); //cerrar el modal   hide:cerrar show:abrir
                    CompletarTablaRubros();
                }
                if (resultado == 2) {
                    $("#ErrorRubroNombre").text("El Rubro ingresado  ya existe en la lista");
                }
            },
            error: function (data) {
            }
        });
    } else {
        $("#ErrorRubroNombre").text("Este campo no puede GUARDARSE vacio");
    }
   
}
function BuscarRubro(rubroID) {
    $("#TituloModalRubro").text("Editar Rubro");
    $("#RubroID").val(rubroID);
    $.ajax({
        type: "POST",
        url: '../../Rubros/BuscarRubro',
        data: { RubroID: rubroID },
        success: function (rubro) {
            $("#TipoDeRubro").val(rubro.descripcion);
            $("#exampleModal").modal("show");
        },
        error: function (data) {
        }
    });
}
function VaciarFormulario() {
    $("#RubroID").val(0);
    $("#RubroNombre").val('');
    $("#ErrorRubroNombre").text("");
}
function AbrirModal() {
    $("#TituloModalRubro").text("Crear Nuevo Rubro");
    $("#RubroID").val(0); 
}
function EliminarRubro(rubroID,elimina) {
    $.ajax({
        type: "POST",
        url: '../../Rubros/EliminarRubro',
        data: { RubroID: rubroID, Elimina: elimina},
        success: function (rubro) {
            CompletarTablaRubros();
        },
        error: function (data) {
        }
    });
}
