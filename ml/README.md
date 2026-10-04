# RailBite Machine Learning Suite & Datasets

This directory contains 3 machine learning datasets curated specifically for the **RailBite Train Food Delivery Platform**, along with ready-to-run Python training scripts.

---

## 📁 Datasets Overview

| Dataset File | Domain & Purpose | Key Features | ML Models / Algorithms |
| :--- | :--- | :--- | :--- |
| **`1_indian_railways_schedules_and_delays.csv`** | Railway routes, station halts, speed, punctuality & historical delay metrics. | `train_no`, `station_code`, `halt_duration_mins`, `distance_km`, `avg_delay_mins`, `punctuality_rating` | XGBoost / Random Forest Regressor for Delay Forecasting |
| **`2_restaurant_menu_and_ratings.csv`** | IRCTC-authorized restaurant menus, dietary flags, spice levels, prep times & ratings across railway junctions. | `dish_name`, `cuisine`, `category`, `price`, `is_veg`, `is_jain`, `spice_level`, `prep_time_mins`, `rating` | TF-IDF + Cosine Similarity Recommender / Content-Based Filtering |
| **`3_food_delivery_eta_and_feasibility.csv`** | Order-level delivery dispatch, coach/berth location, kitchen prep time, platform sprint duration, and halt-window feasibility. | `coach`, `berth`, `items_count`, `kitchen_prep_time_mins`, `station_halt_minutes`, `train_delay_mins`, `station_crowd_index`, `delivery_feasible` (0/1), `delivery_eta_mins` | Logistic Regression / Random Forest Classifier (Feasibility) + Ridge / Gradient Boosting Regressor (ETA) |

---

## 🚀 Quick Start: Train All 3 Machine Learning Models

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Model Training & Evaluation Script
```bash
python train_models.py
```

### 3. Generate or Scale More Training Records
```bash
python generate_datasets.py
```
