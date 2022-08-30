import Head from "next/head";

type PropsType = { title?: string };

export const MetaHead = ({ title }: PropsType) => (
  <Head>
    <title>{`One Social ${title ? ` - ${title}` : ""}`}</title>
  </Head>
);
