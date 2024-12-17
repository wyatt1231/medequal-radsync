using System.Collections.Generic;

namespace radsync_server.Models
{
    public class PaymongoModel
    {
        public class PaymongoBillingModel
        {
            public string name { get; set; }
            public string phone { get; set; }
            public string email { get; set; }
            public PaymongoBillingAddressModel address { get; set; }
        }

        public class PaymongoBillingAddressModel
        {
            public string line1 { get; set; }
            public string line2 { get; set; }
            public string state { get; set; }
            public string postal_code { get; set; }
            public string country { get; set; }
            public string city { get; set; }
        }

        public class PaymongoRedirectModel
        {
            public string success { get; set; }
            public string failed { get; set; }
            public string checkout_url { get; set; }
        }


        public class PaymongoResouceError
        {
            public string code { get; set; }
            public string detail { get; set; }
        }


        public class PaymongoSourceResourceResponse
        {
            public PaymongoSourceResourceData data { get; set; }

            public List<PaymongoResouceError> errors { get; set; }
        }

        public class PaymongoSourceResourceData
        {
            public string id { get; set; }
            public string type { get; set; }
            public string pending_webhooks { get; set; }
            public string public_key { get; set; }
            public int created_at { get; set; }
            public int updated_at { get; set; }
            public PaymongoSourceResourceAttributes attributes { get; set; }
        }

        public class PaymongoSourceResourceAttributes
        {
            public int amount { get; set; }
            public string type { get; set; }
            public PaymongoBillingModel billing { get; set; }
            public string currency { get; set; }
            public string description { get; set; }
            public int fee { get; set; }
            public bool livemode { get; set; }
            public int net_amount { get; set; }
            public string payout { get; set; }
            public PaymongoAttributeSource source { get; set; } //
            public string statement_descriptor { get; set; }
            public int paid_at { get; set; }
            public PaymongoRedirectModel redirect { get; set; }
            public string status { get; set; }
            public int created_at { get; set; }
            public int updated_at { get; set; }
            public int available_at { get; set; }
            public PaymongoSourceResourceData data { get; set; }

            //card payment
            public string payment_intent_id { get; set; }
            public string origin { get; set; }
            public string tax_amount { get; set; }
            public List<dynamic> refunds { get; set; }
            public List<dynamic> taxes { get; set; }
            public string access_url { get; set; }
            public string client_key { get; set; }



        }

        public class PaymongoCardSource
        {
            public string id { get; set; }
            public string type { get; set; }
            public string country { get; set; }
            public string last4 { get; set; }
        }

        public class PaymongoAttributeSource
        {
            public string id { get; set; }
            public string type { get; set; }
            public string brand { get; set; }
            public string country { get; set; }
            public string last4 { get; set; }

        }


        public class PaymongoDataAttribute
        {
            public string id { get; set; }
            public string type { get; set; }
            public PaymongoSourceResourceAttributes attributes { get; set; }
        }



    }
}
