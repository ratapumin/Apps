import { useState, useEffect } from "react";
import Styles from "@/styles/demo.module.css";

export default function Home() {
  const [data, setData] = useState([]);

  const callAPI = async () => {
    try {
      const res = await fetch(`http://localhost:1337/api/apps?populate=*`);
      const data = await res.json();
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    callAPI();
  }, []);
  return (
    <>
      <div className={Styles.bg}>
        <div className={Styles.card_container}>
          <h6 className={Styles.h6}>Your Pre-title goes here</h6>
          <h3 className={Styles.h1}>Application demo build under SaaS</h3>
          {data.data?.map((item) => (
            <div className={Styles.card}>
              <div className={Styles.front}>
                <div key={item.id}>
                  <img
                    className={Styles.solidImg}
                    src={`http://localhost:1337${item.attributes.Pic.data.attributes.url}`}
                  />
                  <p className={Styles.h3}>{item.attributes.Title}</p>
                </div>
              </div>
              <div className={Styles.back}>
                <div>
                  <h4 className={Styles.h4}>{item.attributes.Title}</h4>
                  <p className={Styles.boxtext}>
                    {item.attributes.Descriptions}
                  </p>
                  <p className={Styles.button}> eiei</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
