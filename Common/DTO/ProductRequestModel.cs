using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace DAL.Models.DTO
{
    public class ProductRequestModel
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public IFormFile? Image { get; set; }
        public string? ImageName { get; set; }
        public string? ImagePath { get; set; }
    }
}
