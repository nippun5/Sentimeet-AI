"use client";
import React, { useState } from "react";
import {
  Typography,
  Select,
  Option,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const data: Record<string, string[]> = {
  January: ["Meeting with Team A", "Client Discussion"],
  February: ["Product Review", "Tech Conference"],
  March: ["Sprint Planning", "Marketing Strategy"],
  April: ["Quarterly Review", "UX/UI Update"],
};

const summaryData = [
  { title: "Total Hours", value: "20" },
  { title: "Total Participants", value: "10" },
  { title: "Tasks Assigned", value: "20" },
  { title: "Meeting Outcome", value: "Good" },
  { title: "Average Score", value: "20" },
];

function Analytics() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<string>("January");

  return (
    <div className="min-h-screen bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-start p-6 gap-6">
     <div className="flex items-center justify-between mb-6 w-full max-w-7xl">
  <Typography variant="h4" className="text-white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
    Sentimeet Dashboard
  </Typography>
  <Button color="white" className="ml-4" onClick={() => router.push('/')}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
    Start New Meeting +
  </Button>
</div>

      {/* Row of 5 Empty Cards at the Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-7xl">
  {summaryData.map((item, index) => (
    <Card
      key={index}
      className="bg-white/10 backdrop-blur-xl  sm:p-10 rounded-2xl shadow-2xl w-full max-w-lg space-y-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
      <Typography variant="h5" className="text-white mb-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {item.title}
      </Typography>
      <Typography variant="h5" className="font-bold text-white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {item.value}
      </Typography>
    </Card>
  ))}
</div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mt-4">
        {/* Left: Insights Card */}
        <div className="flex-1">
          <Card className="bg-white/10 backdrop-blur-xl  sm:p-10 rounded-2xl shadow-2xl w-full h-full space-y-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <CardBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <Typography variant="h5" className="mb-4 text-white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Insights Summary
              </Typography>
              <Typography className="text-white mb-4"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Here's where you can show a high-level summary, charts, or quick stats.
              </Typography>
              <ul className="list-disc list-inside text-white">
                <li>Overall attendance: 95%</li>
                <li>Most active month: February</li>
                <li>Avg. meeting duration: 45 mins</li>
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Right: Monthly Analytics Card */}
        <div className="flex-1">
          <Card className="bg-white/10 backdrop-blur-xl  sm:p-10 rounded-2xl shadow-2xl w-full h-full  space-y-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <CardBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <Typography variant="h4" className="mb-4 text-white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Monthly Analytics
              </Typography>
              <Typography  className="mb-2 text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                View monthly meeting analytics and track performance.
              </Typography>

              <div className="flex justify-between items-center mb-4 text-white">
                <Typography variant="h6"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Select Month:</Typography>
                <Select
                  value={selectedMonth}
                  onChange={(value) => setSelectedMonth(value as string)}
                  className="text-white"
                  label="Month"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  {months.map((month) => (
                    <Option key={month} value={month}>
                      {month}
                    </Option>
                  ))}
                </Select>
              </div>

              <Card className="bg-gray-200 text-gray-800"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  <Typography variant="h6" className="mb-2" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Meetings in {selectedMonth}:
                  </Typography>
                  <ul className="list-disc list-inside">
                    {data[selectedMonth]?.length > 0 ? (
                      data[selectedMonth].map((meeting, index) => (
                        <li key={index} className="mb-1">
                          {meeting}
                        </li>
                      ))
                    ) : (
                      <li>No meetings found for this month.</li>
                    )}
                  </ul>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
