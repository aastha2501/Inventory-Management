using BAL.Services;
using DAL.Models;
using DAL.Models.DTO;
using DAL.Repository;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User, Admin")]
    public class SalesmanController : ControllerBase
    {
        private readonly IProductService _productService = null;

        public SalesmanController(IProductService productService)
        {
            _productService = productService;
        }
      
        [HttpGet("/dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var list = await _productService.GetAllProducts();
            if (list != null)
            {
                return Ok(list);
            }
            return BadRequest();
        }

        [HttpGet("prod/{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var prod = await _productService.GetProdById(id);
            if (prod != null)
            {
                return Ok(prod);
            }
            return BadRequest();
        }
          
            [HttpPost("invoice")]
             
            public async Task<IActionResult> SaveInvoice(RequestProductOorder orders)
            {
                var userId = User.FindFirstValue(ClaimTypes.Name);
                var res = await _productService.SaveInvoice(orders, userId);
           
                if (res != null)
                {
                return Ok(res);
                }
            return BadRequest();
           }


        [HttpPost("update")]
        public async Task<IActionResult> Update(List<Product> list)
        {
            var res = await _productService.Update(list);
            if (res != null)
            {
                return Ok(res);
            }
            return BadRequest();
        }

        [HttpGet("invoices/{id:guid}")]
        public async Task<IActionResult> GetInvoiceByUserId(Guid id)
        {
            var res = await _productService.GetInvoiceByUserId(id);
            if (res != null)
            {
                return Ok(res);
            }
            return BadRequest();
        }

        [HttpDelete("deleteInvoice/{id:guid}")]
        public async Task<IActionResult> CancleOrder(Guid id)
        {
            var res = await _productService.CancleOrder(id);
            if (res != null)
            {
                return Ok(res);
            }
            return BadRequest();
        }
        
    }
}
