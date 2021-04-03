/* 
    Ruta : /api/todo:busqueda
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getTermino, getDocumentosColeccion } = require('../controllers/busqueda');

const router = Router();

router.get('/:busqueda', validarJWT, getTermino);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);


module.exports = router;