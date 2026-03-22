// Choudhary Automobile - MongoDB Schema Initialization Script
// Run this in mongosh or your MongoDB Compass console

use bikeYamahaDB

// 1. Master Customers Collection
// Stores the unique identity of every person who interacts with the showroom
db.createCollection("customers")
db.customers.createIndex({ "phone": 1 }, { unique: true })

// 2. Inquiries Collection
// Stores raw interest (test rides, price requests, EMI info)
db.createCollection("inquiries")

// 3. Leads Collection
// Stores qualified sales prospects (customers moving towards a purchase)
db.createCollection("leads")

// 4. Service Bookings Collection
// Stores post-purchase workshop requests
db.createCollection("service_bookings")

// 5. Bikes Collection (Inventory)
// Stores vehicle details and current stock levels
db.createCollection("bikes")
db.bikes.createIndex({ "name": 1 }, { unique: true })

// 6. Ads Collection
// Stores digital campaign metadata and impact tracking
db.createCollection("ads")

// 7. Workshop Slots Collection
// Manages daily capacity for service appointments
db.createCollection("workshop_slots")
db.workshop_slots.createIndex({ "date": 1, "slotTime": 1 }, { unique: true })

print("--------------------------------------------------")
print("Choudhary Automobile Database Schema Expanded.")
print("Collections: Customers, Inquiries, Leads, Services, Bikes, Ads, Slots")
print("--------------------------------------------------")
