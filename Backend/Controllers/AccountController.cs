using Common.DTO;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = configuration;
            _roleManager = roleManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLogin model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            
            if(user == null)
            {
                return Unauthorized("Invalid Email and Password");
            }

            var result = await _userManager.CheckPasswordAsync(user, model.Password);
            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>()
            {
                 new Claim(ClaimTypes.Name, user.Id),
                 new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }
            if (result)
            {
                var token = GenerateJwtToken(authClaims);
                return Ok(new { Token = token });
            }
          
            return BadRequest();
        }

       
        [HttpPost("signup")]
        public async Task<IActionResult> Register(SignupModel model)
        {
            var isExists = await _userManager.FindByEmailAsync(model.Email);
            if(isExists!=null)
            {
                return Unauthorized("Already exists");
            }
            var user = new User()
            {
                UserName= model.Email,
                Email = model.Email,
                NormalizedEmail = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            var AllRolefind = _roleManager.Roles.Select(x => x.Name).ToList();
           

            if (result.Succeeded)
            {
                 await _userManager.AddToRoleAsync(user, AllRolefind[0]);
                 return Ok();
            }
           
            return BadRequest(result.Errors);
        }


        //[HttpGet]
        //[AllowAnonymous]
        //[Route("ConfirmEmail")]
        //public async Task<IActionResult> ConfirmEmail(string token, string email)
        //{
        //    var user = await _userManager.FindByEmailAsync(email);
        //    if (user == null)
        //    {
        //        // Handle user not found error
        //        return BadRequest("User not found.");
        //    }

        //    var result = await _userManager.ConfirmEmailAsync(user, token);
        //    if (result.Succeeded)
        //    {
        //        // Email confirmed successfully
        //        // You can redirect to a success page or perform any necessary actions
        //        return Ok("Email confirmed successfully.");
        //    }
        //    else
        //    {
        //        // Handle email confirmation failure
        //        return BadRequest("Email confirmation failed.");
        //    }
        //}

        //Generate jwt token
        private async Task<string> GenerateJwtToken(IEnumerable<Claim> claims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            var token = new JwtSecurityToken(
                expires: DateTime.Now.AddMinutes(10),
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256Signature)
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            string tokenString = tokenHandler.WriteToken(token);
            return tokenString;
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }
    }
}

