require("dotenv").config();
const mongoose = require("mongoose");

// We need the models to seed data
// Since they aren't fully defined in my view, I'll need to check the schema first or just create dummy entries if they exist
// Let's require them
const Notice = require("./models/notice");
const Issue = require("./models/issue");
const LostItem = require("./models/lostitem");
const FoundItem = require("./models/founditem");

const dbUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus";
mongoose.connect(dbUrl)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch(err => console.log("MongoDB connection error:", err));

async function seedDB() {
    try {
        console.log("Clearing old data...");
        await Notice.deleteMany({});
        await Issue.deleteMany({});
        await LostItem.deleteMany({});
        await FoundItem.deleteMany({});

        console.log("Adding notices...");
        await Notice.create([
            {
                title: "Mid-Semester Examinations 2026",
                description: "The mid-semester examinations for all B.Tech students will commence from the 15th of next month. Please check the department notice board for the detailed schedule.",
                category: "Academic",
                date: new Date()
            },
            {
                title: "Hostel Maintenance Scheduled",
                description: "Routine maintenance and water tank cleaning will occur this weekend in the Nilgiri hostel. Water supply may be interrupted between 10 AM and 2 PM.",
                category: "Hostel",
                date: new Date()
            },
            {
                title: "Techfusion '25 Winners Announced!",
                description: "Congratulations to all the participants and winners of Techfusion '25. The certificate distribution ceremony is scheduled for Friday evening at the main auditorium.",
                category: "Event",
                date: new Date()
            }
        ]);

        console.log("Adding issues...");
        await Issue.create([
            {
                title: "Wi-Fi not working on the 2nd Floor",
                description: "The Wi-Fi router on the 2nd floor of Nilgiri hostel has been down since yesterday evening.",
                status: "Pending",
                date: new Date()
            },
            {
                title: "Broken window in Room 104",
                description: "The window pane was shattered during the storm. Needs urgent replacement.",
                status: "In Progress",
                date: new Date()
            }
        ]);

        console.log("Adding lost & found items...");
        await LostItem.create([
            {
                itemName: "Scientific Calculator",
                description: "Casio fx-991EX, lost in the central library reading hall.",
                contact: "9876543210",
                date: new Date(),
                image: "https://images.unsplash.com/photo-1574607383471-5582845c437a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            }
        ]);

        await FoundItem.create([
            {
                itemName: "Titan Wrist Watch",
                description: "Found near the basketball court. Silver chain with a blue dial.",
                contact: "Admin Office",
                date: new Date(),
                image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            }
        ]);

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seedDB();
