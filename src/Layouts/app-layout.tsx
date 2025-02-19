import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const AppLayout = () => {
  return (
    <div>
        
      <main className='min-h-screen '>
        <Header/>
        <Outlet/>
      </main>

      <div className='p-10 text-center bg-gray-800 mt-10 text-gray-400'>
        made by nahom
      </div>
    </div>
  )
}

export default AppLayout
