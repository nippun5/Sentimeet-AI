"use client";

import React, { useState } from "react";
import { Typography, Button, Select, Option, Card, CardBody } from "@material-tailwind/react";

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

function Analytics() {
  const [selectedMonth, setSelectedMonth] = useState<string>("January");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-white text-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl shadow-lg">
        <Typography variant="h1" className="mb-4 text-xl"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Analytics Dashboard
        </Typography>
        <Typography variant="lead" className="mb-6" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          View monthly meeting analytics and track performance.
        </Typography>
        
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Select Month:</Typography>
          <Select
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value as string)}
            className="text-white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            {months.map((month) => (
              <Option key={month} value={month}>{month}</Option>
            ))}
          </Select>
        </div>

        <Card className="bg-gray-200"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <CardBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Typography variant="h6" className="mb-2 text-left" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Meetings in {selectedMonth}:
            </Typography>
            <ul className="list-disc list-inside text-left">
              {data[selectedMonth]?.length > 0 ? (
                data[selectedMonth].map((meeting, index) => (
                  <li key={index} className="mb-1">{meeting}</li>
                ))
              ) : (
                <li>No meetings found for this month.</li>
              )}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;
