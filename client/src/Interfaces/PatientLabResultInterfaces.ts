export interface LabResultDto {
  accessionno?: string;
  doc_desc?: string;
  doc_filename?: string;
  doc_remarks?: string;

  localftp_file_path?: string;
  dynamic_ftp_file_path?: string;
  dateuploaded?: Date;
  ftpuploadkey?: number;
  //
  blob_file?: string;
}
