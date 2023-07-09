import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          "language": "Language",
          "Thanks for visiting our website": "Thanks for visiting our website",
          "Hello": "Hello",
          "Compare": "Compare",
          "Products": "Products",
          "Favourite": "Favourite",
          "wishlist": "wishlist",
          "Log in": "Log in",
          "My Account": "My Account",
          "Welcome": "Welcome",
          "Home": "Home",
          "Our Store": "Our Store",
          "Blogs": "Blogs",
          "Contact": "Contact",
          "Top new product lauch": "Top new product lauch",
          "Quantity": "Quantity",
          "Featured Collection": "Featured Collection",
          "Special Products": "Special Products",
          "Our Popular Products": "Our Popular Products",
          "Our Latest Blogs": "Our Latest Blogs",


          
        }
        
      },
      vi: {
        translation: {
          "language": "Ngôn ngữ",
          "Thanks for visiting our website":"Cảm ơn đã ghé thăm website của chúng tôi",
          "Hello": "Xin chào",
          "Compare": "So sánh",
          "Products": "sản phẩm",
          "Favourite": "Danh mục",
          "wishlist": "yêu thích",
          "Log in": "Đăng nhập",
          "My Account": "Tài khoản",
          "Welcome": "Xin chào",
          "Home": "Trang chủ",
          "Our Store": "Cửa hàng",
          "Blogs": "Bài viết",
          "Contact": "Liên hệ",
          "Top new product lauch": "Sản phẩm vừa ra mắt",
          "Quantity": "Số lượng",
          "Featured Collection": "Sản phẩm đặc trưng",
          "Special Products": "Sản phẩm đặc biệt",
          "Our Popular Products": "Sản phẩm phổ biến",
          "Our Latest Blogs": "Blogs mới nhất"
          
        },
      },
    }
  });

export default i18n;