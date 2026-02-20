import { FastifyInstance } from "fastify";
import { knex } from "../database.js";
import { User } from "../interfaces/User.js";
import { compare } from "bcrypt-ts";

export async function authRoutes(app: FastifyInstance) {
    // Rota de autenticação -> retorna jwtToken
    app.post("/signup", async (request, reply) => {
        const { email, password } = request.body as {
            email: string,
            password: string
        };

        // Fazer verificação se o usuário e senha estão corretos com bcrypt decode...
        const user = await knex<User>("users")
            .select()
            .where({
                email,
            })
            .first();

        const loginError = `Credenciais Inválidas`;

        if (!user) {
            return reply.send({ loginError });
        };

        const isValid = await compare(password, user.password);

        if (!isValid) {
            return reply.send({ loginError });
        }

        const token = app.jwt.sign(
            {
                email: user.email,
            },
            {
                sub: user.id,
                expiresIn: 3600
            });

        return reply.send({ token });
    });
}