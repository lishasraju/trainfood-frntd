import db from '../config/database.js';

export const getTrains = (req, res) => {
  try {
    const { q } = req.query;
    const trains = db.getTrains(q);
    res.json({
      success: true,
      count: trains.length,
      data: trains
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrainByNo = (req, res) => {
  try {
    const { trainNo } = req.params;
    const train = db.getTrainByNo(trainNo);
    if (!train) {
      return res.status(404).json({ success: false, message: `Train #${trainNo} not found.` });
    }
    const schedule = db.getTrainSchedule(trainNo);
    
    // Simulate real-time running info & delay status
    const mockDelays = [0, 5, 12, 0, 15, 0];
    const scheduleWithLiveStatus = schedule.map((stop, idx) => {
      const delayMin = mockDelays[idx % mockDelays.length];
      const restaurants = db.getRestaurantsByStation(stop.station_code);
      return {
        ...stop,
        delay_minutes: delayMin,
        is_delayed: delayMin > 0,
        status_text: delayMin === 0 ? 'On Time' : `${delayMin}m Late`,
        available_restaurants_count: restaurants.length,
        can_order_now: true
      };
    });

    res.json({
      success: true,
      data: {
        train,
        schedule: scheduleWithLiveStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStations = (req, res) => {
  try {
    const stations = db.getStations();
    res.json({ success: true, count: stations.length, data: stations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
