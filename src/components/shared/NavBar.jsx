

import MenuButton from "../MenuButton";
import Wallet from "../Wallet"

const NavBar = () => {


  return (
    <>
      <div className="fixed top-0  min-w-full z-10 bg-slate-400">

        <nav className="flex items-center justify-between">
          <img src="/assests/logo.png" className="pt-2" alt="logo" />
          <MenuButton />
          <Wallet />

        </nav>
      </div>
    </>
  )
}

export default NavBar
