const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {

    async index(req, res){
        const {user} = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user} }, //não retornar o user logado
                {_id: { $nin: loggedDev.likes } }, //não restornar devs que estão na lista de likes do user logado
                {_id: { $nin: loggedDev.dislikes } }, //não restornar devs que estão na lista de dislikes do user logado
            ],
        })

        return res.json(users);
    },

    async store(req, res){
        const { username } = req.body;
    
        const userExists = await Dev.findOne({user: username})

        if (userExists) {
            return res.json(userExists);
        }
        const response = await axios.get(`https://api.github.com/users/${username}`);
        
        const { name, bio, avatar_url: avatar} = response.data;


        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        })
        return res.json( dev);
    }
}