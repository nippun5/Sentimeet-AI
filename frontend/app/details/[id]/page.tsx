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
  summary?: string;
  tasks?: number;
}

export interface MeetingTask {
  id: string;
  meetingId: string;
  assignee: string | null;
  task: string;
  deadline: string;
  meeting: Meeting;
}

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [meetingTasks, setMeetingTasks] = useState<MeetingTask[]>([]);
  const baseUrl = process.env.BASE_URL;
  useEffect(() => {
  
    const fetchMeeting = async () => {
      try {
        const res = await fetch(`http://18.224.238.26:8000/meetings/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcription: "string" }),
        });

        const data = await res.json();
        setMeeting(data);
      } catch (err) {
        console.error("Failed to fetch meeting:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  useEffect(() => {
    const fetchMeetingTasks = async () => {
      try {
        const res = await fetch(`http://18.224.238.26:8000/meetings/meetingTasks/${id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMeetingTasks(data);
        } else {
          console.warn("Unexpected meeting tasks format:", data);
        }
      } catch (err) {
        console.error("Failed to fetch meeting tasks:", err);
      }
    };

    fetchMeetingTasks();
  }, [id]);

  return (
    <div className="min-h-screen bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <CardBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {loading ? (
            <Typography variant="h2" className="text-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Loading...</Typography>
          ) : meeting ? (
            <div className="space-y-6">
              <div>
                <Typography variant="h5" className="font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Meeting Details Analysis</Typography>
                <Typography variant="h6" className="font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{meeting.title}</Typography>
                <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><strong>Date:</strong> {new Date(meeting.createdAt).toLocaleDateString()}</Typography>
                <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><strong>Description:</strong> {meeting.meetingSummary}</Typography>
                <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><strong>Tasks Assigned:</strong> {meeting.tasks ?? meetingTasks.length}</Typography>
              </div>
              {meeting.meetingSummary && (
                <div>
                  <Typography variant="h5" className="font-bold mt-6"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Meeting Summary</Typography>
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl mt-2">
                    <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{meeting.meetingSummary}</Typography>
                  </div>
                </div>
              )}

              <div>
                <Typography variant="h5" className="font-bold mt-6" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Meeting Tasks</Typography>
                <div className="max-h-64 overflow-y-auto pr-2 space-y-4 mt-4">
                  {Array.isArray(meetingTasks) && meetingTasks.length > 0 ? (
                    meetingTasks.map((task) => (
                      <div key={task.id} className="border-b border-gray-700 pb-2">
                        <Typography variant="h6" className="font-bold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{task.task}</Typography>
                        <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><strong>Assignee:</strong> {task.assignee ?? "Unassigned"}</Typography>
                        <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</Typography>
                        {task.meeting?.summary && (
                          <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><strong>Summary:</strong> {task.meeting.summary}</Typography>
                        )}
                      </div>
                    ))
                  ) : (
                    <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>No tasks found.</Typography>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Typography variant="h6" className="text-center text-red-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Meeting not found.
            </Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
