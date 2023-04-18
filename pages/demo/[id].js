import { useState, useEffect } from "react";
import jsCookie from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function CallID() {
  const [data, setData] = useState({});
  const [jwt, setJwt] = useState("");
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [shouldUpdateImage, setShouldUpdateImage] = useState(false);

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
        setImageURL(
          `http://localhost:1337${res.data.data.attributes.Pic.data.attributes.url}`
        );
      } catch (err) {
        console.log(err);
      }
    };

    idAPI();
  }, []);

  if (!data || !data.attributes) {
    return <div>Loading...</div>;
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setShouldUpdateImage(true);
  };

  const handleSave = async () => {
    try {
      let updateData = {
        data: {
          Title: data.attributes.Title,
          Descriptions: data.attributes.Descriptions,
        },
      };

      if (shouldUpdateImage) {
        const formData = new FormData();
        formData.append("files", imageFile);
        const uploadRes = await axios.post(
          `http://localhost:1337/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const uploadedImageId = uploadRes.data[0].id;
        updateData.data.Pic = uploadedImageId;
      }

      const updateRecord = await axios.put(
        `http://localhost:1337/api/apps/${data.id}?populate=*`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("Updated Success:", updateRecord.data);
      setData(updateRecord.data.data);
      setIsEditing(false);
      Swal.fire({
        title: "Edit Successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 1200,
      });
      setTimeout(() => {
        location.reload();
      }, 1200);
    } catch (error) {
      console.error("Error updating record:", error);
      Swal.fire({
        title: "Error",
        text: `Failed to update data: ${error}`,
        icon: "error",
        confirmButtonText: false,
        timer: 1200,
      });
    }
  };

  return (
    <>
      <center>
        {isEditing ? (
          <div>
            <img src={imageURL} width="200px" height="200px" />
            <h4>Title : {data.attributes.Title}</h4>
            <p>Descriptions : {data.attributes.Descriptions}</p>
            <input type="file" onChange={handleImageChange} />
            <br />
            <button
              onClick={() =>
                Swal.fire({
                  title: "Edit Title and Descriptions",
                  html: `
        <input id="title" type="text" class="swal2-input" value="${data.attributes.Title}">
        <input id="descriptions" class="swal2-input" value="${data.attributes.Descriptions}">`,
                  showCancelButton: true,
                  confirmButtonText: "Save",
                  cancelButtonText: "Cancel",
                  preConfirm: () => {
                    const title = Swal.getPopup().querySelector("#title").value;
                    const descriptions =
                      Swal.getPopup().querySelector("#descriptions").value;
                    return { title, descriptions };
                  },
                  inputValidator: (value) => {
                    if (!value.title || !value.descriptions) {
                      return "Title and Descriptions are required!";
                    }
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    setData({
                      ...data,
                      attributes: {
                        ...data.attributes,
                        Title: result.value.title,
                        Descriptions: result.value.descriptions,
                      },
                    });
                  }
                })
              }
            >
              Edit Title and Descriptions
            </button>
            <br />
            <button
              onClick={() =>
                Swal.fire({
                  title: "Save Changes?",
                  text: "Are you sure you want to save changes?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Save",
                  cancelButtonText: "Cancel",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleSave();
                  }
                })
              }
            >
              Save
            </button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <img src={imageURL} width="200px" height="200px" />
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
