import compression from "compression";

const brotliCompression = compression({
  threshold: 1024,
  filter: (req, res) => {
    const acceptEncoding = req.headers["accept-encoding"] || "";
    if (!acceptEncoding.includes("br") && !acceptEncoding.includes("gzip")) {
      return false;
    }

    const url = req.url;
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|mp4|zip|rar|woff2?|ttf|otf|css|js)$/)) {
      return false; // Exclude media files
    }

    return true; // Apply compression for other requests
  }
});

export default brotliCompression;

