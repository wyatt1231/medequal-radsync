namespace Api.Hooks
{
    public class UseEmail
    {
        //public static ResponseModel SendEmail(string display_name, string email, string body, string subject)
        //{
        //    try
        //    {
        //        var fromAddress = new MailAddress(DefaultConfig._providerEmailAddress, display_name);
        //        var toAddress = new MailAddress(email, subject);

        //        //string body = msg;
        //        var smtp = new SmtpClient
        //        {
        //            Host = "smtp.gmail.com",
        //            Port = 587,
        //            EnableSsl = true,
        //            DeliveryMethod = SmtpDeliveryMethod.Network,
        //            UseDefaultCredentials = false,
        //            Credentials = new NetworkCredential(fromAddress.Address, DefaultConfig._providerEmailPass),
        //        };




        //        using (var message = new MailMessage(fromAddress, toAddress)
        //        {
        //            Subject = subject,
        //            IsBodyHtml = true,
        //            Body = body,

        //        })


        //        {
        //            smtp.Send(message);
        //        }
        //        return new ResponseModel
        //        {
        //            success = true
        //        };
        //    }
        //    catch (Exception e)
        //    {
        //        return new ResponseModel
        //        {
        //            success = false,
        //            message = $"An error has occured while sending the verification link to the patient. {e.Message.ToString()}"
        //        };
        //    }
        //}

        //public static ResponseModel SendEmailAttachment(string display_name, string email, string msg, string subject, string fileName, Byte[] file_byte_arr)
        //{
        //    try
        //    {
        //        if (file_byte_arr == null)
        //        {
        //            return new ResponseModel
        //            {
        //                success = false,
        //                message = "The file is null"
        //            };
        //        }
        //        var fromAddress = new MailAddress(DefaultConfig._providerEmailAddress, display_name);
        //        var toAddress = new MailAddress(email, subject);

        //        string body = msg;
        //        var smtp = new SmtpClient
        //        {
        //            Host = "smtp.gmail.com",
        //            Port = 587,
        //            EnableSsl = true,
        //            DeliveryMethod = SmtpDeliveryMethod.Network,
        //            UseDefaultCredentials = false,
        //            Credentials = new NetworkCredential(fromAddress.Address, DefaultConfig._providerEmailPass)
        //        };

        //        using (var message = new MailMessage(fromAddress, toAddress)
        //        {
        //            Subject = display_name + ": " + subject,
        //            Body = body,
        //            IsBodyHtml = true
        //        }
        //        )
        //        {
        //            message.Attachments.Add(new Attachment(new MemoryStream(file_byte_arr), fileName + ".pdf"));

        //            smtp.Send(message);
        //        }
        //        return new ResponseModel
        //        {
        //            success = true
        //        };
        //    }
        //    catch (Exception e)
        //    {
        //        return new ResponseModel
        //        {
        //            success = false,
        //            message = $"An error has occured while sending the verification link to the patient. {e.Message}"
        //        };
        //    }
        //}

        //public ResponseModel SendEmailMultiAttachment(string email, string msg, string subject, List<FtpModel> files)
        //{
        //    try
        //    {
        //        if (files == null || files.Count <= 0)
        //        {
        //            return new ResponseModel
        //            {
        //                success = false,
        //                message = "The file is null"
        //            };
        //        }
        //        string establishment_name = def_val_repo.GetHospitalName().data.ToString();
        //        var fromAddress = new MailAddress(DefaultConfig._providerEmailAddress, establishment_name);
        //        var toAddress = new MailAddress(email, subject);

        //        string body = msg;
        //        var smtp = new SmtpClient
        //        {
        //            Host = "smtp.gmail.com",
        //            Port = 587,
        //            EnableSsl = true,
        //            DeliveryMethod = SmtpDeliveryMethod.Network,
        //            UseDefaultCredentials = false,
        //            Credentials = new NetworkCredential(fromAddress.Address, DefaultConfig._providerEmailPass)
        //        };

        //        using (var message = new MailMessage(fromAddress, toAddress)
        //        {
        //            Subject = establishment_name + " : " + subject,
        //            Body = body,
        //            IsBodyHtml = true
        //        }
        //        )
        //        {

        //            foreach (var file in files)
        //            {
        //                message.Attachments.Add(new Attachment(new MemoryStream(file.file_byte), file.file_name + ".pdf"));
        //            }

        //            smtp.Send(message);
        //        }
        //        return new ResponseModel
        //        {
        //            success = true
        //        };
        //    }
        //    catch (Exception e)
        //    {
        //        return new ResponseModel
        //        {
        //            success = false,
        //            message = $"An error has occured while sending the verification link to the patient. {e.Message}"
        //        };
        //    }
        //}

    }
}
