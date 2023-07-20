using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.DTO
{
    public class OrderRequestModel
    {
        public decimal SubTotal { get; set; }
        public decimal Gst { get; set; }
        public decimal GrandTotal { get; set; }
        public bool IsDeleted { get; set; } = false;
        public List<OrderDetailsRequest> OrderDetailsRequests { get; set; } 
    }
}
