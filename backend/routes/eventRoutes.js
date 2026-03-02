const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/Eventcontroller");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// Get all events (public)
router.get("/", getAllEvents);
router.get("/all", getAllEvents);

// Get single event by ID
router.get("/:id", getEventById);

// Create Event (with image upload)
router.post("/create", auth, upload.single('image'), createEvent);

// Update Event (with optional image upload)
router.put("/:id", auth, upload.single('image'), updateEvent);

// Delete Event
router.delete("/:id", auth, deleteEvent);

module.exports = router;