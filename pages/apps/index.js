import { useState, useEffect } from "react";
import Styles from "@/styles/demo.module.css";
import jsCookie from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [jwt, setJwt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const callAPI = async () => {
    try {
      const token = jsCookie.get("jwt");
      setJwt(token);
      const res = await axios.get(`http://localhost:1337/api/apps?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data.data);
      setJwt(token);
      console.log(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const handleClick = (itemid) => {
    localStorage.setItem("selectedItemId", itemid);
    router.push({
      pathname: `../demo/[id].js`,
      query: { itemid },
    });
  };

  // CreateData
  const handleCreateImage = (e) => {
    if (e.target.files?.length) {
      setImageFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      (!data.attributes?.Title || "",
      !data.attributes?.Descriptions || "",
      !imageFile)
    ) {
      return null;
    }

    let createData = {
      data: {
        Title: data.attributes?.Title || "",
        Descriptions: data.attributes?.Descriptions || "",
      },
    };
    const formData = new FormData();
    formData.append("files", imageFile);
    try {
      const createimg = await axios.post(
        `http://localhost:1337/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const createImage = createimg.data[0].id;
      createData.data.Pic = createImage;

      const createDataRecrod = await axios.post(
        "http://localhost:1337/api/apps",
        createData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("Updated Success : ", createDataRecrod.data);
      console.log(createDataRecrod.data);
      setShowModal(false);
      setIsEditing(false);
      callAPI();
      location.reload();
    } catch (err) {
      console.log("Error update record", err);
      window.alert("can not update" + err);
    }
  };

  //Delete function
  const handleDeleteData = async (selectedItemId) => {
    try {
      if (!selectedItemId) {
        console.log("No item selected");
        return;
      }
      //sweetalertDelete
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const config = {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.delete(
          `http://localhost:1337/api/apps/${selectedItemId}?populate=*`,
          config
        );

        console.log("Deleted Success:", response.data);
        localStorage.removeItem("selectedItemId");

        setData([]);
        setIsEditing(false);
        location.reload();
      }
    } catch (err) {
      window.alert("can not delete:" + err);
    }
  };

  const handleClickDelete = (id) => {
    handleDeleteData(id);
  };
  return (
    <>
      <div className={Styles.bg}>
        {/* modalstart */}
        <div
          className={Styles.modal}
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className={Styles.modalContent}>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  required
                  value={data?.attributes?.Title || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      attributes: { ...data.attributes, Title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  required
                  value={data?.attributes?.Descriptions || ""}
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
              </div>
              <div>
                <label htmlFor="image">Image</label>
                <input type="file" required onChange={handleCreateImage} />
              </div>
              <button type="submit" onClick={() => setIsEditing(true)}>
                Create Item
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowModal(false);
                }}
              >
                Close
              </button>
            </form>
            {/* modalend */}
          </div>
        </div>
        <div className={Styles.card_container}>
          <h6 className={Styles.h6}>Your Pre-title goes here</h6>
          <button
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
            }}
            className={Styles.buttonCreate}
          >
            add Item
          </button>
          <h3 className={Styles.h1}>Application demo build under SaaS</h3>

          {Array.isArray(data) &&
            data.map((item) => (
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
                    <button
                      className={Styles.buttonDelete}
                      onClick={() => handleClickDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
