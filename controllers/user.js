const { response } = require('express');

const userGet = (req, res = response) => {

    const params = req.query;

    res.json({
        msg: 'Get Api - Controlador ',
        params
    });
}

const userPost = (req, res = response) => {

    const body = req.body;

    res.json({
        msg: 'Post Api - Controlador ',
        body
    });
}

const userPut = (req, res = response) => {

    const id = req.params.idUser;


    res.json({
        msg: 'Put Api - Controlador ',
        id
    });
}

const userDelete = (req, res = response) => {
    res.json({
        msg: 'Delete Api - Controlador '
    });
}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'Patch Api - Controlador '
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete,
    userPatch
}


