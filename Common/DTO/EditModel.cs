using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class EditModel
    {
        public Guid ProductId { get; set; } 
        public int Quantity { get; set; }
    }
}
