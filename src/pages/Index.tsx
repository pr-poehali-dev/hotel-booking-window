import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const HOTEL_IMAGE = "https://cdn.poehali.dev/projects/f838007e-45bf-42d4-b17c-23d30b4e4ded/files/26b0bb9b-2664-4685-8ab7-05284300aaa2.jpg";

const rooms = [
  {
    id: 1,
    name: "Классический номер",
    size: "32 м²",
    price: 8900,
    oldPrice: null as number | null,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    features: ["Вид на сад", "Двуспальная кровать", "Мини-бар"],
    badge: null as string | null,
  },
  {
    id: 2,
    name: "Делюкс номер",
    size: "48 м²",
    price: 14500,
    oldPrice: 18000 as number | null,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    features: ["Панорамный вид", "Гидромассажная ванна", "Балкон"],
    badge: "Хит продаж" as string | null,
  },
  {
    id: 3,
    name: "Президентский люкс",
    size: "120 м²",
    price: 42000,
    oldPrice: null as number | null,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    features: ["Вид на реку", "Личный дворецкий", "Терраса с джакузи"],
    badge: "Эксклюзив" as string | null,
  },
];

const services = [
  { icon: "Utensils", title: "Ресторан", desc: "Авторская кухня от шеф-повара с мишленовской звездой" },
  { icon: "Waves", title: "СПА & Бассейн", desc: "Бассейн с подогревом, сауна и кабинеты массажа" },
  { icon: "Car", title: "Трансфер", desc: "Персональный автомобиль от аэропорта 24/7" },
  { icon: "GlassWater", title: "Бар", desc: "Коллекция вин и авторские коктейли" },
  { icon: "Dumbbell", title: "Фитнес", desc: "Оборудованный зал с персональными тренерами" },
  { icon: "Star", title: "Консьерж", desc: "Организация экскурсий и бронирование столиков" },
];

const offers = [
  {
    title: "Весенний романтик",
    desc: "Номер «Делюкс», ужин при свечах, СПА для двоих",
    discount: "30%",
    until: "31 мая",
    price: "от 24 900 ₽",
    color: "from-rose-950 to-stone-900",
  },
  {
    title: "Раннее бронирование",
    desc: "Скидка при бронировании за 30+ дней до заезда",
    discount: "20%",
    until: "Постоянно",
    price: "от 7 100 ₽",
    color: "from-emerald-950 to-stone-900",
  },
  {
    title: "Уикенд в люксе",
    desc: "2 ночи в Президентском люксе по специальной цене",
    discount: "25%",
    until: "30 июня",
    price: "от 63 000 ₽",
    color: "from-blue-950 to-stone-900",
  },
];

type Room = typeof rooms[0];

function BookingModal({ room, onClose }: { room: Room | null; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", checkin: "", checkout: "", guests: "1" });

  if (!room) return null;

  const nights = (() => {
    if (!form.checkin || !form.checkout) return 1;
    const diff = new Date(form.checkout).getTime() - new Date(form.checkin).getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  })();

  const nightLabel = nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg"
        style={{ animation: "fadeInUp 0.4s ease forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#171411] border border-[rgba(201,169,110,0.3)] rounded-sm overflow-hidden">
          <div className="relative px-8 pt-8 pb-6">
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
            <button onClick={onClose} className="absolute top-6 right-6 text-[#9A7A45] hover:text-[#C9A96E] transition-colors">
              <Icon name="X" size={20} />
            </button>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[#C9A96E] mb-2">Бронирование</p>
            <h2 className="font-display text-3xl text-[#E8D5A3]">{room.name}</h2>
          </div>

          <div className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Заезд</label>
                <input type="date" value={form.checkin} onChange={(e) => setForm({ ...form, checkin: e.target.value })}
                  className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm focus:outline-none focus:border-[#C9A96E] transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Выезд</label>
                <input type="date" value={form.checkout} onChange={(e) => setForm({ ...form, checkout: e.target.value })}
                  className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm focus:outline-none focus:border-[#C9A96E] transition-colors" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Гостей</label>
              <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm focus:outline-none focus:border-[#C9A96E] transition-colors">
                <option value="1">1 гость</option>
                <option value="2">2 гостя</option>
                <option value="3">3 гостя</option>
              </select>
            </div>

            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Ваше имя</label>
              <input type="text" placeholder="Иван Иванов" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm placeholder-[#4a3f2f] focus:outline-none focus:border-[#C9A96E] transition-colors" />
            </div>

            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Телефон</label>
              <input type="tel" placeholder="+7 (___) ___-__-__" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm placeholder-[#4a3f2f] focus:outline-none focus:border-[#C9A96E] transition-colors" />
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="h-px mb-6" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-1">
                  Итого за {nights} {nightLabel}
                </p>
                <p className="font-display text-3xl text-[#C9A96E]">
                  {(room.price * nights).toLocaleString("ru-RU")} ₽
                </p>
              </div>
              <p className="font-sans text-xs text-[#6b5a40]">{room.size}</p>
            </div>
            <button className="w-full py-4 bg-[#C9A96E] text-[#0F0D0A] font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#E8D5A3] transition-colors duration-300 rounded-sm">
              Подтвердить бронирование
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "rooms", "services", "offers", "contacts"];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sec);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: "rooms", label: "Номера" },
    { id: "services", label: "Услуги" },
    { id: "offers", label: "Предложения" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-[#0F0D0A] text-[#E8D5A3]">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{ background: "linear-gradient(180deg, rgba(15,13,10,0.95) 0%, rgba(15,13,10,0) 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="font-display text-2xl text-[#C9A96E] tracking-wider">
            Ramada Novosibirsk
          </button>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className={`font-sans text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${
                  activeSection === link.id ? "text-[#C9A96E]" : "text-[#9A8060] hover:text-[#C9A96E]"
                }`}>
                {link.label}
              </button>
            ))}
            <button onClick={() => navigate("/booking")}
              className="px-6 py-2.5 border border-[#C9A96E] text-[#C9A96E] font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#C9A96E] hover:text-[#0F0D0A] transition-all duration-300 rounded-sm">
              Забронировать
            </button>
          </div>
          <button className="md:hidden text-[#C9A96E]" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#0F0D0A] border-t border-[rgba(201,169,110,0.2)] px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className="text-left font-sans text-xs tracking-[0.15em] uppercase text-[#9A8060] hover:text-[#C9A96E] transition-colors">
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HOTEL_IMAGE} alt="Grand Lumière Hotel" className="w-full h-full object-cover"
            style={{ filter: "brightness(0.4) saturate(0.8)" }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(15,13,10,0.3) 0%, rgba(15,13,10,0.05) 40%, rgba(15,13,10,0.75) 100%)"
          }} />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="animate-fade-in-delay-1 font-sans text-xs tracking-[0.4em] uppercase text-[#C9A96E] mb-6">
            Новосибирск · С 1998 года
          </p>
          <h1 className="animate-fade-in-delay-2 font-display text-7xl md:text-9xl font-light text-[#E8D5A3] leading-none mb-4">
            Ramada Novosibirsk
          </h1>
          <div className="animate-fade-in-delay-2 h-px w-40 mx-auto my-6" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
          <p className="animate-fade-in-delay-3 font-display italic text-xl md:text-2xl text-[#C9A96E] mb-12 font-light">
            Где роскошь встречает безупречность
          </p>
          <div className="animate-fade-in-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/booking")}
              className="px-10 py-4 bg-[#C9A96E] text-[#0F0D0A] font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#E8D5A3] transition-all duration-300 rounded-sm">
              Выбрать номер
            </button>
            <button onClick={() => scrollTo("offers")}
              className="px-10 py-4 border border-[rgba(201,169,110,0.5)] text-[#C9A96E] font-sans text-xs tracking-[0.2em] uppercase hover:border-[#C9A96E] transition-all duration-300 rounded-sm">
              Спецпредложения
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="font-sans text-xs tracking-widest uppercase text-[#9A7A45]">Прокрутите</span>
          <div className="w-px h-12" style={{ background: "linear-gradient(180deg, #C9A96E, transparent)" }} />
        </div>
      </section>

      {/* Stats */}
      <div className="bg-[#171411] border-y border-[rgba(201,169,110,0.15)]">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "25+", label: "Лет безупречного сервиса" },
            { num: "86", label: "Номеров и апартаментов" },
            { num: "4.9", label: "Средняя оценка гостей" },
            { num: "12K+", label: "Довольных гостей" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl text-[#C9A96E] mb-1">{s.num}</p>
              <p className="font-sans text-xs text-[#6b5a40] tracking-wider uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rooms */}
      <section id="rooms" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A96E] mb-4">Размещение</p>
            <h2 className="font-display text-5xl md:text-6xl text-[#E8D5A3] mb-4">Наши номера</h2>
            <div className="h-px w-32 mx-auto" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="group relative bg-[#171411] border border-[rgba(201,169,110,0.15)] hover:border-[rgba(201,169,110,0.4)] transition-all duration-500 overflow-hidden rounded-sm">
                {room.badge && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#C9A96E] text-[#0F0D0A] font-sans text-xs tracking-wider uppercase rounded-sm">
                    {room.badge}
                  </div>
                )}
                <div className="relative overflow-hidden h-56">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, #171411 100%)" }} />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display text-2xl text-[#E8D5A3]">{room.name}</h3>
                    <span className="font-sans text-xs text-[#6b5a40] mt-1">{room.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {room.features.map((f) => (
                      <span key={f} className="font-sans text-xs text-[#9A7A45] px-2 py-1 border border-[rgba(201,169,110,0.2)] rounded-sm">{f}</span>
                    ))}
                  </div>
                  <div className="h-px mb-5" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
                  <div className="flex items-center justify-between">
                    <div>
                      {room.oldPrice && (
                        <p className="font-sans text-xs text-[#4a3f2f] line-through mb-0.5">{room.oldPrice.toLocaleString("ru-RU")} ₽</p>
                      )}
                      <p className="font-display text-2xl text-[#C9A96E]">
                        {room.price.toLocaleString("ru-RU")} ₽
                        <span className="font-sans text-xs text-[#6b5a40] ml-1">/ ночь</span>
                      </p>
                    </div>
                    <button onClick={() => navigate(`/booking?room=${room.id}`)}
                      className="px-5 py-2.5 border border-[#C9A96E] text-[#C9A96E] font-sans text-xs tracking-wider uppercase hover:bg-[#C9A96E] hover:text-[#0F0D0A] transition-all duration-300 rounded-sm">
                      Забронировать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-6 bg-[#0C0A07]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A96E] mb-4">Сервис</p>
            <h2 className="font-display text-5xl md:text-6xl text-[#E8D5A3] mb-4">Для вашего комфорта</h2>
            <div className="h-px w-32 mx-auto" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-[rgba(201,169,110,0.1)]">
            {services.map((s) => (
              <div key={s.title} className="bg-[#0F0D0A] p-8 hover:bg-[#171411] transition-colors duration-300 group">
                <div className="w-12 h-12 border border-[rgba(201,169,110,0.3)] group-hover:border-[#C9A96E] flex items-center justify-center mb-6 transition-colors duration-300 rounded-sm">
                  <Icon name={s.icon as Parameters<typeof Icon>[0]["name"]} size={20} className="text-[#C9A96E]" fallback="Star" />
                </div>
                <h3 className="font-display text-xl text-[#E8D5A3] mb-3">{s.title}</h3>
                <p className="font-sans text-xs text-[#6b5a40] leading-relaxed tracking-wide">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section id="offers" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A96E] mb-4">Акции</p>
            <h2 className="font-display text-5xl md:text-6xl text-[#E8D5A3] mb-4">Специальные предложения</h2>
            <div className="h-px w-32 mx-auto" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.title} className={`relative overflow-hidden rounded-sm bg-gradient-to-br ${offer.color} border border-[rgba(201,169,110,0.2)] hover:border-[rgba(201,169,110,0.5)] transition-all duration-500 group`}>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-full border-2 border-[#C9A96E] flex items-center justify-center">
                      <span className="font-display text-lg text-[#C9A96E] font-semibold">-{offer.discount}</span>
                    </div>
                    <span className="font-sans text-xs text-[#9A7A45] tracking-wider">до {offer.until}</span>
                  </div>
                  <h3 className="font-display text-2xl text-[#E8D5A3] mb-3">{offer.title}</h3>
                  <p className="font-sans text-xs text-[#6b5a40] leading-relaxed mb-6">{offer.desc}</p>
                  <div className="h-px mb-5" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl text-[#C9A96E]">{offer.price}</p>
                    <button onClick={() => navigate("/booking")}
                      className="px-4 py-2 border border-[rgba(201,169,110,0.4)] text-[#C9A96E] font-sans text-xs tracking-wider uppercase hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.1)] transition-all duration-300 rounded-sm">
                      Выбрать
                    </button>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-[rgba(201,169,110,0.08)] group-hover:border-[rgba(201,169,110,0.25)] transition-colors duration-500" />
                <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full border border-[rgba(201,169,110,0.04)] group-hover:border-[rgba(201,169,110,0.12)] transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-24 px-6 bg-[#0C0A07]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A96E] mb-4">Свяжитесь с нами</p>
            <h2 className="font-display text-5xl md:text-6xl text-[#E8D5A3] mb-4">Контакты</h2>
            <div className="h-px w-32 mx-auto" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              {[
                { icon: "MapPin", title: "Адрес", value: "Москва, ул. Тверская, д. 22" },
                { icon: "Phone", title: "Телефон", value: "+7 (495) 000-00-00" },
                { icon: "Mail", title: "Email", value: "booking@grandlumiere.ru" },
                { icon: "Clock", title: "Ресепшн", value: "Работает круглосуточно, 24/7" },
              ].map((c) => (
                <div key={c.title} className="flex gap-5">
                  <div className="w-10 h-10 border border-[rgba(201,169,110,0.3)] flex items-center justify-center flex-shrink-0 rounded-sm">
                    <Icon name={c.icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-[#C9A96E]" fallback="Info" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-widest uppercase text-[#6b5a40] mb-1">{c.title}</p>
                    <p className="font-sans text-sm text-[#E8D5A3]">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#171411] border border-[rgba(201,169,110,0.15)] p-8 rounded-sm">
              <h3 className="font-display text-2xl text-[#E8D5A3] mb-6">Задайте вопрос</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Ваше имя"
                  className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm placeholder-[#4a3f2f] focus:outline-none focus:border-[#C9A96E] transition-colors" />
                <input type="email" placeholder="Email или телефон"
                  className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm placeholder-[#4a3f2f] focus:outline-none focus:border-[#C9A96E] transition-colors" />
                <textarea placeholder="Ваш вопрос или пожелание" rows={4}
                  className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm placeholder-[#4a3f2f] focus:outline-none focus:border-[#C9A96E] transition-colors resize-none" />
                <button className="w-full py-4 bg-[#C9A96E] text-[#0F0D0A] font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#E8D5A3] transition-colors duration-300 rounded-sm">
                  Отправить сообщение
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(201,169,110,0.15)] bg-[#0A0805]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display text-xl text-[#C9A96E]">Ramada Novosibirsk</p>
          <p className="font-sans text-xs text-[#4a3f2f]">© 2026 Ramada Novosibirsk. Все права защищены.</p>
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className="font-sans text-xs tracking-wider uppercase text-[#4a3f2f] hover:text-[#C9A96E] transition-colors">
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </footer>


    </div>
  );
}