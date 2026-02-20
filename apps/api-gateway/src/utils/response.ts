// Definisi tipe data agar TypeScript bisa membantu kita (Type-Safe)
interface ApiResponse {
  status: "success" | "error";
  message: string;
  data?: any;
  meta?: {
    total_data: number | null;
    current_page: number;
    total_page: number;
    row_per_page: number;
  };
}

// Fungsi utama untuk membungkus respons
export const sendResponse = (
  status: "success" | "error",
  message: string,
  data: any = null,
  meta: any = null,
): ApiResponse => {
  return {
    status,
    message,
    data,
    ...(meta && { meta }),
  };
};
