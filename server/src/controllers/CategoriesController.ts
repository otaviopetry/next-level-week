import {Request, Response} from 'express';
import knex from '../database/connection';

class CategoriesController {
    async index (req: Request, res: Response) {

        const categories = await knex('categories').select('*');

        const serializedItems = categories.map( category => {
            return {
                name: category.name,
                image_url: `http://localhost:3333/uploads/${category.icon}`
            }
        })
        
        return res.json(serializedItems);

    }
}

export default CategoriesController;