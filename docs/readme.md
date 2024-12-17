    public ResponseModel getRadStudyReportImpression(string radResultNo)
        {

            using (MySqlConnection con = new MySqlConnection(DatabaseConfig.ConnectionString()))
            {
                con.Open();
                using (var tran = con.BeginTransaction())
                {
                    try
                    {
                        string query = $@"select radresultno,resultdesc,resulttag from `radresult` where radresultno =@radResultNo limit 1";
                        RadStudyReportImpressionModel impression = con.QuerySingle<RadStudyReportImpressionModel>(query, new { radResultNo = radResultNo }, transaction: tran);
                        impression.resultdesc = RtfPipe.Rtf.ToHtml(impression.resultdesc);

                        tran.Commit();
                        con.Close();

                        return new ResponseModel
                        {
                            success = true,
                            data = impression
                        };

                    }

                    catch (Exception e)
                    {

                        return new ResponseModel
                        {
                            success = false,
                            message = $"Internal server error has occured. {e.Message.ToString()}"
                        };
                    }
                }
            }
        }




      public ResponseModel updateRadStudyImpression(IRadStudyUpdateImpression impressionParams)
        {
            using (MySqlConnection con = new MySqlConnection(DatabaseConfig.ConnectionString()))
            {
                con.Open();
                using (var tran = con.BeginTransaction())
                {
                    try
                    {

                        int isSavable = con.QuerySingle<int>(
                               $@"SELECT  IF(`resulttag` IN ('D', 'C'), 1, 0)   FROM `radresult` WHERE radresultno = @radresultno",
                               impressionParams, transaction: tran);

                        if (isSavable == 1)
                        {
                            impressionParams.user = ((ClaimsIdentity)HttpContext.Current.User.Identity).Name;

                            if (impressionParams.resulttag.ToUpper().Equals("D"))
                            {

                                int isSaveDraft = con.Execute(
                                   $@"update `radresult` set resulttag=@resulttag, resultdesc = @resultdesc,draftuser=@user, resultdate=now() where radresultno = @radresultno",
                                   impressionParams, transaction: tran);

                                if (isSaveDraft == 1)
                                {
                                    tran.Commit();
                                    con.Close();
                                    return new ResponseModel
                                    {
                                        success = true,
                                        message = "The radiology study report has been successfully saved to draft"
                                    };
                                }
                                else
                                {
                                    return new ResponseModel
                                    {
                                        success = false,
                                        message = "Database error. There were no rows affected while saving the report to drafts."
                                    };
                                }
                            }
                            else if (impressionParams.resulttag.ToUpper().Equals("F"))
                            {

                                int isSaveDraft = con.Execute(
                                   $@"update `radresult` set resulttag=@resulttag, resultdesc = @resultdesc,finaluser=@user, resultdate=now() where radresultno = @radresultno",
                                   impressionParams, transaction: tran);

                                if (isSaveDraft == 1)
                                {
                                    tran.Commit();
                                    con.Close();
                                    return new ResponseModel
                                    {
                                        success = true,
                                        message = "The radiology study report has been successfully saved as final."
                                    };
                                }
                                else
                                {
                                    return new ResponseModel
                                    {
                                        success = false,
                                        message = "Database error. There were no rows affected while saving the report as final."
                                    };
                                }
                            }
                            else
                            {
                                return new ResponseModel
                                {
                                    success = false,
                                    message = "Request error. Only study tags 'Draft' or 'Final' are accepted to be altered."
                                };
                            }
                        }
                        else
                        {
                            return new ResponseModel
                            {
                                success = false,
                                message = "The study you have selected is no longer editable."
                            };
                        }




                    }

                    catch (Exception e)
                    {
                        return new ResponseModel
                        {
                            success = false,
                            message = $"Internal server error has occured. {e.Message.ToString()}"
                        };
                    }
                }
            }
        }


    "react-rte": "git+https://github.com/sstur/react-rte.git#8c81622706a5f8856d39497bf33f92a97e9664fc",
    "@types/react-rte": "^0.16.1",

RtfPipe
