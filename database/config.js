const mongoose = require('mongoose');

mongoose.set('strictQuery', true);


const dbConnection = async() => {
    try {
        
        await mongoose.connect(process.env.MONGODB_CNN)
        console.log('Base de datos conectada exitosamente');


    } catch (error) {
        console.log(error);
        throw new error ('Error al conectar a la Base de Datos');
        
    }

}

module.exports = {
    dbConnection

}