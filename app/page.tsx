/* Native images keep the supplied logo and art-directed hero crops. */
/* eslint-disable @next/next/no-img-element */
import { LaunchForm } from "./launch-form";
import { siteName } from "./site";

export default function Home() {
  return (
    <>
      <div className="layout">
        <header className="brand">
          <img src="/images/logo.svg" width="158" height="33" alt="Base Apparel" />
        </header>
        <picture className="hero">
          <source media="(min-width: 48rem)" srcSet="/images/hero-desktop.jpg" width="610" height="800" />
          <img src="/images/hero-mobile.jpg" width="375" height="250" alt="A model in a peach button-up shirt, previewing the Base Apparel collection" fetchPriority="high" />
        </picture>
        <main className="content">
          <h1><span className="title-light">We&apos;re</span> <span className="title-strong"><span>coming</span> <span>soon</span></span></h1>
          <p className="intro">Hello fellow shoppers! We&apos;re currently building our new fashion store. Add your email below to stay up-to-date with announcements and our launch deals.</p>
          <LaunchForm />
        </main>
        <footer><span className="site-name">{siteName}</span>. Challenge by <a href="https://www.frontendmentor.io/challenges/base-apparel-coming-soon-page-5d46b47f8db8a7063f9331a0">Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.</footer>
      </div>
    </>
  );
}
