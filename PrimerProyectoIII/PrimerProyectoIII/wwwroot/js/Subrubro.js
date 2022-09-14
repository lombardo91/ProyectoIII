
//function BuscarSubRubros() {
//    $("#SubrubroID").empty();
//    $.ajax({
//        type: 'POST',
//        url: "../../Subrubro/ComboSubRubro",
//        dataType: 'json',
//        data: { id: $("#RubroID").val() },
//        success: function (subRubros) {
//            if (subRubros.length == 0) {
//                $("#SubrubroID").append('<option value="' + "0" + '">' + "[NO EXISTEN SUBRUBROS]" + '</option>');
//            }
//            else {
//                $.each(subRubros, function (i, subRubro) {
//                    $("#SubrubroID").append('<option value="' + subRubro.value + '">' +
//                        subRubro.text + '</option>');
//                });
//            }
//        },
//        error: function (ex) {
//        }
//    });
//    return false;
//}
function BuscarSubRubro(subrubroID) {  //agregue de sergio esta funcion + la del controlador
    $("#ErrorSubrubroNombre").text("Editar SubRubro");
    $("#SubrubroID").val(subrubroID);
    $.ajax({
        type: "POST",
        url: '../../Subrubro/BuscarSubrubro',
        data: { SubrubroID: subrubroID },
        success: function (subrubro) {
            $("#TipoDeSubrubro").val(subrubro.descripcion);
            $("#rubroID").val(subrubro.RubroID);
            $("#exampleModal").modal("show");
        },
        error: function (data) {
        }
    });
}
function CompletarTablaSubrubros() {
    VaciarFormulario(); 
    $.ajax({
        type: "POST",
        url: '../../Subrubro/BuscarSubrubros',
        data: {}, 
        success: function (ListadoSubrubros) {
            $("#tbody-subrubros").empty();
            $.each(ListadoSubrubros, function (index, subrubro) {

                let claseEliminado = 'bg-primary';
                let botones = '<button type="button" onclick="BuscarSubRubro(' + subrubro.subrubroID + ')" class="btn btn-primary btn-sm" style="margin-right:5px"> Editar </button>' +
                    '<button type="button" onclick="EliminarSubrubro(' + subrubro.subrubroID + ',1)" class="btn btn-danger btn-sm"> Eliminar </button>';
                if (subrubro.eliminado) {
                    claseEliminado = 'table-danger';
                    botones = '<button type="button" onclick="EliminarSubrubro(' + subrubro.subrubroID + ',0)" class="btn btn-success btn-sm"> Activar </button>';
                }
                $("#tbody-subrubros").append('<tr class=' + claseEliminado + '>' +
                    //mostrar en la tabla de Index
                    '<td>' + subrubro.descripcion + '</td>' +
                    '<td>' + subrubro.rubroNombre + '</td>' +  //Ver esto
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

function GuardarSubrubro() {
    $("#ErrorSubrubroNombre").text("");
    let subrubroID = $("#SubrubroID").val();
    let SubrubroNombre = $("#TipoDeSubrubro").val().trim();
    let rubroID = $("#RubroID").val(); //De donde viene ese RubroID??
    if (SubrubroNombre != "" && SubrubroNombre != null) {
        $.ajax({
            type: "POST",
            url: '../../Subrubro/GuardarSubrubro',
            data: { SubrubroID: subrubroID, Descripcion: SubrubroNombre, RubroID: rubroID}, 
            success: function (resultado) {
                if (resultado == 0) {
                    $("#exampleModal").modal("hide");
                    CompletarTablaSubrubros();
                }
                if (resultado == 2) {
                    $("#ErrorSubrubroNombre").text("El Sub Rubro ingresado  ya existe en la lista");
                }
            },
            error: function (data) {
            }
        });
    } else {
        $("#ErrorSubrubroNombre").text("Este campo no puede GUARDARSE vacio");
    }

}
function VaciarFormulario() {
    $("#SubrubroID").val(0);
    $("#SubrubroNombre").val('');
    $("#ErrorSubrubroNombre").text("");
}
function AbrirModal() {
    $("#TituloModalSubrubro").text("Crear Nuevo Sub Rubro");
    $()
}
function EliminarSubrubro(subrubroID, elimina) {
    $.ajax({
        type: "POST",
        url: '../../Subrubro/EliminarSubrubro',
        data: { SubrubroID: subrubroID, Elimina: elimina },
        success: function (subrubro) {
            CompletarTablaSubrubros();
        },
        error: function (data) {
        }
    });
}
