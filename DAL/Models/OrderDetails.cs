using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class OrderDetails: BaseEntity
    {
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }   
        public Order Order { get; set; }
        [ForeignKey("Product")]
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
        public decimal Price { get; set; }  
        public int Quantity { get; set; }   
    }
}
