import db from '../config/database.js';

export const createOrder = (req, res) => {
  try {
    const {
      pnr,
      train_no,
      train_name,
      station_code,
      station_name,
      platform_no,
      coach,
      berth,
      passenger_name,
      passenger_phone,
      delivery_note,
      restaurant_id,
      restaurant_name,
      items,
      payment_method,
      coupon_applied
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }
    if (!coach || !berth || !passenger_name || !passenger_phone) {
      return res.status(400).json({ success: false, message: 'Coach, berth, passenger name, and phone are required' });
    }

    // Calculate financials
    let subtotal = 0;
    items.forEach(item => {
      subtotal += (item.price * item.quantity);
    });

    let discount = 0;
    if (coupon_applied) {
      const coupon = db.getCouponByCode(coupon_applied);
      if (coupon && subtotal >= coupon.min_order_amount) {
        if (coupon.discount_percent > 0) {
          discount = Math.min(Math.round((subtotal * coupon.discount_percent) / 100), coupon.max_discount_amount || 9999);
        } else if (coupon.flat_discount > 0) {
          discount = coupon.flat_discount;
        }
      }
    }

    const tax = Math.round((subtotal - discount) * 0.05); // 5% GST on railway food catering
    const packaging_fee = 15; // Eco-friendly thermal seal packaging
    const delivery_fee = 0; // Free delivery to berth
    const total = subtotal - discount + tax + packaging_fee + delivery_fee;

    const orderPayload = {
      user_id: (req.user && req.user.id) || req.body.user_id || null,
      passenger_email: (req.user && req.user.email) || req.body.passenger_email || '',
      pnr: pnr || '',
      train_no: train_no || '12951',
      train_name: train_name || 'Rajdhani Express',
      station_code: station_code || 'BRC',
      station_name: station_name || 'Vadodara Junction',
      platform_no: platform_no || 2,
      coach: String(coach).toUpperCase(),
      berth: Number(berth),
      passenger_name,
      passenger_phone,
      delivery_note: delivery_note || '',
      restaurant_id,
      restaurant_name,
      items,
      subtotal,
      discount,
      tax,
      packaging_fee,
      delivery_fee,
      coupon_applied: coupon_applied || null,
      total,
      payment_method: payment_method || 'UPI',
      delivery_eta: 'At Station Arrival Platform'
    };

    const newOrder = db.createOrder(orderPayload);

    res.status(201).json({
      success: true,
      message: 'Train seat delivery order placed successfully!',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = (req, res) => {
  try {
    const { orderId } = req.params;
    const order = db.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['CONFIRMED', 'PREPARING', 'PACKED', 'DISPATCHED', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = db.updateOrderStatus(orderId, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = (req, res) => {
  try {
    const orders = db.getAllOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
