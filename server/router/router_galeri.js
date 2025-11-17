const express = require('express');
const router = express.Router();
const galeriController = require('../modules/galeri/galeri_controller');
const { authenticate, isAdmin } = require('../middleware/auth'); // Assuming auth middleware exists

// Public routes
router.get('/galeri', galeriController.getAllGaleri);
router.get('/galeri/:id', galeriController.getGaleriById);

// Admin routes
router.post('/galeri', authenticate, isAdmin, galeriController.createGaleri);
router.put('/galeri/:id', authenticate, isAdmin, galeriController.updateGaleri);
router.delete('/galeri/:id', authenticate, isAdmin, galeriController.deleteGaleri);

module.exports = router;
