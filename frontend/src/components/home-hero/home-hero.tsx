import { AuthLogin } from '../auth-login/auth-login';
import type { HomeHeroProps } from './home-hero.types';

export function HomeHero({ title, description, onGoogleLogin }: HomeHeroProps) {
  return (
    <main className="home-hero" aria-labelledby="home-title">
      <section className="home-hero__card">
        <p className="home-hero__tag">Mobile first</p>
        <h1 id="home-title">{title}</h1>
        <p>{description}</p>
        <AuthLogin onGoogleLogin={onGoogleLogin} />
      </section>
    </main>
  );
}
