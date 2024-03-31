import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./decoding.css";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const ImageDecoder = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState("");
  const [decodin, setDecodin] = useState(false);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
    decoding.setFieldValue("image", event.currentTarget.files[0]);
  };

  const imageSchema = Yup.object().shape({
    image: Yup.mixed()
      .required("Required")
      .test(
        "fileFormat",
        "Unsupported format. Please select a PNG image file.",
        (value) => {
          if (value) {
            const supportedFormats = ["image/png"];
            return supportedFormats.includes(value.type);
          }
          return true;
        }
      ),
  });

  const decoding = useFormik({
    initialValues: {
      image: "",
    },
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("image", imageFile);

      setDecodin(true);

      const res = await fetch("http://localhost:5000/decode_img", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Decoded Successfully😊");
          } else toast.error("Error Encountered😔");
          return response.text();
        })
        .then((data) => {
          setDecodedMessage(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Error Encountered😔");
        });
      setDecodin(false);
    },
    validationSchema: imageSchema,
  });

  return (
    <div className="container mt-5 pb-4">
      <div className="card shadow-lg border-0 ">
        <div className="card-body">
          <h1 className=" decoder-head">Image Decoder</h1>
          <p className="mb-4 para">Decode Message hidden in an Image!!</p>
          <div className="row">
            <div className="col-md-7 ">
              <div className="container">
                <div className="card border-0">
                  <div className="card-body form-card p-5">
                    <form
                      className="form-group"
                      onSubmit={decoding.handleSubmit}
                    >
                      <div className="mb-3">
                        <label className="form-label title">Image File:</label>
                        {decoding.touched.image && decoding.errors.image && (
                          <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">
                            {decoding.errors.image}
                          </div>
                        )}
                        <div className="d-flex align-items-center">
                          <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="form-control d-none"
                            id="customFileInput"
                          />
                          <label
                            className="form-control rounded-0"
                            htmlFor="customFileInput"
                          >
                            {imageFile ? imageFile.name : "Choose file"}
                          </label>
                          <button
                            className="btn btn-light ml-2 rounded-0"
                            type="button"
                            onClick={() =>
                              document.getElementById("customFileInput").click()
                            }
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="d-flex">
                              <i className="fa-solid fa-folder-open  mt-1 px-1 "></i>{" "}
                              Browse
                            </div>
                          </button>
                        </div>
                      </div>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Uploaded"
                          height="270"
                          width="350"
                          className="img-thumbnail mb-3 rounded-0 border-0"
                        />
                      )}
                      <div>
                        {decodin ? (
                          <Spinner
                            animation="border"
                            role="status"
                            style={{
                              color: "blue",
                              height: "40px",
                              width: "40px",
                            }}
                          >
                            <span className="visually-hidden">Decoding...</span>
                          </Spinner>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary rounded-0"
                          >
                            Decode
                          </button>
                        )}
                      </div>
                    </form>
                    {decodedMessage && (
                      <div className="mt-3">
                        <p className="title">Decoded Message: </p>
                        <div className="msg  p-2 border-black">
                          {decodedMessage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="container">
                <div className="card border-0">
                  <div className="card-body bg-info-subtle">
                    <h1 className="decoder-head">Instructions</h1>
                    <p className="mb-4 para">
                      Follow these steps to decode your message from an image
                      file:
                    </p>
                    <ul>
                      <li className="para text-start">
                        Select an image file from which you wish to extract the
                        secret message.
                      </li>
                      <li className="para text-start">
                        Click on the 'Decode' button.
                      </li>
                      <li className="para text-start">
                        The decoded message will be displayed below.
                      </li>
                    </ul>
                    <p className="mb-4 para text-start mx-3">
                      Note: Only PNG image files are supported.
                    </p>
                    <p className="fw-bold para text-start mx-3">
                      Want to decode using LPS? Click on the button below.
                    </p>
                    <div className="d-flex justify-content-center">
                      <Link
                        to="/lps-decode"
                        className="btn btn-lg btn-dark rounded-2 mt-1 fw-bolder"
                      >
                        LPS Decoder
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDecoder;
