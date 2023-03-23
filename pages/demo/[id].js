import { useState, useEffect } from "react";

import jsCookie from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";

export default function CallID() {
  const [data, setData] = useState({});
  const [jwt, setJwt] = useState("");
  const router = useRouter();
  const [updatedData, setUpdatedData] = useState({});

  const { itemid } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const token = jsCookie.get("jwt");
    setJwt(token);
    const idAPI = async () => {
      try {
        const token = jsCookie.get("jwt");
        const res = await axios.get(
          `http://localhost:1337/api/apps/${itemid}?populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
        setUpdatedData(res.data.data.attributes);
      } catch (err) {
        console.log(err);
      }
    };

    idAPI();
  }, []);
  console.log(itemid);
  if (!data || !data.attributes || !data.attributes.Pic) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <center>
        {isEditing ? (
          <div>
            <h4>Title : {data.attributes.Title}</h4>
            <p>Descriptions : {data.attributes.Descriptions}</p>
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
                const newUpdatedData = {
                  ...updatedData,
                  Title: data.attributes.Title,
                  Descriptions: data.attributes.Descriptions,
                };
                setUpdatedData(newUpdatedData);
                console.log(newUpdatedData);
                axios
                  .put(
                    `http://localhost:1337/api/apps/${itemid}?populate=*`,
                    newUpdatedData,
                    {
                      headers: {
                        Authorization: `Bearer ${jwt}`,
                      },
                    }
                  )
                  .then((res) => {
                    console.log("Record updated successfully:", res.data);
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
              width="200px"
              height="200px"
            />
            <div>
              <h4>Title : {data.attributes.Title}</h4>
              <p>Descriptions : {data.attributes.Descriptions}</p>
            </div>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        )}
      </center>
    </>
  );
}
