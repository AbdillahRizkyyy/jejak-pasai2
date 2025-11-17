const { galeri } = require('../../models');

// Get all galeri
exports.getAllGaleri = async (req, res) => {
  try {
    const data = await galeri.findAll();
    res.json({
      status: 'success',
      data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get galeri by ID
exports.getGaleriById = async (req, res) => {
  try {
    const data = await galeri.findByPk(req.params.id);
    if (data) {
      res.json({
        status: 'success',
        data
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Galeri not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create new galeri
exports.createGaleri = async (req, res) => {
  try {
    const { destinasi_id, judul, file, tipe } = req.body;
    const newData = await galeri.create({ destinasi_id, judul, file, tipe });
    res.status(201).json({
      status: 'success',
      data: newData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update galeri
exports.updateGaleri = async (req, res) => {
  try {
    const { destinasi_id, judul, file, tipe } = req.body;
    const result = await galeri.update({ destinasi_id, judul, file, tipe }, {
      where: { id: req.params.id }
    });
    if (result[0]) {
      res.json({
        status: 'success',
        message: 'Galeri updated successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Galeri not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete galeri
exports.deleteGaleri = async (req, res) => {
  try {
    const result = await galeri.destroy({
      where: { id: req.params.id }
    });
    if (result) {
      res.json({
        status: 'success',
        message: 'Galeri deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Galeri not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
