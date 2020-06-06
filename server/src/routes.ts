import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import CategoriesController from './controllers/CategoriesController';

const routes = express.Router(); // método para desacoplar as rotas do arquivo principal do servidor
const upload = multer(multerConfig);

const pointsController = new PointsController();
const categoriesController = new CategoriesController();

routes.get('/categorias', categoriesController.index);

routes.get('/negocios-locais', pointsController.index);

routes.get('/negocios-locais/:id', pointsController.show);

routes.post(
    '/negocios-locais',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            biz_name: Joi.string().required().max(100),
            email: Joi.string().email().allow('').optional().default(null  ),
            whatsapp: Joi.string().max(11).allow('').optional().default(null  ),
            working_hours: Joi.string().allow('').optional().default(null  ).max(300),
            instagram: Joi.string().allow('').optional().default(null  ).max(60),
            facebook: Joi.string().max(80).allow('').optional().default(null  ),
            site: Joi.string().max(80).allow('').optional().default(null  ),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required().max(100),
            state: Joi.string().required().max(2),
            neighborhood: Joi.string().required().max(50),
            full_address: Joi.string().max(140).allow('').optional().default(null  ),
            curator_review: Joi.string().required().max(280),
            category: Joi.number().required()
        })
    }, {
        abortEarly: false
    }), 
    pointsController.create
);

export default routes;