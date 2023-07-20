using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.DTO
{
    public class AllOrdersOfSingleUser
    {
        public Guid OrderId { get; set; }   
        public decimal Price { get; set; }  
        public int Quantity { get; set; }
    }
}
