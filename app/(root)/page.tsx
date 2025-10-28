// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constant/route";


// } from "@/components/ui/dropdown-menu";
const Home = async () => {
  const session = await auth();
  console.log(session);
  return (
    <>
      <h1 className="font-inter h1-bold">
        Hello ,welcome to God-Nyxen World🤭
      </h1>
      <form
        className="px-10 pt-[100px]"
        action={async () => {
          "use server";

          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button type="submit">Log out</Button>
      </form>
    </>
  );
};

export default Home;
