import React, { useReducer } from "react";
import actions from "./actions";

export const StoreContext = React.createContext("Store");

export const ACTION_TYPES = {
  CHANGE_PROPS: "CHANGE_PROPS"
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_PROPS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const defaultState = {
  user: undefined,
  coins: [],
  userCoins: [],
  exchanges: ["Binance"],
  pairs: {
    Binance: ["ETHBTC", "NEOBTC", "NEOETH", "XRPBTC", "XRPETH", "LTCBTC"]
  },
  intervals: {
    Binance: ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h"]
  },
  filenames: [],
  strategies: [],
  configs: {},
  hypers: {},
  tasks: undefined
};

const Store = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, defaultState);
  return (
    <StoreContext.Provider value={[store, actions(dispatch, ACTION_TYPES)]}>
      {children}
    </StoreContext.Provider>
  );
};

export default Store;
