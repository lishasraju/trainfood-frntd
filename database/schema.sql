-- RailBite Database Schema
-- Train Food Delivery Platform

CREATE TABLE IF NOT EXISTS trains (
    train_no VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    train_type VARCHAR(50) NOT NULL,
    source_station_code VARCHAR(10) NOT NULL,
    source_station_name VARCHAR(100) NOT NULL,
    dest_station_code VARCHAR(10) NOT NULL,
    dest_station_name VARCHAR(100) NOT NULL,
    departure_time VARCHAR(10) NOT NULL,
    arrival_time VARCHAR(10) NOT NULL,
    duration VARCHAR(20) NOT NULL,
    speed_kmh INT DEFAULT 95,
    coaches_available JSON,
    running_days JSON
);

CREATE TABLE IF NOT EXISTS stations (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    total_platforms INT DEFAULT 5,
    rating DECIMAL(2,1) DEFAULT 4.5
);

CREATE TABLE IF NOT EXISTS train_schedules (
    id VARCHAR(50) PRIMARY KEY,
    train_no VARCHAR(10) NOT NULL,
    station_code VARCHAR(10) NOT NULL,
    station_name VARCHAR(100) NOT NULL,
    sequence INT NOT NULL,
    arrival_time VARCHAR(10) NOT NULL,
    departure_time VARCHAR(10) NOT NULL,
    halt_minutes INT NOT NULL,
    distance_km INT NOT NULL,
    day INT NOT NULL DEFAULT 1,
    platform_no INT DEFAULT 1,
    order_cutoff_minutes INT DEFAULT 45,
    FOREIGN KEY (train_no) REFERENCES trains(train_no),
    FOREIGN KEY (station_code) REFERENCES stations(code)
);

CREATE TABLE IF NOT EXISTS restaurants (
    id VARCHAR(50) PRIMARY KEY,
    station_code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    tagline VARCHAR(150),
    rating DECIMAL(2,1) NOT NULL DEFAULT 4.5,
    reviews_count INT DEFAULT 400,
    delivery_time_mins INT DEFAULT 20,
    min_order INT DEFAULT 99,
    cuisine VARCHAR(100) NOT NULL,
    hygiene_score VARCHAR(10) DEFAULT '98%',
    irctc_authorized BOOLEAN DEFAULT TRUE,
    is_pure_veg BOOLEAN DEFAULT FALSE,
    jain_available BOOLEAN DEFAULT FALSE,
    image VARCHAR(500),
    logo VARCHAR(500),
    FOREIGN KEY (station_code) REFERENCES stations(code)
);

CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(50) PRIMARY KEY,
    restaurant_id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    original_price INT,
    description TEXT,
    is_veg BOOLEAN DEFAULT TRUE,
    is_jain BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    spice_level INT DEFAULT 1,
    prep_time_mins INT DEFAULT 15,
    image VARCHAR(500),
    serves VARCHAR(20) DEFAULT '1 Person',
    customizations JSON,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE IF NOT EXISTS pnr_records (
    pnr VARCHAR(10) PRIMARY KEY,
    train_no VARCHAR(10) NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    journey_date VARCHAR(20) NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    coach VARCHAR(10) NOT NULL,
    berth INT NOT NULL,
    berth_type VARCHAR(20) NOT NULL,
    boarding_station_code VARCHAR(10) NOT NULL,
    boarding_station_name VARCHAR(100) NOT NULL,
    destination_station_code VARCHAR(10) NOT NULL,
    destination_station_name VARCHAR(100) NOT NULL,
    pnr_status VARCHAR(50) DEFAULT 'CNF (Confirmed)'
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    pnr VARCHAR(10),
    train_no VARCHAR(10) NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    station_code VARCHAR(10) NOT NULL,
    station_name VARCHAR(100) NOT NULL,
    platform_no INT DEFAULT 1,
    coach VARCHAR(10) NOT NULL,
    berth INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    delivery_note TEXT,
    restaurant_id VARCHAR(50) NOT NULL,
    restaurant_name VARCHAR(100) NOT NULL,
    items JSON NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    packaging_fee DECIMAL(10,2) NOT NULL DEFAULT 15.0,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    coupon_applied VARCHAR(50),
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    order_status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    delivery_agent_name VARCHAR(100) DEFAULT 'Ramesh Kumar',
    delivery_agent_phone VARCHAR(20) DEFAULT '+91 98765 43210',
    delivery_otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_eta VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS coupons (
    code VARCHAR(30) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    discount_percent INT,
    flat_discount INT,
    min_order_amount INT NOT NULL,
    max_discount_amount INT,
    is_active BOOLEAN DEFAULT TRUE
);
