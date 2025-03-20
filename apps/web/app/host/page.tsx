"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Monitor, Users } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { createProducer } from "../../utils/mediasoup";
import { onDisconnect } from "@/utils/signaling";
import { AppData, Producer, Transport } from "mediasoup-client/lib/types";

const VideoStreamPage = () => {
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"disconnected" | "connected">("disconnected");
  const [producer, setProducer] = useState<Transport<AppData> | null>(null);
  const disconnect = () => {
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
      videoPreviewRef.current.pause();
    }
    console.log('producer closed');
    producer?.close();
  };

  const publishFeed = async () => {
    const displayStream = await navigator.mediaDevices.getDisplayMedia();
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = displayStream;
      videoPreviewRef.current.play().catch(console.error);
    }
    const producer = await createProducer();
    if (!producer || !displayStream) return;
    setProducer(producer);
    await producer.produce({
      track: displayStream.getTracks()[0],
    });
    setStatus('connected');

    onDisconnect(() => {
      console.log('producer closed');
      disconnect();
    });
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-6 w-6" />
                  مشاركة الشاشة
                </CardTitle>
                <CardDescription>
                  يمكنك بدء مشاركة شاشتك مع الطلاب من خلال الضغط على الزر أدناه.
                </CardDescription>
              </div>
              <Button onClick={publishFeed}>بدء المشاركة</Button>
              <Button onClick={() => setStatus('disconnected')}>
                إنهاء المشاركة
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group">
                <video
                  ref={videoPreviewRef}
                  className={`w-full h-full object-contain ${status === 'disconnected' ? 'opacity-0' : ''}`}
                  autoPlay
                  playsInline
                  controls
                />
                {status === 'disconnected' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 rounded-full bg-gray-900 text-white flex items-center justify-center">
                      لا تتم مشاركة الشاشة
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  مساحة لمشاركة الروابط أو الملفات من المدرب
                </label>
                <div className="mt-1 block w-full rounded-md border border-gray-300 p-4 shadow-sm">
                  <p className="text-gray-500">
                    هنا يمكن للمدرب مشاركة الروابط أو الملفات مع الحضور.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoStreamPage;
