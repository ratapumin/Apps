import "@/styles/globals.css";
import Layout from "@/components/Layout";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
