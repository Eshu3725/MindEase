const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.sendToFastAPI = async (filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const response = await axios.post("http://localhost:8000/process-video/", form, {
    headers: form.getHeaders(),
  });

  return response.data.result;
};
