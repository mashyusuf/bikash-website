import { useState } from "react";
import { Link } from "react-router-dom";
import { BiTransfer, BiMoney } from 'react-icons/bi'; 
import { BsCashCoin } from "react-icons/bs";
import Balance from "../Balance";
import { TbCoinTakaFilled } from "react-icons/tb";
import { TfiMenuAlt } from "react-icons/tfi";

const Home = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [balanceVisible, setBalanceVisible] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const toggleBalance = () => {
        setBalanceVisible(!balanceVisible);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`drawer drawer-end bg-gray-200 lg:w-72 lg:block ${drawerOpen ? 'block' : 'hidden'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 bg-gray-300">
                        <h2 className="text-xl font-bold">Sidebar</h2>
                        {/* Close button hidden on md and lg screens */}
                        <button className={`mt-2 btn btn-primary lg:hidden ${drawerOpen ? 'block' : 'hidden'}`} onClick={toggleDrawer}>Close</button>
                    </div>
                    <ul className="flex-1 menu p-4">
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signUp">Registration</Link></li>
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Top Bar with Balance */}
                <div className="px-10 py-4 bg-slate-900 flex justify-center items-center">
                    <h1 className="text-white text-center">
                        {balanceVisible ? (
                            <Balance amount="5000" color="text-green-500" />
                        ) : (
                            <div className="flex justify-center items-center space-x-2 bg-orange-600 px-2 py-2 rounded-xl cursor-pointer" onClick={toggleBalance}>
                                <TbCoinTakaFilled className="w-8 h-8" />
                                <span>Your Balance</span>
                            </div>
                        )}
                    </h1>
                </div>

                {/* Buttons with Links */}
                <div className="p-8 flex flex-col items-center space-y-4 sm:flex-row sm:justify-around">
                    <Link to="/sendMoney" className="text-blue-500 hover:text-blue-600 sm:text-center">
                        <button className="btn btn-outline btn-info flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-110 sm:w-full">
                            <BiTransfer className="w-8 h-8" />
                            Send Money
                        </button>
                    </Link>
                    <Link to="/cashOut" className="text-green-500 hover:text-green-600 sm:text-center">
                        <button className="btn btn-outline btn-success flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-110 sm:w-full">
                            <BiMoney className="w-8 h-8" />
                            Cash Out
                        </button>
                    </Link>
                    <Link to="/cashIn" className="text-yellow-500 hover:text-yellow-600 sm:text-center">
                        <button className="btn btn-outline btn-warning flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-110 sm:w-full">
                            <BsCashCoin className="w-8 h-8" />
                            Cash In
                        </button>
                    </Link>
                </div>
            </div>

            {/* Toggle button for small screens */}
            <label htmlFor="my-drawer-4" className="drawer-button px-4 lg:hidden" onClick={toggleDrawer}>
                <TfiMenuAlt className="text-xl h-full" />
            </label>

            {/* Overlay for closing sidebar on small screens */}
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className={`drawer-overlay lg:hidden ${drawerOpen ? 'block' : 'hidden'}`} onClick={toggleDrawer}></label>
        </div>
    );
};

export default Home;
