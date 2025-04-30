import { Button } from "@heroui/button";
import {
  ArrowLeftEndOnRectangleIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/react";
import { useLocale } from "@/contexts/LocaleContext";
import { Link } from "react-router-dom";

export default function UserHome() {
  const { user } = useAuth();
  const { supportedCountries, country, setCountry } = useLocale();

  const handleCountryChange = (key: string) => {
    setCountry(key);
  };

  return (
    <>
      <div className="p-6 flex items-center justify-between">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="light"
              className="flex flex-col gap-0 items-start p-0"
              disableRipple
              radius="none"
            >
              <h1 className="text-xs font-bold tracking-wide">
                TANGO-CITY.COM
              </h1>
              <div className="flex items-center gap-2">
                <div className="text-base font-bold">
                  {
                    supportedCountries.find(
                      (item) => item.countryCode === country,
                    )?.countryName
                  }
                </div>
                <ChevronDownIcon className="size-4" />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            items={supportedCountries}
            onAction={(key) => {
              handleCountryChange(String(key));
            }}
          >
            {(item) => (
              <DropdownItem key={item.countryCode} textValue={item.countryCode}>
                <div className="flex align-items gap-2">
                  <div>
                    <div className="font-bold">{item.countryName}</div>
                    <div className="text-xs">{item.countryNameEn}</div>
                  </div>
                  {item.countryCode === country && (
                    <CheckIcon className="ms-auto size-4" />
                  )}
                </div>
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
        {user && (
          <Dropdown>
            <DropdownTrigger>
              <div className="flex items-center gap-2">
                <Avatar className="size-10"></Avatar>
                <ChevronDownIcon className="size-4" />
              </div>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="1">TEST</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        {!user && (
          <Button
            className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg"
            radius="full"
            as={Link}
            to="/login"
            startContent={<ArrowLeftEndOnRectangleIcon className="size-4" />}
          >
            LOGIN
          </Button>
        )}
      </div>
    </>
  );
}
