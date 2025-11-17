const { destinasi } = require('../../models');

// Get all destinasi
exports.getAllDestinasi = async (req, res) => {
  try {
    const data = await destinasi.findAll();
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

// Get destinasi by ID
exports.getDestinasiById = async (req, res) => {
  try {
    const data = await destinasi.findByPk(req.params.id);
    if (data) {
      res.json({
        status: 'success',
        data
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Destinasi not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create new destinasi
exports.createDestinasi = async (req, res) => {
  try {
    const { nama_destinasi, deskripsi, gambar, alamat, koordinat } = req.body;
    const newData = await destinasi.create({ nama_destinasi, deskripsi, gambar, alamat, koordinat });
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

// Update destinasi
exports.updateDestinasi = async (req, res) => {
  try {
    const { nama_destinasi, deskripsi, gambar, alamat, koordinat } = req.body;
    const result = await destinasi.update({ nama_destinasi, deskripsi, gambar, alamat, koordinat }, {
      where: { id: req.params.id }
    });
    if (result[0]) {
      res.json({
        status: 'success',
        message: 'Destinasi updated successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Destinasi not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete destinasi
exports.deleteDestinasi = async (req, res) => {
  try {
    const result = await destinasi.destroy({
      where: { id: req.params.id }
    });
    if (result) {
      res.json({
        status: 'success',
        message: 'Destinasi deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Destinasi not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
