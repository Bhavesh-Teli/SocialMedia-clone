import React from 'react'
import SignUp from './components/SignUp'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
