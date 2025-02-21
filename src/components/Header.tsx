import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logo.webp";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOutIcon } from "lucide-react";
import { useUrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { Logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";

const Header = () => {

    const navigate = useNavigate()
    
    const { user, fetchUser } = useUrlState()

    const { loading, fn: fnLogout } = useFetch(Logout)

  return (
    <>
    <nav className="py-4 flex justify-between items-center">
      <Link to="/" className="ml-10">
        <img src={logo} alt="Logo" className="h-20"/>
      </Link>


      <div className="mr-20">
        {!user ?
                <Button onClick={() => navigate('/auth')} variant="outline" className="text-white">
                Login
            </Button>
            :
            (
                <DropdownMenu >
  <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden" >
  <Avatar>
  <AvatarImage src={user?.user_metadata?.profile_pic} className="object-contain" />
  <AvatarFallback className="text-gray-300">NT</AvatarFallback>
</Avatar>

  </DropdownMenuTrigger>
  <DropdownMenuContent className="text-white">
    <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
    <hr className="text-gray-400"/>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
        <Link to={"/dashboard"} className="flex">
        <LinkIcon className="mr-2 h-4 w-4"/>
        My Links
        </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
  className="text-red-400" 
  onClick={() => {
    fnLogout().then(() => {
      fetchUser();  
      navigate("/"); 
    });
  }}
>
  <LogOutIcon className="mr-2 h-4 w-4" />
  Logout
</DropdownMenuItem>


  </DropdownMenuContent>
</DropdownMenu>

            )

    }
      </div>
    </nav>
          {loading && <BarLoader className="mb-4" width={"100%"} color={"#36d7b7"} />}
        </>
  );
};

export default Header;
