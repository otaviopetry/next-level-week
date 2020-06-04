import Knex from 'knex';

export async function up(knex: Knex) { //declaração de tipo (typescript)
    // CRIAR A TABELA

    return knex.schema.createTable('points', table => {

        // DADOS
        table.increments('id').primary();
        table.string('biz_name').notNullable();
        table.string('email');
        table.string('whatsapp').notNullable();
        table.string('working_hours');
        table.string('instagram');
        table.string('facebook');
        table.string('image');

        // ENDEREÇO
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('state', 2).notNullable();
        table.string('neighborhood').notNullable();
        table.string('full_address');

        //REVIEWS
        table.string('curator_review').notNullable();
        table.string('user_reviews');
        
    })
}

export async function down(knex: Knex) {
    // VOLTAR ATRÁS

    return knex.schema.dropTable('points');

}