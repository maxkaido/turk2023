import Head from "next/head";
import { getTemplate } from "@/network";
import Navbar from "@/components/Navbar";

export default function TemplatePage({ template }) {
  if (!template) {
    return null;
  }

  return (
    <>
      <Head></Head>
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
