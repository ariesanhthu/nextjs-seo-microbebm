import { HomepageResponseDto } from './dto/homepage.dto';

export const HOMEPAGE_SEED_DATA: HomepageResponseDto = {
  id: 'seed-homepage',
  title: 'Blue Moonlight Travel & Environment',
  subtitle: 'Tôn vinh thiên nhiên – Sống xanh mỗi ngày',
  created_at: new Date() as any,
  updated_at: new Date() as any,
  banner: [],
  navigation_bar: [
    { title: 'Trang chủ', url: '/' },
    { title: 'Giới thiệu', url: '/about' },
    { title: 'Sản phẩm', url: '/products' },
    { title: 'Dịch vụ', url: '/services' },
    { title: 'Liên hệ', url: '/contact' },
  ],
  footer: {
    vi_name: 'CÔNG TY TNHH MÔI TRƯỜNG & DU LỊCH ÁNH TRĂNG XANH',
    en_name: 'Blue Moonlight Travel & Environment CO., LTD',
    tax_code: '',
    short_name: 'Blue Moonlight',
    owner: '',
    address: '158 Bùi Quang Trinh, P. Phú Thứ, Q. Cái Răng, Tp. Cần Thơ',
    email: 'bluemoonlight.travel@gmail.com',
    phone: '0942 190 022',
    working_time: '',
    fanpage: '',
    address_link: '',
  },
  slider: [
    {
      title: 'Thiên nhiên xanh mát',
      description: 'Chúng tôi cung cấp các sản phẩm thân thiện với môi trường, góp phần xây dựng một tương lai bền vững cho thế hệ mai sau.',
      image_url: '/images/nature-banner.jpg'
    }
  ],
  products: []
};
