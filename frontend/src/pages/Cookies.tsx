import LegalLayout from "../components/layout/LegalLayout";

export default function Cookies() {
  return (
    <LegalLayout
      title="Политика cookies"
      description="Как Sweasy использует cookies и как вы можете управлять своими настройками."
    >
      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          Что такое cookies
        </h2>
        <p>
          Cookies — это небольшие текстовые файлы, которые сайт сохраняет в вашем браузере при посещении.
          Они помогают сайту запомнить ваши предпочтения и улучшить качество взаимодействия.
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          Какие cookies мы используем
        </h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Необходимые</strong> — обеспечивают базовую работу сайта (тема, язык, согласие на cookies);
          </li>
          <li>
            <strong>Аналитические</strong> — помогают понять, как посетители используют сайт (только с согласия);
          </li>
          <li>
            <strong>Функциональные</strong> — запоминают ваши настройки и предпочтения.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          Управление cookies
        </h2>
        <p>
          Вы можете в любой момент изменить своё решение через настройки браузера или очистить локальное
          хранилище сайта. Отключение cookies может повлиять на функциональность сайта.
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          Сторонние сервисы
        </h2>
        <p className="text-on-surface-variant dark:text-white/60">
          [Placeholder — список сторонних сервисов, если используются: Google Analytics, Meta Pixel и т.д.]
        </p>
      </section>
    </LegalLayout>
  );
}
