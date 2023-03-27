import { useState, useEffect } from "react";
import jsCookie from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";

export default function CallID() {
  const [data, setData] = useState({});
  const [jwt, setJwt] = useState("");
  const router = useRouter();
  const [updatedData, setUpdatedData] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = jsCookie.get("jwt");
    setJwt(token);
    const selectedItemId = localStorage.getItem("selectedItemId");
    const idAPI = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/apps/${selectedItemId}?populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
        setUpdatedData(res.data.data.attributes);
        console.log(res.data.data.attributes.Pic.data.attributes.name);
        console.log(selectedItemId);
        console.log(res.data.data.attributes);
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
      <center>
        {isEditing ? (
          <div>
            <img
              src={`http://localhost:1337${data.attributes.Pic.data.attributes.url}`}
              width="200px"
              height="200px"
            />
            <h4>Title : {data.attributes.Title}</h4>
            <p>Descriptions : {data.attributes.Descriptions}</p>
            <input
              type="file"
              onChange={(e) =>
                setData({
                  ...data,
                  attributes: {
                    ...data.attributes,
                    Pic: e.target.files[0],
                  },
                })
              }
            />

            <br />
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
            <br />

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
            <br />
            <button
              onClick={() => {
                const newUpdatedData = {
                  ...updatedData,
                  Title: data.attributes.Title,
                  Descriptions: data.attributes.Descriptions,
                  Pic: data.attributes.Pic.attributes,
                };
                setUpdatedData(newUpdatedData);
                const selectedItemId = localStorage.getItem("selectedItemId");
                axios
                  .put(
                    `http://localhost:1337/api/apps/${selectedItemId}?populate=*`,
                    {
                      data: {
                        Title: data.attributes.Title,
                        Descriptions: data.attributes.Descriptions,
                      },
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${jwt}`,
                      },
                    }
                  )
                  .then((res) => {
                    window.alert("Record updated successfully:", res.data);
                    setIsEditing(false);
                  })
                  .catch((error) => {
                    window.alert("Error updating record:", error);
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
