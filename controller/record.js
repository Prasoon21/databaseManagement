const path = require("path");

const rootDir = require("../util/path");

const User = require("../model/field");

exports.getUser = async (req, res, next) => {
    try{
        const users = await User.findAll();
        res.json(users);
    } catch(error) {
        console.log(JSON.stringify(error));
        res.status(600).json(error);
    }
}

exports.postUser = async (req, res, next) => {
    console.log("Received POST request for adding user:", req.body);

    if(!req.body.name || !req.body.email || !req.body.phone) {
        console.log("Missing req fields");
        return res.status(400).json({ error: "Name, email, and phone are required fields" });
    }
    try{
        const { name, email, phone } = req.body;

        
        console.log(name, email, phone);

        const data = await User.create({
            name: name,
            email: email,
            phone: phone
        });

        res.status(201).json(data);
    } catch(error){
        console.error(error);
        res.status(500).json({ error: "Error creating user" });

    }
};

exports.deleteUser = async (req, res, next) => {
    try{
        if(req.params.id == undefined) {
            console.log("ID is missing");
            return res.status(400).json({ err: "ID is missing" });
        }
        const userId = req.params.id;
        await User.destroy({ where: { id:userId} });
        res.status(200).json({ message: "User deleted successfully"});

    } catch(err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Error deleting user" });
    }
};