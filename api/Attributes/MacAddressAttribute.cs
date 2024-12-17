using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace radsync_server.Attributes
{

    [AttributeUsage(AttributeTargets.All, AllowMultiple = false)]

    public class MacAddressAttribute : ValidationAttribute
    {
        public string fieldName { get; set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            Regex macAddress = new Regex(@"^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$");

            if (macAddress.IsMatch(value.ToString()))
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult($"{fieldName} has invalid mac address format.");
            }
        }
    }
}
