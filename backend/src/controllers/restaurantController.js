import db from '../config/database.js';

export const getRestaurantsByStation = (req, res) => {
  try {
    const { stationCode } = req.params;
    const { pure_veg, jain, min_rating, cuisine } = req.query;

    const station = db.getStationByCode(stationCode);
    let restaurants = db.getRestaurantsByStation(stationCode, { pure_veg, jain, min_rating, cuisine });

    // If no restaurants specifically attached to this station code yet, fall back to high-grade station kitchens
    if (restaurants.length === 0) {
      restaurants = db.data.restaurants.slice(0, 3).map(r => ({
        ...r,
        id: `${r.id}-${stationCode.toLowerCase()}`,
        station_code: stationCode.toUpperCase(),
        name: `${r.name} (${station ? station.name : stationCode})`
      }));
    }

    res.json({
      success: true,
      station: station || { code: stationCode, name: stationCode },
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRestaurantDetails = (req, res) => {
  try {
    const { id } = req.params;
    // Check if composite id like rest-brc-01-st
    const baseId = id.split('-').slice(0, 3).join('-');
    const restaurant = db.getRestaurantById(id) || db.getRestaurantById(baseId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const rawMenu = db.getMenuItemsByRestaurant(restaurant.id) || [];
    // If no direct menu items, borrow menu items from closest category
    const menu = rawMenu.length > 0 ? rawMenu : db.data.menu_items.slice(0, 6);

    // Group menu items by category
    const categories = {};
    menu.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    res.json({
      success: true,
      data: {
        restaurant,
        menu,
        categories
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
