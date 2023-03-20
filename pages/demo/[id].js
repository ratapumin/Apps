import axios from "axios";

export async function getStaticPaths() {
  const res = await fetch("http://localhost:1337/api/apps?populate=*");
  const posts = await res.json();
  const paths = post.map((post) => ({
    params: { id: post.id.toString() },
  }));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const id = params.id;
  const res = await axios.get(
    "http://localhost:1337/api/apps/" + id + "?populate=*",
    { method: "GET" }
  );
  const data = await res.json();
  return {
    props: { posts: data },
  };
}

export default function itemDetail({ posts }) {
  return (
    <>
      <h1>Id= {posts.id}</h1>
    </>
  );
}
