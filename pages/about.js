import Styles from "@/styles/about.module.css";
import Image from "next/image";

export default function about() {
  return (
    <div className={Styles.bg}>
      <div className={Styles.container}>
        <div className={Styles.lcard}>
          <div className={Styles.lcard__text}>
            <div className={Styles.box1}>
              <div className={Styles.body}>
                <div className={Styles.wrapper}>
                  <div className={Styles.card}>
                    <h1 className={Styles.h5}>
                      <span className={Styles.enclosed}>Ab</span>out
                    </h1>
                  </div>
                </div>
              </div>
              <p className={Styles.p}>
                คณะวิศวกรรมศาสตาร์ มหาวิทยาลัยสงขลานครินทร์
                เราได้ออกแบบและวางรากฐานของแพลตฟอร์มสำหรับการพัฒนา
                แอพพลิเคชันสมัยใหม่ที่ทำงานภายใต้สถาปัตยกรรม Microservice
                มากกว่า 5 ปีแล้ว
              </p>
            </div>
            <div className={Styles.box1}>
              <p className={Styles.p}>
                เราได้พัฒนาแอพพลิเคชันที่พร้อมใช้งานภายในองค์กร (Internal
                Application) ที่เราทำงานภายใต้แนวคิดของ SaaS (Software as a
                Service) เราได้ออกแบบให้บุคลากรของ
                คณะวิศวกรรมศาสตาร์สามารถสร้างและใช้งานแอพพลิเคชันได้ด้วยตนเอง
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
