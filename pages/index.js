import Link from "next/link";
import Styles from "@/styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  return (
    <>
      <div className={Styles.bg}>
        <div className={Styles.container}>
          <h1 className={Styles.h1}>SaaS</h1>
          <h3 className={Styles.h3}>
            คณะวิศวกรรมศาสตาร์ ม.อ. ก้าวสู่ยุคของการ
          </h3>
          <h3 className={Styles.h3}>พัฒนาซอฟต์แวร์ อย่างไร้ขีดจำกัด</h3>

          <Link className={Styles.button} href="/about">
            About
          </Link>
        </div>
      </div>
    </>
  );
}
