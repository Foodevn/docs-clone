import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
// import { useNavigate } from "react-router";
import { useRouter } from "next/router";

const Logout = () => {
  const { signOut } = useAuthStore();
  const route = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      route.push("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
