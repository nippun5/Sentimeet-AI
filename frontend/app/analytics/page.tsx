"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";


interface User {
  firstname: string;
  lastname: string;
  email: string;
}

interface Participant {
  user: User;
}
export interface MeetingTask {
  id: string;
  meetingId: string;
  assignee: string | null;
  task: string;
  deadline: string;
  meeting: Meeting;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  participants: Participant[];
  tasks?: number;
  summary?: string;
  transcription?: string;
}

function Analytics() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch("http://localhost:8000/meetings");
        const data = await res.json();
        const meetings: Meeting[] = data.meetings || [];
        setMeetings(meetings);

        // Calculate total unique users and tasks
        const userEmails = new Set<string>();
        let taskCount = 0;

        meetings.forEach((meeting) => {
          meeting.participants.forEach((participant) =>
            userEmails.add(participant.user.email)
          );
          taskCount += meeting.tasks ?? 0;
        });

        setTotalUsers(userEmails.size);
        setTotalTasks(taskCount);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="min-h-screen bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-start p-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full max-w-7xl">
        <Typography variant="h4" className="text-white">
          Sentimeet Dashboard
        </Typography>
        <Button color="white" className="ml-4" onClick={() => router.push("/")}>
          Start New Meeting +
        </Button>
      </div>

      {/* Main Content Row */}
      <div className="flex w-full max-w-7xl gap-6">
        {/* Left Summary Column */}
        <div className="w-1/3 space-y-4">
          <Card className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
            <Typography variant="h6" className="text-white mb-1">
              Total Users
            </Typography>
            <Typography variant="h5" className="font-bold text-white">
              {loading ? "..." : totalUsers}
            </Typography>
          </Card>
          <Card className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
            <Typography variant="h6" className="text-white mb-1">
              Total Tasks Assigned
            </Typography>
            <Typography variant="h5" className="font-bold text-white">
              {loading ? "..." : totalTasks}
            </Typography>
          </Card>
        </div>

        {/* Right Meeting Analytics Column */}
        <div className="w-2/3">
          <Card className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl space-y-6 w-full">
            <CardBody>
              <Typography variant="h4" className="mb-4 text-white">
                Meeting Analytics
              </Typography>
              <Typography className="mb-6 text-white">
                View all meeting details, tasks assigned, and participant info.
              </Typography>

              {loading ? (
                <Typography className="text-white">
                  Loading meetings...
                </Typography>
              ) : meetings.length > 0 ? (
                <div className="space-y-4">
                  {meetings.map((meeting, index) => (
                    <Card key={index} className="bg-gray-200 text-gray-800"   onClick={() =>router.push(`/details/${meeting.id}`)}>
                      <CardBody>
                        <Typography variant="h5" className="font-semibold">
                          {meeting.title}
                        </Typography>
                        <Typography className="text-sm mb-2 text-gray-600">
                          {new Date(meeting.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography className="mb-3">
                          {meeting.description}
                        </Typography>
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                          <div>📝 Tasks Assigned: {meeting.tasks ?? 0}</div>
                          <div>👥 Participants: {meeting.participants.length}</div>
                          
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <Typography className="text-white">No meetings available.</Typography>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
