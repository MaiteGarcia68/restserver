const { Router } = require('express');

const { userGet,
        userPost,
        userPut,
        userDelete,
        userPatch
     } = require('../controllers/user');

const router = Router();


router.get('/',userGet);
router.post('/',userPost);
router.put('/:idUser',userPut);
router.delete('/',userDelete);
router.patch('/',userPatch);


module.exports = router;
