import type { CTAConfig } from "../../config/types";

interface Props {
  config: CTAConfig;
}

export default function CTA({ config }: Props) {
  return (
    <section className="py-20 md:py-32 px-6 md:px-8 flex flex-col items-center text-center">
      <h2 className="font-headline font-black text-4xl md:text-8xl text-primary tracking-tighter uppercase leading-none max-w-4xl">
        {config.headline}
      </h2>
    </section>
  );
}
