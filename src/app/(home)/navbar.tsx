"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { UserButton } from "../../components/user-component"
import OrganizationSwitcher from "./organization-switcher";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href="/" className="flex gap-2">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
          <div className="text-xl">Docs</div>
        </Link>
      </div>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-[720px] w-full h-[48px] bg-[#F0F4F8] rounded-full animate-pulse" />
        </div>
      }>
        <SearchInput />
      </Suspense>
      <div className="flex gap-3 items-center pl-6">
        <OrganizationSwitcher />
        <UserButton />
      </div>
      <div />
    </nav>
  );
};