import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./textDecoder.css";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const TextDecoder = () => {
  const [textFile, setTextFile] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState("");
  const [decodin, setDecodin] = useState(false);

  const handleFileChange = (event) => {
    setTextFile(event.target.files[0]);
    decoding.setFieldValue("file", event.currentTarget.files[0]);
  };

  const textSchema = Yup.object().shape({
    file: Yup.mixed()
      .required("Required")
      .test(
        "fileFormat",
        "Unsupported Format, only .txt files are supported",
        (value) => {
          if (value) {
            const supportedFormats = [".txt"];
            const currentFormat = "." + value.name.split(".").pop();
            return supportedFormats.includes(currentFormat);
          }
          return true;
        }
      ),
  });

  const decoding = useFormik({
    initialValues: {
      file: "",
    },
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("file", textFile);

      setDecodin(true);
      const res = await fetch("http://localhost:5000/decode_text", {
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
    validationSchema: textSchema,
  });

  return (
    <div className="container mt-5 pb-4">
      <div className="card shadow-lg border-0 ">
        <div className="card-body">
          <h1 className=" decoder-head">Text Decoder</h1>
          <p className="mb-4 para">Decode Message hidden in an Text file!!</p>
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
                        <label className="form-label title">Text File:</label>
                        {decoding.touched.file && decoding.errors.file && (
                          <div className="alert alert-danger p-2 rounded-0 mt-2 text-danger fw-bold">
                            {decoding.errors.file}
                          </div>
                        )}
                        <div className="d-flex align-items-center">
                          <input
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            className="form-control d-none"
                            id="customFileInput"
                          />
                          <label
                            className="form-control rounded-0"
                            htmlFor="customFileInput"
                          >
                            {textFile ? textFile.name : "Choose file"}
                          </label>
                          <button
                            className="btn btn-light  ml-2"
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
                      Follow these steps to decode your message from a text
                      file:
                    </p>
                    <ul>
                      <li className="para text-start">
                        Select a text file from which you wish to extract the
                        secret message.
                      </li>
                      <li className="para text-start">
                        Click on the 'Decode' button.
                      </li>
                      <li className="para text-start">
                        The decoded message will be displayed below.
                      </li>
                    </ul>
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

export default TextDecoder;
