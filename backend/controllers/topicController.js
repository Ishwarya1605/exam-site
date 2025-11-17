const Topic = require("../models/topic");
const Subject = require("../models/subject");


const createTopic = async (req, res) => {
  try {
    const { subjectId, topic, description } = req.body;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const newTopic = new Topic({
      subject: subjectId,
      topic,
      description,
    });

    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMultipleTopics = async (req, res) => {
  try {
    const { subjectId, topics } = req.body;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const topicDocs = topics.map((t) => ({
      subject: subjectId,
      topic: t.topic,
      description: t.description || "",
    }));

    const created = await Topic.insertMany(topicDocs);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTopicsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const topics = await Topic.find({ subject: subjectId }).populate("subject", "name");

    if (!topics.length) {
      return res.status(404).json({ message: "No topics found for this subject" });
    }

    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const topic = await Topic.findById(topicId).populate("subject", "name");

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    res.status(200).json(topic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


const updateTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { topic, description } = req.body;

    const updatedTopic = await Topic.findByIdAndUpdate(
      topicId,
      { topic, description },
      { new: true, runValidators: true }
    );

    if (!updatedTopic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    res.status(200).json(updatedTopic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const deletedTopic = await Topic.findByIdAndDelete(topicId);

    if (!deletedTopic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate("subject", "subject");
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch topics", error });
  }
};

module.exports = {
  createTopic,
  createMultipleTopics,
  getTopicsBySubject,
  getTopic,
  updateTopic,
  deleteTopic,
  getAllTopics,
};
