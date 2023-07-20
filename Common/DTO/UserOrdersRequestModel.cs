using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.DTO
{
    public class UserOrdersRequestModel
    {
        public Guid OrderId { get; set; }
        public List<UserOrderProductsRequestModel> UserOrderProductsRequestModels { get; set; }
        public int TotalProducts { get; set; }
        public decimal TotalPrice { get; set; } 

    }
}
