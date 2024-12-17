using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace radsync_server.Attributes
{
    [AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
    public class MobileNumberAttribute : ValidationAttribute
    {
        public string label { get; set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            Regex phoneRegex = new Regex(@"^(\+639)\d{9}$");

            if (phoneRegex.IsMatch(value.ToString()))
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult($"{label} is not a correct mobile number. Ex: +639195946309");
            }
        }
    }
}
