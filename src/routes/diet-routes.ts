import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { knex } from "../database.js";
import z from "zod";

export async function dietRoutes(app: FastifyInstance) {
    app.post("/diet.add", { preHandler: [app.authenticate] }, async (request, reply) => {
        const createDietBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            isDiet: z.boolean()
        });

        const { name, description, isDiet } = createDietBodySchema.parse(request.body);

        const id = randomUUID();

        const fk_UserId = request.user.sub;

        const date = new Date();

        const created_at = new Intl.DateTimeFormat("sv-SE", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }).format(date);

        await knex("diet").insert({
            id,
            name,
            description,
            created_at,
            isDiet,
            user_id: fk_UserId
        });

        return reply.status(201).send({
            result: {
                id,
                name,
                description,
                created_at,
                isDiet,
                fk_UserId
            }
        });
    });

    app.get("/diet.list", { preHandler: [app.authenticate] }, async (request, reply) => {
        const user_id = request.user.sub;

        console.log(request.user);

        const result = await knex("diet")
            .select(
                "name",
                "description",
                "created_at",
                "user_id"
            )
            .where({
                user_id
            });

        return reply.status(200).send({ result });
    });
}