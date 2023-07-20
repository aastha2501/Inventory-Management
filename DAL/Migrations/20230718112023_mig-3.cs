using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class mig3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "728c2768-8031-4ddf-a0fc-8693476f014c", "AQAAAAEAACcQAAAAELWkKhcnnlvTQHtdmBeoN4CbaTiW82+LBthbN4ft4hrWhr64j1erPgbhythJAUS6Cw==", "b1878e0b-b6c5-48f0-98c1-6a6950025cf5" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b74ddd14-6340-4840-95c2-db12554843e5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "23eff404-54b3-4c65-90c6-da2588477d1b", "AQAAAAEAACcQAAAAECHmkFTJv4axyvM4qdWXmqdSPF/eYZHPoCmIkRHIX64dwpxeYWO00G97Lp2owJoduw==", "08145a2d-8a87-49bd-a53f-bf610772fd36" });
        }
    }
}
