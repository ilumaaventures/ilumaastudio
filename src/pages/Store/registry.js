import GifterHome from "../Gifter/GifterHome";
import GifterProducts from "../Gifter/GifterProducts";
import GifterProductDetails from "../Gifter/GifterProductDetails";
import GifterNavbar from "../Gifter/GifterNavbar";
import GifterFooter from "../Gifter/GifterFooter";

import StarlingAbout from "../StarlingTales/StarlingAbout";
import StarlingTalesHome from "../StarlingTales/StarlingTalesHome";
import StarlingTalesProduct from "../StarlingTales/StarlingTalesProduct";
import StarlingNavbar from "../StarlingTales/components/StarlingNavbar";
import StarlingFooter from "../StarlingTales/components/StarlingFooter";

const customStoresRegistry = {
  gifter: {
    Navbar: GifterNavbar,
    Footer: GifterFooter,
    StoreHome: GifterHome,
    StoreProducts: GifterProducts,
    StoreProductDetails: GifterProductDetails,
  },
  starlingtales: {
    Navbar: StarlingNavbar,
    Footer: StarlingFooter,
    StoreAbout: StarlingAbout,
    StoreHome: StarlingTalesHome,
    StoreProducts: StarlingTalesProduct,
  },
};

export default customStoresRegistry;
