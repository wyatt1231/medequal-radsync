namespace radsync_server.Pdf
{
    public class MedPrescrip
    {
        //public static async Task<byte[]> GenerateSoaPdf(string brand_name, string brand_logo, string brand_address, string brand_phone, string brand_email,
        //    ConsultRequestEntity consult_request, string qr_code,
        //    List<ConsultMedEntity> presc_meds,
        //    string resident_esignature_img
        //    )
        //{
        //    string dir = Directory.GetCurrentDirectory();
        //    string css_instance = File.ReadAllText(dir + "\\Pdf\\pdf.css");

        //    string html_header = $@"<style>{css_instance}</style>
        //                                    <header>
        //                                          <div id='header-brand-info' >
        //                                              <div id='brand-main-info'>
        //                                                  <img src='data:image/png;base64,{brand_logo}'   id='blogo' />
        //                                                  <div id='brand-name'>
        //                                                     {brand_name}
        //                                                  </div>
        //                                              </div>
        //                                              <div id='brand-sub-info'>
        //                                                  <div id='sub-info-item' >
        //                                                      {brand_address}
        //                                                  </div>
        //                                                  <div id='sub-info-item'>
        //                                                       {brand_phone}
        //                                                  </div>
        //                                                  <div id='sub-info-item'>
        //                                                      {brand_email}
        //                                                  </div>
        //                                              </div>
        //                                          </div>
        //                                          <div id='document-title'>
        //                                             Medical Prescription
        //                                          </div>
        //                                     </header>
        //    ";


        //    string tbl_med_prescrip = "";

        //    foreach (var med in presc_meds)
        //    {
        //        tbl_med_prescrip += $@"<tr>
        //                                        <td>{med.med_desc}</td>
        //                                        <td>{med.dosage}</td>
        //                                        <td>{med.duration}</td>
        //                                  </tr>";
        //    }


        //    string html_body =
        //         $@"
        //                <html>
        //                    <head>
        //                        <style>
        //                            {css_instance}
        //                            body:before {{
        //                                background-image: url('data:image/png;base64,{brand_logo}') !important ;
        //                            }}
        //                        </style>
        //                    </head>
        //                    <body>
        //                        <section class='doc-main-dtls'>
        //                            <div class='doc-title'>Patient Details</div>
        //                            <div class='doc-content'>
        //                                <div class='doc-sum'>
        //                                    <div class='doc-sum-item'>
        //                                       <b>
        //                                            {consult_request.prefix} 
        //                                            {consult_request.first_name} 
        //                                            {consult_request.middle_name} 
        //                                            {consult_request.last_name} 
        //                                            {consult_request.suffix} / 
        //                                            {consult_request.gender.ToUpper()} / 
        //                                            {consult_request.birth_date:MMM, dd yyyy} ({consult_request.age})
        //                                        </b>
        //                                    </div>
        //                                    <div class='doc-sum-item'>
        //                                        <div class='info-group-column'>
        //                                            <div class='label'>Code: </div>
        //                                            <div class='value'>{consult_request.consult_req_pk}</div>
        //                                        </div>
        //                                    </div>
        //                                    <div class='doc-sum-item'>
        //                                        <div class='info-group-column'>
        //                                            <div class='label'>Contact: </div>
        //                                            <div class='value'>{consult_request.email} / {consult_request.mob_no}</div>
        //                                        </div>
        //                                    </div>
        //                                    <div class='doc-sum-item'>
        //                                        <div class='info-group-column'>
        //                                            <div class='label'>Address: </div>
        //                                            <div class='value'>
        //                                                 {consult_request.line1},
        //                                                 {consult_request.citymundesc},
        //                                                 {consult_request.provincedesc},
        //                                                 {consult_request.regiondesc} 
        //                                                 {consult_request.zip_code}
        //                                            </div>
        //                                        </div>
        //                                    </div>
        //                                    <div class='doc-sum-item'>
        //                                        <div class='info-group-column'>
        //                                            <div class='label'>Prescribed At:</div>
        //                                            <div class='value'> {DateTime.Now:MMM. dd, yyyy hh:mm tt}</div>
        //                                        </div>
        //                                    </div>
        //                                </div>
        //                                <div class='qr'><img class='qr-img' src='data:image/png;base64,{qr_code}' /></div>
        //                            </div>
        //                        </section>

        //                        <table class='tbl-data'>
        //                            <thead style='display: table-header-group;'>
        //                                <tr>
        //                                    <td>
        //                                        Medicine Name
        //                                    </td>
        //                                    <td>
        //                                        Dosage
        //                                    </td>
        //                                    <td>
        //                                        Duration
        //                                    </td>
        //                                </tr>
        //                            </thead>
        //                            <tbody>
        //                                {tbl_med_prescrip}
        //                                <tr style='border: none; box-shadow: none;'>
        //                                    <td colSpan='3' align='center'>
        //                                        <em>Nothing follows</em>
        //                                    </td>
        //                                </tr>
        //                            </tbody>
        //                        </table>

        //                        <div class='end-document-container'>
        //                           <div class='signature'>
        //                               <img src='{resident_esignature_img}' height='30'   /> 
        //                               <div class='name'>
        //                                   <div><b>{consult_request.assigned_resident_info?.res_name}</b></div>
        //                                   <div><small>Lic No. {consult_request.assigned_resident_info?.license_no}</small></div>
        //                               </div>             
        //                           </div>
        //                        </div>
        //                    </body>
        //                </html>
        //             ";


        //    string html_footer = "<div style='text-align: right; width: 100%;font-size: 5pt; margin-right: 10pt; '>This is an electronically signed document | Page: <span><span class='pageNumber'></span> of <span class='totalPages'></span></span> |  <span  style='margin-right: 1cm'>Issued At: " + DateTime.Now.ToString("MMM. dd, yyyy hh:mm tt") + "</span> </div>";



        //    await using var browser = await Puppeteer.LaunchAsync(
        //       new LaunchOptions { Headless = true, ExecutablePath = $"{dir}\\chrome\\chrome.exe" });
        //    await using var page = await browser.NewPageAsync();
        //    await page.SetContentAsync(html_body);
        //    await page.AddStyleTagAsync(new AddTagOptions { Path = $"{dir}\\Pdf\\pdf.css" });


        //    var pdf = await page.PdfDataAsync(new PdfOptions
        //    {
        //        Format = PaperFormat.A4,
        //        DisplayHeaderFooter = true,
        //        HeaderTemplate = html_header,
        //        FooterTemplate = html_footer,
        //        MarginOptions = new MarginOptions
        //        {
        //            Top = "200px",
        //            Bottom = "96px",
        //            Left = "144px",
        //            Right = "96px"
        //        },
        //    });

        //    await browser.CloseAsync();

        //    return pdf;
        //}

    }
}
