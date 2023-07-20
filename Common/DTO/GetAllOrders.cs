using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.DTO
{
    public class GetAllOrders
    {
        public Guid OrderId { get; set; }
        public Guid UserId { get; set; }
        public List<UserOrderProductsRequestModel> UserOrderProductsRequestModels { get; set; }
        public decimal TotalPrice { get; set; }
        public int TotalProducts { get; set; }
    }
}
