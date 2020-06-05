import express from 'express';
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

routes.post('/negocios-locais', upload.single('image'), pointsController.create);

export default routes;