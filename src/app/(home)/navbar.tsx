import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { UserButton } from "../../components/user-component"
import OrganizationSwitcher from "./organization-switcher";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();



  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
          <h3 className="text-xl">Docs</h3>
        </Link>
      </div>
      <SearchInput />
      <div className="flex gap-3 items-center pl-6">
        <OrganizationSwitcher />
        <UserButton />
      </div>
      <div />
    </nav>
  );
};