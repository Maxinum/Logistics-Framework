const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  loading_port: {
    type: String,
    required: [true, "Port of Loading have to be provided"],
    trim: true,
    maxlength: 50,
  },
  final_destination: {
    type: String,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  discharge_port: {
    type: String,
    required: [true, "Port of Discharge have to be provided"],
    trim: true,
    maxlength: 50,
  },
  transit_port: {
    type: String,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  point_of_shipment: {
    type: String,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  train_station: {
    type: String,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  country: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  forwarder: {
    type: String,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  sealine: {
    type: String,
    required: [true, "Sealine have to be provided"],
    trim: true,
    maxlength: 50,
  },
  inland_carrier: {
    loading_port: {
      type: String,
      trim: true,
      default: "-",
      maxlength: 50,
    },
    discharge_port: {
      type: String,
      trim: true,
      default: "-",
      maxlength: 50,
    },
  },
  customs: {
    loading_port: {
      type: String,
      trim: true,
      default: "-",
      maxlength: 50,
    },
    discharge_port: {
      type: String,
      trim: true,
      default: "-",
      maxlength: 50,
    },
  },
  weight_limit: {
    w_20: {
      type: Number,
      trim: true,
      default: 0,
      maxlength: 50,
    },
    w_40: {
      type: Number,
      trim: true,
      default: 0,
      maxlength: 50,
    },
  },
  valid_from: {
    type: Date,
    trim: true,
    required: [true, "Valid from have to be provided"],
  },
  valid_until: {
    type: Date,
    trim: true,
    required: [true, "Valid until have to be provided"],
  },
  duration: {
    type: String,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  free_days: {
    type: Number,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  mode: [
    {
      type: String,
      trim: true,
      default: "-",
      maxlength: 50,
    },
  ],
  certificate: {
    type: String,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  incoterm: {
    type: String,
    required: [true, "Incoterm have to be provided"],
    enum: ["DAP", "CIF", "EXW", "FOB"],
    trim: true,
    maxlength: 50,
  },
  importer: {
    type: String,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  client: {
    type: String,
    trim: true,
    default: "-",
    maxlength: 50,
  },
  details: {
    type: [
      {
        item_line: {
          type: String,
          trim: true,
          required: [true, "Item line have to be provided"],
          maxlength: 50,
        },
        supplier: {
          type: String,
          trim: true,
          required: [true, "Supplier have to be provided"],
          maxlength: 50,
        },
        price_20: {
          type: Number,
          trim: true,
          required: [true, "Price 20 have to be provided"],
          maxlength: 50,
        },
        price_40: {
          type: Number,
          trim: true,
          required: [true, "Price 40 have to be provided"],
          maxlength: 50,
        },
        currency_code: {
          type: String,
          default: "USD",
          trim: true,
          maxlength: 50,
        },
        per: {
          type: Boolean,
        },
      },
    ],
    required: [true, "Details must contain at least one item line"],
    validate: [
      {
        validator: function (details) {
          const itemLines = details.map((detail) => detail.item_line);
          return itemLines.length === [...new Set(itemLines)].length;
        },
        message: "Item line must be unique within the same document",
      },
      {
        validator: function (details) {
          return (
            details.length > 0 && details.some((detail) => detail.item_line)
          );
        },
        message: "Details must contain at least one item line",
      },
    ],
  },
  activity: {
    type: String,
    trim: true,
    enum: ["Active", "Archived"],
    default: "Active",
  },
  created_at: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  secret_status: {
    type: Boolean,
    default: false,
    select: false,
  },
  duration_sum: {
    type: Number,
  },
  total_price: {
    price_20: {
      type: Number,
    },
    price_40: {
      type: Number,
    },
  },
  update_history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "offer_histories",
    },
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: true,
  },
  senderInformation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

schema.pre("save", async function (next) {
  const [leftOp, rightOp] = this.duration.split("+");
  if (rightOp) {
    this.duration_sum = Number(leftOp) + Number(rightOp);
  } else {
    this.duration_sum = Number(leftOp);
  }
  next();
});

const offerData = mongoose.model("data_entry", schema);

module.exports = offerData;
