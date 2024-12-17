import { GetLibraryDto } from "../../Interfaces/LibraryInterfaces";

export type LibraryReducerTypes =
  | {
      type: "set_med_lib";
      med_lib: Array<GetLibraryDto>;
    }
  | {
      type: "set_freq_lib";
      freq_lib: Array<GetLibraryDto>;
    };

export interface LibraryReducerModel {
  med_lib?: Array<GetLibraryDto>;
  freq_lib?: Array<GetLibraryDto>;
}
