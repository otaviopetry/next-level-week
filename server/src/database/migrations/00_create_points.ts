import Knex from 'knex';

export async function up(knex: Knex) { //declaração de tipo (typescript)
    // CRIAR A TABELA

    return knex.schema.createTable('points', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('image');
        table.string('neighborhood').notNullable();
        table.string('street').notNullable();
        table.integer('number');
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();        
        table.string('city').notNullable();
        table.string('state', 2).notNullable();
        table.string('working_hours');
        table.string('email');
        table.string('whatsapp').notNullable();
        table.string('curator_review').notNullable();
        table.string('user_reviews');
    })
}

export async function down(knex: Knex) {
    // VOLTAR ATRÁS

    return knex.schema.dropTable('points');

}