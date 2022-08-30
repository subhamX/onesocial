import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="scroll-smooth">
      <Head />

      <meta property="og:title" content="One Social" />
				<meta property="og:image" content='https://raw.githubusercontent.com/subhamX/onesocial/main/_docs/screenshots/landing5.png' />
				<meta
					property="og:description"
					content="The ultimate super app for creators and their audience"
				/>
				<meta property="og:url" content='https://www.onesocial.tk/' />
				<meta
					name="description"
					content="The ultimate super app for creators and their audience"
				/>
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
      <meta name="apple-mobile-web-app-title" content="One Social" />
      <meta name="application-name" content="One Social" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff"></meta>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
