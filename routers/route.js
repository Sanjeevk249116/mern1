const express = require("express");
const { UserModel } = require("../models/user");
const bcrypt = require("bcrypt")
var cors = require('cors');
var jwt = require('jsonwebtoken');
const { TaskModel } = require("../models/task");
require("dotenv").config();
const Router = express.Router();

Router.use(cors({
    origin: "*"
}))

const check = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.TOKENKEY, function (err, decoded) {
        if (err) {
            res.send({ msg: "Login first, then try again please!" })
            return;
        }
        const { user_id } = decoded
        req.user_id = user_id;
        next();

    });
}



Router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(name)
    const users_data = await UserModel.findOne({ email })
    if (users_data) {
        res.send({ msg: "Email is already registered, please login with correct data" });
        return;
    }

    try {
        bcrypt.hash(password, 2, async function (err, hash) {
            let new_obj = UserModel({
                name,
                email,
                password: hash,
                role
            })
            await new_obj.save();
        });
        const data = await UserModel.find();
        res.send({ msg: data });

    } catch (err) {
        res.send({ msg: "failed to signup" })
    }
})




Router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user_data = await UserModel.findOne({ email })
    if (user_data) {

        bcrypt.compare(password, user_data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ user_id: user_data._id }, process.env.TOKENKEY);
                res.send({ msg: "login successfully", token })
            } else {
                res.send({ msg: "login failed, please provide the correct details" })
            }
        });

    } else {
        res.send({ msg: "please signup first!" })
    }
})

Router.use(check);

Router.get("/task", check, (req, res) => {

    res.send({msg:"get all data succesfully"})
})

Router.post("/task/add", check, async (req, res) => {
    const { title, category, position, rank, heading, content } = req.body;
    const user_id=req.user_id;
    const check_data = await TaskModel.findOne({ title, category, position, rank });
    if (check_data) {
        res.send({ msg: "this product is already in database" });
        return;
    }
    const new_obj = TaskModel({
        title,
        category,
        position,
        rank,
        heading,
        content,
        user_Id:user_id
    })
    await new_obj.save();
    res.send({msg:"item added succesfully"});
})


Router.put("/task/put/:Id",check,async(req,res)=>{
    const {Id}=req.params;
  const{title,rank,heading,content}=req.body
    const data_details=await TaskModel.findOne({_id:Id,user_Id:req.user_id});
    
    if(data_details){
        try{
            data_details.title=title,
        data_details.rank=rank,
        data_details.heading=heading,
        data_details.content=content
        await data_details.save()
        res.send({msg:"updating data successfully"})
        }catch(err){
            res.send({msg:"fill all put data"})
        }

    }else{
        res.send({msg:"Something went wrong!"})
    }

})



Router.delete("/task/delete/:Id",check,async(req,res)=>{
    const{Id}=req.params;
    try{
        const data=await TaskModel.findByIdAndDelete({_id:Id,user_Id:req.user_id})
        console.log(data)
    res.send({msg:"delete part succesfully"})
    }catch(err){
        res.send({msg:"something wrong in delete part"})
    }
})




module.exports = { Router }