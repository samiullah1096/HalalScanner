'use client';

import { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      setScanning(true);

      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const videoInputDevices = await reader.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        setError('No camera found');
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;

      reader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const barcode = result.getText();
            onScan(barcode);
            stopScanning();
            onClose();
          }
        }
      );
    } catch (err) {
      setError('Failed to access camera');
      console.error(err);
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl relative overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={() => {
            stopScanning();
            onClose();
          }}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Scan Barcode</h2>
          </div>

          {error ? (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
              {error}
            </div>
          ) : (
            <>
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                />

                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-white/20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                  </div>
                </div>

                {scanning && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-black">
                      Scanning...
                    </div>
                  </div>
                )}
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Position the barcode within the frame
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
