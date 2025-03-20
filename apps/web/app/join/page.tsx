'use client';
import { useRef } from 'react';
import { consumerFlow } from '../../utils/mediasoup';
import Link from 'next/link';
import { unpauseConsumer } from '../../utils/signaling';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Users } from 'lucide-react';

const VideoStreamPage = () => {
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const consumeFeed = async () => {
    debugger;
    const consumer = await consumerFlow();

    const videoElement = videoPreviewRef.current;
    if (!videoElement || !consumer?.track) return;
    videoElement.srcObject = new MediaStream([consumer.track]);
    unpauseConsumer(consumer.id);
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
                  <Users className="h-6 w-6" />
                  الانضمام للمحاضرة
                </CardTitle>
                <CardDescription>
                  يتم الدخول تلقائياً، ولكن في حال عدم دخول المستخدم وبدء المحاضرة، يمكنه الضغط على الزر للانضمام.
                </CardDescription>
              </div>
              <Button onClick={consumeFeed}>انضمام</Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group">
                <video
                  ref={videoPreviewRef}
                  className="w-full h-full object-contain"
                  autoPlay
                  playsInline
                  controls
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  مساحة لمشاركة الروابط أو الملفات من المدرب
                </label>
                <div className="mt-1 block w-full rounded-md border border-gray-300 p-4 shadow-sm">
                  <p className="text-gray-500">هنا يمكن للمدرب مشاركة الروابط أو الملفات مع الحضور.</p>
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
