import { BookingData } from "@/types";
import { bookingValidationRules } from "@/utils/validation";
import { useForm } from "./useForm";

const initialBookingData: BookingData = {
  divisi: "",
  ruangan: "",
  jumlah_peserta: 0,
  tanggal: new Date(),
  waktu_mulai: new Date(),
  waktu_selesai: (() => {
    const defaultEnd = new Date();
    defaultEnd.setHours(defaultEnd.getHours() + 1);
    return defaultEnd;
  })(),
};

export function useBooking() {
  const form = useForm(initialBookingData, bookingValidationRules);

  const validateDateInput = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today;
  };

  const validateTimeRange = (start: Date, end: Date): boolean => {
    return start < end;
  };

  const validateBooking = (): boolean => {
    const baseValidation = form.validate();

    // Additional booking-specific validations
    let isValid = baseValidation;
    const newErrors: Record<string, string> = {};

    if (!validateDateInput(form.values.tanggal)) {
      newErrors.tanggal = "Tanggal tidak boleh di masa lalu";
      isValid = false;
    }

    if (
      !validateTimeRange(form.values.waktu_mulai, form.values.waktu_selesai)
    ) {
      newErrors.waktu_selesai =
        "Waktu selesai harus lebih besar dari waktu mulai";
      isValid = false;
    }

    // Merge with existing form errors
    const allErrors = { ...form.errors, ...newErrors };

    return isValid && Object.keys(newErrors).length === 0;
  };

  const submitBooking = async () => {
    if (!validateBooking()) return false;

    form.setLoading(true);
    try {
      // TODO: Implement actual booking API call
      // const response = await meetingService.createBooking(form.values);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      form.showSuccessAlert(
        "Booking Berhasil",
        "Permintaan booking ruangan telah berhasil dikirim. Tim kami akan menghubungi Anda untuk konfirmasi."
      );

      // Reset form after successful booking
      setTimeout(() => {
        form.reset();
        form.closeAlert();
      }, 3000);

      return true;
    } catch (error: any) {
      form.showErrorAlert(
        "Booking Gagal",
        error.message || "Terjadi kesalahan saat memproses booking"
      );
      return false;
    } finally {
      form.setLoading(false);
    }
  };

  return {
    ...form,
    validateDateInput,
    validateTimeRange,
    validateBooking,
    submitBooking,
  };
}
