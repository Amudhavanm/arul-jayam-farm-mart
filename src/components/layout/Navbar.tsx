
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Home, Package, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsHPUdeeW67M7jsF1y4JxssrQB4ab90-VRfA&s"
              alt="Arul Jayam Machinery"
              className="h-8 w-8"
            />
            <span className="hidden font-bold sm:inline-block">
              ARUL JAYAM MACHINERY
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
            <Home size={18} />
            Home
          </Link>
          <Link
            to="/cart"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 relative"
          >
            <ShoppingCart size={18} />
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            to="/orders"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
          >
            <Package size={18} />
            Orders
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  My Orders
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 bg-background border-b">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-md"
              onClick={toggleMobileMenu}
            >
              <Home size={18} />
              Home
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-md"
              onClick={toggleMobileMenu}
            >
              <ShoppingCart size={18} />
              Cart
              {totalItems > 0 && (
                <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-md"
              onClick={toggleMobileMenu}
            >
              <Package size={18} />
              Orders
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-md"
                  onClick={toggleMobileMenu}
                >
                  <User size={18} />
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-md"
                    onClick={toggleMobileMenu}
                  >
                    Admin Panel
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  navigate("/login");
                  toggleMobileMenu();
                }}
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
