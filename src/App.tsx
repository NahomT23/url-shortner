import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AppLayout from "./Layouts/app-layout"
import Auth from "./pages/auth"
import Dashboard from "./pages/dashboard"
import LandingPage from "./pages/LandingPage"
import Link from "./pages/link"
import RedirectLink from "./pages/redirectLink"
import UrlProvider from './context'


const router = createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
      {
        path: '/',
        element:<LandingPage/>
      },

      {
        path: '/dashboard',
        element:<Dashboard/>
      },

      {
        path: '/auth',
        element:<Auth/>
      },

      {
        path: '/link/:id',
        element:<Link/>
      },

      {
        path: '/:id',
        element:<RedirectLink/>
      }

    ]
  }
])

function App() {
  
  return (    
    <UrlProvider>
        <div style={{ backgroundColor: "rgb(55, 65, 74)" }}>
          <RouterProvider router={router} />
        </div>
    </UrlProvider>

  )
}

export default App
