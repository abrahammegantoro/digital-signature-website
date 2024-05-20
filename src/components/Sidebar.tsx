import classNames from "classnames";
import { Dropdown, Sidebar, TextInput, Tooltip } from "flowbite-react";
import type { FC } from "react";
import React from "react";
import { HiAdjustments, HiCog, HiSearch } from "react-icons/hi";

import { useSidebarContext } from "@/context/SidebarContext";
import isSmallScreen from "@/helpers/is-small-screen";
import { SidebarGroup, SidebarItem, sidebarItems } from "@/constant/navs";
import { usePathname } from "next/navigation";

const isSidebarGroup = (
    item: SidebarItem | SidebarGroup
): item is SidebarGroup => {
    return (item as SidebarGroup).items !== undefined;
};

const renderSidebarItems = (items: (SidebarItem | SidebarGroup)[], parent?: SidebarGroup) => {
    return items.map((item, index) => {
        const pathname = usePathname()
        const route = (item as SidebarItem).href === pathname ? item : undefined;
        return (
            <React.Fragment key={index}>
                {isSidebarGroup(item) ? (
                    <Sidebar.Collapse icon={item.icon} label={item.label || item.title}>
                        {renderSidebarItems(item.items, item)}
                    </Sidebar.Collapse>
                ) : (
                    <Sidebar.Item
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        badge={item.badge}
                    >
                        {item.title || route?.title}
                    </Sidebar.Item>
                )}
            </React.Fragment>
        );
    });
};

const ExampleSidebar: FC = function () {
    const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
        useSidebarContext();

    return (
        <div
            className={classNames("lg:!block h-screen", {
                hidden: !isSidebarOpenOnSmallScreens,
            })}
        >
            <Sidebar
                aria-label="Sidebar with multi-level dropdown example"
                collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
            >
                <div className="flex h-full flex-col justify-between py-2">
                    <div>
                        <form className="pb-3 md:hidden">
                            <TextInput
                                icon={HiSearch}
                                type="search"
                                placeholder="Search"
                                required
                                size={32}
                            />
                        </form>
                        <Sidebar.Items>
                            <Sidebar.ItemGroup>{renderSidebarItems(sidebarItems)}</Sidebar.ItemGroup>
                        </Sidebar.Items>
                    </div>
                </div>
            </Sidebar>
        </div>
    );
};

export default ExampleSidebar;