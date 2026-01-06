import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export async function userRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.email(),
            password: z.string()
        });

        const { name, email, password } = createUserBodySchema.parse(request.body);

        const id = randomUUID();

        await knex("users").insert({
            id,
            name,
            email,
            password
        });

        return reply.status(201).send(String(id));
    });

    app.get("/", async () => {
        const user = await knex("users").select();

        return { user };
    });
}