import LegalLayout from "../components/layout/LegalLayout";

export default function Impressum() {
  return (
    <LegalLayout
      title="Impressum"
      description="Юридические и контактные данные оператора сайта Sweasy в соответствии со швейцарским законодательством."
    >
      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          Оператор сайта
        </h2>
        <div className="space-y-1">
          <p className="font-bold">Sweasy</p>
          <p className="text-on-surface-variant dark:text-white/60">
            [Placeholder — название юрлица/ИП]
          </p>
          <p className="text-on-surface-variant dark:text-white/60">
            [Placeholder — улица, дом]
          </p>
          <p className="text-on-surface-variant dark:text-white/60">
            [Placeholder — индекс, город], Switzerland
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          Контактная информация
        </h2>
        <div className="space-y-1">
          <p>
            Email:{" "}
            <a href="mailto:hello@example.com" className="text-[#FF2D55] dark:text-[#00FF9D] hover:underline font-bold">
              [Placeholder — email]
            </a>
          </p>
          <p>
            Telegram:{" "}
            <a href="https://t.me/YOUR_TELEGRAM" target="_blank" rel="noopener noreferrer" className="text-[#FF2D55] dark:text-[#00FF9D] hover:underline font-bold">
              [Placeholder — Telegram]
            </a>
          </p>
          <p className="text-on-surface-variant dark:text-white/60">[Placeholder — телефон]</p>
        </div>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          Регистрационные данные
        </h2>
        <div className="space-y-1 text-on-surface-variant dark:text-white/60">
          <p>[Placeholder — UID (CHE-XXX.XXX.XXX)]</p>
          <p>[Placeholder — № в торговом реестре]</p>
          <p>[Placeholder — НДС номер]</p>
        </div>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          Ответственный за содержание
        </h2>
        <p className="text-on-surface-variant dark:text-white/60">
          [Placeholder — ФИО ответственного лица]
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          Отказ от ответственности
        </h2>
        <p>
          Несмотря на тщательную проверку содержания, мы не несём ответственности за содержание внешних
          ссылок. За содержание связанных страниц отвечают исключительно их операторы.
        </p>
      </section>
    </LegalLayout>
  );
}
