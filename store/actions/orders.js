import moment from "moment";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const { userId } = getState().auth;
    try {
      const response = await fetch(
        `https://react-native-shop-ca7fe.firebaseio.com/orders/${userId}.json`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();

      const loadedOrders = Object.keys(resData).map(item => ({
        id: item,
        items: resData[item].cartItems,
        totalAmount: resData[item].totalAmount,
        date: moment(new Date(resData[item].date)).format("MMMM Do YYYY, hh:mm")
      }));

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth;
    const { userId } = getState().auth;
    const date = new Date();
    const response = await fetch(
      `https://react-native-shop-ca7fe.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date
      }
    });
  };
};
