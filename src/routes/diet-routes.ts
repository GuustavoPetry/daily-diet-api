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
            .select()
            .where({
                user_id
            });

        return reply.status(200).send({ result });
    });

    app.post<{
        Body: {
            id: string
        }
    }>(
        "/diet.get",
        {
            preHandler: [app.authenticate],
            schema: {
                body: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "string" }
                    }
                }
            }
        },
        async (request, reply) => {
            const { id } = request.body;

            const user_id = request.user.sub;

            const result = await knex("diet")
                .select()
                .where({
                    id,
                    user_id
                })
                .first();

            return reply.status(200).send({ result });
        });

    app.post<{
        Body: {
            id: string,
            fields: {
                name?: string,
                description?: string,
                isDiet?: boolean,
            }

        }
    }>(
        "/diet.update",
        {
            preHandler: [app.authenticate],
            schema: {
                body: {
                    type: "object",
                    required: ["id", "fields"],
                    properties: {
                        id: { type: "string" },
                        fields: {
                            type: "object",
                            minProperties: 1,
                            properties: {
                                name: { type: "string" },
                                description: { type: "string" },
                                isDiet: { type: "boolean" },
                                updated_at: {
                                    type: "string",
                                    format: "date-time"
                                },
                            },
                        }
                    },
                }
            }
        },
        async (request, reply) => {
            const { name, description, isDiet } = request.body.fields;

            const { id } = request.body;

            const date = new Date();

            const updated_at = new Intl.DateTimeFormat("sv-SE", {
                timeZone: "America/Sao_Paulo",
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }).format(date);

            const user_id = request.user.sub;

            const result = await knex("diet")
                .update({
                    name,
                    description,
                    isDiet,
                    updated_at
                })
                .where({
                    id,
                    user_id
                });

            return reply.status(201).send({ result });
        }
    );
}