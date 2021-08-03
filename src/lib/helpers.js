const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (contrasenia) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasenia, salt);
    return hash;
};

helpers.matchPassword = async (contrasenia, savedPassword) => {
    try{
        return await bcrypt.compare(contrasenia, savedPassword);
    } catch(e){
        console.log(e);
    }
};

helpers.matchUser = async (user, userSaved) =>{
    try{
        return await bcrypt.compare(user,userSaved);
    }catch(e){
        console.log(e)
    }
};
module.exports = helpers;
