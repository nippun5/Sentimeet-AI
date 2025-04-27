"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dotenv from 'dotenv';
dotenv.config();

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
  meetingTask?: {
    id: string;
    task: string;
    deadline: string;
    assignee: string | null;
    days_remaining: number;
  }[];
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

  useEffect(() => {
    const fetchMeeting = async () => {
      try {

        const res = await fetch(`${process.env.BASE_URL}/meetings/${id}`, {

          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
        const res = await fetch(`${process.env.BASE_URL}/meetingTasks/${id}`);
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
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-white">
        {loading ? (
          <h2 className="text-3xl font-bold text-center">Loading...</h2>
        ) : meeting ? (
          <div className="space-y-6">
            {/* Meeting Details */}
            <div>
              <h3 className="text-2xl font-bold mb-2">Meeting Details Analysis</h3>
              <h4 className="text-xl font-semibold">{meeting.title}</h4>
              <p><strong>Date:</strong> {new Date(meeting.createdAt).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {meeting.meetingSummary}</p>
              <p><strong>Tasks Assigned:</strong> {meeting.meetingTask?.length ?? meetingTasks.length}</p>
            </div>

            {/* Meeting Summary */}
            {meeting.meetingSummary && (
              <div>
                <h3 className="text-2xl font-bold mt-6">Meeting Summary</h3>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl mt-2">
                  <p>{meeting.meetingSummary}</p>
                </div>
              </div>
            )}

            {/* Meeting Tasks */}
            <div>
              <h3 className="text-2xl font-bold mt-6">Meeting Tasks</h3>
              <div className="max-h-64 overflow-y-auto pr-2 space-y-4 mt-4">
                {Array.isArray(meetingTasks) && meetingTasks.length > 0 ? (
                  meetingTasks.map((task) => (
                    <div key={task.id} className="border-b border-gray-700 pb-2">
                      <h4 className="text-lg font-semibold">{task.task}</h4>
                      <p><strong>Assignee:</strong> {task.assignee ?? "Unassigned"}</p>
                      <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                      {task.meeting?.summary && (
                        <p><strong>Summary:</strong> {task.meeting.summary}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No tasks found.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <h4 className="text-lg font-semibold text-center text-red-400">
            Meeting not found.
          </h4>
        )}
      </div>
    </div>
  );
}
