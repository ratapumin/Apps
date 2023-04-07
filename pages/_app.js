import "@/styles/globals.css";
import Layout from "@/components/Layout";
import "@sweetalert2/theme-borderless/borderless.css";

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
