using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PrimerProyectoIII.Data;
using PrimerProyectoIII.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PrimerProyectoIII.Controllers
{
    public class SubrubroController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SubrubroController(ApplicationDbContext context)
        {
            _context = context;
        }
        // Get Subrubros 
        public IActionResult Index()
        {//CREAMOS OBJETO EN FORMA DE LISTA CON LOS RUBROS ACTIVOS
            var rubros = _context.Rubros.Where(p => p.Eliminado == false).ToList();
            //CARGAMOS UNA LISTA ORDENADA DE RUBROS DONDE INCLUIMOS 2 PARAMETROS
            ViewBag.RubroID = new SelectList(rubros.OrderBy(p => p.Descripcion), "RubroID", "Descripcion");
            return View();
        }
        public JsonResult BuscarSubRubros()
        {
            //CREAMOS UNA OBJETO LIST EN BLANCO DONDE INCLUYA RUBROS
            var subrubros = _context.Subrubros.Include(r => r.Rubro).ToList();
            //CREAMOS LISTA PARA PODER MOSTRAR SOBRE EL MODELO CREADO 
            List<ListadoSubrubros> subrubrosList = new List<ListadoSubrubros>();
            //CARGAMOS EN EL OBJETO CREADO RECORRIENDO LA TABLA 
            foreach (var subrubro in subrubros)
            {
                var subrubromostrar = new ListadoSubrubros()
                {
                    SubrubroID = subrubro.SubrubroID,
                    Descripcion = subrubro.Descripcion,
                    RubroID = subrubro.RubroID,
                    RubroNombre = subrubro.Rubro.Descripcion,
                    Eliminado = subrubro.Eliminado,
                };
                subrubrosList.Add(subrubromostrar);

            }
            return Json(subrubrosList);
        }



        // Código para armar combo de subrubro a partir de un rubro
        public JsonResult ComboSubRubro(int id)//RUBRO ID
        {  //BUSCAR SUBRUBROS
            var subRubros = (from o in _context.Subrubros where o.RubroID == id && o.Eliminado == false select o).ToList();
            return Json(new SelectList(subRubros, "SubrubroID", "Descripcion"));
        }
        public JsonResult BuscarSubrubro(int SubrubroID)
        {
            var subrubros = _context.Subrubros.FirstOrDefault(m => m.SubrubroID == SubrubroID);
            return Json(subrubros);
        }

        private bool SubrubroExists(int id)
        {
            return _context.Subrubros.Any(e => e.SubrubroID == id);
        }
        public JsonResult GuardarSubrubro(int SubrubroID, string Descripcion, int RubroID)
        {
            int resultado = 0;
           
            if (!string.IsNullOrEmpty(Descripcion))
            {
                Descripcion = Descripcion.ToUpper(); 
                if (SubrubroID == 0)  
                {  
                    if (_context.Subrubros.Any(e => e.Descripcion == Descripcion))
                    {
                        resultado = 2;
                    }
                    else
                    {
                        var nuevoSubrubro = new Subrubro
                        {
                            Descripcion = Descripcion,
                            RubroID = RubroID,
                        };
                        _context.Add(nuevoSubrubro);
                        _context.SaveChanges();
                    }

                }
                else
                {
                    if (_context.Subrubros.Any(e => e.Descripcion == Descripcion && e.SubrubroID != SubrubroID))
                    {
                        resultado = 2;
                    }
                    else
                    {
                        var subrubro = _context.Subrubros.Single(m => m.SubrubroID == SubrubroID);
                        subrubro.Descripcion = Descripcion;
                        subrubro.RubroID = RubroID; // modificar el ID del rubro (Agregue hoy)
                        _context.SaveChanges();
                    }

                }
            }
            else
            {
                resultado = 1;
            }
            return Json(resultado);
        }
        public JsonResult EliminarSubrubro(int SubrubroID, int Elimina)
        {
            bool resultado = true;

            var subrubro = _context.Subrubros.Find(SubrubroID);
            if (subrubro != null)
            {
                if (Elimina == 0)
                {
                    subrubro.Eliminado = false;
                }
                else
                {
                    subrubro.Eliminado = true;
                }

                _context.SaveChanges();
            }

            return Json(resultado);
        }
    }
}
