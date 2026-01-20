const StoreSettings = require("../models/StoreSettings");

async function getStoreSettings(req, res) {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({ orderingOpen: true, closedMessage: "" });
    }
    return res.json(settings);
  } catch {
    return res.status(500).json({ error: "Failed to load store settings" });
  }
}

async function updateStoreSettings(req, res) {
  try {
    const { orderingOpen, closedMessage } = req.body;

    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({ orderingOpen: true, closedMessage: "" });
    }

    if (orderingOpen !== undefined) settings.orderingOpen = Boolean(orderingOpen);
    if (closedMessage !== undefined) settings.closedMessage = String(closedMessage);

    await settings.save();
    return res.json(settings);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { getStoreSettings, updateStoreSettings };