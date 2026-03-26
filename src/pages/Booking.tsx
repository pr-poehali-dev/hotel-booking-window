import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";

const rooms = [
  { id: 1, name: "Классический номер", price: 8900, size: "32 м²" },
  { id: 2, name: "Делюкс номер", price: 14500, size: "48 м²" },
  { id: 3, name: "Президентский люкс", price: 42000, size: "120 м²" },
];

const steps = ["Номер", "Даты и гости", "Контакты", "Подтверждение"];

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = Number(searchParams.get("room")) || null;

  const [step, setStep] = useState(preselectedId ? 1 : 0);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(preselectedId);
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
    if (step === 1) return form.checkin && form.checkout;
    if (step === 2) return form.name && form.phone;
    return true;
  };

  const next = () => { if (canNext()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

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
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-sans text-xs font-semibold transition-all duration-300 ${
                  i < step ? "bg-[#C9A96E] border-[#C9A96E] text-[#0F0D0A]" :
                  i === step ? "border-[#C9A96E] text-[#C9A96E]" :
                  "border-[rgba(201,169,110,0.2)] text-[#4a3f2f]"
                }`}>
                  {i < step ? <Icon name="Check" size={14} /> : i + 1}
                </div>
                <span className={`font-sans text-xs tracking-wider uppercase hidden sm:block ${
                  i === step ? "text-[#C9A96E]" : "text-[#4a3f2f]"
                }`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-colors duration-300 ${
                  i < step ? "bg-[#C9A96E]" : "bg-[rgba(201,169,110,0.15)]"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form */}
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

            {/* Step 1: Dates */}
            {step === 1 && (
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-3">Шаг 2</p>
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

            {/* Step 2: Contacts */}
            {step === 2 && (
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-3">Шаг 3</p>
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

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-3">Шаг 4</p>
                <h1 className="font-display text-4xl text-[#E8D5A3] mb-8">Подтверждение</h1>
                <div className="space-y-3 mb-8">
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

                <div className="p-5 bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.25)] rounded-sm mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-xs tracking-widest uppercase text-[#9A7A45]">Итого к оплате</span>
                    <span className="font-display text-3xl text-[#C9A96E]">{total.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="w-full py-4 bg-[#C9A96E] text-[#0F0D0A] font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#E8D5A3] transition-colors duration-300 rounded-sm">
                  Отправить заявку на бронирование
                </button>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full border-2 border-[#C9A96E] flex items-center justify-center mx-auto mb-8">
                  <Icon name="Check" size={36} className="text-[#C9A96E]" />
                </div>
                <h1 className="font-display text-5xl text-[#E8D5A3] mb-4">Заявка отправлена</h1>
                <p className="font-sans text-sm text-[#6b5a40] mb-2">Спасибо, {form.name}!</p>
                <p className="font-sans text-sm text-[#6b5a40] mb-10">
                  Мы свяжемся с вами по номеру {form.phone} в течение 30 минут для подтверждения.
                </p>
                <button onClick={() => navigate("/")}
                  className="px-10 py-4 border border-[#C9A96E] text-[#C9A96E] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#C9A96E] hover:text-[#0F0D0A] transition-all duration-300 rounded-sm">
                  На главную
                </button>
              </div>
            )}

            {/* Navigation buttons */}
            {step < 4 && (
              <div className="flex gap-4 mt-8">
                {step > 0 && (
                  <button onClick={back}
                    className="px-8 py-3 border border-[rgba(201,169,110,0.3)] text-[#9A7A45] font-sans text-xs tracking-widest uppercase hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300 rounded-sm">
                    Назад
                  </button>
                )}
                {step < 3 && (
                  <button onClick={next} disabled={!canNext()}
                    className={`flex-1 py-3 font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 rounded-sm ${
                      canNext()
                        ? "bg-[#C9A96E] text-[#0F0D0A] hover:bg-[#E8D5A3]"
                        : "bg-[#2a2218] text-[#4a3f2f] cursor-not-allowed"
                    }`}>
                    Продолжить
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          {step < 4 && (
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
