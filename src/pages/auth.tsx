import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Auth = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className="mt-6 flex flex-col items-center gap-10 ">
      <h1 className="text-5xl flex flex-col items-center gap-10 text-white">
        {searchParams.get("createNew")
          ? "Hold up! Let's login first.."
          : "Login / Signup"}
      </h1>
      
      <Tabs defaultValue="login" className="w-[400px] text-white border-white">
        <TabsList className="grid w-full grid-cols-2">
          {/* Make sure the trigger values match the content values */}
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        {/* Matching content values */}
        <TabsContent className="text-white" value="login">
          <Login/>
        </TabsContent>
        <TabsContent className="text-white" value="signup">
          <Signup/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
