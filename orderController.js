const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem')

// Count orders
const countOrders = async (req, res) => {
  try {
    // Count orders
    const todayOrdersCount = await Order.countDocuments({
      
    });
    res.json({ todayOrders: todayOrdersCount });
  } catch (error) {
    res.status(500).json({ message: 'Error counting today\'s orders', error });
  }
};

// // Get all orders
// const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate('customer').populate('items.menuItem');
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Update order status
// const updateOrderStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!['pending', 'preparing', 'ready', 'served', 'completed'].includes(status)) {
//     return res.status(400).json({ error: 'Invalid status' });
//   }

//   try {
//     const order = await Order.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     ).populate('customer').populate('items.menuItem');

//     if (!order) return res.status(404).json({ error: 'Order not found' });
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Generate Reports
const generateReports = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $group: { _id: { $dayOfYear: '$createdAt' }, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({ message: 'Sales report generated', sales });
  } catch (error) {
    res.status(500).json({ message: 'Error generating reports', error });
  }
};
// Get all menu items sorted by quantity sold
const getMenuItemsBySales = async (req, res) => {
  try {
    // Aggregate order data to calculate the total sales for each menu item
    const soldItems = await Order.aggregate([
      { $unwind: '$items' }, // Deconstruct the items array
      {
        $group: {
          _id: '$items.menuItem', // Group by menuItem ID
          totalQuantity: { $sum: '$items.quantity' }, // Sum the quantities sold
        },
      },
      { $sort: { totalQuantity: -1 } }, // Sort by total quantity sold in descending order
    ]);

    if (soldItems.length === 0) {
      return res.status(404).json({ message: 'No sales data found.' });
    }

    // Populate menu item details for all sold items
    const menuItems = await Promise.all(
      soldItems.map(async (item) => {
        const menuItem = await MenuItem.findById(item._id);
        if (!menuItem) {
          return null; // Skip if the menu item doesn't exist
        }
        return {
          menuItem,
          totalSold: item.totalQuantity,
        };
      })
    );

    // Filter out null values (missing menu items)
    const filteredMenuItems = menuItems.filter((item) => item !== null);

    res.json(filteredMenuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items by sales', error });
  }
};

// const getMenuItemsBySales = async (req, res) => {
//   try {
//     // Aggregate order data to calculate the total sales for each menu item
//     const soldItems = await Order.aggregate([
//       { $unwind: '$items' }, // Deconstruct the items array
//       {
//         $group: {
//           _id: '$items.menuItem', // Group by menuItem ID
//           totalQuantity: { $sum: '$items.quantity' } // Sum the quantities sold
//         }
//       },
//       { $sort: { totalQuantity: -1 } } // Sort by total quantity sold in descending order
//     ]);

//     if (soldItems.length === 0) {
//       return res.status(404).json({ message: 'No sales data found.' });
//     }

//     // Populate menu item details for all sold items
//     const menuItems = await Promise.all(
//       soldItems.map(async (item) => {
//         const menuItem = await MenuItem.findById(item._id);
//         return {
//           menuItem,
//           totalSold: item.totalQuantity
//         };
//       })
//     );

//     res.json(menuItems);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching menu items by sales', error });
//   }
// };

// Calculate total profits
const calculateTotalProfits = async (req, res) => {
  try {
    // Aggregate order data to calculate total quantities of each menu item sold
    const soldItems = await Order.aggregate([
      { $unwind: '$items' }, // Deconstruct the items array
      {
        $group: {
          _id: '$items.menuItem', // Group by menuItem ID
          totalQuantity: { $sum: '$items.quantity' } // Sum the quantities sold
        }
      }
    ]);

    if (soldItems.length === 0) {
      return res.status(404).json({ message: 'No sales data found. Profits cannot be calculated.' });
    }

    // Calculate total profits by fetching menu item prices
    let totalProfits = 0;

    for (const item of soldItems) {
      const menuItem = await MenuItem.findById(item._id);
      if (menuItem) {
        const profitPerItem = (menuItem.price * 3) / 100; // 3% profit
        totalProfits += profitPerItem * item.totalQuantity;
      }
    }

    res.json({ totalProfits: totalProfits.toFixed(2) }); // Rounded to two decimal places
  } catch (error) {
    res.status(500).json({ message: 'Error calculating total profits', error });
  }
};

// Calculate total revenues
const calculateTotalRevenues = async (req, res) => {
  try {
    // Aggregate order data to calculate total revenues
    const revenues = await Order.aggregate([
      {
        $group: {
          _id: null, // Group all orders together
          totalRevenue: { $sum: '$totalAmount' } // Sum the totalAmount field for all orders
        }
      }
    ]);

    // Handle the case where there are no orders
    if (revenues.length === 0) {
      return res.status(404).json({ message: 'No orders found. Revenues cannot be calculated.' });
    }

    res.json({ totalRevenue: revenues[0].totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating total revenues', error });
  }
};

// Function to get order history sorted by latest orders first
const  getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer').sort({ createdAt: -1 }); // Sort by latest first
    res.json({ordersHistory:orders});
  } catch (error) {
    res.status(500).json({ message: 'Error getting orders history', error });
  }
}
/////////////////////

// Get all orders (with filtering)
const getOrders = async (req, res) => {
  try {
    const { searchTerm, filterStatus } = req.query; // Expecting query parameters for filtering

    // Build filter object
    let filter = {};
    if (filterStatus) filter.status = filterStatus;

    const orders = await Order.find(filter)
      .populate('customer', 'name email') // Populate customer details
      .populate('items.menuItem', 'name price') // Populate dish information
      .exec();

    // Apply search filtering if searchTerm is provided
    const filteredOrders = orders.filter((order) => {
      const matchesSearch =
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });

    res.status(200).json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error });
  }
};



// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};



// Create an order with a specific dish
const addToOrderQueue = async (req, res) => {
  const { customer, items, totalAmount } = req.body;

  if (!customer || !items || !totalAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create a new order
    const newOrder = new Order({
      customer,
      items,
      totalAmount,
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order added to queue successfully',
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to order queue', error });
  }
};

module.exports = { 
  generateReports, 
  getOrders, 
  updateOrderStatus, 
  getMenuItemsBySales, 
  calculateTotalProfits, 
  calculateTotalRevenues,
  getOrderHistory,
  countOrders,addToOrderQueue};
