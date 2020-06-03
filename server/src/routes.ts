import express from 'express';

import PointsController from './controllers/PointsController';
import CategoriesController from './controllers/CategoriesController';

const routes = express.Router(); // método para desacoplar as rotas do arquivo principal do servidor

const pointsController = new PointsController();
const categoriesController = new CategoriesController();

routes.get('/categorias', categoriesController.index);

routes.post('/negocios-locais', pointsController.create);

routes.get('/negocios-locais', pointsController.index);

routes.get('/negocios-locais/:id', pointsController.show);

export default routes;