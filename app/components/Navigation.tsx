import { Popover, Transition } from "@headlessui/react"
import { MenuIcon, XIcon } from "@heroicons/react/solid"
import { Link } from "@remix-run/react"
import { Fragment } from "react"

let ROUTES = [
  { link: "Your feedback", to: "/me" },
  { link: "How it works", to: "/how-it-works" },
  { link: "What makes a great boss", to: "/what-makes-a-great-boss" },
]

let EXTERNAL = [
  {
    link: "Twitter",
    to: "https://twitter.com/Rate_Your_Boss",
    icon: "/media/twitter.png",
  },
  {
    link: "GitHub",
    to: "https://github.com/rate-your-boss/rate-your-boss",
    icon: "/media/github.png",
  },
]

export default function Navigation() {
  return (
    <Popover className="relative bg-white shadow">
      <div className="relative p-6">
        <nav
          className="relative flex items-center justify-between sm:h-10 lg:justify-start"
          aria-label="Global"
        >
          <div className="flex flex-shrink-0 flex-grow items-center md:flex-grow-0">
            <div className="flex w-full items-center justify-between md:w-auto">
              <Link
                to="/"
                className="bg-black p-4 text-xl font-bold text-white"
              >
                Rate Your Boss
              </Link>
              <div className="-mr-2 flex items-center md:hidden">
                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
          </div>
          <div className="hidden md:flex md:flex-1 justify-between">
            <div className="ml-10 space-x-8 mr-4">
              {ROUTES.map(({ link, to }) => (
                <span
                  key={link}
                  className="font-medium text-gray-500 hover:text-gray-900"
                >
                  <Link to={to}>{link}</Link>
                </span>
              ))}
            </div>
            <div className="ml-4 space-x-8 mr-4 flex flex-row items-center">
              {EXTERNAL.map(({ link, to, icon }) => (
                <a key={to} href={to} target="_blank" rel="noreferrer noopener">
                  <img src={icon} alt={link} width="30" />
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
            <div className="flex items-center justify-between px-5 pt-4">
              <div className="bg-black p-4 text-xl font-bold text-white">
                Rate Your Boss
              </div>
              <div className="-mr-2">
                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Close main menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <ul className="mt-8 flex flex-col space-y-2 pb-3">
              {ROUTES.map(({ link, to }) => (
                <li
                  key={link}
                  className="w-full p-4 text-base text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Link to={to}>{link}</Link>
                </li>
              ))}

              {EXTERNAL.map(({ link, to, icon }) => (
                <li
                  key={link}
                  className="w-full p-4 text-base text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <a
                    href={to}
                    className="flex flex-row items-center"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img
                      className="mr-4"
                      src={icon}
                      alt={link}
                      height="30"
                      width="30"
                    />
                    {link} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
