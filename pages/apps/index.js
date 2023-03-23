import { useState, useEffect } from "react";
import Styles from "@/styles/demo.module.css";
import Link from "next/link";
import jsCookie from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    const token = jsCookie.get("jwt");
    setJwt(token);
  }, []);

  const callAPI = async () => {
    try {
      const token = jsCookie.get("jwt");
      const res = await axios.get(`http://localhost:1337/api/apps?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data.data);
      setJwt(token);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (itemid) => {
    router.push({
      pathname: `../demo/[id].js`,
      query: { itemid },
    });
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
          {data.map((item) => (
            <div className={Styles.card} key={item.id}>
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

                  <p
                    className={Styles.button}
                    onClick={() => handleClick(item.id)}
                  >
                    click
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
