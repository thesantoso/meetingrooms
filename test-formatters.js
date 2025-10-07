// Quick test untuk verify formatters
import { formatters } from "./formatters";

// Test data sesuai API response
const testMeetings = [
  {
    waktu_mulai: "08:00",
    waktu_selesai: "09:00",
    nama_ruangan: "Squats Room",
  },
  {
    waktu_mulai: "10:00",
    waktu_selesai: "11:00",
    nama_ruangan: "Lungles Room",
  },
];

console.log("=== FORMATTER TESTS ===");

testMeetings.forEach((meeting, index) => {
  console.log(`\nMeeting ${index + 1}: ${meeting.nama_ruangan}`);

  console.log(
    "formatTime(waktu_mulai):",
    formatters.formatTime(meeting.waktu_mulai)
  );
  console.log(
    "formatTime(waktu_selesai):",
    formatters.formatTime(meeting.waktu_selesai)
  );
  console.log(
    "formatDuration:",
    formatters.formatDuration(meeting.waktu_mulai, meeting.waktu_selesai)
  );
});

// Expected output:
// Meeting 1: Squats Room
// formatTime(waktu_mulai): 08:00
// formatTime(waktu_selesai): 09:00
// formatDuration: 1 jam

// Meeting 2: Lungles Room
// formatTime(waktu_mulai): 10:00
// formatTime(waktu_selesai): 11:00
// formatDuration: 1 jam
