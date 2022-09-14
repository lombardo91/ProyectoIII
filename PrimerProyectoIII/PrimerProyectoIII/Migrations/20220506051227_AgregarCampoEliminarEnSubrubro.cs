using Microsoft.EntityFrameworkCore.Migrations;

namespace PrimerProyectoIII.Migrations
{
    public partial class AgregarCampoEliminarEnSubrubro : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Subrubros",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Subrubros");
        }
    }
}
