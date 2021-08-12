const express = require('express');
const axios = require('axios');
const router = express.Router();
const { Recipe, Diet} = require('../db')
const { v4: uuid } = require('uuid');
const {BASE_URL, URL_COMPLEX, URL_DETAIL } = require('../../constants');
const API_KEY = process.env.API_KEY;

// SI QUIERO TRAERME TODOS LOS ELEMENTOS DE MI TABLA DIET HAGO LO SIGUIENTE:
// const DietGet = router.get('/', (req, res)=>{
//   return Diet.findAll()
//     .then((diets)=>res.send(diets))
//     .catch((err)=> console.log('Hay un error en la dieta ingresada'))
// })

const RecipeDetail = router.get('/:id', async (req, res) => {
  const { id } = req.params;
     if (!id) return res.status(404).send("Please type a right ID");
     try {
            if (id.length>10){
              const dbQuery = await Recipe.findAll({include:Diet});
            
              let dietss = dbQuery.filter(e=> e.dataValues.id === id) 
              let aux = []
              dietss[0].dataValues.diets.forEach(e=> aux.push(e.dataValues.name))
                
              let {title, summary, spoonacularScore, healthScore, instructions} = dietss[0].dataValues;
              if(title){res.send({title, diets: aux, summary, spoonacularScore, healthScore, instructions})}

        } else {
           const apiRecipe = await axios.get(`${BASE_URL}/${id}/information?apiKey=${API_KEY}`);
         if(apiRecipe){
           let { title,  image, spoonacularScore, healthScore, diets, summary, analyzedInstructions } = apiRecipe.data;
           let instructionsArray = [];
           analyzedInstructions[0].steps.forEach(s => instructionsArray.push({id: s.number, step: s.step}));
          return res.send({title, image, summary, analyzedInstructions: instructionsArray , spoonacularScore, healthScore, diets }); 
         }   
        }
     }
     catch (error) {  
         res.status(404).send("Input Id doesn't exist");
     }  
 })




const Recipes = router.get('/', async (req, res) => {
   const {name}= req.query;
    const recipesArray = [];
       try{
      if (!name) {
            const recipeResponses = await axios.get(`${BASE_URL}/${URL_COMPLEX}?apiKey=${API_KEY}&${URL_DETAIL}&number=20`);
            recipeResponses.data.results.forEach(recipe => {
               let {id, title, image, spoonacularScore, summary, healthScore, instructions, diets} = recipe;
                recipesArray.push({id, title, image, spoonacularScore, summary, healthScore, instructions, diets})
            });
          const recipePropias = await Recipe.findAll({include: Diet});
              recipePropias.forEach(recipe => {
              let {id, title, spoonacularScore, summary, healthScore, instructions } = recipe;
                      const {diets} = recipe.dataValues
                      const diet = [];
                      for (let i = 0; i < diets.length; i++) {
                        diet.push(diets[i].dataValues.name)
                      }
                   recipesArray.push({id, title, spoonacularScore, summary, healthScore, instructions, diets: diet})
          
         });       
            if(recipesArray.length > 0){
              return res.send(recipesArray)
            }else{
              return res.send('No existen registros que coincidan con la busqueda')
            }           
      }else{
        const recipeResponses = await axios.get(`${BASE_URL}/${URL_COMPLEX}?apiKey=${API_KEY}&${URL_DETAIL}&number=50`);
        recipeResponses.data.results.forEach(recipe => {
           let {id, title, image, spoonacularScore, summary, healthScore, instructions, diets} = recipe;
          if (recipe.title.toLowerCase().includes(name)){ 
                recipesArray.push({id, title, image,spoonacularScore, summary, healthScore, instructions, diets})
           }
        });
        const recipePropias = await Recipe.findAll({include: Diet});
      // const dbRecipes = Recipe.findAll({where: {name: {[Op.like]: `%${name}%`}}, include: Diet})
        //este es el array que tengo que enviar: recipePropias[0].dataValues.diets[0]
        recipePropias.forEach(recipe => {
             let {id, title, spoonacularScore, summary, healthScore, instructions} = recipe;
             if (recipe.title.toLowerCase().includes(name)){ 
                     const {diets} = recipe.dataValues
                     const diet = [];
                     for (let i = 0; i < diets.length; i++) {
                       diet.push(diets[i].dataValues.name)
                      // diet.concat(diets[i].dataValues.name);
                     }
                    //  recipesArray.push({...recipe, diets: diet});
               recipesArray.push({id, title, spoonacularScore, summary, healthScore, instructions, diets: diet})
             }
        });       
        if(recipesArray.length > 0){
          return res.send(recipesArray)
        }else{
          return res.send('No existen registros que coincidan con la busqueda')
        }     
      }
    }catch (error) {
                  return res.sendStatus(500).send(error); 
                  }
                });  
         
        //USAR LOS INCLUDE
  // user.findAll({
  //   include:[{
  //     model: Address,
  //     as:"domicilio",
  //     attributes:['street']
  //   },{
  //     model: Post
  //     as:"publicaciones",
  //     attributes:['title','body']
  //     where:{
  //        title: "Foo"		
  //     }
  //   }],
  //   attributes: [name, age]
  
  // }).then(users=>res.json(users))

module.exports = Recipes;
    
        
     