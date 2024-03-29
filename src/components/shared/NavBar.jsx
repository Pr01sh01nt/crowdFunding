

import MenuButton from "../MenuButton";
import Wallet from "../Wallet"

const NavBar = () => {

  const handleClick = () => {

  }

  return (
    <>
      <nav className="flex items-center justify-between">
        <span className="pl-2">Logo</span>
        <MenuButton/>
        <Wallet />

      </nav>
    </>
  )
}

export default NavBar
