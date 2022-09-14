using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PrimerProyectoIII.Models
{
    public class Subrubro
    {
        [Key]
        public int SubrubroID { get; set; }
        public string Descripcion { get; set; }
        public int RubroID { get; set; }
        public bool Eliminado { get; set; }
        public virtual Rubro Rubro { get; set; }
        public virtual ICollection<Articulo> Articulos { get; set; }
    }
    public class ListadoSubrubros
    {
        public int SubrubroID { get; set; }
        public string Descripcion { get; set; }
        public int RubroID { get; set; }
        public string RubroNombre { get; set; }
        public bool Eliminado { get; set; }
    }
}
