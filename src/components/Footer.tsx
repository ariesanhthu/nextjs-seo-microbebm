import Link from "next/link";
import { Facebook, Mail, Phone, MapPin } from "lucide-react";

type FooterData = {
  vi_name?: string;
  en_name?: string;
  tax_code?: string;
  owner?: string;
  working_time?: string;
  address?: string;
  email?: string;
  fanpage?: string;
  phone?: string;
};

type FooterProps = {
  footer?: FooterData;
};

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-green-800 via-green-900 to-green-950 py-16 text-white">
      <div className="container mx-auto px-10">
        <div className="flex flex-col md:flex-row md:justify-evenly gap-8 max-w-7xl mx-auto">
          
          {/* Cột 1: Về chúng tôi */}
          <div className="text-center md:text-left md:flex-1 md:max-w-xs">
            <h3 className="mb-6 text-2xl font-bold text-green-100">Về chúng tôi</h3>
            <div className="mb-6 sm:pr-10 pr-0">
              <h4 className="text-lg font-semibold text-green-200 mb-2">
                {footer?.vi_name || "CÔNG TY TNHH MÔI TRƯỜNG & DU LỊCH ÁNH TRĂNG XANH"}
              </h4>
              <p className="text-green-100 font-medium mb-2">
                {footer?.en_name || "Blue Moonlight Travel & Environment CO., LTD"}
              </p>
              <p className="text-sm text-green-200 leading-relaxed">
                Chúng tôi là đơn vị tiên phong trong lĩnh vực cung cấp các sản phẩm và giải pháp thân thiện với môi trường tại Việt Nam.
              </p>
            </div>
          </div>

          {/* Cột 2: Thông tin công ty */}
          <div className="text-center md:text-left md:flex-1 md:max-w-xs">
            <h3 className="mb-6 text-2xl font-bold text-green-100">Thông tin công ty</h3>
            <div className="space-y-4 text-sm">
              <div className="flex flex-col items-center md:items-start">
                <span className="font-semibold text-green-200 mb-1">Mã số thuế</span>
                <span className="text-green-100">{footer?.tax_code || "0317967773"}</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="font-semibold text-green-200 mb-1">Chủ sở hữu</span>
                <span className="text-green-100">{footer?.owner || "N/A"}</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="font-semibold text-green-200 mb-1">Giờ làm việc</span>
                <span className="text-green-100">{footer?.working_time || "8:00 - 17:00 (Thứ 2 - Thứ 6)"}</span>
              </div>
            </div>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="text-center md:text-left md:flex-1 md:max-w-xs">
            <h3 className="mb-6 text-2xl font-bold text-green-100">Liên hệ</h3>
            <div className="space-y-4">
              
              {/* Địa chỉ */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="p-2 rounded-full bg-green-600/20 border border-green-400/30 flex-shrink-0 hidden sm:block">
                  <MapPin className="h-5 w-5 text-green-300" />
                </div>
                <div className="text-center sm:text-left hidden sm:block">
                  <p className="text-green-100 text-sm leading-relaxed">
                    {footer?.address || "158 Bùi Quang Trinh, P. Phú Thứ, Q. Cái Răng, Tp. Cần Thơ"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="p-2 rounded-full bg-green-600/20 border border-green-400/30 flex-shrink-0 hidden sm:block">
                  <Mail className="h-5 w-5 text-green-300" />
                </div>
                <div className="text-center sm:text-left hidden sm:block">
                  <Link 
                    href={`mailto:${footer?.email || "bluemoonlight.travel@gmail.com"}`} 
                    className="text-green-100 hover:text-green-300 transition-colors text-sm"
                  >
                    {footer?.email || "bluemoonlight.travel@gmail.com"}
                  </Link>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="p-2 rounded-full bg-green-600/20 border border-green-400/30 flex-shrink-0 hidden sm:block">
                  <Facebook className="h-5 w-5 text-green-300" />
                </div>
                <div className="text-center sm:text-left hidden sm:block">
                  <Link 
                    href={footer?.fanpage || "#"} 
                    target="_blank"
                    className="text-green-100 hover:text-green-300 transition-colors text-sm"
                  >
                    Microbe
                  </Link>
                </div>
              </div>

              {/* Điện thoại */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="p-2 rounded-full bg-green-600/20 border border-green-400/30 flex-shrink-0 hidden sm:block">
                  <Phone className="h-5 w-5 text-green-300" />
                </div>
                <div className="text-center sm:text-left hidden sm:block">
                  <Link 
                    href={`tel:${footer?.phone || "0942190022"}`} 
                    className="text-green-100 hover:text-green-300 transition-colors text-sm"
                  >
                    {footer?.phone || "0942190022"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-green-700/50 pt-8 text-center">
          <p className="text-green-200">
            &copy; {"2025 Blue Moonlight Travel & Environment CO., LTD"}
          </p>
        </div>
      </div>
    </footer>
  );
}
