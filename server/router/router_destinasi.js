const express = require('express');
const router = express.Router();
const destinasiController = require('../modules/destinasi/destinasi_controller');
const { authenticate, isAdmin } = require('../middleware/auth'); // Assuming auth middleware exists

// Public routes
router.get('/destinasi', destinasiController.getAllDestinasi);
router.get('/destinasi/:id', destinasiController.getDestinasiById);

// Admin routes
router.post('/destinasi', authenticate, isAdmin, destinasiController.createDestinasi);
router.put('/destinasi/:id', authenticate, isAdmin, destinasiController.updateDestinasi);
router.delete('/destinasi/:id', authenticate, isAdmin, destinasiController.deleteDestinasi);

module.exports = router;
