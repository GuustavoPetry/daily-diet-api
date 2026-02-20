import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("diet", (table) => {
        table.uuid("id").primary();
        table.text("name").notNullable();
        table.text("description").notNullable();
        table.datetime("created_at").notNullable();
        table.boolean("isDiet").notNullable();
        
        /*========================
            FOREIGN KEY (users)
        ======================= */
        table
            .uuid("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("NO ACTION");

    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("diet");
}

