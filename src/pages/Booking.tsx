import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";

const rooms = [
  { id: 1, name: "Студия", price: 7500, size: "40 м²" },
  { id: 2, name: "Апартаменты с 1 спальней", price: 11500, size: "65 м²" },
  { id: 3, name: "Апартаменты с 2 спальнями", price: 17000, size: "95 м²" },
];

const steps = ["Номер", "Предпочтения", "Даты и гости", "Контакты", "Подтверждение"];

type Prefs = {
  temperature: string;
  lighting: string;
  curtains: string;
  wakeTime: string;
  fragrance: string;
  tvChannel: string;
  extraNotes: string;
};

const defaultPrefs: Prefs = {
  temperature: "",
  lighting: "",
  curtains: "",
  wakeTime: "",
  fragrance: "",
  tvChannel: "",
  extraNotes: "",
};

function SliderInput({
  label, hint, value, onChange, min, max, unit, icon,
}: {
  label: string; hint: string; value: string; onChange: (v: string) => void;
  min: number; max: number; unit: string; icon: string;
}) {
  const num = value ? Number(value) : null;
  const pct = num !== null ? ((num - min) / (max - min)) * 100 : 50;

  return (
    <div className="bg-[#171411] border border-[rgba(201,169,110,0.15)] rounded-sm p-5 hover:border-[rgba(201,169,110,0.3)] transition-colors">
      <div className="flex items-center gap-3 mb-1">
        <Icon name={icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-[#C9A96E]" fallback="Settings" />
        <span className="font-sans text-xs tracking-widest uppercase text-[#9A7A45]">{label}</span>
        {num !== null && (
          <span className="ml-auto font-display text-lg text-[#C9A96E]">{num}{unit}</span>
        )}
      </div>
      <p className="font-sans text-xs text-[#4a3f2f] mb-4 ml-7">{hint}</p>
      <div className="flex items-center gap-3 ml-7">
        <span className="font-sans text-xs text-[#4a3f2f] w-8 text-right">{min}{unit}</span>
        <div className="relative flex-1 h-1 bg-[#2a2218] rounded-full">
          {num !== null && (
            <div className="absolute left-0 top-0 h-1 rounded-full bg-[#C9A96E] transition-all" style={{ width: `${pct}%` }} />
          )}
          <input
            type="range" min={min} max={max} step={1}
            value={num ?? Math.round((min + max) / 2)}
            onChange={(e) => onChange(e.target.value)}
            onMouseDown={() => { if (!value) onChange(String(Math.round((min + max) / 2))); }}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1.5"
          />
          {num !== null && (
            <div className="absolute w-3 h-3 rounded-full bg-[#C9A96E] border-2 border-[#0F0D0A] -top-1 transition-all pointer-events-none"
              style={{ left: `calc(${pct}% - 6px)` }} />
          )}
        </div>
        <span className="font-sans text-xs text-[#4a3f2f] w-8">{max}{unit}</span>
      </div>
      {!value && (
        <button onClick={() => onChange(String(Math.round((min + max) / 2)))}
          className="mt-3 ml-7 font-sans text-xs text-[#6b5a40] underline underline-offset-2 hover:text-[#C9A96E] transition-colors">
          Задать значение
        </button>
      )}
    </div>
  );
}

function OptionInput({
  label, hint, icon, options, value, onChange,
}: {
  label: string; hint: string; icon: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="bg-[#171411] border border-[rgba(201,169,110,0.15)] rounded-sm p-5 hover:border-[rgba(201,169,110,0.3)] transition-colors">
      <div className="flex items-center gap-3 mb-1">
        <Icon name={icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-[#C9A96E]" fallback="Settings" />
        <span className="font-sans text-xs tracking-widest uppercase text-[#9A7A45]">{label}</span>
      </div>
      <p className="font-sans text-xs text-[#4a3f2f] mb-4 ml-7">{hint}</p>
      <div className="flex flex-wrap gap-2 ml-7">
        {options.map((opt) => (
          <button key={opt} onClick={() => onChange(value === opt ? "" : opt)}
            className={`px-3 py-1.5 rounded-sm font-sans text-xs border transition-all duration-200 ${
              value === opt
                ? "bg-[rgba(201,169,110,0.12)] border-[#C9A96E] text-[#C9A96E]"
                : "border-[rgba(201,169,110,0.2)] text-[#6b5a40] hover:border-[rgba(201,169,110,0.4)]"
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextInput({
  label, hint, icon, placeholder, value, onChange,
}: {
  label: string; hint: string; icon: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="bg-[#171411] border border-[rgba(201,169,110,0.15)] rounded-sm p-5 hover:border-[rgba(201,169,110,0.3)] transition-colors">
      <div className="flex items-center gap-3 mb-1">
        <Icon name={icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-[#C9A96E]" fallback="Settings" />
        <span className="font-sans text-xs tracking-widest uppercase text-[#9A7A45]">{label}</span>
      </div>
      <p className="font-sans text-xs text-[#4a3f2f] mb-3 ml-7">{hint}</p>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full ml-0 bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-2.5 text-[#E8D5A3] font-sans text-sm placeholder-[#3a3020] focus:outline-none focus:border-[#C9A96E] transition-colors" />
    </div>
  );
}

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = Number(searchParams.get("room")) || null;

  const [step, setStep] = useState(preselectedId ? 1 : 0);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(preselectedId);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [form, setForm] = useState({
    checkin: "",
    checkout: "",
    guests: "1",
    name: "",
    phone: "",
    email: "",
    wishes: "",
  });

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;

  const nights = (() => {
    if (!form.checkin || !form.checkout) return 1;
    const diff = new Date(form.checkout).getTime() - new Date(form.checkin).getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  })();

  const nightLabel = nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей";
  const total = selectedRoom ? selectedRoom.price * nights : 0;

  const canNext = () => {
    if (step === 0) return selectedRoomId !== null;
    if (step === 1) return true; // preferences are optional
    if (step === 2) return form.checkin && form.checkout;
    if (step === 3) return form.name && form.phone;
    return true;
  };

  const next = () => { if (canNext()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const setPref = (key: keyof Prefs) => (val: string) => setPrefs((p) => ({ ...p, [key]: val }));

  const filledPrefsCount = Object.values(prefs).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0F0D0A] text-[#E8D5A3]">
      {/* Header */}
      <header className="border-b border-[rgba(201,169,110,0.15)] bg-[#0A0805]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 text-[#9A7A45] hover:text-[#C9A96E] transition-colors">
            <Icon name="ArrowLeft" size={18} />
            <span className="font-sans text-xs tracking-widest uppercase">Назад</span>
          </button>
          <span className="font-display text-2xl text-[#C9A96E]">Ramada Novosibirsk</span>
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Steps */}
        <div className="flex items-center justify-center mb-12 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-sans text-xs font-semibold transition-all duration-300 ${
                  i < step ? "bg-[#C9A96E] border-[#C9A96E] text-[#0F0D0A]" :
                  i === step ? "border-[#C9A96E] text-[#C9A96E]" :
                  "border-[rgba(201,169,110,0.2)] text-[#4a3f2f]"
                }`}>
                  {i < step ? <Icon name="Check" size={14} /> : i + 1}
                </div>
                <span className={`font-sans text-xs tracking-wider uppercase hidden sm:block whitespace-nowrap ${
                  i === step ? "text-[#C9A96E]" : "text-[#4a3f2f]"
                }`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-10 sm:w-16 h-px mx-2 mb-5 transition-colors duration-300 flex-shrink-0 ${
                  i < step ? "bg-[#C9A96E]" : "bg-[rgba(201,169,110,0.15)]"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">

            {/* Step 0: Choose Room */}
            {step === 0 && (
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-3">Шаг 1</p>
                <h1 className="font-display text-4xl text-[#E8D5A3] mb-8">Выберите номер</h1>
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <button key={room.id} onClick={() => setSelectedRoomId(room.id)}
                      className={`w-full text-left p-6 rounded-sm border transition-all duration-300 ${
                        selectedRoomId === room.id
                          ? "border-[#C9A96E] bg-[rgba(201,169,110,0.07)]"
                          : "border-[rgba(201,169,110,0.15)] bg-[#171411] hover:border-[rgba(201,169,110,0.35)]"
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            selectedRoomId === room.id ? "border-[#C9A96E]" : "border-[rgba(201,169,110,0.3)]"
                          }`}>
                            {selectedRoomId === room.id && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" />}
                          </div>
                          <div>
                            <p className="font-display text-xl text-[#E8D5A3]">{room.name}</p>
                            <p className="font-sans text-xs text-[#6b5a40] mt-1">{room.size}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl text-[#C9A96E]">{room.price.toLocaleString("ru-RU")} ₽</p>
                          <p className="font-sans text-xs text-[#4a3f2f]">за ночь</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Smart Home Preferences */}
            {step === 1 && (
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-3">Шаг 2</p>
                <h1 className="font-display text-4xl text-[#E8D5A3] mb-2">Ваши предпочтения</h1>
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(201,169,110,0.07)] border border-[rgba(201,169,110,0.2)] rounded-sm">
                    <Icon name="Smartphone" size={13} className="text-[#C9A96E]" />
                    <span className="font-sans text-xs text-[#9A7A45]">Умный номер · управление с телефона</span>
                  </div>
                  {filledPrefsCount > 0 && (
                    <span className="font-sans text-xs text-[#6b5a40]">{filledPrefsCount} из 6 заполнено</span>
                  )}
                </div>

                <p className="font-sans text-xs text-[#4a3f2f] mb-6 leading-relaxed">
                  Персонализируйте микроклимат номера заранее — система умного дома настроит всё к вашему заезду. Все параметры можно изменить в любой момент через приложение.
                </p>

                <div className="space-y-4">
                  <SliderInput
                    label="Температура воздуха"
                    hint="Комфортная температура в номере"
                    icon="Thermometer"
                    value={prefs.temperature}
                    onChange={setPref("temperature")}
                    min={16} max={28} unit="°C"
                  />

                  <SliderInput
                    label="Яркость освещения"
                    hint="Уровень освещённости при заезде"
                    icon="Sun"
                    value={prefs.lighting}
                    onChange={setPref("lighting")}
                    min={0} max={100} unit="%"
                  />

                  <OptionInput
                    label="Шторы и жалюзи"
                    hint="Положение штор при заселении"
                    icon="Wind"
                    options={["Открыты полностью", "Открыты наполовину", "Закрыты"]}
                    value={prefs.curtains}
                    onChange={setPref("curtains")}
                  />

                  <TextInput
                    label="Время подъёма"
                    hint="Умная система мягко поднимет свет и температуру к нужному часу"
                    icon="AlarmClock"
                    placeholder="Например: 07:30"
                    value={prefs.wakeTime}
                    onChange={setPref("wakeTime")}
                  />

                  <OptionInput
                    label="Аромат в номере"
                    hint="Диффузор умного дома подготовит атмосферу к вашему приезду"
                    icon="Sparkles"
                    options={["Без аромата", "Лаванда", "Свежесть", "Цитрус", "Ваниль", "Мята"]}
                    value={prefs.fragrance}
                    onChange={setPref("fragrance")}
                  />

                  <TextInput
                    label="Любимый ТВ-канал"
                    hint="Телевизор включится на нужном канале при заселении"
                    icon="Tv"
                    placeholder="Например: Россия 1, HBO, Discovery"
                    value={prefs.tvChannel}
                    onChange={setPref("tvChannel")}
                  />

                  <div className="bg-[#171411] border border-[rgba(201,169,110,0.15)] rounded-sm p-5 hover:border-[rgba(201,169,110,0.3)] transition-colors">
                    <div className="flex items-center gap-3 mb-1">
                      <Icon name="MessageSquare" size={16} className="text-[#C9A96E]" />
                      <span className="font-sans text-xs tracking-widest uppercase text-[#9A7A45]">Дополнительные пожелания</span>
                    </div>
                    <p className="font-sans text-xs text-[#4a3f2f] mb-3 ml-7">Любые особые запросы к подготовке номера</p>
                    <textarea value={prefs.extraNotes} onChange={(e) => setPref("extraNotes")(e.target.value)}
                      placeholder="Например: аллергия на пыль, предпочитаю тихую сторону, нужна подушка потвёрже..."
                      rows={3}
                      className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-2.5 text-[#E8D5A3] font-sans text-sm placeholder-[#3a3020] focus:outline-none focus:border-[#C9A96E] transition-colors resize-none" />
                  </div>
                </div>

                <p className="font-sans text-xs text-[#4a3f2f] mt-5 text-center">
                  Этот шаг необязателен — можно пропустить и настроить всё через приложение после заезда
                </p>
              </div>
            )}

            {/* Step 2: Dates */}
            {step === 2 && (
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-3">Шаг 3</p>
                <h1 className="font-display text-4xl text-[#E8D5A3] mb-8">Даты и гости</h1>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Дата заезда</label>
                      <input type="date" value={form.checkin}
                        onChange={(e) => setForm({ ...form, checkin: e.target.value })}
                        className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm focus:outline-none focus:border-[#C9A96E] transition-colors" />
                    </div>
                    <div>
                      <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Дата выезда</label>
                      <input type="date" value={form.checkout}
                        onChange={(e) => setForm({ ...form, checkout: e.target.value })}
                        className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm focus:outline-none focus:border-[#C9A96E] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Количество гостей</label>
                    <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm focus:outline-none focus:border-[#C9A96E] transition-colors">
                      <option value="1">1 гость</option>
                      <option value="2">2 гостя</option>
                      <option value="3">3 гостя</option>
                      <option value="4">4 гостя</option>
                    </select>
                  </div>
                  {form.checkin && form.checkout && nights > 0 && (
                    <div className="p-4 bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.2)] rounded-sm">
                      <p className="font-sans text-xs text-[#9A7A45]">
                        Продолжительность пребывания: <span className="text-[#C9A96E] font-semibold">{nights} {nightLabel}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Contacts */}
            {step === 3 && (
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-3">Шаг 4</p>
                <h1 className="font-display text-4xl text-[#E8D5A3] mb-8">Ваши контакты</h1>
                <div className="space-y-5">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Имя и фамилия *</label>
                    <input type="text" placeholder="Иван Иванов" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm placeholder-[#4a3f2f] focus:outline-none focus:border-[#C9A96E] transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Телефон *</label>
                    <input type="tel" placeholder="+7 (___) ___-__-__" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm placeholder-[#4a3f2f] focus:outline-none focus:border-[#C9A96E] transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Email</label>
                    <input type="email" placeholder="ivan@mail.ru" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm placeholder-[#4a3f2f] focus:outline-none focus:border-[#C9A96E] transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-[#9A7A45] mb-2">Пожелания</label>
                    <textarea placeholder="Поздний заезд, детская кроватка..." value={form.wishes}
                      onChange={(e) => setForm({ ...form, wishes: e.target.value })}
                      rows={3}
                      className="w-full bg-[#1E1A15] border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-[#E8D5A3] font-sans text-sm placeholder-[#4a3f2f] focus:outline-none focus:border-[#C9A96E] transition-colors resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-3">Шаг 5</p>
                <h1 className="font-display text-4xl text-[#E8D5A3] mb-8">Подтверждение</h1>
                <div className="space-y-0 mb-6">
                  {[
                    { label: "Номер", value: selectedRoom?.name ?? "—" },
                    { label: "Заезд", value: form.checkin || "—" },
                    { label: "Выезд", value: form.checkout || "—" },
                    { label: "Ночей", value: `${nights} ${nightLabel}` },
                    { label: "Гостей", value: form.guests },
                    { label: "Имя", value: form.name || "—" },
                    { label: "Телефон", value: form.phone || "—" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between py-3 border-b border-[rgba(201,169,110,0.1)]">
                      <span className="font-sans text-xs tracking-widest uppercase text-[#6b5a40]">{row.label}</span>
                      <span className="font-sans text-sm text-[#E8D5A3]">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Smart home summary */}
                {filledPrefsCount > 0 && (
                  <div className="mb-6 p-5 bg-[#171411] border border-[rgba(201,169,110,0.2)] rounded-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon name="Smartphone" size={15} className="text-[#C9A96E]" />
                      <span className="font-sans text-xs tracking-widest uppercase text-[#9A7A45]">Настройки умного номера</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {prefs.temperature && (
                        <div className="flex items-center gap-2">
                          <Icon name="Thermometer" size={13} className="text-[#6b5a40]" />
                          <span className="font-sans text-xs text-[#9A7A45]">Температура: <span className="text-[#E8D5A3]">{prefs.temperature}°C</span></span>
                        </div>
                      )}
                      {prefs.lighting && (
                        <div className="flex items-center gap-2">
                          <Icon name="Sun" size={13} className="text-[#6b5a40]" />
                          <span className="font-sans text-xs text-[#9A7A45]">Свет: <span className="text-[#E8D5A3]">{prefs.lighting}%</span></span>
                        </div>
                      )}
                      {prefs.curtains && (
                        <div className="flex items-center gap-2">
                          <Icon name="Wind" size={13} className="text-[#6b5a40]" />
                          <span className="font-sans text-xs text-[#9A7A45]">Шторы: <span className="text-[#E8D5A3]">{prefs.curtains}</span></span>
                        </div>
                      )}
                      {prefs.wakeTime && (
                        <div className="flex items-center gap-2">
                          <Icon name="AlarmClock" size={13} className="text-[#6b5a40]" />
                          <span className="font-sans text-xs text-[#9A7A45]">Подъём: <span className="text-[#E8D5A3]">{prefs.wakeTime}</span></span>
                        </div>
                      )}
                      {prefs.fragrance && (
                        <div className="flex items-center gap-2">
                          <Icon name="Sparkles" size={13} className="text-[#6b5a40]" />
                          <span className="font-sans text-xs text-[#9A7A45]">Аромат: <span className="text-[#E8D5A3]">{prefs.fragrance}</span></span>
                        </div>
                      )}
                      {prefs.tvChannel && (
                        <div className="flex items-center gap-2">
                          <Icon name="Tv" size={13} className="text-[#6b5a40]" />
                          <span className="font-sans text-xs text-[#9A7A45]">Канал: <span className="text-[#E8D5A3]">{prefs.tvChannel}</span></span>
                        </div>
                      )}
                    </div>
                    {prefs.extraNotes && (
                      <div className="mt-3 pt-3 border-t border-[rgba(201,169,110,0.1)]">
                        <p className="font-sans text-xs text-[#6b5a40]">Пожелания: <span className="text-[#9A7A45]">{prefs.extraNotes}</span></p>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-5 bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.25)] rounded-sm mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-xs tracking-widest uppercase text-[#9A7A45]">Итого к оплате</span>
                    <span className="font-display text-3xl text-[#C9A96E]">{total.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>

                <button onClick={() => setStep(5)}
                  className="w-full py-4 bg-[#C9A96E] text-[#0F0D0A] font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#E8D5A3] transition-colors duration-300 rounded-sm">
                  Отправить заявку на бронирование
                </button>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full border-2 border-[#C9A96E] flex items-center justify-center mx-auto mb-8">
                  <Icon name="Check" size={36} className="text-[#C9A96E]" />
                </div>
                <h1 className="font-display text-5xl text-[#E8D5A3] mb-4">Заявка отправлена</h1>
                <p className="font-sans text-sm text-[#6b5a40] mb-2">Спасибо, {form.name}!</p>
                <p className="font-sans text-sm text-[#6b5a40] mb-3">
                  Мы свяжемся с вами по номеру {form.phone} в течение 30 минут.
                </p>
                {filledPrefsCount > 0 && (
                  <p className="font-sans text-xs text-[#9A7A45] mb-10">
                    Настройки умного номера переданы — к вашему заезду всё будет готово.
                  </p>
                )}
                <button onClick={() => navigate("/")}
                  className="px-10 py-4 border border-[#C9A96E] text-[#C9A96E] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#C9A96E] hover:text-[#0F0D0A] transition-all duration-300 rounded-sm">
                  На главную
                </button>
              </div>
            )}

            {/* Nav buttons */}
            {step < 5 && (
              <div className="flex gap-4 mt-8">
                {step > 0 && (
                  <button onClick={back}
                    className="px-8 py-3 border border-[rgba(201,169,110,0.3)] text-[#9A7A45] font-sans text-xs tracking-widest uppercase hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300 rounded-sm">
                    Назад
                  </button>
                )}
                {step < 4 && (
                  <button onClick={next} disabled={!canNext()}
                    className={`flex-1 py-3 font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 rounded-sm ${
                      canNext()
                        ? "bg-[#C9A96E] text-[#0F0D0A] hover:bg-[#E8D5A3]"
                        : "bg-[#2a2218] text-[#4a3f2f] cursor-not-allowed"
                    }`}>
                    {step === 1 ? (filledPrefsCount > 0 ? "Продолжить" : "Пропустить") : "Продолжить"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          {step < 5 && (
            <div className="md:col-span-1">
              <div className="bg-[#171411] border border-[rgba(201,169,110,0.15)] rounded-sm p-6 sticky top-6">
                <p className="font-sans text-xs tracking-[0.25em] uppercase text-[#C9A96E] mb-4">Ваш выбор</p>
                {selectedRoom ? (
                  <div className="mb-5">
                    <p className="font-display text-xl text-[#E8D5A3] mb-1">{selectedRoom.name}</p>
                    <p className="font-sans text-xs text-[#6b5a40]">{selectedRoom.size}</p>
                  </div>
                ) : (
                  <p className="font-sans text-xs text-[#4a3f2f] mb-5">Номер не выбран</p>
                )}

                {filledPrefsCount > 0 && (
                  <div className="mb-5 p-3 bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="Smartphone" size={12} className="text-[#C9A96E]" />
                      <span className="font-sans text-xs text-[#9A7A45]">Умный номер</span>
                    </div>
                    <p className="font-sans text-xs text-[#6b5a40]">{filledPrefsCount} настройки заданы</p>
                  </div>
                )}

                {(form.checkin || form.checkout) && (
                  <div className="space-y-2 mb-5">
                    {form.checkin && (
                      <div className="flex justify-between">
                        <span className="font-sans text-xs text-[#6b5a40]">Заезд</span>
                        <span className="font-sans text-xs text-[#E8D5A3]">{form.checkin}</span>
                      </div>
                    )}
                    {form.checkout && (
                      <div className="flex justify-between">
                        <span className="font-sans text-xs text-[#6b5a40]">Выезд</span>
                        <span className="font-sans text-xs text-[#E8D5A3]">{form.checkout}</span>
                      </div>
                    )}
                  </div>
                )}
                {selectedRoom && (
                  <>
                    <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-sans text-xs text-[#6b5a40] mb-1">{nights} {nightLabel}</p>
                        <p className="font-display text-2xl text-[#C9A96E]">{total.toLocaleString("ru-RU")} ₽</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
