import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { useLocale } from '../../lib/i18n';
import './home.css';

const content = {
  vi: {
    label: 'Hồn Làng / Di sản văn hóa Việt Nam', title: 'Chạm vào di sản,', accent: 'tìm về hồn làng.',
    description: 'Một chuyến đi bắt đầu từ sự tò mò. Khám phá những câu chuyện làng nghề, gặp gỡ nét đẹp văn hóa và tìm hành trình xứ Huế dành riêng cho bạn.',
    explore: 'Khám phá di sản', journey: 'Thiết kế hành trình AI', scroll: 'Cuộn để khám phá',
    introLabel: 'Những câu chuyện còn tiếp nối', introTitle: 'Mỗi làng nghề,\nmột miền ký ức.',
    introText: 'Sau một chiếc nón, một dáng gốm hay một đóa hoa giấy là bàn tay khéo léo và câu chuyện của bao thế hệ. Hồn Làng mời bạn khám phá văn hóa qua những điều bình dị ấy.',
    introLink: 'Tìm điểm đến của bạn', caption: 'Bàn tay giữ nghề. Câu chuyện giữ hồn.',
    aiLabel: 'Hành trình theo cách của bạn', aiTitle: 'Một chút tò mò.\nMột hành trình riêng.',
    aiText: 'Bạn muốn khám phá điều gì, trong bao lâu? Bắt đầu với sở thích của mình và cùng Hồn Làng lên kế hoạch.',
    steps: [['Tìm cảm hứng', 'Khám phá địa điểm, đọc câu chuyện và chọn nơi khiến bạn muốn ghé thăm.'], ['Lên kế hoạch', 'Chọn sở thích và thời gian để nhận gợi ý hành trình từ Gemini.'], ['Lưu chuyến đi', 'Giữ lại hành trình để mở lại khi bạn sẵn sàng khám phá.']],
    passportLabel: 'Hộ chiếu văn hóa', passportTitle: 'Mang một phần\nký ức về cùng bạn.',
    passportText: 'Đọc một câu chuyện, thử một câu hỏi văn hóa và lưu lại hành trình yêu thích. Mỗi lần khám phá là một dịp hiểu thêm về vùng đất bạn ghé qua.',
    passportCta: 'Mở hộ chiếu của tôi', endTitle: 'Bắt đầu bằng một điểm đến.', endText: 'Khám phá chậm hơn. Hiểu một vùng đất sâu hơn.',
    heroAlt: 'Nghệ nhân đan lát trong làng nghề truyền thống Việt Nam', artisanAlt: 'Hình minh họa nghệ nhân và nghề thủ công', craftAlt: 'Hình minh họa nón lá thủ công Việt Nam',
  },
  en: {
    label: 'Hon Lang / Vietnamese cultural heritage', title: 'Discover the craft,', accent: 'feel the village soul.',
    description: 'Every journey starts with curiosity. Discover craft traditions, stories of local life, and a cultural journey through Hue that feels like your own.',
    explore: 'Explore the heritage', journey: 'Plan with AI', scroll: 'Scroll to discover',
    introLabel: 'Stories that live on', introTitle: 'Every village,\na living memory.',
    introText: 'Behind a conical hat, a piece of pottery or a paper flower are skilled hands and generations of stories. Hon Lang invites you to discover culture through these everyday details.',
    introLink: 'Find your next destination', caption: 'Hands that keep a craft. Stories that keep its soul.',
    aiLabel: 'A journey that feels like you', aiTitle: 'A little curiosity.\nA journey of your own.',
    aiText: 'What would you like to discover, and how much time do you have? Start with your interests and plan your next journey with Hon Lang.',
    steps: [['Find inspiration', 'Explore places, read their stories and choose somewhere you would love to visit.'], ['Make a plan', 'Choose your interests and available time for a suggested itinerary from Gemini.'], ['Save your journey', 'Keep your itinerary handy for the moment you are ready to explore.']],
    passportLabel: 'Your cultural passport', passportTitle: 'Take a little\nof the story with you.',
    passportText: 'Read a story, try a cultural quiz and save a favourite journey. Each discovery is a chance to understand the places you visit a little better.',
    passportCta: 'Open my passport', endTitle: 'It starts with one destination.', endText: 'Travel a little slower. Discover a little deeper.',
    heroAlt: 'Artisans weaving baskets in a traditional Vietnamese craft village', artisanAlt: 'Illustration of a traditional craft artisan', craftAlt: 'Illustration of a handmade Vietnamese conical hat',
  },
};

export function HomeIntro({ onExplore }: { onExplore: () => void }) {
  const { locale } = useLocale();
  const c = content[locale];
  return <>
    <section className="hl-hero" aria-labelledby="home-title">
      <picture className="hl-hero-picture"><source media="(max-width: 639px)" srcSet="/images/home/hero-mobile.webp" /><img src="/images/home/hero.webp" alt={c.heroAlt} width={1920} height={1103} fetchPriority="high" /></picture>
      <div className="hl-container hl-hero-content">
        <p className="hl-eyebrow">{c.label}</p><h1 id="home-title">{c.title}<span>{c.accent}</span></h1>
        <p className="hl-hero-description">{c.description}</p>
        <div className="hl-actions"><button type="button" className="hl-button" onClick={onExplore}>{c.explore}<ArrowRight aria-hidden="true" /></button><Link className="hl-button hl-button-outline" to="/journey">{c.journey}<ArrowUpRight aria-hidden="true" /></Link></div>
      </div>
      <button type="button" className="hl-scroll" onClick={onExplore}><ArrowDown size={15} aria-hidden="true" />{c.scroll}</button><span className="hl-hero-caption">Hồn Làng / SoulVillage</span>
    </section>
    <section className="hl-section hl-intro" aria-labelledby="home-story-title"><div className="hl-container hl-split">
      <div className="hl-copy"><p className="hl-eyebrow">{c.introLabel}</p><h2 id="home-story-title" className="hl-title">{c.introTitle}</h2><p className="hl-body">{c.introText}</p><button type="button" className="hl-text-link" onClick={onExplore}>{c.introLink}<ArrowUpRight size={16} aria-hidden="true" /></button></div>
      <figure className="hl-photo"><img src="/images/home/artisan.webp" alt={c.artisanAlt} width={960} height={800} loading="lazy" decoding="async" /><figcaption>{c.caption}</figcaption></figure>
    </div></section>
  </>;
}

export function HomeOutro({ onExplore }: { onExplore: () => void }) {
  const { locale } = useLocale();
  const c = content[locale];
  return <>
    <section className="hl-section hl-journey" aria-labelledby="home-journey-title"><div className="hl-container hl-split">
      <div className="hl-copy"><p className="hl-eyebrow">{c.aiLabel}</p><h2 id="home-journey-title" className="hl-title">{c.aiTitle}</h2><p className="hl-body">{c.aiText}</p><Link to="/journey" className="hl-button"><Sparkles aria-hidden="true" />{c.journey}<ArrowRight aria-hidden="true" /></Link></div>
      <ol className="hl-steps">{c.steps.map(([title, text], i) => <li key={title}><span className="hl-step-number" aria-hidden="true">0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
    </div></section>
    <section className="hl-section hl-passport" aria-labelledby="home-passport-title"><div className="hl-container hl-split">
      <figure className="hl-photo"><img src="/images/home/craft.webp" alt={c.craftAlt} width={960} height={960} loading="lazy" decoding="async" /></figure>
      <div className="hl-copy"><p className="hl-eyebrow">{c.passportLabel}</p><h2 id="home-passport-title" className="hl-title">{c.passportTitle}</h2><p className="hl-body">{c.passportText}</p><Link to="/passport" className="hl-text-link">{c.passportCta}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </div></section>
    <section className="hl-closing" aria-labelledby="home-closing-title"><h2 className="hl-title" id="home-closing-title">{c.endTitle}</h2><p>{c.endText}</p><button type="button" className="hl-button" onClick={onExplore}>{c.explore}<ArrowRight aria-hidden="true" /></button></section>
  </>;
}
