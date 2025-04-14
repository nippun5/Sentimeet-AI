import "dotenv/config";

export const tokenSecret: string = process.env.JWT_SECRET || 'defaultSecret';
export const tokenExpiresInSeconds: number = process.env.JWT_EXPIRES as unknown as number / 144;
export const tokenExpiresInDate: Date = new Date((Math.floor(new Date().getTime() / 1000) + tokenExpiresInSeconds) * 1000);
export const geminiPrompt = `
Extract tasks and deadlines from the following meeting transcript. 
Return only valid JSON. Do NOT include any markdown or code blocks like \` \`. 
Use the exact date from calendar in "mm-dd-yyyy" format using today as start date.
Calculate the days remaining to complete the task.

Use the format: 
{
  "meetingTask": [
    {
      "assignee": "Name",
      "task": "Task description",
      "deadline": "Due date",
      "days_remaining": "days remaining"
    }
  ],
  "summary": "meeting summary"
}
`;