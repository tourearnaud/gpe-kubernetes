using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quest_web.Migrations
{
    public partial class FixEmailColumnAndIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Modifier le type de colonne pour qu'il supporte l'index unique
            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "User",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext"
            );

            // Créer l'index unique
            migrationBuilder.CreateIndex(
                name: "IX_User_email",
                table: "User",
                column: "email",
                unique: true
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Supprimer l'index unique
            migrationBuilder.DropIndex(
                name: "IX_User_email",
                table: "User"
            );

            // Revenir à longtext si on annule
            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "User",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255
            );
        }
    }
}
