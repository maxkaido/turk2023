import Head from "next/head";
import { getTemplate } from "@/network";

export default function TemplatePage({ template }) {
  if (!template) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{template.title} - Jobot</title>
        <meta name="description" content={template.description} />
        <link rel="icon" href="/jobot_icon.png" type="image/png" />
        <meta property="og:image" content="/jobot_meta.png" />
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const template = await getTemplate(context.params.slug);

  return {
    props: { template },
  };
}
