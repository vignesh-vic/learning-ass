import { Bell, Menu, User } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';

const Header = ({ toggleSider }) => {

  const user = useSelector((state) => state.auth.user);

  return (
    <header className='sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 '>
      <div className='flex items-center justify-end h-full px-6'>
        <button
          onClick={toggleSider}
          className='md:hidden inline-flex  items-center justify-center w-10 h-10 text-slate-500  hover:text-slate-900  rounded-lg transition duration-150 ease-in-out'
          aria-label='Toggle sidebar'
        >
          <Menu />

        </button>

        <div className='hidden md:block ml-4'>

          <div className='flex items-center  gap-3'>

            <button className='relative inline-flex items-center justify-center w-10 h-10 text-slate-500 hover:text-slate-900 rounded-lg transition-all duration-200 ease-in-out'>
              <Bell size={20} strokeWidth={2} className='group-hover:scale-110  transition:transform duration-200' />
              <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white'></span>
            </button>


            <div className='flex items-center  gap-3 pl-3 border-l border-slate-200/60'>
              <div className='flex items-center justify-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors duration-200 ease-in-out cursor-pointer group'>
                <div className='w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center  text-white  shadow-md  shadow-emerald-500/25 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-200 ease-in-out'>
                  <User size={18} strokeWidth={2.5} />
                </div>
              </div>
              <p className='text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors duration-200 '>
                {user?.usename || 'User'}
              </p>
              <p className='text-sm text-slate-500 group-hover:text-slate-700 transition-colors duration-200 ease-in-out'>
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header
