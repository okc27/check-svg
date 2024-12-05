import React, { useState } from "react";

const App = () => {
  const [svgContent, setSvgContent] = useState(""); // To display the SVG
  const [colorDetails, setColorDetails] = useState([]);
  const [imageSize, setImageSize] = useState({ width: null, height: null }); // To store SVG size

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(e.target.result, "image/svg+xml");

        // Extract and set SVG content for display
        setSvgContent(e.target.result);

        // Get SVG element
        const svgElement = svgDoc.querySelector("svg");

        let width = svgElement?.getAttribute("width");
        let height = svgElement?.getAttribute("height");

        if (!width || !height) {
          // If width and height are missing, try to use viewBox
          const viewBox = svgElement?.getAttribute("viewBox");
          if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(" ").map(parseFloat);
            width = vbWidth ? `${vbWidth}px` : "Unknown";
            height = vbHeight ? `${vbHeight}px` : "Unknown";
          } else {
            width = "Not specified";
            height = "Not specified";
          }
        }

        setImageSize({ width, height });

        // Extract colors (fill and stroke)
        const elements = svgElement?.querySelectorAll("[fill], [stroke]");
        const extractedColors = new Set();

        elements?.forEach((el) => {
          const fill = el.getAttribute("fill");
          const stroke = el.getAttribute("stroke");

          if (fill && fill !== "none") {
            extractedColors.add(fill);
          }
          if (stroke && stroke !== "none") {
            extractedColors.add(stroke);
          }
        });

        setColorDetails(Array.from(extractedColors));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>SVG Color Extractor</h1>
      <input type="file" accept=".svg" onChange={handleFileUpload} />
      <div style={{ marginTop: "20px" }}>
        {svgContent && (
          <div style={{ margin: "20px auto", border: "1px solid #ccc", padding: "10px" }}>
            <h3>Uploaded SVG:</h3>
            <div dangerouslySetInnerHTML={{ __html: svgContent }} />
            <p>
              <strong>Size:</strong> Width: {imageSize.width}, Height: {imageSize.height}
            </p>
          </div>
        )}
        {colorDetails.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Colors in the SVG:</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              {colorDetails.map((color, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: color,
                      border: "1px solid #000",
                    }}
                  ></div>
                  <span style={{ marginTop: "5px", fontSize: "12px" }}>{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
