// router/Router.jsx
import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../Home/Home2/Home";
import Login from '../page/login/Login'
import Register from "../page/registration/Register";
import SendMoney from '../Home/SendMoney'
import CashOut from "../Home/CashOut";
import CashIn from "../Home/CashIn";
import Balance from "../Home/Balance";
import TranjectionForUser from "../Home/TranjectionForUser";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/sendMoney',
        element: <SendMoney />
      },
      {
        path: '/cashOut',
        element: <CashOut />
      },
      {
        path: '/cashIn',
        element: <CashIn />
      },
      {
        path: '/balance',
        element: <Balance />
      },
      {
        path: '/userHistory',
        element: <TranjectionForUser />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Register />
      },
    ]
  }
]);
