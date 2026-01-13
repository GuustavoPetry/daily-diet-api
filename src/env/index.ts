import { config } from "dotenv";
import { z } from "zod";

// Condicional para apontar path-env com base em na variável NODE_ENV
switch (process.env.NODE_ENV) {
    case "test":
        config({ path: ".env.test" });
        break;
    default:
        config();
}

// Criar schema para validar as variáveis de ambiente
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string()
});

// Validar o schema criado
const _env = envSchema.safeParse(process.env);

// Se o schema não aprovar, throw error
if (_env.success === false) {
    console.log("Invalid Environment Variables", z.treeifyError(_env.error).properties);
    throw new Error("Invalid Environment Variables");
}

// exportar variável com as variáveis de ambiente
export const env = _env.data;