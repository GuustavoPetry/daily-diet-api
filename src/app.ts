import fastify, { FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { userRoutes } from "./routes/user-routes.js";
import { authRoutes } from "./routes/auth-routes.js";
import { env } from "./env/index.js";
import { dietRoutes } from "./routes/diet-routes.js";

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
});

app.decorate("authenticate", async (request: FastifyRequest) => {
    await request.jwtVerify();
});

app.register(authRoutes, {
    prefix: "auth"
});

app.register(userRoutes);

app.register(dietRoutes);