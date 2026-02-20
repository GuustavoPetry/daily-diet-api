import "@fastify/jwt";

declare module "@fastify/jwt"{
    interface FastifyJWT {
        payload: unknown;
        user: {
            sub: string
            email: string
        }
    }
}