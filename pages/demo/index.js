import Image from "next/image";
import Styles from "@/styles/demo.module.css";
import Link from "next/link";

export const getStaticProps = async () => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
  const data = await res.json();
  return {
    props: { demo: data },
  };
};

export default function demo({ demo }) {
  return (
    <>
      <div clasName={Styles.body}>
        <div className={Styles.bg}>
          <div className={Styles.card_container}>
            <h6 className={Styles.h6}>Your pre-title goes here</h6>
            <h1 className={Styles.h1}>Application demo build under SaaS</h1>
            <div className={Styles.card}>
              <div className={Styles.front}>
                <Image
                  className={Styles.solidImg}
                  src="/icon1.png"
                  width={250}
                  height={250}
                  alt="icon1"
                />
                <h3 className={Styles.h3}>easy Generate fully chart</h3>
              </div>

              <div className={Styles.back}>
                <div className={Styles.boxtext}>
                  <h4 className={Styles.h4}>Easy Generate fully chart</h4>
                  <p>
                    box1 สร้างกราฟแบบง่าย ๆ
                    เพียงแค่คุณเชื่อมต่อข้อมูลที่คุณมีอยู่จาก Google Sheet หรือ
                    Microsoft Excel หรือใส่ข้อมูลผ่าน Storactive
                    ให้คุณพร้อมนำไปแชร์หรือนำเสนอได้ทุกที่
                  </p>
                </div>
                {demo.map((demo) => (
                  <Link
                    href={"demo/" + demo.id}
                    key={demo.id}
                    className={Styles.button}
                  >
                    Try me
                  </Link>
                ))}
              </div>
            </div>

            <div className={Styles.card}>
              <div className={Styles.front}>
                <Image
                  className={Styles.solidImg}
                  src="/icon2.jpg"
                  width={250}
                  height={250}
                  alt="icon2"
                />
                <h3 className={Styles.h3}>Your Articless Title Goge Here</h3>
              </div>
              <div className={Styles.back}>
                <div className={Styles.boxtext}>
                  <h4 className={Styles.h4}> Your Articless Title Goge Here</h4>
                  <p>
                    box2 There is just enough space here for several lines of
                    text. Make sure you get your message across clearly yet
                    concisely.
                  </p>
                </div>
                {demo.map((demo) => (
                  <Link
                    href={"demo/" + demo.id}
                    key={demo.id}
                    className={Styles.button}
                  >
                    Try me
                  </Link>
                ))}
              </div>
            </div>

            <div className={Styles.card}>
              <div className={Styles.front}>
                <Image
                  className={Styles.solidImg}
                  src="/icon3.png"
                  width={250}
                  height={250}
                  alt="icon3"
                />
                <h3 className={Styles.h3}>Your Articless Title Goge Here</h3>
              </div>
              <div className={Styles.back}>
                <div className={Styles.boxtext}>
                  <h4 className={Styles.h4}> Your Articless Title Goge Here</h4>
                  <p>
                    box3 There is just enough space here for several lines of
                    text. Make sure you get your message across clearly yet
                    concisely.
                  </p>
                </div>

                {demo.map((demo) => (
                  <Link
                    href={"demo/" + demo.id}
                    key={demo.id}
                    className={Styles.button}
                  >
                    Try me
                  </Link>
                ))}
              </div>
            </div>

            <div className={Styles.card}>
              <div className={Styles.front}>
                <Image
                  className={Styles.solidImg}
                  src="/icon4.png"
                  width={250}
                  height={250}
                  alt="icon4"
                />
                <h3 className={Styles.h3}>Your Articless Title Goge Here</h3>
              </div>
              <div className={Styles.back}>
                <div className={Styles.boxtext}>
                  <h4 className={Styles.h4}> Your Articless Title Goge Here</h4>
                  <p>
                    box4 There is just enough space here for several lines of
                    text. Make sure you get your message across clearly yet
                    concisely.
                  </p>
                </div>

                {demo.map((demo) => (
                  <Link
                    href={"demo/" + demo.id}
                    key={demo.id}
                    className={Styles.button}
                  >
                    Try me
                  </Link>
                ))}
              </div>
            </div>
            <div className={Styles.card}>
              <div className={Styles.front}>
                <Image
                  className={Styles.solidImg}
                  src="/icon5.png"
                  width={250}
                  height={250}
                  alt="icon5"
                />
                <h3 className={Styles.h3}>Your Articless Title Goge Here</h3>
              </div>
              <div className={Styles.back}>
                <div className={Styles.boxtext}>
                  <h4 className={Styles.h4}> Your Articless Title Goge Here</h4>
                  <p>
                    box5 There is just enough space here for several lines of
                    text. Make sure you get your message across clearly yet
                    concisely.
                  </p>
                </div>

                {demo.map((demo) => (
                  <Link
                    href={"demo/" + demo.id}
                    key={demo.id}
                    className={Styles.button}
                  >
                    Try me
                  </Link>
                ))}
              </div>
            </div>
            <div className={Styles.card}>
              <div className={Styles.front}>
                <Image
                  className={Styles.solidImg}
                  src="/icon6.png"
                  width={250}
                  height={250}
                  alt="icon6"
                />
                <h3 className={Styles.h3}>Your Articless Title Goge Here</h3>
              </div>
              <div className={Styles.back}>
                <div className={Styles.boxtext}>
                  <h4 className={Styles.h4}> Your Articless Title Goge Here</h4>
                  <p>
                    box6 There is just enough space here for several lines of
                    text. Make sure you get your message across clearly yet
                    concisely.
                  </p>
                </div>

                {demo.map((demo) => (
                  <Link
                    href={"demo/" + demo.id}
                    key={demo.id}
                    className={Styles.button}
                  >
                    Try me
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
