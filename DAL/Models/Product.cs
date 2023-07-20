using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Product: BaseEntity
    {
        public string Name { get; set; }    
        public string? Description { get; set; } 
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? Image { get; set; }
        public string? ImageUrl { get; set;}
    }

}
