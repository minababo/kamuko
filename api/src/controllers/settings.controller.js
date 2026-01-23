const StoreSettings = require("../models/StoreSettings");
const { writeAuditLog } = require("../utils/audit");

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

    const previous = {
      orderingOpen: settings.orderingOpen,
      closedMessage: settings.closedMessage,
    };

    if (orderingOpen !== undefined) settings.orderingOpen = Boolean(orderingOpen);
    if (closedMessage !== undefined) settings.closedMessage = String(closedMessage);

    await settings.save();

    await writeAuditLog({
      actorId: req.user._id,
      action: "settings.updated",
      entityType: "StoreSettings",
      entityId: settings._id,
      meta: {
        from: previous,
        to: {
          orderingOpen: settings.orderingOpen,
          closedMessage: settings.closedMessage,
        },
      },
    });

    return res.json(settings);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getStoreSettings,
  updateStoreSettings,
};