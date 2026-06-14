// ✅ Migrated to shared/spinner-button — this file is a thin adapter for auth steps
import { SpinnerButton } from "@/components/shared/spinner-button";

interface SubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  loadingText: string;
  buttonText: string;
  type?: "submit" | "button";
}

export const SubmitButton = ({ isLoading, disabled, loadingText, buttonText, type = "submit" }: SubmitButtonProps) => (
  <SpinnerButton
    loading={isLoading}
    {...(disabled !== undefined && { disabled })}
    loadingText={loadingText}
    type={type}
    className="w-full bg-primary-600 cursor-pointer hover:bg-primary-700 text-white h-12 text-sm md:text-base font-medium rounded-xl"
  >
    {buttonText}
  </SpinnerButton>
);
