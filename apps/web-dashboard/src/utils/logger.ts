/**
 * Logger utility untuk development dan production
 * Bisa di-disable di production untuk performa yang lebih baik
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  info: (message: string, data?: any) => {
    if (isDev) {
      console.info(`ℹ️ ${message}`, data || "");
    }
  },

  warn: (message: string, data?: any) => {
    if (isDev) {
      console.warn(`⚠️ ${message}`, data || "");
    }
  },

  error: (message: string, error?: any) => {
    if (isDev) {
      console.error(`❌ ${message}`, error || "");
    }
  },

  debug: (message: string, data?: any) => {
    if (isDev) {
      console.debug(`🐛 ${message}`, data || "");
    }
  },
};

/**
 * Error handler utility untuk catch blocks
 */
export const handleError = (
  error: any,
  context: string,
  fallbackAction?: () => void,
) => {
  logger.error(`Error in ${context}`, error);

  // Jalankan fallback action jika ada
  if (fallbackAction) {
    fallbackAction();
  }
};
