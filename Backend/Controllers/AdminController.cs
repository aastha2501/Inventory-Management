using BAL.Services;
using Common.DTO;
using DAL.Models;
using DAL.Models.DTO;
using DAL.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IProductService _productService = null;
        private readonly IWebHostEnvironment _webHostEnvironment = null;
        public AdminController(IProductService productService, IWebHostEnvironment webHostEnvironment)
        {
            _productService = productService;
            _webHostEnvironment = webHostEnvironment;
        }

        //add
        [HttpPost("addproduct")]
        public async Task<IActionResult> Add([FromForm] ProductRequestModel model)
        {   
            if (model.Image != null)
            {
                var fileResult = SaveImage(model.Image);

                model.ImageName = fileResult.Item2; //getting the name of the image
                model.ImagePath = fileResult.Item1;  //getting the path of the image
             
                var res = _productService.AddProduct(model);
                if (res != null)    
                {
                    return Ok(model);
                }
            }
        
                return BadRequest();
        }

        //delete
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            bool res = await _productService.DeleteProduct(id);
            if (res)
            {
                return Ok(res);
            }
            return NotFound();
        }

        [HttpGet("allOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var res = await _productService.GetAllUsersOrder();
            if (res != null)
            {
                return Ok(res);
            }
            return BadRequest();
        }

        [HttpPost("edit/{id:guid}")]
        public async Task<IActionResult> EditQty(Guid id, EditModel model)
        {
            model.ProductId = id;
            var res = await _productService.EditQty(model);
            if (res != null)
            {
                return Ok(res);
            }
            return BadRequest();
        }

        [NonAction]
        public Tuple<string, string> SaveImage(IFormFile imageFile)
        {
            try
            {
                var contentPath = this._webHostEnvironment.WebRootPath;
                var path = Path.Combine(contentPath, "Images");

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                var ext = Path.GetExtension(imageFile.FileName);
                string uniqueString = Guid.NewGuid().ToString();

                var newFileName = uniqueString + ext;
                var fileWithPath = Path.Combine(path, newFileName);
                var stream = new FileStream(fileWithPath, FileMode.Create);
                imageFile.CopyTo(stream);
                stream.Close();

                return new Tuple<string, string>("https://localhost:7270/Images/"+newFileName, newFileName);
            }
            catch (Exception ex)
            {
                return new Tuple<string, string>("0", "Error has occured");
            }
        }
    }
}
