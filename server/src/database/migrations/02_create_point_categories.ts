import Knex from 'knex';

export async function up(knex: Knex) { //declaração de tipo (typescript)
    // CRIAR A TABELA

    return knex.schema.createTable('point_categories', table => {
        table.increments('id').primary();
        table.integer('point_id').notNullable().references('id').inTable('points');
        table.integer('category_id').notNullable().references('id').inTable('categories');
    })
}

export async function down(knex: Knex) {
    // VOLTAR ATRÁS

    return knex.schema.dropTable('point_categories');

}