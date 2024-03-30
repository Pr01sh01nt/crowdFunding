

import MenuButton from "../MenuButton";
import Wallet from "../Wallet"

const NavBar = () => {

  const handleClick = () => {

  }

  return (
    <>
    <div className="fixed top-0  min-w-full z-10">

      <nav className="flex items-center justify-between">
        <span className="pl-2">Logo</span>
        <MenuButton/>
        <Wallet />

      </nav>
    </div>
    </>
  )
}

export default NavBar
