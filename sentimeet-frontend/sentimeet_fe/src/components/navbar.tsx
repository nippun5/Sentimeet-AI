"use client";

import {
  Navbar as MTNavbar,
  Collapse,
  IconButton,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Typography
        as="a"
        href={href || "#"}
        target="_self"
        variant="small"
        className="font-medium"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 960) setOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    function handleScroll() {
      setIsScrolling(window.scrollY > 0);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MTNavbar
      fullWidth
      shadow={false}
      blurred={false}
      color={isScrolling ? "white" : "transparent"}
      className={`fixed top-0 left-0 w-full z-30 border-0 transition-colors duration-300 ${isScrolling ? "bg-white shadow-md" : "bg-transparent"}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
      <div className="container mx-auto flex items-center justify-between py-3">
        <Typography variant="h6" className="text-white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Sentimeet
        </Typography>

        {/* <ul className="ml-10 hidden items-center gap-6 lg:flex">
          <NavItem href="/">New Member? Register</NavItem>
        </ul> */}

        <div className="hidden gap-2 lg:flex lg:items-center">
          <IconButton variant="text" color="gray" size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <i className="fa-brands fa-twitter text-base" />
          </IconButton>
          <IconButton variant="text" color="gray" size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <i className="fa-brands fa-facebook text-base" />
          </IconButton>
          <IconButton variant="text" color="gray" size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <i className="fa-brands fa-instagram text-base" />
          </IconButton>
          <a href="/login">
            <Button color="gray" size="lg"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Login</Button>
          </a>
          <a href="#">
            <Button color="white" size="lg"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Register</Button>
          </a>
        </div>

        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      <Collapse open={open} className="lg:hidden">
        <div className="container mx-auto mt-4 border-t border-gray-200 bg-white px-6 py-5">
          {/* <ul className="flex flex-col gap-4 text-gray-900">
            <NavItem href="/">Home</NavItem>
          
          </ul> */}
          <div className="mt-4 flex items-center gap-2">
            <IconButton variant="text" color="gray" size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <i className="fa-brands fa-twitter text-base" />
            </IconButton>
            <IconButton variant="text" color="gray" size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <i className="fa-brands fa-facebook text-base" />
            </IconButton>
            <IconButton variant="text" color="gray" size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <i className="fa-brands fa-instagram text-base" />
            </IconButton>
            <a href="#">
              <Button color="gray" size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Blocks</Button>
            </a>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
