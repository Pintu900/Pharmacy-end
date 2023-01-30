const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');

const router = express.Router();

const productSchema = new mongoose.Schema({
    name : {type : String, required : true , minLength : 3, maxLength : 30},
    price: {type: Number, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true }
})

const Product = mongoose.model('Product',productSchema);


router.get('/api/products',async (req,res) => {
  let products = await Product.find();
  res.send(products);
})

router.post('/api/products', async (req,res) => {
  const {error} = validateData(req.body);
  
  if(error){
    res.status(400).send(error.details[0].message);
    return ;
  }

  const product = new Product({
    name : req.body.name,
    price : req.body.price,
    description : req.body.description,
    image_url : req.body.image_url
  });
  console.log(product);
  await product.save();
  res.status(200).send(product);
})

router.get('/api/products/:id', async (req, res) => {
  let product = await Product.findById(req.params.id)
  res.send(product);
})

// router.put('/api/categories/:id',users.checkAuth, async (req, res) => {
//   const {error} = validateData(req.body);
//   if(error){
//     res.status(400).send(error.details[0].message);
//     return ;
//   }
//   const category =  await Category.findByIdAndUpdate(req.params.id,{name : req.body.name}, {new : true});
//   if(!category) return res.status(404).send('The category with the given id is not found.');

//   res.status(200).send(category);
// })

// router.delete('/api/categories/:id',users.checkAuth, async (req,res) => {
//   const category = await Category.findByIdAndRemove(req.params.id);
//   if(!category) return res.status(404).send('The category with the given id is not found.');
//   res.status(200).send(category);
// })

function validateData(product){
    const schema = {
        name : Joi.string().min(3).required(),
        price : Joi.number().min(3).required(),
        description: Joi.string().min(3).required(),
        image_url: Joi.string().min(3).required()
    }

    return Joi.validate(product,schema);
}

module.exports = router;