import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy,  Download, Trash } from "lucide-react";
import { deleteUrl, Url } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { BeatLoader } from "react-spinners";

interface LinkCardProps {
  url: Url;
  fetchUrls: () => void;
}



interface LinkCardProps {
  url: Url;
  fetchUrls: () => void;
}

const LinkCard = ({ url, fetchUrls }: LinkCardProps) => {
  const downloadImage = () => {
    if (!url.qr || !url.title) return;

    const anchor = document.createElement("a");
    anchor.href = url.qr;
    anchor.download = url.title;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };


  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl);



  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      {url.qr && (
        <img
          src={url.qr}
          alt="qr code"
          className="h-32 object-contain ring ring-blue-500 self-start"
        />
      )}
      <Link to={`/link/${url.id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url.title || "Untitled"}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
          https://trimrr.in{url.custom_url || url.short_url}
        </span>
        <span className="gap-1 hover:underline cursor-pointer">
          {url.orignal_url}
        </span>
        <span className="flex flex-end font-extralight text-sm flex-1">
          {new Date(url.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="text-white"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://trimrr.in/${url.short_url}`
            );
          }}
        >
          <Copy />
        </Button>
        <Button
          variant="outline"
          className="text-white"
          onClick={downloadImage}
        >
          <Download />
        </Button>
 

        <Button
  variant="destructive"
  className="text-white"
  onClick={() => {
    fnDelete(url.id).then(() => fetchUrls());
  }}
  disabled={loadingDelete}
>
    {loadingDelete? <BeatLoader size={5} color="white"/> : <Trash /> }
</Button>


      </div>
    </div>
  );
};

export default LinkCard;