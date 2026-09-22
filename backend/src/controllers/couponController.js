import db from '../config/database.js';

export const getCoupons = (req, res) => {
  try {
    const coupons = db.getCoupons();
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCoupon = (req, res) => {
  try {
    const { code, amount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const orderAmount = parseFloat(amount) || 0;
    const coupon = db.getCouponByCode(code);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    if (orderAmount < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum order value of ₹${coupon.min_order_amount}.`
      });
    }

    let discount = 0;
    if (coupon.discount_percent > 0) {
      discount = Math.min(Math.round((orderAmount * coupon.discount_percent) / 100), coupon.max_discount_amount || 9999);
    } else if (coupon.flat_discount > 0) {
      discount = coupon.flat_discount;
    }

    res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied! You save ₹${discount}`,
      data: {
        code: coupon.code,
        discount,
        coupon
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
