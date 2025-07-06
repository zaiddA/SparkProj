import json
import math

# --- Configuration & Mock Data ---

# Location Coordinates (Approximate for Delhi, India)
LOCATIONS = {
    "Delhi Warehouse": {"latitude": 28.6139, "longitude": 77.2090}, # Central Delhi
    "Delhi Logistics Hub": {"latitude": 28.5562, "longitude": 77.0999} # Gurugram/Dwarka side for a "hub" feel
}

# Load Mock Customer Data
# Make sure your 'customers.json' file is in the same directory as this script,
# or provide the correct path to it.
try:
    with open("customers.json", "r") as f:
        CUSTOMER_DATA = json.load(f)
except FileNotFoundError:
    print("Error: customers.json not found. Please ensure it's in the same directory as this script.")
    CUSTOMER_DATA = [] # Empty list to prevent further errors
    exit() # Exit if crucial data is missing

# --- Utility Functions ---

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculates the distance between two points on Earth using the Haversine formula.
    Returns distance in kilometers.
    """
    R = 6371  # Radius of Earth in kilometers

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return distance

# --- Module Implementations ---

def reverse_logistics_cost_estimator(cancellation_type):
    """
    Simulates the cost saved by reallocating.
    Hackathon Simplification: Hardcoded values based on cancellation type.
    """
    if cancellation_type == "Pre-dispatch":
        return 100  # Cost of returning to seller from warehouse
    elif cancellation_type == "In-Transit":
        return 300  # Higher cost for diverting a package already out
    elif cancellation_type == "Open Box Return":
        return 0   # Already returned, savings are from avoiding holding costs, not transport
    return 0

def score_customers(eligible_customers_with_dist, item_name, cancellation_type):
    """
    Assigns a score to each eligible customer based on mock ML rules.
    Higher score indicates higher likelihood of acceptance.
    """
    scored_customers = []
    item_category = "Unknown"
    
    # Simple categorization based on item name for mock data
    if "TV" in item_name or "Console" in item_name or "Laptop" in item_name or "Refrigerator" in item_name:
        item_category = "Electronics"
    elif "Speaker" in item_name:
        item_category = "Smart Home"

    for customer, dist in eligible_customers_with_dist:
        score = 0

        # Proximity Score (closer is better, but cap it)
        if dist < 2: score += 50
        elif dist < 5: score += 30
        elif dist < 10: score += 20
        elif dist < 25: score += 10 # For expanded search

        # Item Match Score
        if item_category in customer.get("past_purchases", []):
            score += 40
        # Broad electronics interest if the item is electronic
        elif item_category == "Electronics" and any(cat in customer.get("past_purchases", []) for cat in ["Electronics", "Gaming", "Smart Home"]):
            score += 20

        # Active Delivery Score
        if customer.get("has_active_delivery_nearby", False):
            score += 30

        # Deal Seeker Score (important for Open Box)
        if cancellation_type == "Open Box Return" and customer.get("is_deal_seeker", False):
            score += 50 # Strong preference for deal seekers on open box

        scored_customers.append((customer, score))
    return scored_customers


def predictive_customer_selector(item_name, cancellation_type, origin_location_coords):
    """
    Selects high-likelihood customers using mock ML logic (rule-based scoring).
    Includes dynamic radius expansion for In-Transit cancellations.
    """
    eligible_customers = []
    initial_radius_km = 10
    expanded_radius_km = 25
    current_search_radius = initial_radius_km

    print(f"\n--- Predictive Customer Selector ---")
    print(f"Searching for customers around {origin_location_coords}...")

    # Dynamic Radius Logic for In-Transit
    if cancellation_type == "In-Transit":
        # First, try to find customers within the initial radius
        temp_eligible_initial_radius = []
        for customer in CUSTOMER_DATA:
            dist = haversine_distance(origin_location_coords["latitude"], origin_location_coords["longitude"],
                                       customer["latitude"], customer["longitude"])
            if dist <= initial_radius_km:
                temp_eligible_initial_radius.append((customer, dist))

        # Score these initial candidates
        scored_initial_candidates = score_customers(temp_eligible_initial_radius, item_name, cancellation_type)
        
        # Determine if we need to expand. Simplified check: if fewer than 2 strong candidates (score > 60)
        strong_candidates_count = sum(1 for c, s in scored_initial_candidates if s > 60) # Arbitrary threshold for 'strong'
        
        if strong_candidates_count < 2 and reverse_logistics_cost_estimator(cancellation_type) > 150: # Only expand if it's a high cost to return
            print(f"  No strong candidates within {initial_radius_km}km for In-Transit (high return cost). Expanding search to {expanded_radius_km}km!")
            current_search_radius = expanded_radius_km
        else:
            print(f"  Searching within initial {initial_radius_km}km radius.")
    else:
        print(f"  Searching within {initial_radius_km}km radius.")

    # Now, filter and score customers based on the determined search radius
    for customer in CUSTOMER_DATA:
        dist = haversine_distance(origin_location_coords["latitude"], origin_location_coords["longitude"],
                                   customer["latitude"], customer["longitude"])
        if dist <= current_search_radius:
            eligible_customers.append((customer, dist))

    if not eligible_customers:
        print("  No customers found in the search radius.")
        return []

    # Score all eligible customers
    scored_customers = score_customers(eligible_customers, item_name, cancellation_type)

    # Sort by score (descending) and return top N
    scored_customers.sort(key=lambda x: x[1], reverse=True)
    
    # Print candidates for transparency
    print("\n  Top Potential Customers:")
    for i, (customer, score) in enumerate(scored_customers[:5]): # Show top 5 for debug
        print(f"    {i+1}. {customer['name']} (ID: {customer['customer_id']}) - Score: {score} - Dist: {haversine_distance(origin_location_coords['latitude'], origin_location_coords['longitude'], customer['latitude'], customer['longitude']):.2f}km")

    return scored_customers[:3] # Return top 3 for offer

def dynamic_pricing_engine(original_value, cancellation_type):
    """
    Determines the offer price and coupon based on cancellation type and item value.
    Hackathon Simplification: Conditional logic.
    """
    offer_price = original_value
    coupon_percentage = 0
    message = ""

    print(f"\n--- Dynamic Pricing Engine ---")

    if cancellation_type == "Open Box Return":
        discount_percentage = 0.15  # 15% static discount for open box
        offer_price = original_value * (1 - discount_percentage)
        message = f"(15% Open Box Discount!)"
        print(f"  Item is Open Box. Applying {int(discount_percentage*100)}% discount.")
    elif original_value > 10000:
        coupon_percentage = 0.02 # 2% coupon for high value items
        offer_price = original_value * (1 - coupon_percentage)
        message = f"(with 2% coupon)"
        print(f"  High-value item (Rs. {original_value:,}). Applying {int(coupon_percentage*100)}% coupon.")
    else:
        print(f"  Standard pricing applied for this item.")
    
    return int(offer_price), coupon_percentage, message

# --- Main Execution Flow (Simulated Input) ---

def run_cancellation_scenario(item_name, original_value, cancellation_type, origin_location_name):
    """
    Runs a complete cancellation scenario based on provided inputs.
    """
    print(f"\n=======================================================")
    print(f"🚀 Running Scenario: '{item_name}' (Rs. {original_value:,}) cancelled as '{cancellation_type}' from '{origin_location_name}'")
    print(f"=======================================================\n")

    origin_location_coords = LOCATIONS.get(origin_location_name)
    if not origin_location_coords:
        print(f"Error: Unknown origin location '{origin_location_name}'. Please choose from {list(LOCATIONS.keys())}")
        return

    # 1. Reverse Logistics Cost Estimator
    saved_cost = reverse_logistics_cost_estimator(cancellation_type)
    print(f"\n--- Reverse Logistics Cost Estimator ---")
    print(f"Calculated Reverse Logistics Cost Saved: Rs. {saved_cost:,}")

    # 2. Predictive Customer Selector
    potential_customers_data = predictive_customer_selector(item_name, cancellation_type, origin_location_coords)

    if potential_customers_data:
        top_customer = potential_customers_data[0][0] # Get the top customer's data
        print(f"\n--- Targeted Customer ---")
        print(f"Selected Top Customer for Offer: {top_customer['name']} (ID: {top_customer['customer_id']})")

        # 3. Dynamic Pricing Engine
        offer_price, coupon_pct, pricing_msg = dynamic_pricing_engine(original_value, cancellation_type)
        print(f"Final Offer Price for {item_name}: Rs. {offer_price:,} {pricing_msg}")
        if coupon_pct > 0:
            print(f"  (Customer will receive a {int(coupon_pct*100)}% coupon.)")

        # 4. Communication Simulation
        print(f"\n--- Communication Simulation ---")
        print(f"Simulating SMS/Email to {top_customer['name']}:")
        print(f"  'Hi {top_customer['name']}, great news! Get a {item_name} for just Rs. {offer_price:,}! {pricing_msg} Reply YES to accept.'")
        print("Offer Sent!")

        # 5. Simulated Acceptance & Savings
        print(f"\n--- Simulated Acceptance & Savings ---")
        print(f"🎉 Customer {top_customer['name']} accepted the offer! Item reallocated successfully!")
        print(f"  Total Saved in Reverse Logistics from this reallocation: Rs. {saved_cost:,}")
        print(f"  Revenue generated from this reallocation: Rs. {offer_price:,}")

        # Simulated Feedback
        print(f"\n--- Customer Feedback Module (Simulated) ---")
        print(f"Customer {top_customer['name']} provides feedback: 5 stars (simulated for successful reallocation)")
    else:
        print(f"\n--- Reallocation Outcome ---")
        print(f"No suitable customers found for reallocation based on current criteria.")
        print(f"Item will be returned to inventory or processed accordingly (no immediate reallocation savings).")


# --- DEMO SCENARIOS (Uncomment and run one by one) ---

if __name__ == "__main__":
    print("Welcome to the Walmart Sparkthon Smart Reallocation Model (Console Version)!")

     #Scenario 1: Pre-dispatch Cancellation (Simple Reallocation)
    item_name = "Smart TV"
    original_value = 12000
    cancellation_type = "Pre-dispatch"
    origin_location_name = "Delhi Warehouse"
    run_cancellation_scenario(item_name, original_value, cancellation_type, origin_location_name)

    # Scenario 2: In-Transit Cancellation (Dynamic Hub Reallocation)
    item_name = "Gaming Console"
    original_value = 8000
    cancellation_type = "In-Transit"
    origin_location_name = "Delhi Logistics Hub"
    run_cancellation_scenario(item_name, original_value, cancellation_type, origin_location_name)

    # Scenario 3: Open Box Return (Discounted Offer)
    item_name = "Smart Home Speaker"
    original_value = 5000
    cancellation_type = "Open Box Return"
    origin_location_name = "Delhi Warehouse"
    run_cancellation_scenario(item_name, original_value, cancellation_type, origin_location_name)

    print("\n--- Model Run Complete ---")
    print("You can modify the 'run_cancellation_scenario' inputs above to test different cases.")