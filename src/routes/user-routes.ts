import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database.js";
import { randomUUID } from "node:crypto";
import { genSalt, hash } from "bcrypt-ts";

export async function userRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.email(),
            password: z.string()
        });

        const { name, email, password } = createUserBodySchema.parse(request.body);

        const bcryptSaltPassword = await genSalt(10);
        const bcryptResultPassword = await hash(password, bcryptSaltPassword);

        const id = randomUUID();

        await knex("users").insert({
            id,
            name,
            email,
            password: bcryptResultPassword
        });

        return reply.status(201).send({result: true});
    });

    app.get("/", { preHandler: [app.authenticate] }, async () => {
        const users = await knex("users").select();

        return { users };
    });
}