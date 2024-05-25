/* eslint-disable jsx-a11y/anchor-is-valid */
"use client";
import { useContext, type FC } from "react";
import { DarkThemeToggle, Label, Navbar, TextInput } from "flowbite-react";
import { HiMenuAlt1, HiSearch, HiX } from "react-icons/hi";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import Image from "next/image";
import { useKaprodiContext } from "@/context/KaprodiProviders";
import DSSelect from "./DSSelect";

type ResponseType = {
  [key: string]: string;
};

const ExampleNavbar = function ({
  listKaprodi,
}: {
  listKaprodi: ResponseType;
}) {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();

  const { kaprodi, setKaprodi } = useKaprodiContext();

  return (
    <Navbar fluid>
      <div className="w-full py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens && isSmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <Navbar.Brand href="/">
              <span className="self-center whitespace-nowrap text-2xl font-semibold text-gray-800 dark:text-white">
                Digital Signature
              </span>
            </Navbar.Brand>
            <form className="ml-16 hidden md:block">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <DSSelect
                id="bits"
                options={listKaprodi}
                onChange={(e) => setKaprodi(parseInt(e.target.value))}
                value={kaprodi}
                placeholder="Pilih Ketua Program Studi"
                required
              />
            </form>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              >
                <span className="sr-only">Search</span>
                <HiSearch className="h-6 w-6" />
              </button>
              <DarkThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
