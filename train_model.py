import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

df = pd.read_csv("food_waste_data.csv")

df["Waste"] = df["PortionsMade"] - df["StudentsServed"]

le_day = LabelEncoder()
le_menu = LabelEncoder()
le_cat = LabelEncoder()
le_weather = LabelEncoder()

df["DayEncoded"] = le_day.fit_transform(df["Day"])
df["MenuEncoded"] = le_menu.fit_transform(df["Menu"])
df["CatEncoded"] = le_cat.fit_transform(df["MenuCategory"])
df["WeatherEncoded"] = le_weather.fit_transform(df["Weather"])
df["IsHolidayWeek"] = (df["IsHolidayWeek"] == "Yes").astype(int)
df["SpecialEvent"] = (df["SpecialEvent"] == "Assembly").astype(int)

features = ["DayEncoded", "MenuEncoded", "CatEncoded", "PortionsMade",
            "WeatherEncoded", "IsHolidayWeek", "SpecialEvent"]
X = df[features]
y = df["Waste"]

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

joblib.dump(model, "waste_predictor.pkl")
joblib.dump(le_day, "le_day.pkl")
joblib.dump(le_menu, "le_menu.pkl")
joblib.dump(le_cat, "le_cat.pkl")
joblib.dump(le_weather, "le_weather.pkl")

co2_per_serving = 0.43
cost_per_serving = 1.50
avg_waste = df["Waste"].mean()
print(f"Model trained. Avg waste per meal: {avg_waste:.0f} servings")
print(f"CO2 per serving: {co2_per_serving}kg | Cost per serving: ${cost_per_serving:.2f}")
print(f"Annual CO2 impact (avg waste * 180 days): {avg_waste * 180 * co2_per_serving / 1000:.1f} tonnes")
print(f"Annual cost impact (avg waste * 180 days): ${avg_waste * 180 * cost_per_serving:,.0f}")
