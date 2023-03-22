import { useState, useEffect } from "react";
import Styles from "@/styles/demo.module.css";
import jsCookie from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";

export default function CallID() {
  const [data, setData] = useState({});
  const [jwt, setJwt] = useState("");
  const router = useRouter();
  const { itemid } = router.query;
  const strapiBaseUrl = `http://localhost:1337/api/${itemid}`;
  const collectionName = `apps`;
  const [isEditing, setIsEditing] = useState(false);
  const recordId = `${itemid}`;

  useEffect(() => {
    console.log(itemid);
    const token = jsCookie.get("jwt");
    setJwt(token);
    const idAPI = async () => {
      try {
        const token = jsCookie.get("jwt");
        const res = await axios.get(
          `http://localhost:1337/api/apps/${itemid}?populate=*  `,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    idAPI();
  }, []);

  if (!data || !data.attributes || !data.attributes.Pic) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h4>{data.attributes.Title}</h4>
        <p>{data.attributes.Descriptions}</p>
      </div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={data.attributes.Title}
            onChange={(e) =>
              setData({
                ...data,
                attributes: { ...data.attributes, Title: e.target.value },
              })
            }
          />
          <textarea
            value={data.attributes.Descriptions}
            onChange={(e) =>
              setData({
                ...data,
                attributes: {
                  ...data.attributes,
                  Descriptions: e.target.value,
                },
              })
            }
          />
          <button
            onClick={() => {
              axios
                .put(
                  `${strapiBaseUrl}/${collectionName}/${recordId.data}`,
                  data.attributes,
                  {
                    headers: { Authorization: `Bearer ${jwt}` },
                  }
                )
                .then((response) => {
                  console.log("Record updated successfully:", response.data);
                  setIsEditing(false);
                })
                .catch((error) => {
                  console.error("Error updating record:", error);
                });
            }}
          >
            Save
          </button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <img
            src={`http://localhost:1337${data.attributes.Pic.data.attributes.url}`}
          />
          <p className={Styles.h3}>{data.attributes.Title}</p>
          <div>
            <h4>{data.attributes.Title}</h4>
            <p>{data.attributes.Descriptions}</p>
          </div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </>
  );
}
