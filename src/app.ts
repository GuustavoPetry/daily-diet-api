import fastify from "fastify";
import { userRoutes } from "./routes/user-routes";

export const app = fastify();

app.register(userRoutes, {
    prefix: "user"
});