using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class EmailHelper
    {
        //send the email using SMTP
        public bool SendEmail(string userEmail, string confirmationLink)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("aastha252001@gmail.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Confirm your Email";
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = confirmationLink;

            SmtpClient client = new SmtpClient();
            client.Credentials = new System.Net.NetworkCredential("aastha252001@gmail.com", "aasstthhaa");
            client.Host = "smtpout.secureserver.net";
            client.Port = 80;
            try
            {
                client.Send(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                //
            }
            return false;
        }
    }
}
