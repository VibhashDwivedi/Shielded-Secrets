import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./encoding.css";
import { toast } from "react-hot-toast";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";

const ImageEncoder = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [encodedImage, setEncodedImage] = useState(null);
  const [encodin, setEncodin] = useState(false);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    encoding.setFieldValue("image", event.currentTarget.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  const postSchema = Yup.object().shape({
    secret: Yup.string().required("Required"),
    image: Yup.mixed()
      .required("Required")
      .test(
        "fileFormat",
        "Unsupported format. Please select an image file.",
        (value) => {
          if (value) {
            const supportedFormats = [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/webp",
            ];
            return supportedFormats.includes(value.type);
          }
          return true;
        }
      ),
  });

  const encoding = useFormik({
    initialValues: {
      secret: "",
      image: "",
    },
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("image", imageFile);
      formData.append("secret", values.secret);

      setEncodin(true);

      const res = await fetch("http://localhost:5000/encode_img", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Encoded Successfully😊");
          } else toast.error("Error Encountered😔");
          return response.json();
        })
        .then((data) => {
          setEncodedImage(data.image);
          encoding.resetForm();
          setImageFile(null);
          setImageUrl(null);
          console.log(data);
        })
        .catch((error) => {
          // console.error('Error:', error);
          toast.error("Error Encountered😔");
        });
      setEncodin(false);
    },
    validationSchema: postSchema,
  });

  return (
    <div className="container mt-5 pb-4">
      <div className="card shadow-lg border-0 ">
        <div className="card-body ">
          <h1 className=" encoder-head">Image Encoder</h1>
          <p className="mb-4 para">Encode Your Message in an Image!!</p>
          <div className="row">
            <div className="col-md-7 ">
              <div className="container">
                <div className="card border-0">
                  <div className="card-body form-card p-5">
                    <form
                      className="form-group"
                      onSubmit={encoding.handleSubmit}
                    >
                      <div className="mb-3">
                        <label className="form-label title">
                          Select an Image:
                        </label>
                        {encoding.touched.image && encoding.errors.image && (
                          <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">
                            {encoding.errors.image}
                          </div>
                        )}
                        <div className="d-flex align-items-center">
                          <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="form-control d-none w-25 "
                            id="customFileInput"
                          />
                          <label
                            className="form-control rounded-0"
                            htmlFor="customFileInput"
                          >
                            {imageFile ? imageFile.name : "Choose file"}
                          </label>
                          <button
                            className="btn btn-light ml-3 rounded-0"
                            type="button"
                            onClick={() =>
                              document.getElementById("customFileInput").click()
                            }
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="d-flex">
                              <i className="fa-solid fa-folder-open  mt-1 px-1"></i>{" "}
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
                      <div className="mb-3">
                        <label className="form-label title">
                          Secret Message:
                        </label>
                        {encoding.touched.secret && encoding.errors.secret && (
                          <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">
                            {encoding.errors.secret}
                          </div>
                        )}
                        <input
                          type="text"
                          name="secret"
                          onChange={encoding.handleChange}
                          value={encoding.values.secret}
                          className="form-control rounded-0"
                          placeholder="Secret Message here..."
                          autoComplete="off"
                        />
                      </div>
                      {encodin ? (
                        <Spinner
                          animation="border"
                          role="status"
                          style={{
                            color: "blue",
                            height: "40px",
                            width: "40px",
                          }}
                        >
                          <span className="visually-hidden">Encoding...</span>
                        </Spinner>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary rounded-0 mb-3"
                        >
                          Encode
                        </button>
                      )}
                    </form>

                    {encodedImage && (
                      <div className="d-block">
                        {/* put a label as encoded image */}
                        <label className="form-label title mt-2">
                          Encoded Image:
                        </label>
                        <div>
                          <img
                            src={encodedImage}
                            alt="Encoded"
                            height="270"
                            width="350"
                            className="img-thumbnail  rounded-0"
                          />
                        </div>
                        <div>
                          <a
                            href={encodedImage}
                            download="encoded_image.png"
                            className="btn btn-primary rounded-0 mt-2"
                          >
                            Download
                          </a>
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
                    <h1 className="encoder-head">Instructions</h1>
                    <p className="mb-4 para">
                      Follow these steps to encode your message in an image
                      file:
                    </p>
                    <ul>
                      <li className="para text-start">
                        Select an image file into which you wish to embed your
                        secret message.
                      </li>
                      <li className="para text-start">
                        Input the confidential message that you wish to embed
                        within the image file.
                      </li>
                      <li className="para text-start">
                        Click on the 'Encode' button.
                      </li>
                      <li className="para text-start">
                        The encoded image will be displayed below.
                      </li>
                    </ul>
                    <p className="fw-bold para text-start mx-3">
                      Want to encode using LPS? Click on the button below.
                    </p>
                    <div className="d-flex justify-content-center">
                      <Link
                        to="/lps-encode"
                        className="btn btn-lg btn-dark rounded-2 mt-1 fw-bolder"
                      >
                        LPS Encoder
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

export default ImageEncoder;
