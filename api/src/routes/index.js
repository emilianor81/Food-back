const { Router } = require('express');
const RecipeRoutes = require('./recipe')
const DietRoutes = require('./diet')
const RecipesRoutes = require('./recipes');

const router = Router();


router.use('/recipes',RecipesRoutes)
router.use('/types',DietRoutes);
router.use('/recipe',RecipeRoutes);


module.exports = router;


