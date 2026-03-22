const Event = require("../models/Event");
const { saveFile } = require("../services/fileService");

// Create Event with file upload
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      location,
      registrationEndDate,
      ticketPrice,
      category
    } = req.body;

    const event = new Event({
      title,
      description,
      eventDate,
      location,
      registrationEndDate,
      ticketPrice,
      // Use the multer-uploaded file name, NOT req.body.image
      image: req.file ? req.file.filename : null,
      category,
      admin: req.user?.id
    });

    await event.save();
    await event.populate('image', '-data');

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('image', '-data')
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('image', '-data')
      .populate('admin', 'name email');

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check authorization
    if (event.admin.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this event' });
    }

    const { title, description, eventDate, location, registrationEndDate, ticketPrice, category } = req.body;

    // Update fields if provided
    if (title) event.title = title;
    if (description) event.description = description;
    if (eventDate) event.eventDate = eventDate;
    if (location) event.location = location;
    if (registrationEndDate) event.registrationEndDate = registrationEndDate;
    if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;
    if (category) event.category = category;

    // Handle new image upload
    if (req.file) {
      const fileDoc = await saveFile(req.file, req.user.id, 'event', event._id);
      event.image = fileDoc._id;
    }

    await event.save();
    await event.populate('image', '-data');

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check authorization
    if (event.admin.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};