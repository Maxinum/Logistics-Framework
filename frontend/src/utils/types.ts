export type GenericObject = { [key: string]: any; }; // eslint-disable-line

export type User = {
  _id: string;
  token: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  status: string;
  company: {
    _id: string;
    name: string;
  };
};

export type SignupInfo = {
  email: string;
  name: string;
  surname: string;
  password: string;
  confirmPassword: string;
};

export type Invitation = {
  _id: string;
  email: string;
  invitationDate: string;
  isEmailAcquired: boolean;
  isUserRegistered: boolean;
};

export type ItemLine = {
  item_line: string;
  supplier: string;
  price_20: number;
  price_40: number;
  price_20_usd: number;
  price_40_usd: number;
  currency: number;
  currency_code: string;
};

export type PriceList = {
  _id: string;
  category: "cc-destination" | "inland-carrier" | "forwarder" | "inland-supplier" | "local-charges";
  incoterm: string;
  forwarder?: string;
  final_destination?: string;
  train_station?: string;
  sealine?: string;
  discharge_port?: string;
  inland_carrier: {
    loading_port?: string;
    discharge_port?: string;
  };
  customs: {
    loading_port?: string;
    discharge_port?: string;
  };
  valid_from: string;
  valid_until: string;
  details: ItemLine[];
  activity?: "Active" | "Archive";
  total_price_20_usd: number;
  total_price_40_usd: number;
  senderInformation: string;
  company: string;
};

export type Offer = {
  _id: string;
  loading_port: string;
  final_destination: string;
  discharge_port: string;
  transit_port: string;
  train_station: string;
  country: string;
  forwarder: string;
  sealine: string;
  inland_carrier: {
    loading_port: string;
    discharge_port: string;
  };
  customs: {
    loading_port: string;
    discharge_port: string;
  };
  weight_limit: {
    w_20: number;
    w_40: number;
  };
  duration: string;
  free_days: number;
  mode: string[];
  certificate: string;
  incoterm: string;
  valid_from: string;
  valid_until: string;
  importer: string;
  client: string;
  details: ItemLine[];
  total_price_20_usd: number;
  total_price_40_usd: number;
  activity: string;
  senderInformation: string;
  company: string;
  created_at: string;
  secret_status: boolean;
  priceLists: PriceList[];
};

export type OffersFilter = {
  activities: string[];
  incoterm: string[];
  final_destination: string[];
  country: string[];
  discharge_port: string[];
  "details.supplier": string[];
  loading_port: string[];
};

export type OfferInput = {
  importer: string[];
  client: string[];
  sealine: string[];
  forwarder: string[];
  loading_port: string[];
  discharge_port: string[];
  train_station: string[];
  transit_port: string[];
  certificate: string[];
  final_destination: string[];
  country: string[];
  currencies: string[];
  customs: string[];
  suppliers: string[];
  item_lines: string[];
};

export type FreeInterval = {
  freeIntervals: {
    valid_from: string;
    valid_until: string;
  }[];
  validIntervals: {
    valid_from: string;
    valid_until: string;
  }[];
};