export const appReducer = (state, action) => {
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
    default:
      return state;
  }
};
