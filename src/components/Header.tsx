import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logo.webp";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOutIcon } from "lucide-react";

const Header = () => {

    const navigate = useNavigate()
    const user = false

  return (
    <nav className="py-4 flex justify-between items-center">
      <Link to="/" className="ml-10">
        <img src={logo} alt="Logo" className="h-20"/>
      </Link>


      <div className="mr-10">
        {!user ?
                <Button onClick={() => navigate('/auth')} variant="outline" className="text-white">
                Login
            </Button>
            :
            (
                <DropdownMenu >
  <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden" >
  <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback className="text-gray-300">NT</AvatarFallback>
</Avatar>

  </DropdownMenuTrigger>
  <DropdownMenuContent className="text-white">
    <DropdownMenuLabel>Nahom Tsegaye</DropdownMenuLabel>
    <hr className="text-gray-400"/>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
        <LinkIcon className="mr-2 h-4 w-4"/>
        My Links
        </DropdownMenuItem>
    <DropdownMenuItem className="text-red-400 ">
        <LogOutIcon className="mr-2 h-4 w-4"/>
        Logout
        </DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu>

            )

    }
      </div>
    </nav>
  );
};

export default Header;
