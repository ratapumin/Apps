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

  const newUpdatedData = {
    Pic: data.attributes.Pic.data,
    Title: data.attributes.Title,
    Descriptions: data.attributes.Descriptions,
  };

  const handleSave = async () => {
    setUpdatedData(newUpdatedData);
    console.log(newUpdatedData);

    // Create a FormData object
    const formData = new FormData();
    formData.append("Title", newUpdatedData.Title);
    formData.append("Descriptions", newUpdatedData.Descriptions);
    formData.append("Pic", data.attributes.Pic.data);

    try {
      const uploadRes = await axios.post(
        "http://localhost:1337/api/upload",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("Image uploaded successfully:", uploadRes.data);

      const updateRes = await axios.put(
        `http://localhost:1337/api/apps/${localStorage.getItem(
          "selectedItemId"
        )}?populate=*`,
        {
          Pic: {
            url: uploadRes.data[0].url,
          },
          Title: newUpdatedData.Title,
          Descriptions: newUpdatedData.Descriptions,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("Record updated successfully:", updateRes.data);
      window.alert("Record updated successfully:", updateRes.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      window.alert("Error uploading image:", error);
    }
  };

  return (
    <>
      <center>
        {isEditing ? (
          <div>
            <img
              src={`http://localhost:1337${data.attributes.Pic.data}`}
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
                    Pic: {
                      ...data.attributes.Pic,
                      data: e.target.files[0],
                    },
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
                setUpdatedData(newUpdatedData);
                console.log(newUpdatedData);
                const selectedItemId = localStorage.getItem("selectedItemId");

                // Create a FormData object
                const formData = new FormData();
                formData.append("files", newUpdatedData.Pic); // Append the updated image to FormData
                formData.append("text", newUpdatedData.Title);
                formData.append("text", newUpdatedData.Descriptions);
                // Send the FormData object using axios.post
                axios
                  .post("http://localhost:1337/api/upload", formData, {
                    headers: {
                      Authorization: `Bearer ${jwt}`,
                      "Content-Type": "multipart/form-data", // Set the Content-Type header to multipart/form-data
                    },
                  })
                  .then((response) => {
                    console.log(
                      "Image uploaded successfully:",
                      response.data[0]
                    );
                    const imageUrl = response.data[0].url;

                    // Update the record with the new image URL
                    axios
                      .put(
                        `http://localhost:1337/api/apps/${selectedItemId}?populoate=*`,
                        {
                          Pic: {
                            url: imageUrl,
                          },
                          Title: newUpdatedData.Title,
                          Descriptions: newUpdatedData.Descriptions,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${jwt}`,
                          },
                        }
                      )
                      .then((res) => {
                        console.log("Record updated successfully:", res.data);
                        window.alert("Record updated successfully:", res.data);
                        setIsEditing(false);
                      })
                      .catch((error) => {
                        console.error("Error updating record:", error);
                        window.alert("Error updating record:", error);
                      });
                  })
                  .catch((error) => {
                    console.error("Error uploading image:", error);
                    window.alert("Error uploading image:", error);
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
