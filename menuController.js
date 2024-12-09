const MenuItem = require('../models/MenuItem');
const Menu = require('../models/MenuItem');


const getMenuItems = async (req, res) => {
  try{
    const menuItems = await MenuItem.find({});
    res.status(201).json({message:'Menu items retrieved successfully', menuItems});
  } catch (err) {
    res.status(500).json({message:'Error getting menu items', err})
  }
}

// Add Menu Item
const addMenuItem = async (req, res) => {
  const { name, category, price, description, isSpecial, imgPath } = req.body;

  try {
    const menuItem = new Menu({ name, category, price, description, isSpecial, imgPath });
    await menuItem.save();
    res.status(201).json({ message: 'Menu item added successfully', menuItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error });
  }
};

// Update Menu Item
const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, isSpecial, imgPath } = req.body;

  try {
    const menuItem = await Menu.findByIdAndUpdate(id, { name, category, price, description, isSpecial, imgPath }, { new: true });
    res.json({ message: 'Menu item updated successfully', menuItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error });
  }
};

// Delete Menu Item
const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    await Menu.findByIdAndDelete(id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error });
  }
};

module.exports = { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem };
