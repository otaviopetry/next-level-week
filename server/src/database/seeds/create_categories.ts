import Knex from 'knex';

export async function seed(knex: Knex) {
    
    await knex('categories').insert([
        { name: 'Alimentação', icon: 'alimentacao.svg' },
        { name: 'Diversos', icon: 'diversos.svg' },
        { name: 'Serviços', icon: 'servicos.svg' }
    ])
}