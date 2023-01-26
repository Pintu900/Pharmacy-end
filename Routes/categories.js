const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');

const router = express.Router();

const categorySchema = new mongoose.Schema({
    name : {type : String, required : true , minLength : 3, maxLength : 30}
})

const Category = mongoose.model('Category',categorySchema);

// const categories =[
//   {id : 1, name : 'Web'},
//   {id : 2, name : 'Mobile'},
//   {id : 3, name : 'Photography'}
// ]

router.get('/api/categories',async (req,res) => {
  let categories = await Category.find();
  res.send(categories);
})

router.post('/api/categories', async (req,res) => {
  const {error} = validateData(req.body);
  
  if(error){
    res.status(400).send(error.details[0].message);
    return ;
  }

  const category = new Category({
    name : req.body.name
  });
  console.log(category);
  await category.save();
  res.status(200).send(category);
})

router.put('/api/categories/:id', async (req, res) => {
  const {error} = validateData(req.body);
  if(error){
    res.status(400).send(error.details[0].message);
    return ;
  }
  const category =  await Category.findByIdAndUpdate(req.params.id,{name : req.body.name}, {new : true});
  if(!category) return res.status(404).send('The category with the given id is not found.');

  res.status(200).send(category);
})

router.delete('/api/categories/:id', async (req,res) => {
  const category = await Category.findByIdAndRemove(req.params.id);
  if(!category) return res.status(404).send('The category with the given id is not found.');
  res.status(200).send(category);
})

function validateData(category){
    const schema = {
        name : Joi.string().min(3).required()
    }

    return Joi.validate(category,schema);
}

module.exports = router;