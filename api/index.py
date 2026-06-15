from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import numpy as np
import joblib
import os

app = FastAPI()

templates = Jinja2Templates(directory="templates")

MODEL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(MODEL_DIR, "waste_predictor.pkl"))
le_day = joblib.load(os.path.join(MODEL_DIR, "le_day.pkl"))
le_menu = joblib.load(os.path.join(MODEL_DIR, "le_menu.pkl"))
le_cat = joblib.load(os.path.join(MODEL_DIR, "le_cat.pkl"))
le_weather = joblib.load(os.path.join(MODEL_DIR, "le_weather.pkl"))

CO2_PER_SERVING = 0.43
COST_PER_SERVING = 1.50

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
MENU_ITEMS = ["ChickenTenders", "Pizza", "Burger", "SaladBar", "FishSticks", "Pasta"]
MENU_CATEGORIES = {
    "ChickenTenders": "HotMeal", "Pizza": "HotMeal", "Burger": "HotMeal",
    "SaladBar": "Vegetarian", "FishSticks": "HotMeal", "Pasta": "Vegetarian"
}
WEATHER = ["Sunny", "Cloudy", "Rainy"]

MONTHLY_MULTIPLIER = 20
YEARLY_MULTIPLIER = 180

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "days": DAYS,
        "menu_items": MENU_ITEMS,
        "weather_options": WEATHER,
        "result": None
    })

@app.post("/", response_class=HTMLResponse)
async def predict(
    request: Request,
    day: str = Form(...),
    menu: str = Form(...),
    portions: int = Form(...),
    weather: str = Form(...),
    holiday: str = Form("no"),
    special: str = Form("no")
):
    is_holiday = 1 if holiday == "yes" else 0
    is_special = 1 if special == "yes" else 0
    category = MENU_CATEGORIES.get(menu, "HotMeal")

    try:
        day_enc = le_day.transform([day])[0]
        menu_enc = le_menu.transform([menu])[0]
        cat_enc = le_cat.transform([category])[0]
        weather_enc = le_weather.transform([weather])[0]
    except:
        day_enc = le_day.transform([day])[0]
        menu_enc = 0
        cat_enc = 0
        weather_enc = 0

    features = np.array([[day_enc, menu_enc, cat_enc, portions, weather_enc, is_holiday, is_special]])
    predicted_waste = model.predict(features)[0]
    predicted_waste = max(0, int(round(predicted_waste)))

    students_fed = portions - predicted_waste
    cost_wasted = round(predicted_waste * COST_PER_SERVING, 2)
    co2_wasted = round(predicted_waste * CO2_PER_SERVING, 2)
    waste_rate = round((predicted_waste / portions) * 100, 1)

    recommended = max(50, int(portions - predicted_waste * 0.7))
    rec_cost_saved = round((portions - recommended) * COST_PER_SERVING, 2)
    rec_co2_saved = round((portions - recommended) * CO2_PER_SERVING, 2)

    monthly_saved = round((portions - recommended) * COST_PER_SERVING * MONTHLY_MULTIPLIER, 2)
    monthly_co2 = round((portions - recommended) * CO2_PER_SERVING * MONTHLY_MULTIPLIER / 1000, 3)
    yearly_saved = round((portions - recommended) * COST_PER_SERVING * YEARLY_MULTIPLIER, 2)
    yearly_co2 = round((portions - recommended) * CO2_PER_SERVING * YEARLY_MULTIPLIER / 1000, 2)

    if waste_rate > 30:
        alert = "high"
        alert_text = "High Waste Alert"
    elif waste_rate > 15:
        alert = "moderate"
        alert_text = "Moderate Waste"
    else:
        alert = "low"
        alert_text = "Low Waste"

    result = {
        "day": day, "menu": menu, "portions": portions, "weather": weather,
        "holiday": "Yes" if is_holiday else "No",
        "special": "Yes" if is_special else "No",
        "predicted_waste": predicted_waste,
        "students_fed": students_fed,
        "cost_wasted": cost_wasted,
        "co2_wasted": co2_wasted,
        "waste_rate": waste_rate,
        "alert": alert,
        "alert_text": alert_text,
        "recommended": recommended,
        "rec_cost_saved": rec_cost_saved,
        "rec_co2_saved": rec_co2_saved,
        "monthly_saved": monthly_saved,
        "monthly_co2": monthly_co2,
        "yearly_saved": yearly_saved,
        "yearly_co2": yearly_co2,
        "annual_food_saved": (portions - recommended) * YEARLY_MULTIPLIER
    }

    return templates.TemplateResponse("index.html", {
        "request": request,
        "days": DAYS,
        "menu_items": MENU_ITEMS,
        "weather_options": WEATHER,
        "result": result
    })
