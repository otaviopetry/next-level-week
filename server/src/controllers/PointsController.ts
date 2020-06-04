import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {

    async index (req: Request, res: Response) {
        // filtros: cidade, estado, categorias

        const { city, state, category } = req.query;

        console.log( city, state, category );

        const points = await knex('points')
            .join('point_categories', 'points.id', '=', 'point_categories.point_id')
            .where('point_categories.category_id', Number(category))
            .where('city', String(city))
            .where('state', String(state))
            .select('points.*');

        return res.json(points);
        
    }
    
    async show (req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return res.status(400).json({ message: 'Negócio não encontrado'});
        }

        const categories = await knex('categories')
            .join('point_categories', 'categories.id', '=', 'point_categories.category_id')
            .where('point_categories.point_id', id)
            .select( 'categories.name' );

        return res.json( { point, categories } );
    }

    async create (req: Request, res: Response) {

        const {
            biz_name,
            email,
            whatsapp,
            working_hours,
            instagram,
            facebook,
            image,
            latitude,
            longitude,
            city,
            state,
            neighborhood,
            full_address,
            category,
            curator_review            
        } = req.body;

        if ( typeof(category) === 'number' ) {

            const trx = await knex.transaction(); //só insere na database se as duas querys tiverem sucesso

            const point = {
                image: 'https://images.unsplash.com/photo-1582198810343-5b5b2ff7f3c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
                biz_name,
                email,
                whatsapp,
                working_hours,
                instagram,
                facebook,
                latitude,
                longitude,
                city,
                state,
                neighborhood,
                full_address,
                curator_review
            };

            const insertedIds = await trx('points').insert(point);

            const point_id = insertedIds[0];

            const pointCategories = {
                    category_id: category,
                    point_id
                }

            await trx('point_categories').insert(pointCategories);

            trx.commit();

            return res.json({ 
                id: point_id,
                ...point
            })


        } else {

            return res.json({ message: "Category wasn't a number"});
        }        
    }
}

export default PointsController;