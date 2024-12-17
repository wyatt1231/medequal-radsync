export interface IActionCallback {
  loading_callback?: (is_loading: boolean) => void;
  err_callback?: (err_msg?: string) => void;
}
