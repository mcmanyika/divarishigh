"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../lib/utils";
import {
  NavigationMenu as Nav,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";
import { GraduationCap } from "lucide-react";

export function NavigationMenu() {
  return (
    <div className="fixed w-full bg-white/80 dark:bg-background/80 backdrop-blur-sm z-50 border-b border-blue-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Nav className="py-4">
          <NavigationMenuList>
            <NavigationMenuItem className="mr-4">
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={cn("flex items-center space-x-2", navigationMenuTriggerStyle())}>
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Divaris Makaharis School</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/about" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Our Story</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Learn about our history, mission, and values</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/faculty" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Faculty</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Meet our world-class educators</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </Nav>
      </div>
    </div>
  );
}