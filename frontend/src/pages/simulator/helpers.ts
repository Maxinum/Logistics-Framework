import { Offer } from "../../utils/types";

/**
 * Get an array of suppliers with calculated total prices
 */
export const getOfferSuppliers = (offer: Offer) => {
  const itemLines = offer.details;
  const suppliers = new Map<string, number>();

  itemLines.forEach(itemLine => {
    const { supplier, price_20_usd, price_40_usd } = itemLine;
    const itemLinePrice = Math.round(price_20_usd + price_40_usd);

    if (suppliers.has(supplier)) {
      suppliers.set(supplier, itemLinePrice + (suppliers.get(supplier) || 0));
    } else {
      suppliers.set(supplier, itemLinePrice);
    }
  });

  return Array.from(suppliers, ([supplier, price_usd]) => {
    return { supplier, price_usd };
  });
};

/**
 * Get the path of an offer in the from of an array where
 * each object is an intermediate location of an offer
 */
export const getOfferPath = (offer: Offer) => {
  const { transit_port, discharge_port, train_station } = offer;
  const path = [];

  if (transit_port && transit_port !== "-") {
    path.push({ name: transit_port, isInLand: false, label: "Port of transit" });
  }
  if (discharge_port && discharge_port !== "-") {
    path.push({ name: discharge_port, isInLand: false, label: "Port of discharge" });
  }
  if (train_station && train_station !== "-") {
    path.push({ name: train_station, isInLand: true, label: "Train station" });
  }

  return path;
};

/**
 * Update single offer's item line prices by multiplying
 * those prices with the provided number of containers
 */
export const multiplyOfferPrices = (offer: Offer, num20: number, num40: number): Offer => {
  return {
    ...offer,
    total_price_20_usd: offer.total_price_20_usd * num20,
    total_price_40_usd: offer.total_price_40_usd * num40,
    weight_limit: {
      w_20: offer.weight_limit.w_20 * num20,
      w_40: offer.weight_limit.w_40 * num40,
    },
    details: offer.details.map(itemLine => ({
      ...itemLine,
      price_20: itemLine.price_20 * num20,
      price_40: itemLine.price_40 * num40,
      price_20_usd: itemLine.price_20_usd * num20,
      price_40_usd: itemLine.price_40_usd * num40,
    })),
    priceLists: offer.priceLists.map(priceList => ({
      ...priceList,
      details: priceList.details.map(itemLine => ({
        ...itemLine,
        price_20: itemLine.price_20 * num20,
        price_40: itemLine.price_40 * num40,
        price_20_usd: itemLine.price_20_usd * num20,
        price_40_usd: itemLine.price_40_usd * num40,
      })),
    }))
  };
};