using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class mig2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "23eff404-54b3-4c65-90c6-da2588477d1b", "AQAAAAEAACcQAAAAECHmkFTJv4axyvM4qdWXmqdSPF/eYZHPoCmIkRHIX64dwpxeYWO00G97Lp2owJoduw==", "08145a2d-8a87-49bd-a53f-bf610772fd36" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "65ab6a95-2b28-4b8e-92fa-e2c80cefc1e6", "AQAAAAEAACcQAAAAEKrle1F4ioBpJsiagwF4NugVn0m5Ejvq9d5uwRcfnVS0TbcEABFZ/qMYbDf5McEdWQ==", "fb6ca493-ae5c-462b-ba0b-04cd9221a148" });
        }
    }
}
