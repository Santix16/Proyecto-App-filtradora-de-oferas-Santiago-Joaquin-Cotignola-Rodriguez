const Store = require('../models/Store');

const getAllStores = async (req, res) => {
  try {
    const { city, minRating } = req.query;
    let query = {};

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const stores = await Store.find(query);
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStore = async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json({ message: 'Store deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
};
