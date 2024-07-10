"use client";

import GithubCorners from "@yukiniro/react-github-corners";
import "@yukiniro/react-github-corners/dist/style.css";
import { toArrayBuffer, toObjectUrl } from "file-to-any";
import { InputFile } from "@/components/input-file";
import Script from "next/script";

import "./page.css";
import { useRef, useState } from "react";

export default function Home() {
  const [metadata, setMetadata] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const buf = new Uint8Array(await toArrayBuffer(file));

      // @ts-ignore
      const metadata = dcraw(buf, { verbose: true, identify: true });
      console.log(metadata);
      setMetadata(metadata);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // @ts-ignore
      const tiffFile = dcraw(buf, { exportAsTiff: true });
      const url = await toObjectUrl(tiffFile);
      const image = new Image();
      image.src = url;
      await image.decode();

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/dcraw" />
      <main className="w-full h-full">
        <GithubCorners href="https://github.com/Yukiniro/next-starter" />
        <div className="w-full h-full flex items-center justify-center font-mono text-lg">
          {!metadata && <InputFile label="Upload Photo" onChange={handleFileChange} id="upload-file" />}
          <canvas style={{ display: metadata ? "block" : "none" }} ref={canvasRef}></canvas>
        </div>
      </main>
    </>
  );
}
