import LegalLayout from "../components/layout/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout
      title="Политика конфиденциальности"
      description="Как Sweasy собирает, использует и защищает ваши персональные данные. GDPR и швейцарский FADP."
    >
      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          1. Общие положения
        </h2>
        <p>
          Настоящая Политика конфиденциальности описывает, как Sweasy («мы», «нас» или «наш») собирает,
          использует и защищает ваши персональные данные при посещении нашего сайта и использовании наших услуг.
        </p>
        <p className="mt-2">
          <em className="text-on-surface-variant dark:text-white/50">
            [Placeholder — добавить полные реквизиты оператора данных]
          </em>
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          2. Какие данные мы собираем
        </h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Контактные данные, которые вы предоставляете добровольно (имя, email, Telegram);</li>
          <li>Технические данные (IP-адрес, тип браузера, операционная система);</li>
          <li>Данные использования (посещённые страницы, время визита);</li>
          <li>Cookies и аналогичные технологии.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          3. Как мы используем данные
        </h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Для ответа на ваши запросы и организации туров;</li>
          <li>Для улучшения качества сайта и услуг;</li>
          <li>Для информирования о новых предложениях (только с вашего согласия);</li>
          <li>Для выполнения юридических обязательств.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          4. Передача данных третьим лицам
        </h2>
        <p>
          Мы не продаём ваши данные. Передача третьим лицам возможна только в случаях, предусмотренных
          законодательством, либо с вашего явного согласия.
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          5. Ваши права (GDPR / FADP)
        </h2>
        <p>Согласно GDPR (ЕС) и швейцарскому FADP, вы имеете право:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Получить информацию о хранимых данных;</li>
          <li>Требовать исправления или удаления данных;</li>
          <li>Ограничить обработку данных;</li>
          <li>Отозвать согласие в любое время;</li>
          <li>Подать жалобу в надзорный орган.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          6. Контакты
        </h2>
        <p>
          По всем вопросам, связанным с обработкой персональных данных, пишите на{" "}
          <a href="mailto:hello@example.com" className="text-[#FF2D55] dark:text-[#00FF9D] hover:underline font-bold">
            [Placeholder — email]
          </a>
          .
        </p>
        <p className="mt-2 text-xs text-on-surface-variant dark:text-white/50">
          [Placeholder — указать реальный email и почтовый адрес]
        </p>
      </section>
    </LegalLayout>
  );
}
