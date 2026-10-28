
const Tabs = ({
    tabs,
    activeTab, 
    setActiveTab

}) => {
    console.log("tabs", tabs, activeTab)
    return (
        <div className='w-full '>
            <div className='relative'>
                <nav>
                    {

                        tabs?.map((tab) => (
                            <button
                                key={tab?.name}
                                onClick={() => setActiveTab(tab?.name)}
                                className={`relative pb-4 px-6 text-sm  font-semibold  transition-all duration-200 ${activeTab === tab?.name ? 'text-emerald-600' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                <span className=''>
                                    {tab.label}


                                </span>

                                {activeTab === tab.name && (
                                    <div className='' />
                                )}
                                    
                                {activeTab === tab.name && (
                                    <div className='' />
                                )}
                            </button>
                        ))
                    }

                </nav>
            </div>

            <div>
                {tabs?.map((tab)=>{
                    if(tab.name===activeTab){
                        return (
                            <div key={tab.name} className=''>
                                {tab?.content}
                            </div>
                        )
                    }
                    return null
                })}
            </div>


        </div>
    )
}

export default Tabs
