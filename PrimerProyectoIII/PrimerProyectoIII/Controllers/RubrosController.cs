using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PrimerProyectoIII.Data;
using PrimerProyectoIII.Models;

namespace PrimerProyectoIII.Controllers
{
    public class RubrosController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RubrosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Rubros
        public IActionResult Index()
        {
            return View();
        }

        

        private bool RubroExists(int id)
        {
            return _context.Rubros.Any(e => e.RubroID == id);
        }
        public JsonResult BuscarRubros()
        {
            var rubros = _context.Rubros.ToList();
            return Json(rubros);
        }

        public JsonResult GuardarRubro(int RubroID, string Descripcion) // trae los valores de la vista para comparar
        {                               
            int resultado = 0;
            // 0 --> correcto
            // 1 --> campo descripcion vacio
            // 2 --> registro ya existe
            if (!string.IsNullOrEmpty(Descripcion))
            {
                Descripcion = Descripcion.ToUpper(); //Cuando recivimos el dato, lo transformamos a mayuscula .ToUpper()
                if (RubroID == 0)  //Se crea nuevo registro
                {     //Antes de Crearlo, preguntamos si ya existe uno con la misma descripcion
                    if (_context.Rubros.Any(e => e.Descripcion == Descripcion))
                    {
                        resultado = 2;
                    }else
                    {
                        var nuevoRubro = new Rubro
                        {
                            Descripcion = Descripcion
                        };
                        _context.Add(nuevoRubro);
                        _context.SaveChanges();
                    }
                   
                }
                else
                {
                    //Antes de Editar, preguntamos si ya existe uno con la misma descripcion, y que tenga ID diferente
                    if (_context.Rubros.Any(e => e.Descripcion == Descripcion && e.RubroID != RubroID))
                    {
                        resultado = 2;
                    }else
                    {
                        var rubro = _context.Rubros.Single(m => m.RubroID == RubroID);
                        rubro.Descripcion = Descripcion;
                        _context.SaveChanges();
                        //BUSCAMOS EL REGISTRO EN LA BASE DE DATOS //se crea una variable, que busca en bd,tabla rubros y trae todos campos de rubrosID    
                        //CAMBIAMOS LA DESCRIPCIÓN POR LA QUE INGRESÓ EL USUARIO EN LA VISTA
                    }

                }
            }else
            {
                resultado = 1;
            }
            return Json(resultado);
        }
        public JsonResult BuscarRubro(int RubroID)
        {
            var rubro = _context.Rubros.FirstOrDefault(m => m.RubroID == RubroID);

            return Json(rubro);
        }

        public JsonResult EliminarRubro(int RubroID, int Elimina)
        {
            bool resultado = true;

            var rubro = _context.Rubros.Find(RubroID);
            if (rubro != null)
            {
                if (Elimina == 0)
                {
                    rubro.Eliminado = false;
                }else
                {
                    rubro.Eliminado = true;
                }
              
                _context.SaveChanges();
            }

            return Json(resultado);
        }


    }

}
// ctl + k + d = acomoda el codigo
