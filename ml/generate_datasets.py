"""
RailBite Synthetic & Real-world Aligned Dataset Generator for Machine Learning
Generates 3 production-grade CSV datasets specifically modeled around Indian Railways,
IRCTC e-Catering, station halts, coach delivery, and food preparation.
"""

import os
import random
import csv
import math

# Output Directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
os.makedirs(DATASETS_DIR, exist_ok=True)

random.seed(42)

# ==========================================
# 1. TRAIN SCHEDULES & DELAYS DATASET
# ==========================================
def generate_railway_dataset(filepath, num_rows=1500):
    trains = [
        {"no": "12951", "name": "Mumbai Rajdhani Express", "type": "Rajdhani", "speed": 130, "src": "MMCT", "dest": "NDLS"},
        {"no": "22436", "name": "Varanasi Vande Bharat Express", "type": "Vande Bharat", "speed": 140, "src": "NDLS", "dest": "BSB"},
        {"no": "12002", "name": "Bhopal Shatabdi Express", "type": "Shatabdi", "speed": 120, "src": "NDLS", "dest": "RKMP"},
        {"no": "12628", "name": "Karnataka Superfast Express", "type": "Superfast", "speed": 85, "src": "NDLS", "dest": "SBC"},
        {"no": "12810", "name": "Howrah Mumbai Mail", "type": "Mail Superfast", "speed": 88, "src": "HWH", "dest": "CSMT"},
        {"no": "12259", "name": "Sealdah Bikaner Duronto", "type": "Duronto", "speed": 110, "src": "SDAH", "dest": "BKN"},
        {"no": "12301", "name": "Howrah Rajdhani Express", "type": "Rajdhani", "speed": 130, "src": "HWH", "dest": "NDLS"},
        {"no": "12431", "name": "Trivandrum Rajdhani Express", "type": "Rajdhani", "speed": 125, "src": "TVC", "dest": "NZM"},
        {"no": "12953", "name": "August Kranti Rajdhani", "type": "Rajdhani", "speed": 130, "src": "MMCT", "dest": "NZM"},
        {"no": "20801", "name": "Magadh Express", "type": "Superfast", "speed": 85, "src": "IPR", "dest": "NDLS"},
    ]

    stations = [
        {"code": "ST", "name": "Surat", "zone": "WR", "platforms": 4},
        {"code": "BRC", "name": "Vadodara Jn", "zone": "WR", "platforms": 7},
        {"code": "KOTA", "name": "Kota Jn", "zone": "WCR", "platforms": 4},
        {"code": "RTM", "name": "Ratlam Jn", "zone": "WR", "platforms": 7},
        {"code": "MTJ", "name": "Mathura Jn", "zone": "NCR", "platforms": 9},
        {"code": "AGC", "name": "Agra Cantt", "zone": "NCR", "platforms": 6},
        {"code": "GWL", "name": "Gwalior Jn", "zone": "NCR", "platforms": 5},
        {"code": "BPL", "name": "Bhopal Jn", "zone": "WCR", "platforms": 6},
        {"code": "CNB", "name": "Kanpur Central", "zone": "NCR", "platforms": 10},
        {"code": "PRYJ", "name": "Prayagraj Jn", "zone": "NCR", "platforms": 10},
        {"code": "NGP", "name": "Nagpur Jn", "zone": "CR", "platforms": 8},
        {"code": "DDU", "name": "Pt Deen Dayal Upadhyaya", "zone": "ECR", "platforms": 8},
        {"code": "DHN", "name": "Dhanbad Jn", "zone": "ECR", "platforms": 7},
        {"code": "TATA", "name": "Tatanagar Jn", "zone": "SER", "platforms": 5},
        {"code": "BSP", "name": "Bilaspur Jn", "zone": "SECR", "platforms": 8}
    ]

    weather_types = ["Clear", "Sunny", "Rainy", "Foggy", "Misty"]
    seasons = ["Winter", "Summer", "Monsoon", "Autumn"]

    headers = [
        "train_no", "train_name", "train_type", "station_code", "station_name",
        "distance_from_source_km", "scheduled_halt_mins", "day_of_week",
        "speed_kmh", "season", "weather_condition", "fog_index", "is_weekend",
        "historical_avg_delay_mins", "congestion_score", "delay_mins"
    ]

    rows = []
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    for _ in range(num_rows):
        tr = random.choice(trains)
        st = random.choice(stations)
        day = random.choice(days)
        is_wknd = 1 if day in ["Sat", "Sun"] else 0
        season = random.choice(seasons)
        weather = random.choice(weather_types)
        
        fog = round(random.uniform(0.6, 1.0), 2) if (season == "Winter" and weather in ["Foggy", "Misty"]) else round(random.uniform(0.0, 0.2), 2)
        dist = random.randint(100, 2200)
        halt = random.choice([2, 3, 5, 5, 5, 7, 10, 15])
        congestion = round(random.uniform(1.0, 5.0), 1)

        # Baseline delay logic
        base_delay = 0.0
        if tr["type"] == "Rajdhani":
            base_delay += random.uniform(0, 15)
        elif tr["type"] == "Vande Bharat":
            base_delay += random.uniform(0, 8)
        elif tr["type"] == "Shatabdi":
            base_delay += random.uniform(2, 18)
        else:
            base_delay += random.uniform(5, 45)

        if weather == "Foggy":
            base_delay += random.uniform(20, 90)
        elif weather == "Rainy":
            base_delay += random.uniform(10, 30)

        base_delay += (congestion * 3.5) + (dist * 0.008)
        actual_delay = max(0, round(base_delay + random.gauss(0, 6), 1))
        hist_delay = max(0, round(actual_delay * random.uniform(0.85, 1.15), 1))

        rows.append([
            tr["no"], tr["name"], tr["type"], st["code"], st["name"],
            dist, halt, day, tr["speed"], season, weather, fog, is_wknd,
            hist_delay, congestion, actual_delay
        ])

    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    print(f"[+] Generated {len(rows)} records in {filepath}")


# ==========================================
# 2. RESTAURANTS & MENU DATASET
# ==========================================
def generate_menu_dataset(filepath):
    restaurants = [
        {"id": "rest_1", "name": "Haldiram's Express", "stations": ["ST", "BRC", "KOTA", "AGC", "CNB", "MTJ"], "rating": 4.7, "pure_veg": 1, "cuisine": "North Indian"},
        {"id": "rest_2", "name": "Domino's Pizza Train Delivery", "stations": ["ST", "BRC", "KOTA", "AGC", "BPL", "CNB", "NGP", "MTJ"], "rating": 4.6, "pure_veg": 0, "cuisine": "Italian & Fast Food"},
        {"id": "rest_3", "name": "Behrouz Royal Biryani", "stations": ["ST", "BRC", "KOTA", "BPL", "CNB", "NGP"], "rating": 4.8, "pure_veg": 0, "cuisine": "Mughlai & Biryani"},
        {"id": "rest_4", "name": "Saravana Bhavan South Express", "stations": ["ST", "BRC", "NGP", "BPL"], "rating": 4.9, "pure_veg": 1, "cuisine": "South Indian"},
        {"id": "rest_5", "name": "Faasos Rolls & Bowls", "stations": ["KOTA", "ST", "BRC", "AGC", "CNB"], "rating": 4.5, "pure_veg": 0, "cuisine": "Wraps & Fast Food"},
        {"id": "rest_6", "name": "Bikanervala Heritage Kitchen", "stations": ["MTJ", "AGC", "KOTA", "CNB"], "rating": 4.7, "pure_veg": 1, "cuisine": "Rajasthani & Sweets"},
        {"id": "rest_7", "name": "Punjabi Rasoi Express", "stations": ["NDLS", "CNB", "AGC", "PRYJ"], "rating": 4.4, "pure_veg": 1, "cuisine": "North Indian"},
        {"id": "rest_8", "name": "Chai Point & Railway Cafe", "stations": ["ST", "BRC", "KOTA", "BPL", "NGP", "NDLS"], "rating": 4.6, "pure_veg": 1, "cuisine": "Beverages & Snacks"}
    ]

    base_dishes = [
        ("Royal Maharaja Special Veg Thali", "thali", 249, 299, 1, 1, 2, 15, "Full Meal Box with Paneer, Dal, 4 Rotis, Rice & Sweet", 680, 1),
        ("Standard Deluxe Mini Thali", "thali", 179, 219, 1, 1, 1, 12, "Dal Tadka, Mix Veg, 3 Rotis, Jeera Rice, Pickle", 520, 1),
        ("Shahi Paneer Butter Masala Combo", "north_indian", 219, 259, 1, 1, 2, 14, "Cottage cheese cubes in buttery gravy with 2 Garlic Naans", 580, 0),
        ("Dal Makhani with Jeera Rice", "north_indian", 169, 199, 1, 1, 1, 10, "Slow cooked black lentils with aromatic cumin basmati rice", 490, 1),
        ("Dum Gosht Hyderabadi Biryani", "biryani", 329, 399, 0, 0, 3, 18, "Tender marinated meat layered with long basmati rice and saffron", 750, 1),
        ("Royal Dum Veg Paneer Biryani", "biryani", 239, 289, 1, 1, 2, 15, "Charcoal cooked fragrant basmati rice with paneer cubes & mint", 610, 1),
        ("Cheesy Farmhouse Delight Pizza (Medium)", "pizza", 299, 349, 1, 0, 1, 15, "Loaded with capsicum, onion, grilled mushroom, crisp tomato & mozzarella", 720, 1),
        ("Non-Veg Supreme Feast Pizza (Medium)", "pizza", 379, 449, 0, 0, 2, 15, "Smoked chicken tikka, spicy meatballs & black olives", 810, 0),
        ("Ghee Podi Masala Dosa with Sambar", "south_indian", 139, 169, 1, 0, 2, 8, "Crispy golden crepe roasted in pure desi ghee with potato filling", 420, 1),
        ("Steamed Button Idlis & Medu Vada Combo", "south_indian", 119, 149, 1, 1, 1, 6, "4 Fluffy rice cakes + 2 crispy lentil donuts with coconut chutney", 340, 1),
        ("Jain Special Satvik Khichdi Bowl", "jain", 149, 179, 1, 1, 1, 10, "No onion no garlic yellow moong dal rice prepared in cow ghee", 380, 1),
        ("Jain Paneer Kadhai with Phulkas", "jain", 229, 269, 1, 1, 1, 14, "Prepared strictly without root vegetables or onion garlic", 510, 0),
        ("Crispy Jumbo Paneer Tikka Wrap", "snacks", 159, 189, 1, 0, 2, 10, "Marinated paneer chunks grilled in tandoor rolled in flaky paratha", 460, 1),
        ("Chicken Bhuna Egg Roll", "snacks", 179, 219, 0, 0, 3, 12, "Spiced slow cooked chicken wrapped with double eggs", 540, 1),
        ("Kulhad Ginger Elaichi Chai (Serves 2)", "beverages", 79, 99, 1, 1, 1, 5, "Freshly brewed tea infused with ginger and green cardamom in earthen cups", 120, 1),
        ("Filter Coffee Flask (500ml)", "beverages", 99, 129, 1, 1, 1, 5, "Strong South Indian chicory blend filter coffee", 150, 0),
        ("Hot Angoori Gulab Jamun (4 pcs)", "dessert", 89, 109, 1, 1, 1, 4, "Soft cottage cheese dumplings soaked in saffron sugar syrup", 310, 1),
        ("Royal Kesar Rasmalai (2 pcs)", "dessert", 119, 149, 1, 1, 1, 4, "Spongy discs in thickened pistachio saffron milk", 280, 0)
    ]

    headers = [
        "dish_id", "dish_name", "restaurant_id", "restaurant_name", "station_code",
        "cuisine", "category", "price", "original_price", "discount_pct", "is_veg",
        "is_jain_available", "spice_level", "prep_time_mins", "calories_kcal",
        "rating", "reviews_count", "is_bestseller", "hygiene_score_pct", "description"
    ]

    rows = []
    dish_counter = 1

    for r in restaurants:
        for st_code in r["stations"]:
            for d in base_dishes:
                # filter veg dishes for pure veg restaurants
                if r["pure_veg"] == 1 and d[4] == 0:
                    continue

                dish_id = f"dish_{dish_counter}"
                name, cat, price, orig_price, is_veg, is_jain, spice, prep, desc, cal, best = d
                
                # add slight natural variance by station/restaurant
                price_adj = price + random.choice([-10, 0, 10, 20])
                orig_adj = orig_price + random.choice([0, 10, 20])
                disc = round(((orig_adj - price_adj) / orig_adj) * 100)
                item_rating = round(min(5.0, r["rating"] + random.uniform(-0.3, 0.2)), 1)
                rev_count = random.randint(80, 1200)
                hygiene = random.randint(94, 99)

                rows.append([
                    dish_id, name, r["id"], r["name"], st_code,
                    r["cuisine"], cat, price_adj, orig_adj, disc, is_veg,
                    is_jain, spice, prep, cal,
                    item_rating, rev_count, best, hygiene, desc
                ])
                dish_counter += 1

    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    print(f"[+] Generated {len(rows)} records in {filepath}")


# ==========================================
# 3. DELIVERY ETA & FEASIBILITY DATASET
# ==========================================
def generate_delivery_feasibility_dataset(filepath, num_rows=3000):
    train_types = ["Rajdhani", "Vande Bharat", "Shatabdi", "Superfast", "Mail Express"]
    stations = ["ST", "BRC", "KOTA", "AGC", "CNB", "BPL", "NGP", "MTJ", "PRYJ", "DDU"]
    coaches = ["B1", "B2", "B3", "B4", "B5", "A1", "A2", "H1", "S1", "S4", "S8", "C1", "C2", "E1"]
    weather_conds = ["Clear", "Rainy", "Foggy"]
    meal_times = ["Breakfast", "Lunch", "Snacks", "Dinner", "LateNight"]

    headers = [
        "order_id", "train_type", "station_code", "coach", "berth", "is_ac_coach",
        "items_count", "order_amount_inr", "meal_time", "kitchen_prep_time_mins",
        "platform_distance_meters", "station_crowd_index", "weather",
        "station_halt_mins", "train_delay_mins", "advance_order_mins",
        "delivery_agent_sprint_mins", "total_time_required_mins",
        "buffer_margin_mins", "delivery_feasible", "predicted_delivery_eta_mins"
    ]

    rows = []

    for i in range(1, num_rows + 1):
        order_id = f"RB-ORD-{100000 + i}"
        t_type = random.choice(train_types)
        st = random.choice(stations)
        coach = random.choice(coaches)
        berth = random.randint(1, 72)
        is_ac = 1 if coach.startswith(("A", "B", "H", "C", "E")) else 0
        items_count = random.randint(1, 6)
        order_amount = random.randint(120, 1100)
        meal = random.choice(meal_times)
        weather = random.choice(weather_conds)

        # Halt duration
        halt_mins = random.choice([2, 3, 5, 5, 5, 7, 10, 15])
        
        # Advance notice before train arrives
        advance_order_mins = random.randint(15, 90)
        train_delay = max(0, round(random.gauss(12, 18), 1))
        effective_arrival_window = advance_order_mins + train_delay

        # Kitchen prep time based on item count
        base_prep = 8 + (items_count * 2.2) + random.uniform(0, 5)
        if meal in ["Lunch", "Dinner"]:
            base_prep += 3.0
        kitchen_prep = round(base_prep, 1)

        # Distance to platform & coach position
        plat_dist = random.randint(60, 480) # meters
        crowd_index = random.randint(1, 5) # 1 low crowd, 5 heavy rush
        
        # Sprint speed in minutes
        speed_factor = 1.4 if weather == "Rainy" else 1.0
        sprint_mins = round((plat_dist / 65.0) * (1 + (crowd_index * 0.12)) * speed_factor, 1)

        total_time_req = round(kitchen_prep + sprint_mins, 1)
        
        # Buffer margin = (Time until train departs) - (Time required to prepare & deliver)
        time_until_train_departs = effective_arrival_window + halt_mins
        buffer_margin = round(time_until_train_departs - total_time_req, 1)

        # Feasibility classification (1 = safe deliverable, 0 = risky/missed)
        # If order was placed too late (e.g. less than total_time_req before departure), delivery fails
        if effective_arrival_window < (kitchen_prep + sprint_mins - (halt_mins * 0.5)):
            feasible = 0
        elif halt_mins <= 2 and total_time_req > effective_arrival_window:
            feasible = 0
        else:
            feasible = 1

        # Delivery ETA (how many minutes from order time to coach seat handover)
        delivery_eta = round(min(effective_arrival_window + (halt_mins * 0.5), total_time_req + random.uniform(1.0, 3.0)), 1)

        rows.append([
            order_id, t_type, st, coach, berth, is_ac,
            items_count, order_amount, meal, kitchen_prep,
            plat_dist, crowd_index, weather,
            halt_mins, train_delay, advance_order_mins,
            sprint_mins, total_time_req,
            buffer_margin, feasible, delivery_eta
        ])

    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    print(f"[+] Generated {len(rows)} records in {filepath}")


if __name__ == "__main__":
    print("[*] Generating RailBite Machine Learning Datasets...")
    generate_railway_dataset(os.path.join(DATASETS_DIR, "1_indian_railways_schedules_and_delays.csv"), 2000)
    generate_menu_dataset(os.path.join(DATASETS_DIR, "2_restaurant_menu_and_ratings.csv"))
    generate_delivery_feasibility_dataset(os.path.join(DATASETS_DIR, "3_food_delivery_eta_and_feasibility.csv"), 3500)
    print("[+] All 3 Machine Learning datasets generated successfully in ml/datasets/")
