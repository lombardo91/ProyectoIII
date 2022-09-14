function AbrirModal() {
    //-----------------------------------------------------------------------------------
    $("#Titulo-Modal-Articulo").text("Crear Nuevo Articulo");
    $("#exampleModal").modal("show");
    $("#ArticuloID").val(0);
}
function VaciarFormulario() {
    //-----------------------------------------------------------------------------------
    $("#ArticuloID").val(0);
    $("#ArticuloNombre").val('');
    $("#Error-ArticuloNombre").text("");
    $("#Error-SubrubroID").text("");
    $("#RubroID").val(0);
    $("#SubrubroID").val(0);
    $("#PrecioCosto").val(0);
    $("#PorcentajeGanancia").val(0);
    $("#PrecioVenta").val(0);
    //$("#ArticuloID").val(0);
    //$("#NuevoArticulo").val('');
    //$("#ErrorArticuloNombre").text("");
}

$("#RubroID").change(function () {//-----------------------------------------------------------------------------------
    BuscarSubRubros();
});
function BuscarSubRubros() {
    //------------------------------------------------------------------------------------------------------
    $("#SubrubroID").empty();
    //se limpia el contenido del dropdownlist

    let rubroID = $("#RubroID").val();
    
    $.ajax({
        type: 'POST',
        //se llama al metodo en el controlador
        url: "../../Subrubro/ComboSubRubro",
        dataType: 'json',
        //parametros que se envian al metodo del controlador
        data: { id: RubroID},
        //exitoso, entonces
        success: function (subRubros) {
            if (rubroID == 0) {
                $("#SubrubroID").append('<option value="' + "0" + '">' + "[SELECCIONE UN RUBRO]" + '</option>');
            }
            else {
                if (subRubros.lengt == o) {
                    $("#SubrubroID").append('<option value="' + "0" + '">' + "[NO EXISTEN SUBRUBROS]" + '</option>');
                } else  {
                       $.each(subRubros, function (i, subRubro) {
                        $("#SubrubroID").append('<option value="' + subRubro.value + '">' +
                         subRubro.text + '</option>');
                       });
                }
                
            }
        },

        error: function (ex) {
        }
    });
    return false;
}
function GuardarArticulo() {
    //--------------------------------------------------------------------------------------------------------------
    $("#Error-ArticuloNombre").text("");
    $("#Error-SubrubroID").text("");


    let articuloID = $("#ArticuloID").val();
    let articuloNombre = $("#ArticuloNombre").val().trim();
    let subrubroID = $("#SubrubroID").val();
    let costo = $("#PrecioCosto").val();
    let ganancia = $("#PorcentajeGanancia").val();
    let venta = $("#PrecioVenta").val();

    let guardar = true;

    if (articuloNombre == "" || articuloNombre == null) {
        guardar = false;
        $("#Error-ArticuloNombre").text("Debe ingresar un Nombre.");
    }
    if (subrubroID == 0) {
        guardar = false;
        $("#Error-SubrubroID").text("Debe seleccionar un Subrubro.");
    }
    if (guardar) {
        $.ajax({
            type: "POST",
            url: '../../Articulos/GuardarArticulo',
            data: {
                ArticuloID: articuloID, Descripcion: articuloNombre,
                SubrubroID: subrubroID, Costo: costo,
                Ganancia: ganancia, Venta: venta
            },
            success: function (resultado) {
                if (resultado == 0) {
                    $("#exampleModal").modal("hide");
                    CompletarTablaArticulos();
                }
            },
            error: function (data) {
            }
        });
    }
    //$("#ErrorArticuloNombre").text(""); ver esto
    //y ver error subrubro id
    //let articuloID = $("#ArticuloID").val(); //De donde viene ese RubroID??
    //let subrubro = $("#TipoDeSubrubro").val();
    //let ArticuloNombre = $("#NuevoArticulo").val().trim();

    //if (ArticuloNombre != "" && ArticuloNombre != null) {
    //    $.ajax({
    //        type: "POST",
    //        url: '../../Articulo/GuardarArticulo',
    //        data: { ArticuloID: articuloID, Descripcion: ArticuloNombre, SubrubroID: subrubro, PrecioCosto: PrecioCosto, PorcentajeGanancia: PorcentajeGanancia, PrecioVenta: PrecioVenta  },
    //        success: function (resultado) {
    //            if (resultado == 0) {
    //                $("#exampleModal").modal("hide");
    //                CompletarTablaArticulos();
    //            }
    //            if (resultado == 2) {
    //                $("##ErrorArticuloNombre").text("El Articulo ingresado  ya existe en la lista");
    //            }
    //        },
    //        error: function (data) {
    //        }
    //    });
    //} else {
    //    $("##ErrorArticuloNombre").text("Este campo no puede GUARDARSE vacio")
    //}

  
    
}

function BuscarArticulo(articuloID) { //Funcion completa------------mel
    $("#Titulo-Modal-Articulo").text("Editar Articulo");
    $("#ArticuloID").val(articuloID);
    $.ajax({
        type: "POST",
        url: '../../Articulos/BuscarArticulo',
        data: { ArticuloID: articuloID },
        success: function (articulo) {
            $("#ArticuloNombre").val(articulo.descripcion);
            $("#RubroID").val(articulo.rubroID);
            BuscarSubRubros();

            $("#PrecioCosto").val(articulo.precioCosto.toFixed(2));
            $("#PorcentajeGanancia").val(articulo.porcentajeGanancia.toFixed(2));
            $("#PrecioVenta").val(articulo.precioVenta.toFixed(2));
            $("#SubrubroID").val(articulo.subrubroID);
            $("#exampleModal").modal("show");
        },
        error: function (data) {
        }
    });
}//-------------------------------------------------------------------

function CompletarTablaArticulos() {
    VaciarFormulario();
    $.ajax({
        type: "POST",
        url: '../../Articulo/BuscarArticulos',
        data: {},
        success: function (ListadoArticulos) {
            $("#tbody-articulos").empty();
            $.each(ListadoArticulos, function (index, articulo) {

                let claseEliminado = 'bg-primary';
                let botones = '<button type="button" onclick="BuscarArticulo(' + articulo.articuloID + ')" class="btn btn-primary btn-sm" style="margin-right:5px"> Editar </button>' +
                    '<button type="button" onclick="EliminarArticulo(' + articulo.articuloID + ',1)" class="btn btn-danger btn-sm"> Eliminar </button>';
                if (articulo.eliminado) {
                    claseEliminado = 'table-danger';
                    botones = '<button type="button" onclick="EliminarArticulo(' + articulo.articuloID + ',0)" class="btn btn-success btn-sm"> Activar </button>';
                }
                $("#tbody-articulos").append('<tr class=' + claseEliminado + '>' +
                    //mostrar en la tabla de Index
                    '<td>' + articulo.descripcion + '</td>' +
                    '<td>' + articulo.articuloNombre + '</td>' +  //Ver esto
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
function EliminarArticulo(articuloID, elimina) {
    $.ajax({
        type: "POST",
        url: '../../Articulo/EliminarArticulo',
        data: { ArticuloID: articuloID, Elimina: elimina },
        success: function (articulo) {
            CompletarTablaArticulos();
        },
        error: function (data) {
        }
    });
}

