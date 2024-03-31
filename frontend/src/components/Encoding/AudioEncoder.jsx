import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./encoding.css";
import toast from "react-hot-toast";
import Spinner from "react-bootstrap/Spinner";

const AudioEncoder = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [encodedAudio, setEncodedAudio] = useState(null);
  const [encodin, setEncodin] = useState(false);

  const handleAudioChange = (event) => {
    setAudioFile(event.target.files[0]);
    encoding.setFieldValue("audio", event.currentTarget.files[0]);
  };

  const audioSchema = Yup.object().shape({
    audio: Yup.mixed()
      .required("Required")
      .test(
        "fileFormat",
        "Unsupported format. Please select an audio file.",
        (value) => {
          if (value) {
            const supportedFormats = ["audio/mpeg", "audio/wav"];
            return supportedFormats.includes(value.type);
          }
          return true;
        }
      ),
    secret: Yup.string().required("Required"),
  });

  const encoding = useFormik({
    initialValues: {
      audio: "",
      secret: "",
    },
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("secret", values.secret);

      setEncodin(true);
      const res = await fetch("http://localhost:5000/encode_audio", {
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
          setEncodedAudio(data.audio);
          encoding.resetForm();
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Error Encountered😔");
        });
      setEncodin(false);
    },
    validationSchema: audioSchema,
  });

  return (
    <div className="container mt-5 pb-4">
      <div className="card shadow-lg border-0 ">
        <div className="card-body">
          <h1 className=" encoder-head">Audio Encoder</h1>
          <p className="mb-4 para">Encode Your Message in an audio file!!</p>
          <div className="row">
            <div className="col-md-7 ">
              <div className="container">
                <div className="card border-0">
                  <div className="card-body p-5 form-card">
                    <form
                      className="form-group"
                      onSubmit={encoding.handleSubmit}
                    >
                      <div className="mb-3">
                        <label className="form-label title">
                          Select Audio File:
                        </label>
                        {encoding.touched.audio && encoding.errors.audio && (
                          <div className="alert alert-danger mt-2  p-2 rounded-0 fw-bold text-danger">
                            {encoding.errors.audio}
                          </div>
                        )}
                        <div className="d-flex align-items-center">
                          <input
                            type="file"
                            name="audio"
                            onChange={handleAudioChange}
                            className="form-control d-none border-0 rounded-0"
                            id="customFileInput"
                          />

                          <label
                            className="form-control rounded-0"
                            htmlFor="customFileInput"
                          >
                            {audioFile ? audioFile.name : "Choose file"}
                          </label>
                          <button
                            className="btn btn-light rounded-0"
                            type="button"
                            onClick={() =>
                              document.getElementById("customFileInput").click()
                            }
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="d-flex">
                              {" "}
                              <i className="fa-solid fa-folder-open  mt-1 px-1 border-0"></i>{" "}
                              Browse
                            </div>{" "}
                          </button>
                        </div>
                        {audioFile && (
                          <div className="rounded-0 mt-3">
                            <audio controls>
                              <source
                                src={URL.createObjectURL(audioFile)}
                                type={audioFile.type}
                              />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label title">
                          Secret Message:
                        </label>
                        {encoding.touched.secret && encoding.errors.secret && (
                          <div className="alert alert-danger mt-2  p-2 rounded-0 fw-bold text-danger">
                            {encoding.errors.secret}
                          </div>
                        )}
                        <input
                          type="text"
                          name="secret"
                          onChange={encoding.handleChange}
                          value={encoding.values.secret}
                          className="form-control rounded-0 border-0"
                          placeholder="Secret message here..."
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
                    {encodedAudio && (
                      <div className="mt-3 ">
                        <label className="form-label title mt-2">
                          Encoded Audio:
                        </label>
                        <div>
                          <audio
                            controls
                            src={encodedAudio}
                            className="rounded-0"
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          />
                        </div>
                        <div>
                          <a
                            href={encodedAudio}
                            download="encoded_audio.mp3"
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
                  <div className="card-body  bg-info-subtle">
                    <h1 className=" encoder-head">Instructions</h1>
                    <p className="mb-4 para">
                      Follow these steps to encode your message in an audio
                      file:
                    </p>
                    <ul>
                      <li className="para text-start">
                        Choose an audio file into which you wish to embed your
                        secret message.
                      </li>
                      <li className="para text-start">
                        Enter the confidential message that you wish to embed
                        within the audio file.
                      </li>
                      <li className="para text-start">
                        Click on the 'Encode' button.
                      </li>
                      <li className="para text-start">
                        The encoded audio will be displayed below.
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

export default AudioEncoder;
