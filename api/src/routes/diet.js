const {Router} = require('express');
const {BASE_URL, URL_COMPLEX, URL_DETAIL } = require('../../constants');
const API_KEY = process.env.API_KEY;
const router = Router();
const axios = require('axios');
const { v4: uuid } = require('uuid');
const express = require('express');
const { Diet } = require('../db')


const dietTypes = router.get('/',async (req, res) =>{
  // HACER UN GET DE TODAS LAS RECETAS Y SACARLE A CADA UNA LAS DIETAS Y ESTAS DIETAS PONERLAS EN UN ARREGLO
  // Y METERLA EN MI TABLA DIETA SI NO EXISTEN
       try {
        const dietsBD = await Diet.findAll()
        return res.json(dietsBD)
      }catch{
        console.log('hay un error en los types')
      }
});


module.exports =  dietTypes;