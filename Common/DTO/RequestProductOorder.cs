using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models.DTO
{
    public class RequestProductOorder
    {
        public List<RequestProduct> RequestProducts { get; set; }
        public decimal Total { get; set; }
    }
}
