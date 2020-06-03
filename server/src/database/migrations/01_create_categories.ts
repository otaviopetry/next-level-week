import Knex from 'knex';

export async function up(knex: Knex) { //declaração de tipo (typescript)
    // CRIAR A TABELA

    return knex.schema.createTable('categories', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('icon').notNullable();
    })
}

export async function down(knex: Knex) {
    // VOLTAR ATRÁS

    return knex.schema.dropTable('categories');

}