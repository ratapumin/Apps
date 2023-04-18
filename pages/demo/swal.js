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
      location.reload();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating record:", error);
      window.alert("can not update:" + error);
    }
  };

  const sweetalerteiei = async (props) => {
    let updateData = {
      data: {
        Title: data.attributes.Title,
        Descriptions: data.attributes.Descriptions,
        attributes: {},
      },
    };

    let formData = new FormData();
    if (imageFile && shouldUpdateImage) {
      formData.append("files", imageFile);
      updateData.data.attributes.Pic = {
        data: imageFile,
      };
    } else {
      updateData.data.attributes.Pic = {
        data: null,
      };
    }

    const editData = await Swal.fire({
      imageUrl: `${imageURL}`,
      imageWidth: 400,
      imageHeight: 200,
      html: `<form>
        <input id="Title" class="swal2-input" type="text" placeholder="Title" value="${data.attributes.Title}">
        <input id="Descriptions" class="swal2-input" type="text" placeholder="Descriptions" value="${data.attributes.Descriptions}">
        <input id="Pic" className="swal2-input" type="file" placeholder="Image" />
      </form>`,
      showConfirmButton: true,
      confirmButtonText: "Edit",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showCancelButton: true,

      preConfirm: () => {
        if (
          document.getElementById("Title").value == "" ||
          document.getElementById("Descriptions").value == "" ||
          document.getElementById("Title").value == null ||
          document.getElementById("Descriptions").value == null
        ) {
          Swal.showValidationMessage(`Can not change value null`);
        }
        updateData.data.Title = Swal.getPopup().querySelector("#Title").value;
        updateData.data.Descriptions =
          Swal.getPopup().querySelector("#Descriptions").value;
        const imageFileElement = Swal.getPopup().querySelector("#Pic");
        imageFileElement.removeEventListener("change", handleImageChange); // Remove existing event listener
        imageFileElement.addEventListener("change", handleImageChange); // Add new event listener
        const newFile = imageFileElement.files[0];
        if (newFile) {
          setImageFile(newFile);
        }
        return updateData;
      },
    });

    if (editData.isConfirmed) {
      Swal.fire({
        title: "Edit Successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 1200,
      });
      setTimeout(() => {
        location.reload();
      }, 1200);
      // Only update image if shouldUpdateImage is true
      const updateImage = await axios.post(
        `http://localhost:1337/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            refId: data.id, // Pass the ID of the record being updated as a query parameter
            ref: "modelName", // Replace "modelName" with the actual name of the model
            field: "Pic", // Replace "Pic" with the actual name of the image field
            source: "attributes.Pic.data", // Replace "attributes.Pic.data" with the actual path to the image field in the record
          },
        }
      );
      const updatedImageID = updateImage.data[0].id;
      console.log("image", updatedImageID);
      updateData.data.Pic = updatedImageID;
      console.log("image", updateData.data.Pic);

      const updateDataRecord = await axios.put(
        `http://localhost:1337/api/apps/${data.id}?populate=*`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log(updateData);
      console.log("Updated Success:", updateDataRecord.data);
      console.log("Updated Image:", updateDataRecord.data.data.attributes.Pic);
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
            <button onClick={handleSave}>Save</button>
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
