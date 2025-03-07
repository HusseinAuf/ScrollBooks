import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Button from "../../../../components/common/button/Button";
import useUIContext from "../../../../contexts/UIContext";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type PDFViewerProps = {
  pdfUrl: string;
  onClose: () => void;
};

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onClose }) => {
  const { windowWidth } = useUIContext();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(false);
  let hideTimeout: NodeJS.Timeout;
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pageRef.current && !pageRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    console.log("mouse entered");
    clearTimeout(hideTimeout);
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => {
      setShowControls(false);
    }, 1000); // Hide Navigation Buttons after 1 second
  };

  return (
    <div className="z-10 fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
      <div>
        <div
          className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full flex items-center justify-center"
          ref={pageRef}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            ✖
          </button>
          <div className="overflow-auto max-h-screen">
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="flex justify-center"
            >
              <Page
                pageNumber={currentPage}
                width={windowWidth < 768 ? windowWidth - 30 : undefined}
              />
            </Document>
          </div>

          {/* Navigation Buttons */}
          <div
            className="fixed bottom-0 w-full h-16 flex justify-center items-center z-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`flex justify-between items-center w-full max-w-5xl px-4 py-2 bg-black bg-opacity-50 text-white rounded-lg transition-opacity duration-500 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="text-lg font-semibold">
                Page {currentPage} of {numPages}
              </span>

              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= (numPages || 1)}
                className=""
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
