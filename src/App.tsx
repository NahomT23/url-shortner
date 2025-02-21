import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AppLayout from "./Layouts/app-layout"
import Auth from "./pages/auth"
import Dashboard from "./pages/dashboard"
import LandingPage from "./pages/LandingPage"
import Link from "./pages/link"
import RedirectLink from "./pages/redirectLink"
import UrlProvider from './context'
import RequireAuth from './components/require-auth'


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
        element:(
          <RequireAuth>
            <Dashboard/>
          </RequireAuth>
        )
      },

      {
        path: '/auth',
        element:<Auth/>
      },

      {
        path: '/link/:id',
        element:(
          <RequireAuth>
            <Link/>
          </RequireAuth>
        )
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
