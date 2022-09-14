using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PrimerProyectoIII.Data;
using PrimerProyectoIII.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PrimerProyectoIII.Controllers
{
    public class ArticuloController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ArticuloController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            //EN INDEX DE CONTROLADOR DE ARTICULOS copie desde el aula virtual

            var rubros = _context.Rubros.Where(p => p.Eliminado == false).ToList();
            rubros.Add(new Rubro { RubroID = 0, Descripcion = "[SELECCIONE UN RUBRO]" });
            ViewBag.RubroID = new SelectList(rubros.OrderBy(p => p.Descripcion), "RubroID", "Descripcion");

            List<Subrubro> subrubros = new List<Subrubro>();
            subrubros.Add(new Subrubro { SubrubroID = 0, Descripcion = "[SELECCIONE UN RUBRO]" });
            ViewBag.SubrubroID = new SelectList(subrubros.OrderBy(p => p.Descripcion), "SubrubroID", "Descripcion");
            return View();
            //EN INDEX DE CONTROLADOR DE ARTICULOS copie desde el aula virtual hasta aca
        }
        public JsonResult BuscarArticulos()
        {
            //CREAMOS UNA OBJETO LIST EN BLANCO DONDE INCLUYA RUBROS
            var articulos = _context.Articulos.Include(r => r.Subrubro).ToList();
            //CREAMOS LISTA PARA PODER MOSTRAR SOBRE EL MODELO CREADO 
            List<VistaArticulo> articuloList = new List<VistaArticulo>();
            //CARGAMOS EN EL OBJETO CREADO RECORRIENDO LA TABLA 
            foreach (var subrubro in articulos)
            {
                var articulomostrar = new VistaArticulo()
                {
       
                };
                articuloList.Add(articulomostrar);

            }
            return Json(articuloList);
        }
        public JsonResult GuardarArticulo(int ArticuloID, string Descripcion, string Costo, string Venta, string Ganancia, int SubrubroID )
        {
            //CONFIGURACIÓN DE CULTURA ESPAÑOL ARGENTINA
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-AR");

            //PUNTO COMO DECIMAL
            //int resultado = 0;--------------------------------------mel

            Costo = Costo.Replace(".", ",");
            Ganancia = Ganancia.Replace(".", ",");
            Venta = Venta.Replace(".", ",");
            decimal costo = Convert.ToDecimal(Costo);
            decimal ganancia = Convert.ToDecimal(Ganancia);
            decimal venta = Convert.ToDecimal(Venta);

            if (ArticuloID == 0)
            {
                var articuloCrear = new Articulo
                {
                    Descripcion = Descripcion,
                    SubrubroID = SubrubroID,
                    PrecioCosto = costo,
                    PorcentajeGanancia = ganancia,
                    PrecioVenta = venta,
                    UltAct = DateTime.Now //FECHA Y HORA ACTUAL
                };
                _context.Add(articuloCrear);
                _context.SaveChanges();
            }
            else
            {
                var articulo = _context.Articulos.Single(m => m.ArticuloID == ArticuloID);

                //CAMBIAMOS LA DESCRIPCIÓN POR LA QUE INGRESÓ EL USUARIO EN LA VISTA
                articulo.Descripcion = Descripcion;
                articulo.SubrubroID = SubrubroID;

                if (articulo.PrecioCosto != costo || articulo.PrecioVenta != venta)
                {
                    articulo.UltAct = DateTime.Now;
                }
                articulo.PrecioCosto = costo;
                articulo.PorcentajeGanancia = ganancia;
                articulo.PrecioVenta = venta;
                _context.SaveChanges();
            }
            int resultado = 0;
            return Json(resultado);
        }

        public JsonResult EliminarArticulo(int ArticuloID, int Elimina)
        {
            bool resultado = true;

            var articulo = _context.Articulos.Find(ArticuloID);
            if (articulo != null)
            {
                if (Elimina == 0)
                {
                    articulo.Eliminado = false;
                }
                else
                {
                    articulo.Eliminado = true;
                }

                _context.SaveChanges();
            }

            return Json(resultado);
        }
    }
}
