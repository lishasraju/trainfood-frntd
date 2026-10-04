"""
RailBite Machine Learning Suite - Model Training & Evaluation Pipeline
Trains models on all 3 RailBite project datasets:
1. Train Delay Predictor (Regression)
2. Dish & Cuisine Recommender System (Content-Based NLP Similarity)
3. Safe Delivery Feasibility Classifier & ETA Regressor
"""

import os
import sys
import pandas as pd
import numpy as np

# Ensure stdout handles UTF-8 / ASCII cleanly
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, classification_report, accuracy_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
MODELS_DIR = os.path.join(BASE_DIR, "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

# =====================================================================
# 1. TRAIN DELAY PREDICTOR (Regression)
# =====================================================================
def train_delay_prediction_model():
    print("\n" + "="*65)
    print("🚂 1. TRAINING TRAIN DELAY PREDICTION MODEL (Dataset 1)")
    print("="*65)

    csv_path = os.path.join(DATASETS_DIR, "1_indian_railways_schedules_and_delays.csv")
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} railway records from: 1_indian_railways_schedules_and_delays.csv")

    features = [
        "train_type", "station_code", "distance_from_source_km",
        "scheduled_halt_mins", "day_of_week", "speed_kmh", "season",
        "weather_condition", "fog_index", "is_weekend",
        "historical_avg_delay_mins", "congestion_score"
    ]
    target = "delay_mins"

    X = df[features]
    y = df[target]

    categorical_cols = ["train_type", "station_code", "day_of_week", "season", "weather_condition"]
    numerical_cols = [c for c in features if c not in categorical_cols]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numerical_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
        ]
    )

    model = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"[+] Model Evaluation Metrics:")
    print(f"    - Mean Absolute Error (MAE): {mae:.2f} minutes")
    print(f"    - Root Mean Squared Error (RMSE): {rmse:.2f} minutes")
    print(f"    - R-squared (R2 Score): {r2:.4f}")

    # Save model
    model_save_path = os.path.join(MODELS_DIR, "train_delay_model.joblib")
    joblib.dump(model, model_save_path)
    print(f"[+] Saved model artifact to: {model_save_path}")
    return model


# =====================================================================
# 2. FOOD RECOMMENDATION SYSTEM (Content-Based NLP Recommender)
# =====================================================================
class FoodRecommender:
    def __init__(self, menu_df):
        self.df = menu_df.copy()
        self.df["combined_features"] = (
            self.df["dish_name"] + " " +
            self.df["cuisine"] + " " +
            self.df["category"] + " " +
            self.df["description"] + " " +
            np.where(self.df["is_veg"] == 1, "pure veg vegetarian", "non-veg chicken egg") + " " +
            np.where(self.df["is_jain_available"] == 1, "jain satvik no onion no garlic", "")
        )
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df["combined_features"])

    def recommend(self, query_text, station_code=None, is_veg_only=False, top_n=5):
        filtered_indices = self.df.index
        if station_code:
            filtered_indices = self.df[self.df["station_code"] == station_code].index
        if is_veg_only:
            filtered_indices = self.df.loc[filtered_indices][self.df.loc[filtered_indices]["is_veg"] == 1].index

        if len(filtered_indices) == 0:
            return pd.DataFrame()

        query_vec = self.vectorizer.transform([query_text])
        sub_matrix = self.tfidf_matrix[filtered_indices]
        similarities = cosine_similarity(query_vec, sub_matrix).flatten()

        top_local_idx = similarities.argsort()[::-1][:top_n]
        top_global_idx = [filtered_indices[i] for i in top_local_idx]

        results = self.df.loc[top_global_idx, ["dish_name", "restaurant_name", "station_code", "category", "price", "rating", "is_veg"]].copy()
        results["match_score"] = [round(similarities[i] * 100, 1) for i in top_local_idx]
        return results


def train_food_recommender():
    print("\n" + "="*65)
    print("🍛 2. TRAINING DISH & CUISINE RECOMMENDER SYSTEM (Dataset 2)")
    print("="*65)

    csv_path = os.path.join(DATASETS_DIR, "2_restaurant_menu_and_ratings.csv")
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} restaurant dishes from: 2_restaurant_menu_and_ratings.csv")

    recommender = FoodRecommender(df)

    # Demo query
    sample_query = "hot paneer thali butter roti sweet"
    sample_station = "KOTA"
    print(f"\n[?] Demo Passenger Search: '{sample_query}' at Station '{sample_station}' (Veg Only)")
    recommendations = recommender.recommend(sample_query, station_code=sample_station, is_veg_only=True, top_n=3)
    print(recommendations.to_string(index=False))

    recommender_save_path = os.path.join(MODELS_DIR, "food_recommender.joblib")
    joblib.dump(recommender, recommender_save_path)
    print(f"\n[+] Saved recommender artifact to: {recommender_save_path}")
    return recommender


# =====================================================================
# 3. DELIVERY FEASIBILITY CLASSIFIER & ETA REGRESSOR (Dataset 3)
# =====================================================================
def train_delivery_models():
    print("\n" + "="*65)
    print("🛵 3. TRAINING DELIVERY FEASIBILITY & ETA MODELS (Dataset 3)")
    print("="*65)

    csv_path = os.path.join(DATASETS_DIR, "3_food_delivery_eta_and_feasibility.csv")
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} delivery order dispatches from: 3_food_delivery_eta_and_feasibility.csv")

    features = [
        "train_type", "station_code", "is_ac_coach", "items_count",
        "order_amount_inr", "meal_time", "kitchen_prep_time_mins",
        "platform_distance_meters", "station_crowd_index", "weather",
        "station_halt_mins", "train_delay_mins", "advance_order_mins"
    ]

    categorical_cols = ["train_type", "station_code", "meal_time", "weather"]
    numerical_cols = [c for c in features if c not in categorical_cols]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numerical_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
        ]
    )

    X = df[features]
    y_feasibility = df["delivery_feasible"]
    y_eta = df["predicted_delivery_eta_mins"]

    # 3A: Feasibility Classifier
    clf_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    X_train, X_test, y_train_f, y_test_f = train_test_split(X, y_feasibility, test_size=0.2, random_state=42)
    clf_pipeline.fit(X_train, y_train_f)
    y_pred_f = clf_pipeline.predict(X_test)

    acc = accuracy_score(y_test_f, y_pred_f)
    print(f"[+] 3A. Order Feasibility Classification Accuracy: {acc * 100:.2f}%")
    print("    Classification Report:")
    print(classification_report(y_test_f, y_pred_f, target_names=["Risky/Unfeasible", "Safe Delivery"]))

    # 3B: ETA Regressor
    reg_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    X_train_eta, X_test_eta, y_train_eta, y_test_eta = train_test_split(X, y_eta, test_size=0.2, random_state=42)
    reg_pipeline.fit(X_train_eta, y_train_eta)
    y_pred_eta = reg_pipeline.predict(X_test_eta)

    mae_eta = mean_absolute_error(y_test_eta, y_pred_eta)
    r2_eta = r2_score(y_test_eta, y_pred_eta)
    print(f"[+] 3B. Delivery ETA Regressor Performance:")
    print(f"    - Mean Absolute Error (MAE): {mae_eta:.2f} minutes")
    print(f"    - R-squared (R2 Score): {r2_eta:.4f}")

    joblib.dump(clf_pipeline, os.path.join(MODELS_DIR, "delivery_feasibility_classifier.joblib"))
    joblib.dump(reg_pipeline, os.path.join(MODELS_DIR, "delivery_eta_regressor.joblib"))
    print(f"[+] Saved both delivery model artifacts in: {MODELS_DIR}")


if __name__ == "__main__":
    train_delay_prediction_model()
    train_food_recommender()
    train_delivery_models()
    print("\n" + "="*65)
    print("🎉 ALL 3 MACHINE LEARNING PIPELINES TRAINED & SAVED SUCCESSFULLY!")
    print("="*65)
