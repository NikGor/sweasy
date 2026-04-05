import LegalLayout from "../components/layout/LegalLayout";

export default function Terms() {
  return (
    <LegalLayout
      title="Условия использования"
      description="Условия использования сайта и услуг Sweasy — авторских туров по Швейцарии."
    >
      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          1. Принятие условий
        </h2>
        <p>
          Используя сайт Sweasy, вы соглашаетесь с настоящими Условиями. Если вы не согласны, пожалуйста,
          не используйте сайт.
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          2. Описание услуг
        </h2>
        <p>
          Sweasy предоставляет услуги частного гида по Швейцарии — авторские туры, экскурсии и консультации.
          Все туры организуются индивидуально и согласовываются с клиентом.
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          3. Бронирование и оплата
        </h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Бронирование подтверждается после согласования даты и деталей тура;</li>
          <li>Условия оплаты обсуждаются индивидуально;</li>
          <li>Отмена бронирования регулируется отдельным соглашением.</li>
        </ul>
        <p className="mt-2 text-xs text-on-surface-variant dark:text-white/50">
          [Placeholder — прописать подробные условия отмены и возврата]
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          4. Ответственность
        </h2>
        <p>
          Мы делаем всё возможное для безопасности и комфорта клиентов, однако не несём ответственности
          за форс-мажорные обстоятельства (погодные условия, транспортные сбои и т.п.).
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          5. Интеллектуальная собственность
        </h2>
        <p>
          Все материалы сайта (тексты, фотографии, дизайн) являются собственностью Sweasy и защищены
          авторским правом. Использование без разрешения запрещено.
        </p>
      </section>

      <section>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-tighter mb-2 sm:mb-3">
          6. Применимое право
        </h2>
        <p>
          К настоящим условиям применяется законодательство Швейцарии. Все споры разрешаются в судах
          по месту нахождения оператора.
        </p>
      </section>
    </LegalLayout>
  );
}
