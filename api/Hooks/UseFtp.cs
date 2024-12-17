using Api.Models;
using FluentFTP;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace Api.Hooks
{
    public class UseFtp
    {

        public static string GetFtpFile(string file_path, string ftp_url, string username, string password)
        {
            var files = new List<FtpModel>();


            FtpClient client = new FtpClient(ftp_url, username, password);

            client.SocketKeepAlive = true;
            client.ReadTimeout = 600000;
            client.ConnectTimeout = 600000;
            client.Connect();

            foreach (FtpListItem item in client.GetListing(file_path))
            {
                if (item.Type == FtpFileSystemObjectType.File)
                {
                    files.Add(new FtpModel
                    {
                        file_name = item.Name,
                        modified_time = client.GetModifiedTime(item.FullName),
                        file_path = "ftp://" + ftp_url + item.FullName,
                    });
                }
            }

            if (files.Count > 0)
            {
                return files[0].file_path;
            }
            return "";
        }


        public static byte[] DownloadFtp(string ftp_path, string username, string password)
        {

            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://" + ftp_path);
                request.KeepAlive = true;
                request.UsePassive = true;
                request.UseBinary = true;
                request.Method = WebRequestMethods.Ftp.DownloadFile;
                //request.Method = WebRequestMethods.Ftp.ListDirectory;
                //request.EnableSsl = true;
                request.Credentials = new NetworkCredential(username, password);
                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                Stream responseStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(responseStream);

                var byte_file = default(byte[]);
                using (var memstream = new MemoryStream())
                {
                    reader.BaseStream.CopyTo(memstream);
                    byte_file = memstream.ToArray();
                }
                reader.Close();
                response.Close();

                //var request = new WebClient();
                //request.Credentials = new NetworkCredential(username, password);
                //var byte_file = request.DownloadData("ftp://" + ftp_path);
                return byte_file;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);

                //return null;
            }
        }

        public static byte[] DownloadFtp(string file_path, string ftp_path, string username, string password)
        {
            try
            {
                var request = new WebClient();
                request.Credentials = new NetworkCredential(username, password);
                var byte_file = request.DownloadData(file_path + ftp_path);
                return byte_file;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string GetLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            throw new Exception("No network adapters with an IPv4 address in the system!");
        }

        //public static async Task<FileResponseModel> UploadToFtpAsync(IFormFile file, string ftp_base_url, string file_dest_path, string username, string password)
        //{
        //    try
        //    {

        //        if (file.Length > (5 * 1000000))
        //        {
        //            return new FileResponseModel
        //            {
        //                success = false,
        //                message = $"The file ({file.FileName}) could not be uploaded because it exceeds to the maximum file size of 5MB. "
        //            };
        //        }


        //        if (file != null)
        //        {
        //            string root_file_name = Path.GetFileName(file.FileName);
        //            string ext = Path.GetExtension(root_file_name);



        //            string unique_file_name = Path.GetFileNameWithoutExtension(root_file_name)
        //                      + "_"
        //                      + Guid.NewGuid().ToString();


        //            string root_dir = "ftp://" + ftp_base_url + file_dest_path;

        //            bool root_dir_exists = await CreateFTPDirectoryAsync(root_dir, username, password);

        //            if (root_dir_exists)
        //            {
        //                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(new Uri(root_dir + "/" + unique_file_name + ext));
        //                request.Method = WebRequestMethods.Ftp.UploadFile;
        //                request.UsePassive = false;
        //                request.Credentials = new NetworkCredential(username, password);


        //                using (Stream ftpStream = await request.GetRequestStreamAsync())
        //                {
        //                    await file.CopyToAsync(ftpStream);
        //                }

        //                return new FileResponseModel
        //                {
        //                    success = true,
        //                    data = new FileModel
        //                    {
        //                        name = unique_file_name,
        //                        path = file_dest_path + unique_file_name + ext,
        //                        ext = ext
        //                    }
        //                };
        //            }
        //            else
        //            {
        //                return new FileResponseModel
        //                {
        //                    success = false,
        //                    message = "Unable to create the specified directory. Please make sure that the file URI is correct!"
        //                };
        //            }


        //        }


        //        return new FileResponseModel
        //        {
        //            success = false,
        //            message = "The file cannot be null"
        //        };
        //    }
        //    catch (Exception e)
        //    {
        //        return new FileResponseModel
        //        {
        //            success = false,
        //            message = e.Message
        //        };
        //    }
        //}


        private static async Task<bool> CreateFTPDirectoryAsync(string directory, string username, string password)
        {

            try
            {
                //create the directory
                FtpWebRequest requestDir = (FtpWebRequest)FtpWebRequest.Create(new Uri(directory));
                requestDir.Method = WebRequestMethods.Ftp.MakeDirectory;
                requestDir.Credentials = new NetworkCredential(username, password);
                requestDir.UsePassive = true;
                requestDir.UseBinary = true;
                requestDir.KeepAlive = false;
                FtpWebResponse response = (FtpWebResponse)await requestDir.GetResponseAsync();
                Stream ftpStream = response.GetResponseStream();

                ftpStream.Close();
                response.Close();

                return true;
            }
            catch (WebException ex)
            {
                FtpWebResponse response = (FtpWebResponse)ex.Response;
                if (response.StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                {
                    response.Close();
                    return true;
                }
                else
                {
                    response.Close();
                    return false;
                }
            }
        }

    }
}
