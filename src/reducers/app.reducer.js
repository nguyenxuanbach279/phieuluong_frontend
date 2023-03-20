const initialState = {
  jwtToken: null,
  loginUser: null,
  indexItem: 0,
  accountInfo: null,
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_JWT_TOKEN_ACTION":
      return {
        ...state,
        jwtToken: action.jwtToken,
      };
    case "SET_LOGIN_USER_ACTION":
      return {
        ...state,
        loginUser: action.loginUser,
      };
    case "SET_CHOOSE_SIDEBAR_ITEM":
      return {
        ...state,
        indexItem: action.indexItem,
      };
    case "SET_ACCOUNT_INFO":
      return {
        ...state,
        accountInfo: action.accountInfo,
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};
