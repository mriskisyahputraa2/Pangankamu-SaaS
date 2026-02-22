const requiredEnv = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];

export const validateEnv = () => {
  requiredEnv.forEach((envName) => {
    if (!process.env[envName]) {
      console.log(`Error: Variabel ${envName} belum diatur di file .env`);
      process.exit(1);
    }
  });
};
