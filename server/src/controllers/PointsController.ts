import {Request, Response, request} from 'express';
import knex from '../database/connection';

class PointsController {

    async index (req: Request, res: Response) {
        // filtros: cidade, estado, categorias

        const { city, state, categories } = req.query;

        console.log( city, state, categories );

        const parsedCategories = String(categories)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_categories', 'points.id', '=', 'point_categories.point_id')
            .whereIn('point_categories.category_id', parsedCategories)
            .where('city', String(city))
            .where('state', String(state))
            .select('points.*');

        const serializedPoints = points.map( point => {
            return {
                ...point,
                image_url: `${point.image}`
            }
        })

        return res.json(serializedPoints);
        
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
            .select( '*' );

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
            site,
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


        const trx = await knex.transaction(); //só insere na database se as duas querys tiverem sucesso

        const point = {
            image: `http://192.168.0.102:3333/uploads/${req.file.filename}`,
            biz_name,
            email,
            whatsapp,
            working_hours,
            instagram,
            facebook,
            site,
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



              
    }
}

export default PointsController;