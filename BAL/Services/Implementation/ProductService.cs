using DAL.DbContextClass;
using DAL.Models.DTO;
using DAL.Models;
using DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Common.DTO;

namespace BAL.Services.Implementation
{
    public class ProductService : IProductService
    {
        private readonly ApplicationContext _context = null;
        //   private readonly IProductRepo _productRepo = null;

        private IGenericRepository<Product> _genericRepoProduct = null;
        private IGenericRepository<Order> _genericRepoOrder = null;
        private IGenericRepository<OrderDetails> _genericRepoOrderDetails = null;

        public ProductService(

            IGenericRepository<Product> genericProductRepo,
            IGenericRepository<Order> genericRepoOrder,
            IGenericRepository<OrderDetails> genericRepoOrderDetails
            )
        {

            _genericRepoOrder = genericRepoOrder;
            _genericRepoOrderDetails = genericRepoOrderDetails;
            _genericRepoProduct = genericProductRepo;
        }

        public async Task<IEnumerable<Product>> GetAllProducts()
        {
            var res = _genericRepoProduct.GetAll();
            return res;
        }

        public async Task<bool> AddProduct(ProductRequestModel model)
            {

            var product = new Product()
            {
                Id = Guid.NewGuid(),
                Name = model.Name,
                Quantity = model.Quantity,
                Price = model.Price,
                Description = model.Description,
                Image = model.ImageName,
                ImageUrl = model.ImagePath
            };
            await _genericRepoProduct.AddAsync(product);
            return true;
        }

        public async Task<bool> DeleteProduct(Guid id)
        {
            var prod = await _genericRepoProduct.GetByIdAsync(id);
            if (prod != null)
            {
                await _genericRepoProduct.DeleteAsync(prod);
                return true;
            }
            return false;
        }

        public async Task<Product> GetProdById(Guid id)
        {
            var prod = await _genericRepoProduct.GetByIdAsync(id);
            if (prod != null)
            {
                return prod;
            }
            return null;
        }

        public async Task<Guid> SaveInvoice(RequestProductOorder orders, string userId)
        {

            //quantity
            var qty = orders.RequestProducts.Sum(ip => ip.Quantity);

            var order = new Order()
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Quantity = qty

            };
            order.OrderDetails = orders.RequestProducts.Select((ip) => new OrderDetails()
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                ProductId = ip.ProductId,
                Quantity = ip.Quantity

            }).ToList();


            foreach (var orderDetail in order.OrderDetails)
            {
                var prodId = orderDetail.ProductId;
                var qtyy = orderDetail.Quantity;

                var allProducts = _genericRepoProduct.GetAll();

                var productToUpdate = allProducts.FirstOrDefault(p => p.Id == prodId);
                if (productToUpdate != null)
                {
                    productToUpdate.Quantity -= qtyy;
                }

            }

            await _genericRepoOrder.AddAsync(order);
            return order.Id;
        }

        public async Task<List<Product>> Update(List<Product> list)
        {
            var allProd = _genericRepoProduct.GetAll();
            var updatedList = list.Where(x => allProd.Any(y => y.Id == x.Id));

            foreach (var item in updatedList)
            {
                var product = allProd.FirstOrDefault(y => y.Id == item.Id);
                var qty = list.FirstOrDefault(product => product.Id == item.Id);
                if (product != null && product.Quantity > 0)
                {
                    product.Quantity = product.Quantity - qty.Quantity;
                }
                else
                {
                    // var productId = product.Id;

                    //_genericRepoProduct.Delete(productId);
                    await _genericRepoProduct.DeleteAsync(product);
                }
            }
            _genericRepoProduct.Save();
            return allProd.ToList();
        }

        public async Task<Guid> CancleOrder(Guid id)
        {
            var prod = await _genericRepoOrder.GetByIdAsync(id);
            if (prod != null)
            {
                var orderDetails = _genericRepoOrderDetails.GetAll().Where(x => x.OrderId == id).ToList();

                foreach (var orderDetail in orderDetails)
                {
                    var productId = orderDetail.ProductId;
                    var quantity = orderDetail.Quantity;

                    var product = _genericRepoProduct.GetAll().FirstOrDefault(x => x.Id == productId);
                    if (product != null)
                    {
                        product.Quantity += quantity;
                    }
                }
                _genericRepoOrder.Delete(id);

            }
            return id;
        }
        public async Task<List<UserOrdersRequestModel>> GetInvoiceByUserId(Guid id)
        {
            var allOrdersList = _genericRepoOrder.GetAll().Include(x => x.OrderDetails).ThenInclude(y => y.Product).ToList();
            var userOrdersList = allOrdersList.Where((i) => Guid.Parse(i.UserId) == id).ToList();

            List<UserOrdersRequestModel> invoiceList = new List<UserOrdersRequestModel>();

            foreach (var order in userOrdersList)
            {
                var productIds = order.OrderDetails.Select(od => od.ProductId).ToList();

                var productDetails = _genericRepoProduct.GetAll().Where(p => productIds.Contains(p.Id));

                var userOrderProductsList = order.OrderDetails.Select(od => new UserOrderProductsRequestModel
                {
                    Quantity = od.Quantity,
                    Price = productDetails.FirstOrDefault(p => p.Id == od.ProductId).Price,
                    ProductName = productDetails.FirstOrDefault(p => p.Id == od.ProductId)?.Name,

                }).ToList();

                decimal totalPrice = 0;

                foreach (var userOrderProduct in userOrderProductsList)
                {
                    decimal productPrice = userOrderProduct.Price;
                    int productQuantity = userOrderProduct.Quantity;
                    decimal productTotalPrice = productPrice * productQuantity;

                    totalPrice += productTotalPrice;
                }

                UserOrdersRequestModel userOrder = new UserOrdersRequestModel
                {
                    OrderId = order.Id,
                    UserOrderProductsRequestModels = userOrderProductsList,
                    TotalProducts = userOrderProductsList.Count(),
                    TotalPrice = totalPrice
                };

                invoiceList.Add(userOrder);
            }

            return invoiceList;
        }

        public async Task<List<GetAllOrders>> GetAllUsersOrder()
        {
            var allOrdersList = _genericRepoOrder.GetAll().Include(x => x.OrderDetails).ThenInclude(y => y.Product).ToList();

            List<GetAllOrders> getAllOrders = new List<GetAllOrders>();

            foreach (var order in allOrdersList)
            {
                var productIds = order.OrderDetails.Select(od => od.ProductId).ToList();

                var productDetails = _genericRepoProduct.GetAll()
                    .Where(p => productIds.Contains(p.Id));

                var userOrderProductsList = order.OrderDetails.Select(od => new UserOrderProductsRequestModel
                {
                    Quantity = od.Quantity,
                    Price = productDetails.FirstOrDefault(p => p.Id == od.ProductId).Price,
                    ProductName = productDetails.FirstOrDefault(p => p.Id == od.ProductId)?.Name,

                }).ToList();

                decimal totalPrice = 0;

                foreach (var userOrderProduct in userOrderProductsList)
                {
                    decimal productPrice = userOrderProduct.Price;
                    int productQuantity = userOrderProduct.Quantity;
                    decimal productTotalPrice = productPrice * productQuantity;

                    totalPrice += productTotalPrice;
                }

                GetAllOrders allOrders = new GetAllOrders
                {
                    OrderId = order.Id,
                    UserOrderProductsRequestModels = userOrderProductsList,
                    TotalProducts = userOrderProductsList.Count(),
                    TotalPrice = totalPrice,
                    UserId = Guid.Parse(order.UserId)
                };

                getAllOrders.Add(allOrders);
            }
            return getAllOrders;
        }

        public async Task<Product> EditQty(EditModel model)
        {
            var product = await _genericRepoProduct.GetByIdAsync(model.ProductId);
            if (product != null)
            {
                product.Quantity = model.Quantity;
                _genericRepoProduct.Save();
            }
            return product;
        }
    }
}
