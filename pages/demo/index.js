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

  const showInputDialog = async () => {
    let createData = {
      data: {
        Title: data.attributes?.Title,
        Descriptions: data.attributes?.Descriptions,
      },
    };
    let formData = new FormData();
    formData.append("files", imageFile);

    const result = await Swal.fire({
      title: "Enter Title and Description",
      html:
        "<form>" +
        '<input  id="swal-input1"  class="swal2-input " placeholder="Title"  value="' +
        (data.attributes?.Title || "") +
        '" required>' +
        '<input id="swal-input2"  class="swal2-input " placeholder="Description" value="' +
        (data.attributes?.Descriptions || "") +
        '"required>' +
        '<input type="file" id="swal-input3"  class="swal2-input" placeholder="Description" value="' +
        (data.attributes?.Pic.data || "") +
        '"required>' +
        "</form>",

      showConfirmButton: true,
      showCancelButton: true,

      preConfirm: () => {
        event.preventDefault();
        if (
          document.getElementById("swal-input1", "swal-input2", "swal-input3")
            .value == "" ||
          document.getElementById("swal-input1", "swal-input2", "swal-input3")
            .value == "" ||
          document.getElementById("swal-input1", "swal-input2", "swal-input3")
            .value == null
        ) {
          Swal.showValidationMessage(`Unable to pass null`);
        }
        createData.data.Title = document.getElementById("swal-input1").value;
        createData.data.Descriptions =
          document.getElementById("swal-input2").value;
        const fileInput = document.getElementById("swal-input3");
        if (fileInput.files.length > 0) {
          formData.append("files", fileInput.files[0]);

          if (createData.data.attributes) {
            createData.data.attributes.Pic = {
              data: fileInput.files[0],
            };
          }
        }
        return { createData };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Create Item",
          text: "Create Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
        });

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
        console.log(createDataRecrod.data.data);
      }
    });
  };

  //Delete function
  const handleDeleteData = async (selectedItemId) => {
    try {
      if (!selectedItemId) {
        console.log("No item selected");
        return;
      }
      //sweetalertDelete
      const sweetDelete = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (sweetDelete.isConfirmed) {
        await Swal.fire({
          title: "Deleted Successfully",
          text: "Deleted Successfully",
          icon: "success",
          Button: false,
        });

        const config = {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        };
        {
          location.reload();
        }
        const response = await axios.delete(
          `http://localhost:1337/api/apps/${selectedItemId}?populate=*`,
          config
        );

        console.log("Deleted Success:", response.data);
        localStorage.removeItem("selectedItemId");

        setData([]);
        setIsEditing(false);
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
        <div className={Styles.card_container}>
          <h6 className={Styles.h6}>Your Pre-title goes here</h6>
          <button
            onClick={() => {
              showInputDialog();
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
