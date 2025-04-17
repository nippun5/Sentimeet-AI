// app/details/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";

interface Meeting {
  id: string;
  title: string;
  description: string;
  transcription: string;
  createdAt: string;
  updatedAt: string;
  meetingAnalytics: any;
  meetingSummary: any;
  tasks?: number;
}

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await fetch(`http://localhost:8000/meetings/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcription: "string" }),
        });

        const data = await res.json();
        console.log("Fetched meeting:", data);
        setMeeting(data);
      } catch (err) {
        console.error("Failed to fetch meeting:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  return (
    <div className="min-h-screen bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <CardBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {loading ? (
            <Typography variant="h2" className="text-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Loading...</Typography>
          ) : meeting ? (
            <div className="space-y-4">
              <Typography variant="h5" className="font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{"Meeting Details Analysis"}</Typography>
              <Typography variant="h6" className="font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{meeting.title}</Typography>
              <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><strong>Date:</strong> {new Date(meeting.createdAt).toLocaleDateString()}</Typography>
              <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><strong>Description:</strong> {meeting.description}</Typography>
              <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><strong>Tasks Assigned:</strong> {meeting.tasks ?? 0}</Typography>
              {/* You can add more fields if needed from the response */}
            </div>
          ) : (
            <Typography variant="h6" className="text-center text-red-400"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Meeting not found.
            </Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
