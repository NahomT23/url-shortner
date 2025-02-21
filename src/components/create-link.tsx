import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { useUrlState } from "@/context";
import { QRCode } from "react-qrcode-logo";

// Define types for form values
interface FormValues {
  title: string;
  longUrl: string;
  customUrl: string;
}

// Define types for errors
interface Errors {
  [key: string]: string;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

export function CreateLink() {
  const { user } = useUrlState();
  const navigate = useNavigate();
  const ref = useRef<{ canvasRef: HTMLCanvasElement | null }>({ canvasRef: null });
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const [errors, setErrors] = useState<Errors>({});
  const [formValues, setFormValues] = useState<FormValues>({
    title: "",
    longUrl: longLink || "",
    customUrl: "",
  });

  // Yup validation schema
  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  // Custom hook for fetching data
  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  // Navigate when data is successfully created
  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);

  // Function to handle form submission
  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = ref.current?.canvasRef;
      if (!canvas) throw Error("Canvas not found");
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve)
      );
      if (blob) {
        await fnCreateUrl(blob);
      }
    } catch (e: any) {
      const newErrors: Errors = {};
      e?.inner?.forEach((err: yup.ValidationError) => {
        newErrors[err.path || ""] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <ErrorBoundary>
      <Dialog
        defaultOpen={!!longLink}
        onOpenChange={(res) => {
          if (!res) setSearchParams({});
        }}
      >
        <DialogTrigger asChild>
          <Button variant="destructive">Create New Link</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
          </DialogHeader>
          {formValues.longUrl && (
            <QRCode
              ref={(el) => {
                if (el) {
                  ref.current = { canvasRef: el.canvas };
                }
              }}
              size={250}
              value={formValues.longUrl}
            />
          )}
          <Input
            id="title"
            placeholder="Short Link's Title"
            value={formValues.title}
            onChange={handleChange}
          />
          {errors.title && <Error message={errors.title} />}
          <Input
            id="longUrl"
            placeholder="Enter your Loooong URL"
            value={formValues.longUrl}
            onChange={handleChange}
          />
          {errors.longUrl && <Error message={errors.longUrl} />}
          <div className="flex items-center gap-2">
            <Card className="p-2">trimrr.in</Card> /
            <Input
              id="customUrl"
              placeholder="Custom Link (optional)"
              value={formValues.customUrl}
              onChange={handleChange}
            />
          </div>
          {error && <Error message={errors.message} />}
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={createNewLink}
              disabled={loading}
            >
              {loading ? <BeatLoader size={10} color="white" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}
export default CreateLink


