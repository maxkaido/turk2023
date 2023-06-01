import { createStore, applyMiddleware } from "redux";
import { createWrapper } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";

const reducer = (
  state = {
    /* initial state */
  },
  action
) => {
  switch (action.type) {
    // Define your reducers here...
    default:
      return state;
  }
};

const initStore = () => {
  return createStore(reducer, applyMiddleware(thunkMiddleware));
};

export const wrapper = createWrapper(initStore);
