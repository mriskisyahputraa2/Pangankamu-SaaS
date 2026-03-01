// web-dashboard/src/utils/error-handler.ts
import axios from "axios";

/**
 * Fungsi untuk mengekstrak pesan error secara type-safe
 * Menghindari penggunaan 'any' dan memastikan pesan yang muncul ke user selalu valid
 */
export const getErrorMessage = (
  error: unknown,
  defaultMsg: string = "Terjadi kesalahan sistem",
): string => {
  // 1. Cek jika error berasal dari Axios (Backend Hono)
  if (axios.isAxiosError(error)) {
    // Mengambil pesan dari format sendResponse backend kita
    return error.response?.data?.message || defaultMsg;
  }

  // 2. Cek jika error adalah objek Error standar JavaScript
  if (error instanceof Error) {
    return error.message;
  }

  // 3. Jika tipenya tidak dikenal, kembalikan pesan default
  return defaultMsg;
};
