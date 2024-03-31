import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./encoding.css";
import Spinner from "react-bootstrap/Spinner";

const VideoEncoder = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [totalFrames, setTotalFrames] = useState(null);
  const [encodedVideo, setEncodedVideo] = useState(null);
  const [encodin, setEncodin] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleVideoChange = (event) => {
    setVideoFile(event.target.files[0]);
    encoding.setFieldValue("video", event.currentTarget.files[0]);
    setVideoUrl(URL.createObjectURL(event.target.files[0]));
  };

  const handleVideoUpload = async () => {
    let formData = new FormData();
    formData.append("video", videoFile);

    setUploading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/upload_vid",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Video uploaded successfully");
        console.log(response.data);
        setEncodedVideo(null)
        setTotalFrames(response.data.total_frames);
      } else {
        toast.error("Failed to upload video");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the video");
    }
    setUploading(false);
  };

  const postSchema = Yup.object().shape({
    data: Yup.string().required("Required"),
    key: Yup.string().required("Required"),
    frameNumber: Yup.number().required("Required")
    .min(1, "Frame number cannot be less than 1")
    .max(totalFrames, `Frame number cannot be more than ${totalFrames}`),
    video: Yup.mixed().required("Required"),
  });

  const encoding = useFormik({
    initialValues: {
      data: "",
      key: "",
      frameNumber: "",
      video: "",
    },
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("video", videoFile);
      formData.append("frame_num", values.frameNumber);
      formData.append("msg", values.data);
      formData.append("key", values.key);

      setEncodin(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/encode_vid",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Encoded Successfully😊");
          setEncodedVideo(response.data.video);
          encoding.resetForm();
          setVideoFile(null);
          setVideoUrl(null);
          setTotalFrames(null);
        } else {
          toast.error("Error Encountered😔");
        }
      } catch (error) {
        toast.error("Error Encountered😔");
      }
      setEncodin(false);
    },
    validationSchema: postSchema,
  });

  return (
    <div className="container mt-5 pb-4">
      <div className="card shadow-lg border-0">
        <div className="card-body">
          <h1 className="encoder-head">Video Encoder</h1>
          <p className="mb-4 para">Encode Your Message in a video!!</p>
          <div className="row">
            <div className="col-md-7">
              <div className="container">
                <div className="card border-0">
                  <div className="card-body form-card p-5">
                    <div className="mb-3">
                      <label className="form-label title">
                        Select a Video:
                      </label>
                      <div className="d-flex align-items-center">
                        <input
                          type="file"
                          id="customFileInput"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="form-control rounded-0 d-none"
                        />
                        <label
                          className="form-control rounded-0 text-truncate"
                          htmlFor="customFileInput"
                        >
                          {videoFile ? videoFile.name : "Choose file"}
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
                    {videoUrl && (
                      <video
                        src={videoUrl}
                        controls
                        height="270"
                        width="350"
                        className="img-thumbnail  rounded-0"
                      />
                    )}
                    {/* <button onClick={handleVideoUpload} className="btn btn-primary rounded-0 mb-3">
  <i className="fa fa-upload"></i> Upload Video
</button> */}
                    {uploading ? (
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ color: "blue", height: "40px", width: "40px" }}
                      >
                        <span className="visually-hidden">Uploading...</span>
                      </Spinner>
                    ) : (
                      <button
                        onClick={handleVideoUpload}
                        className="btn btn-primary rounded-0 mb-3"
                      >
                        <i className="fa fa-upload"></i> Upload Video
                      </button>
                    )}

                    {totalFrames && (
                      <div className="  mb-3">
                        <label className="form-label title">
                          Total number of Frames in Video:
                        </label>{" "}
                        <p
                          className="title text-info-emphasis"
                          style={{ fontWeight: "900" }}
                        >
                          {" "}
                          {totalFrames}
                        </p>{" "}
                      </div>
                    )}

                    <form
                      className="form-group"
                      onSubmit={encoding.handleSubmit}
                    >
                      <div className="mb-3">
                        <label className="form-label title">
                          Select a Frame:
                        </label>
                        {encoding.touched.frameNumber &&
                          encoding.errors.frameNumber && (
                            <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">
                              {encoding.errors.frameNumber}
                            </div>
                          )}
                        <input
                          autoComplete="off"
                          className="form-control rounded-0"
                          type="number"
                          name="frameNumber"
                          onChange={encoding.handleChange}
                          value={encoding.values.frameNumber}
                          placeholder="Frame number"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label title">
                          Secret Message:
                        </label>
                        {encoding.touched.data && encoding.errors.data && (
                          <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">
                            {encoding.errors.data}
                          </div>
                        )}
                        <input
                          autoComplete="off"
                          className="form-control rounded-0"
                          type="text"
                          name="data"
                          onChange={encoding.handleChange}
                          value={encoding.values.data}
                          placeholder="Secret Message"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label title">Generate Key:</label>
                        {encoding.touched.key && encoding.errors.key && (
                          <div className="alert alert-danger mt-2 p-2 rounded-0 fw-bold text-danger">
                            {encoding.errors.key}
                          </div>
                        )}
                        <input
                          type="password"
                          autoComplete="off"
                          className="form-control rounded-0"
                          name="key"
                          onChange={encoding.handleChange}
                          value={encoding.values.key}
                          placeholder="Key"
                        />
                      </div>
                      {/* <button type="submit" className="btn btn-primary rounded-0">Encode Video</button> */}

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
                          className="btn btn-primary rounded-0"
                        >
                          Encode
                        </button>
                      )}
                    </form>
                    {encodedVideo && (
                      <div className="d-block">
                        <label className="form-label title mt-2">
                          Encoded Video:
                        </label>
                        <div>
                          <video
                            src={encodedVideo}
                            controls
                            height="270"
                            width="350"
                            className="img-thumbnail  rounded-0"
                          />
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
                      Follow these steps to encode your message in a video file:
                    </p>
                    <ul>
                      <li className="para text-start">
                        Select a video file into which you wish to embed your
                        secret message.
                      </li>
                      <li className="para text-start">
                        Click on the 'Upload Video' button to upload the
                        selected video.
                      </li>
                      <li className="para text-start">
                        Input the frame number where you wish to embed your
                        message.
                      </li>
                      <li className="para text-start">
                        Input the confidential message that you wish to embed
                        within the video file.
                      </li>
                      <li className="para text-start">
                        Input the cryptography key for the encoding process.
                      </li>
                      <li className="para text-start">
                        Click on the 'Encode' button.
                      </li>
                      <li className="para text-start">
                        The encoded video will be displayed below.
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

export default VideoEncoder;
