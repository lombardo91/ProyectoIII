using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using PrimerProyectoIII.Models;

namespace PrimerProyectoIII.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<PrimerProyectoIII.Models.Rubro> Rubros { get; set; }
        public DbSet<PrimerProyectoIII.Models.Subrubro> Subrubros { get; set; }
        public DbSet<PrimerProyectoIII.Models.Articulo> Articulos { get; set; }
        public object Subrubro { get; internal set; }
    }
}
