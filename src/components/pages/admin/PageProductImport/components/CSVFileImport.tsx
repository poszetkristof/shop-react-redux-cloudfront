import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ title, url }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const getPresignedUrl = async () =>
    await axios({
      method: "GET",
      url,
      params: {
        name: encodeURIComponent(file?.name ?? "unknown"),
      },
    });

  const uploadFile = async () => {
    console.log("Upload CSV file to", url);

    const response = await getPresignedUrl();

    console.log(
      `File to upload: ${file?.name}, into presigned url: `,
      response.data.url
    );

    const result = await fetch(response.data.url, {
      method: "PUT",
      body: file,
    });

    console.log("Result: ", result);
    setFile(null);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
